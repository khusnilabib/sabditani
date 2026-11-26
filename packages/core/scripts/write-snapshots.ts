import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calendarEntries, calcParams, commodities, guides, pests, searchIndex, symptoms, zones,
} from '../src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../../apps/web/public/data');
mkdirSync(out, { recursive: true });

const snapshots: Record<string, unknown> = {
  'commodities.json': commodities,
  'crop_calendar.json': calendarEntries,
  'zones.json': zones,
  'pests.json': pests,
  'symptoms.json': symptoms,
  'guides.json': guides,
  'calc_params.json': calcParams,
  'search-index.json': searchIndex,
};

for (const [file, data] of Object.entries(snapshots)) {
  writeFileSync(resolve(out, file), JSON.stringify(data, null, 2));
}

writeFileSync(
  resolve(out, 'manifest.json'),
  JSON.stringify(
    {
      version: '0.1.0',
      generatedAt: new Date().toISOString(),
      counts: Object.fromEntries(Object.entries(snapshots).map(([k, v]) => [k.replace('.json', ''), (v as unknown[]).length])),
      note: 'Snapshot statis dibuat saat build. Web publik tidak memanggil Supabase saat runtime.',
    },
    null,
    2
  )
);

console.log(`Wrote ${Object.keys(snapshots).length + 1} snapshots to ${out}`);
