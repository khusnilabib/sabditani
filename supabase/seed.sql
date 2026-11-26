-- SABDITANI — data awal untuk pengembangan.
-- Jalankan setelah 0001_init.sql. Aman dijalankan ulang.

insert into public.categories (name, slug, description, sort_order) values
  ('Budidaya', 'budidaya', 'Langkah kerja dari lahan sampai panen.', 1),
  ('Pemupukan', 'pemupukan', 'Dosis, waktu, dan cara aplikasi hara.', 2),
  ('Hama & Penyakit', 'hama-penyakit', 'Pengenalan gejala dan pengendalian bertingkat.', 3),
  ('Usaha Tani', 'usaha-tani', 'Perhitungan populasi, biaya, dan keuntungan.', 4),
  ('Pascapanen', 'pascapanen', 'Penanganan hasil setelah panen.', 5)
on conflict (slug) do nothing;

insert into public.climate_zones (name, description, rainy_months) values
  ('Jawa, dataran rendah', 'Musim hujan November–Maret.', array[11,12,1,2,3]),
  ('Jawa, dataran tinggi', 'Musim hujan lebih panjang.', array[11,12,1,2,3,4]),
  ('Sumatera, dataran rendah', 'Hujan mulai lebih awal.', array[10,11,12,1,2,3,4])
on conflict do nothing;

insert into public.commodities (name, slug, group_name, summary, is_active) values
  ('Cabai', 'cabai', 'hortikultura', 'Tanaman buah bernilai tinggi yang sensitif terhadap air.', true),
  ('Padi', 'padi', 'pangan', 'Tanaman pangan utama dengan jadwal tanam yang jelas.', true),
  ('Jagung', 'jagung', 'pangan', 'Tanaman serbaguna untuk pangan dan pakan.', true),
  ('Tomat', 'tomat', 'hortikultura', 'Buah yang mudah terserang penyakit daun bila lembap.', true)
on conflict (slug) do nothing;

insert into public.articles (title, slug, summary, body_md, category_id, commodity_id, status, field_verified, verified_at, published_at, seo_title, seo_desc)
select
  'Pemupukan Cabai: Dosis dan Waktu yang Aman',
  'pemupukan-cabai',
  'Cara menentukan kebutuhan NPK untuk cabai dan kapan diberikan.',
  '## Ringkasan dosis\n\nGunakan NPK 16-16-16 sekitar 300–400 kg per hektar, dibagi tiga aplikasi.\n\n:::peringatan\nGunakan sarung tangan dan masker saat memupuk.\n:::',
  c.id, k.id, 'published', true, date '2026-11-12', now(),
  'Pemupukan Cabai: Dosis dan Waktu', 'Panduan dosis NPK cabai dengan asumsi yang jelas.'
from public.categories c, public.commodities k
where c.slug = 'pemupukan' and k.slug = 'cabai'
on conflict (slug) do nothing;

insert into public.symptoms (name, body_part, icon_key, sort_order) values
  ('Daun menggulung', 'daun', 'leaf', 1),
  ('Bercak cokelat', 'daun', 'leaf', 2),
  ('Layu mendadak', 'seluruh', 'plant', 3),
  ('Bintik putih halus', 'daun', 'leaf', 4)
on conflict do nothing;

insert into public.pests (name, slug, kind, summary, cause, is_published) values
  ('Kutu Keputih', 'kutu-keputih', 'hama', 'Serangga kecil bersayap putih pengisap cairan daun.', 'Kanopi lembap dan serial tanam tanpa jeda.', true),
  ('Hawar Daun', 'hawar-daun', 'penyakit', 'Bercak cokelat pada daun akibat jamur.', 'Kelembapan tinggi dan sirkulasi udara buruk.', true)
on conflict (slug) do nothing;

insert into public.calc_params (calc_key, name, value, note) values
  ('pupuk', 'defaultDosis', '300', 'Dosis contoh NPK 16-16-16 kg/ha.'),
  ('pupuk', 'defaultApplications', '3', 'Jumlah aplikasi.'),
  ('pupuk', 'defaultPrice', '14000', 'Harga per kg dalam Rupiah.'),
  ('populasi', 'defaultRow', '0.7', 'Jarak antarbaris meter.'),
  ('populasi', 'defaultPlant', '0.25', 'Jarak dalam baris meter.'),
  ('usaha', 'defaultYield', '4000', 'Hasil panen contoh kg per ha.'),
  ('usaha', 'defaultPrice', '18000', 'Harga jual contoh per kg.')
on conflict (calc_key, name) do nothing;
