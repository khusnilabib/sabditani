# Migrasi PRD Flutter → Next.js + React Native

Dokumen ini memetakan bagian PRD v3.0 ke implementasi baru agar tidak ada cakupan yang hilang tanpa sengaja.

| Bagian PRD | Diimplementasikan sebagai | Catatan |
|---|---|---|
| Situs statis Jaspr | `apps/web/app/(site)/**` | App Router menghasilkan HTML SSR/SSG |
| Flutter Web `/app` | `apps/web/app/app/**` | Client components, tanpa CanvasKit/WASM |
| `sabdani_ds` (Flutter) | `apps/web/app/globals.css` + `apps/admin/src/components/ui.tsx` | Token bersama, komponen platform-spesifik |
| `sabdani_tokens/tokens.json` | `packages/tokens/tokens.json` | Generator CSS + TS + RN |
| `sabdani_core` (Dart) | `packages/core/src/**` | Rumus, kalender, diagnosa, pencarian, seed |
| Riverpod | React Context + hooks | `ThemeProvider`, `AdminProvider` |
| go_router | Next App Router + Expo Router | Path-based URL di web |
| freezed/json_serializable | TypeScript interfaces + Zod tidak dipakai | Model murni, validasi manual |
| `shared_preferences` web | `useLocalStorage` | Tersimpan, preferensi |
| drift/SQLite admin | AsyncStorage + SecureStore | MVP; migrasi fase lanjut |
| `image_picker` + compress | `expo-image-picker` + `expo-image-manipulator` | WebP 1600/480 |
| supabase_flutter | `@supabase/supabase-js` | Hanya di admin |
| Cloudflare Worker | `services/api/src/index.ts` | Endpoint sama seperti PRD |
| R2 | Binding `MEDIA` di `wrangler.toml` | Magic bytes + 2 MB |
| GitHub Actions content-deploy | `web-deploy.yml` → Cloudflare Pages | Build ulang statis dari `apps/web/out` |
| Widgetbook | Tidak ada di MVP | Katalog token dan komponen dibahas di fase desain lanjut |
| Golden test | Tidak ada di MVP | Unit test logika tersedia |
| Flutter Web splash/WASM | Tidak relevan | Next.js streaming + font lokal |

## Perubahan alur penerbitan

PRD: Worker → `repository_dispatch` → Actions → build statis → Pages → admin Realtime.

Implementasi: Worker → `repository_dispatch` → Actions/Vercel build → `POST /api/revalidate` → Next.js ISR → admin menampilkan status build. Snapshot JSON tetap ditulis saat build.

## Yang sengaja tidak diubah

- Nama dan janji merek: SABDITANI — sarana abdi tani.
- Logo yang diberikan pengguna (icon dan wordmark).
- Palet warna, tipografi, prinsip desain, dan panduan bahasa UI dari PRD.
- Empat pilar produk: Hari Ini, Kalender, Hitung, Pelajari/Selamatkan.
- Rumus alat hitung, aturan jendela kalender lintas tahun, dan skor diagnosa berbasis aturan.
- Supabase + RLS + Worker + R2.
- Bahasa Indonesia dengan sapaan "Anda" dan format angka `id_ID`.
