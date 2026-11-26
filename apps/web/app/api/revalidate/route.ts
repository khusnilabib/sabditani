import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret && request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { slug?: string };
  const paths = ['/', '/panduan', '/komoditas', '/hama', '/sitemap.xml', '/rss.xml'];
  if (body.slug) paths.push(`/panduan/${body.slug}`);
  paths.forEach((path) => revalidatePath(path));
  return NextResponse.json({ ok: true, revalidated: paths });
}
