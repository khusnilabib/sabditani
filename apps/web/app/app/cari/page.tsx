import { SearchPageClient } from '../components/SearchPageClient';

export const metadata = { title: 'Pencarian' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  return <SearchPageClient initialQuery={params.q ?? ''} />;
}
