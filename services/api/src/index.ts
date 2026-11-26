interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GITHUB_DISPATCH_TOKEN: string;
  GITHUB_REPO: string;
  WEB_REVALIDATE_URL?: string;
  REVALIDATE_SECRET?: string;
  ALLOWED_ORIGIN?: string;
  MEDIA_PUBLIC_BASE?: string;
  MEDIA: R2Bucket;
}

type Role = 'admin' | 'editor';
interface Staff { id: string; role: Role }

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'Authorization, Content-Type',
      'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS',
      ...headers,
    },
  });

const fail = (message: string, status = 400) => json({ error: message }, status);

async function requireStaff(request: Request, env: Env): Promise<{ staff?: Staff; error?: Response }> {
  const token = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: fail('Authorization diperlukan.', 401) };
  const headers = { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` };
  const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, { headers });
  if (!userResponse.ok) return { error: fail('Sesi tidak valid.', 401) };
  const user = (await userResponse.json()) as { id: string };
  const profileResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role`,
    { headers }
  );
  if (!profileResponse.ok) return { error: fail('Gagal memeriksa peran.', 502) };
  const [profile] = (await profileResponse.json()) as { role: string }[];
  if (!profile || !['admin', 'editor'].includes(profile.role)) return { error: fail('Akses ditolak.', 403) };
  return { staff: { id: user.id, role: profile.role as Role } };
}

function serviceHeaders(env: Env) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

function magicBytes(bytes: Uint8Array): string | null {
  const matches = (signature: number[], offset = 0) => signature.every((byte, index) => bytes[index + offset] === byte);
  if (matches([0xff, 0xd8, 0xff])) return 'jpeg';
  if (matches([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (matches([0x52, 0x49, 0x46, 0x46]) && matches([0x57, 0x45, 0x42, 0x50], 8)) return 'webp';
  if (matches([0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66])) return 'avif';
  return null;
}

async function handleMedia(request: Request, env: Env, staff: Staff) {
  if (request.method === 'DELETE') {
    if (staff.role !== 'admin') return fail('Hanya admin yang dapat menghapus media.', 403);
    const id = new URL(request.url).pathname.split('/').pop();
    if (!id) return fail('ID media diperlukan.', 400);
    const lookup = await fetch(
      `${env.SUPABASE_URL}/rest/v1/media_assets?id=eq.${encodeURIComponent(id)}&select=r2_key`,
      { headers: serviceHeaders(env) }
    );
    const [asset] = (await lookup.json()) as { r2_key: string }[];
    if (!asset) return fail('Media tidak ditemukan.', 404);
    await env.MEDIA.delete(asset.r2_key);
    if (asset.r2_key.endsWith('.webp')) await env.MEDIA.delete(asset.r2_key.replace('.webp', '_480.webp'));
    await fetch(`${env.SUPABASE_URL}/rest/v1/media_assets?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE', headers: serviceHeaders(env),
    });
    return json({ ok: true });
  }

  const form = await request.formData();
  const allFiles = (form.getAll('file') as unknown[]).filter(
    (entry): entry is File => typeof entry !== 'string' && typeof (entry as File).arrayBuffer === 'function'
  );
  const files = allFiles.filter((entry) => !entry.name.includes('_480'));
  if (!files.length) return fail('Berkas tidak ditemukan.', 400);
  const mediaBase = (env.MEDIA_PUBLIC_BASE ?? 'https://pub-b44339b46b4c4ef09f8ce14505d7dccd.r2.dev').replace(/\/$/, '');
  const created: { url: string; thumbUrl?: string; key: string }[] = [];
  for (const file of files) {
    if (file.size > 2_000_000) return fail('Ukuran berkas maksimal 2 MB.', 413);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = magicBytes(bytes);
    if (!ext) return fail('Tipe berkas tidak didukung.', 415);
    const now = new Date();
    const uuid = crypto.randomUUID();
    const key = `uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${uuid}.${ext}`;
    await env.MEDIA.put(key, bytes, {
      httpMetadata: { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}` },
      customMetadata: { uploadedBy: staff.id },
    });
    const thumbCandidate = allFiles.find((entry) => entry !== file && entry.name.startsWith(file.name.replace(/\.[^.]+$/, '')) && entry.name.includes('_480'));
    let thumbKey: string | undefined;
    if (thumbCandidate) {
      thumbKey = key.replace(/\.[^.]+$/, `_480.${ext}`);
      await env.MEDIA.put(thumbKey, new Uint8Array(await thumbCandidate.arrayBuffer()), {
        httpMetadata: { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}` },
      });
    }
    const publicBase = `${mediaBase}/${key}`;
    created.push({ key, url: publicBase, thumbUrl: thumbKey ? `${mediaBase}/${thumbKey}` : undefined });
    await fetch(`${env.SUPABASE_URL}/rest/v1/media_assets`, {
      method: 'POST',
      headers: serviceHeaders(env),
      body: JSON.stringify({ r2_key: key, url: publicBase, thumb_url: created[created.length - 1].thumbUrl ?? null, uploaded_by: staff.id, bytes: file.size }),
    });
  }
  return json({ items: created });
}

async function handlePublish(request: Request, env: Env, staff: Staff) {
  const payload = (await request.json().catch(() => ({}))) as { articleId?: string; message?: string };
  const dispatch = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'sabditani-api',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: 'publish', client_payload: { article_id: payload.articleId ?? null, by: staff.id, message: payload.message ?? 'Publish dari admin mobile' } }),
  });
  if (!dispatch.ok) return fail('Gagal memicu proses build.', 502);

  // Beri tahu web Next.js agar ISR langsung menyegarkan halaman yang berubah.
  if (env.WEB_REVALIDATE_URL) {
    await fetch(env.WEB_REVALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': env.REVALIDATE_SECRET ?? '' },
      body: JSON.stringify({ slug: payload.articleId ?? null }),
    }).catch(() => undefined);
  }

  const record = await fetch(`${env.SUPABASE_URL}/rest/v1/deployments`, {
    method: 'POST',
    headers: serviceHeaders(env),
    body: JSON.stringify({ status: 'queued', trigger: 'manual', message: payload.message ?? 'Publish dari admin mobile' }),
  });
  return json({ ok: true, queued: record.ok });
}

async function handleDeployments(env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/deployments?select=id,status,message,started_at,finished_at&order=id.desc&limit=1`,
    { headers: serviceHeaders(env) }
  );
  const items = await response.json();
  return json({ latest: Array.isArray(items) ? items[0] ?? null : null });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS', 'access-control-allow-headers': 'Authorization, Content-Type' } });
    if (url.pathname === '/health') return json({ ok: true, service: 'sabditani-api', time: new Date().toISOString() });

    if (url.pathname.startsWith('/v1/')) {
      const { staff, error } = await requireStaff(request, env);
      if (error) return error;
      if (!staff) return fail('Staf tidak ditemukan.', 401);

      if (url.pathname === '/v1/media' && ['POST', 'DELETE'].includes(request.method)) return handleMedia(request, env, staff);
      if (url.pathname === '/v1/publish' && request.method === 'POST') return handlePublish(request, env, staff);
      if (url.pathname === '/v1/deployments/latest' && request.method === 'GET') return handleDeployments(env);
      if (url.pathname === '/v1/devices' && request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as { token?: string; platform?: string };
        if (!body.token) return fail('Token perangkat diperlukan.', 400);
        const response = await fetch(`${env.SUPABASE_URL}/rest/v1/device_tokens`, {
          method: 'POST', headers: serviceHeaders(env),
          body: JSON.stringify({ user_id: staff.id, token: body.token, platform: body.platform ?? 'android' }),
        });
        return json({ ok: response.ok });
      }
      return fail('Rute tidak ditemukan.', 404);
    }
    return fail('Rute tidak ditemukan.', 404);
  },
};
