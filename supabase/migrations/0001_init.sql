-- SABDITANI — skema awal Supabase (Postgres 15+)
-- Sumber: PRD v3.0 bagian 13, disesuaikan untuk arsitektur Next.js + React Native.

create extension if not exists pgcrypto;

-- ===== ENUM =====
create type user_role         as enum ('admin','editor','viewer');
create type article_status    as enum ('draft','scheduled','published');
create type calendar_activity as enum ('semai','olah_lahan','tanam','pemupukan','panen','pascapanen');
create type pest_kind         as enum ('hama','penyakit','gulma','kekurangan_hara');
create type deploy_status     as enum ('queued','running','success','failed');

-- ===== PENGGUNA =====
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       user_role not null default 'viewer',
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ===== TAKSONOMI =====
create table public.categories (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique, description text,
  sort_order int not null default 0
);
create table public.tags (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique
);
create table public.commodities (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique,
  group_name text check (group_name in ('pangan','hortikultura','perkebunan','peternakan','perikanan')),
  summary text, cover_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== WILAYAH & KALENDER TANAM =====
create table public.climate_zones (
  id bigint generated always as identity primary key,
  name text not null,                       -- mis. 'Jawa, dataran rendah'
  description text,
  rainy_months smallint[] not null default '{}'   -- indikatif, mis. {11,12,1,2,3}
);
create table public.crop_calendar_entries (
  id bigint generated always as identity primary key,
  commodity_id bigint not null references public.commodities(id) on delete cascade,
  zone_id bigint not null references public.climate_zones(id) on delete cascade,
  activity calendar_activity not null,
  start_month smallint not null check (start_month between 1 and 12),
  end_month   smallint not null check (end_month between 1 and 12),  -- boleh < start_month (melintasi tahun)
  note text
);
create index on public.crop_calendar_entries (commodity_id, zone_id);

-- ===== ARTIKEL =====
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique,
  summary text, body_md text not null default '',
  cover_url text, cover_thumb_url text, cover_alt text,
  category_id  bigint references public.categories(id)  on delete set null,
  commodity_id bigint references public.commodities(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status article_status not null default 'draft',
  field_verified boolean not null default false,
  verified_at date,
  seo_title text, seo_desc text, og_image_url text,
  published_at timestamptz,
  version int not null default 1,           -- kontrol konflik penyuntingan
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.articles (status, published_at desc);
create index on public.articles (commodity_id);

create table public.article_tags (
  article_id uuid   references public.articles(id) on delete cascade,
  tag_id     bigint references public.tags(id)     on delete cascade,
  primary key (article_id, tag_id)
);
create table public.article_revisions (
  id bigint generated always as identity primary key,
  article_id uuid references public.articles(id) on delete cascade,
  body_md text not null,
  edited_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ===== HAMA, PENYAKIT, GEJALA =====
create table public.pests (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique,
  kind pest_kind not null,
  summary text, cause text, control_md text,
  photos jsonb not null default '[]',       -- [{url, thumb_url, alt}]
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.pest_commodities (
  pest_id bigint references public.pests(id) on delete cascade,
  commodity_id bigint references public.commodities(id) on delete cascade,
  primary key (pest_id, commodity_id)
);
create table public.symptoms (
  id bigint generated always as identity primary key,
  name text not null,
  body_part text not null check (body_part in ('daun','batang','buah','akar','bunga','seluruh')),
  icon_key text, photo_url text,
  sort_order int not null default 0
);
create table public.pest_symptoms (
  pest_id bigint references public.pests(id) on delete cascade,
  symptom_id bigint references public.symptoms(id) on delete cascade,
  weight smallint not null default 1 check (weight between 1 and 5),
  primary key (pest_id, symptom_id)
);

-- ===== ALAT HITUNG & AFILIASI =====
create table public.calc_params (
  id bigint generated always as identity primary key,
  calc_key text not null,                   -- 'pupuk' | 'populasi' | 'usaha'
  name text not null,
  value jsonb not null,
  note text,
  updated_at timestamptz not null default now(),
  unique (calc_key, name)
);
create table public.affiliate_links (
  id bigint generated always as identity primary key,
  code text not null unique, product text not null,
  platform text, url text not null,
  is_active boolean not null default true
);

-- ===== MEDIA, PESAN, OPERASIONAL =====
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  r2_key text not null unique, url text not null, thumb_url text,
  width int, height int, bytes int, alt text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.messages (
  id bigint generated always as identity primary key,
  name text not null, contact text, body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.deployments (
  id bigint generated always as identity primary key,
  status deploy_status not null default 'queued',
  trigger text not null default 'manual',   -- manual | schedule | push
  commit_sha text, message text, url text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);
create table public.device_tokens (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique, platform text,
  created_at timestamptz not null default now()
);
create table public.settings (
  key text primary key, value jsonb not null
);

-- ===== TRIGGER =====
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create or replace function public.bump_version()
returns trigger language plpgsql as $$
begin new.version = old.version + 1; new.updated_at = now(); return new; end $$;

create trigger trg_articles_bump  before update on public.articles
  for each row execute function public.bump_version();
create trigger trg_pests_touch    before update on public.pests
  for each row execute function public.touch_updated_at();
create trigger trg_calc_touch     before update on public.calc_params
  for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','editor') from public.profiles where id = auth.uid()), false)
$$;

-- Aktifkan RLS di semua tabel
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','categories','tags','commodities','climate_zones','crop_calendar_entries',
    'articles','article_tags','article_revisions','pests','pest_commodities','symptoms',
    'pest_symptoms','calc_params','affiliate_links','media_assets','messages',
    'deployments','device_tokens','settings']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Profil
create policy profiles_read_own on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_admin_all on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Data publik (dibaca saat build dengan anon key); staf boleh menulis
do $$
declare t text;
begin
  foreach t in array array['categories','tags','climate_zones','crop_calendar_entries',
                           'article_tags','pest_commodities','symptoms','pest_symptoms','calc_params']
  loop
    execute format('create policy %I on public.%I for select using (true)', t || '_read', t);
    execute format('create policy %I on public.%I for all using (public.is_staff()) with check (public.is_staff())', t || '_write', t);
  end loop;
end $$;

create policy commodities_read  on public.commodities for select using (is_active or public.is_staff());
create policy commodities_write on public.commodities for all using (public.is_staff()) with check (public.is_staff());

create policy pests_read  on public.pests for select using (is_published or public.is_staff());
create policy pests_write on public.pests for all using (public.is_staff()) with check (public.is_staff());

create policy affiliate_read  on public.affiliate_links for select using (is_active or public.is_staff());
create policy affiliate_write on public.affiliate_links for all using (public.is_staff()) with check (public.is_staff());

-- Artikel: publik hanya yang sudah terbit atau terjadwal yang sudah jatuh tempo
create policy articles_read on public.articles for select using (
  (status in ('published','scheduled') and published_at <= now()) or public.is_staff()
);
create policy articles_insert on public.articles for insert with check (public.is_staff());
create policy articles_update on public.articles for update using (public.is_staff()) with check (public.is_staff());
create policy articles_delete on public.articles for delete using (public.is_admin());
create policy revisions_staff on public.article_revisions for all using (public.is_staff()) with check (public.is_staff());

-- Internal staf
create policy media_staff       on public.media_assets for all using (public.is_staff()) with check (public.is_staff());
create policy messages_staff    on public.messages     for all using (public.is_staff()) with check (public.is_staff());
create policy deployments_read  on public.deployments  for select using (public.is_staff());
create policy device_own        on public.device_tokens for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Pengaturan: publik baca, admin tulis (JANGAN simpan rahasia di sini)
create policy settings_read  on public.settings for select using (true);
create policy settings_write on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Realtime untuk aplikasi admin (tetap mengikuti RLS)
alter publication supabase_realtime add table public.messages, public.deployments, public.articles;

insert into public.profiles (id, full_name, role)
select id, 'Nama Admin', 'admin' from auth.users where email = 'email-admin@contoh.com'
on conflict (id) do update set role = 'admin';

