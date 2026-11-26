# Arsitektur SABDITANI

Versi 0.1 — November 2026. Menggantikan arsitektur Flutter pada PRD v3.0 dengan **Next.js + React Native**.

## 1. Gambaran

```
                    ┌─────────────────────────────────────────────┐
   Pengunjung ─────►│ Next.js 16 (Vercel / Node hosting)         │
                    │ • situs SEO (SSR/SSG)                      │
                    │ • /app interaktif (client components)      │
                    │ • /data/*.json (snapshot)                  │
                    │ • /api/revalidate (ISR webhook)            │
                    └──────────────────┬──────────────────────────┘
                                       │ GitHub Actions / Vercel deploy
 ┌────────────────┐                    │
 │ Admin mobile   │  JWT + REST        │
 │ Expo / RN      ├──────────────┐     │
 │ AsyncStorage   │              ▼     │
 └────────┬───────┘      ┌───────────────────────┐
          │ upload       │ Cloudflare Worker     │
          └─────────────►│ api.sabdani.id        │
                         │ auth + R2 + dispatch  │
                         └──────┬───────┬────────┘
                                │       │
                    ┌───────────▼──┐  ┌─▼──────────────────┐
                    │ Supabase     │  │ GitHub Actions     │
                    │ Auth/PG/RLS  │  │ build + revalidate │
                    └──────────────┘  └────────────────────┘
                                │
                         ┌──────▼─────────┐
                         │ Cloudflare R2  │
                         │ media domain   │
                         └────────────────┘
```

## 2. Keputusan teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Situs + web app | **Next.js 16 App Router, React 19, TypeScript** | SSR/SSG untuk SEO, route handler, ISR, satu deployment untuk situs dan `/app` |
| Styling | CSS vanilla + token CSS hasil generate | Tidak ada runtime CSS-in-JS; kontras dan tema mudah dikontrol |
| Font | `@fontsource/fraunces` dan `@fontsource/plus-jakarta-sans` | Dikemas lokal, tidak memuat CDN saat runtime |
| Admin | **Expo SDK 54 + React Native 0.81** | Node 20 didukung, satu kode Android/iOS, kamera dan biometrik tersedia |
| Navigasi admin | Expo Router | Route berbasis file, mirip App Router |
| Penyimpanan admin | AsyncStorage + SecureStore | MVP offline; jalur naik ke SQLite/Drizzle bila transaksi kompleks |
| Backend data | Supabase (Auth, Postgres, RLS, Realtime) | Sesuai PRD |
| API tipis | Cloudflare Worker TypeScript | Verifikasi JWT, upload R2, publish dispatch |
| Media | Cloudflare R2 + `media.sabdani.id` | Sesuai PRD, CORS untuk gambar web |
| Build | GitHub Actions, npm workspaces | Satu lockfile untuk semua klien |
| Deploy web | Vercel (native Next.js). Alternatif: OpenNext → Cloudflare Pages | Next.js tidak menghasilkan `dist/` statis murni bila memakai ISR/route handler |

## 3. Alur data publik

Sama dengan PRD: web **tidak** memanggil Supabase saat runtime. Data seed dikompilasi menjadi:

- modul TypeScript `@sabditani/core` (dipakai SSR dan komponen klien), dan
- snapshot JSON di `apps/web/public/data/*.json` untuk konsumsi eksternal atau pembaruan tanpa build klien.

Perubahan konten dari admin memicu:

1. `POST /v1/publish` ke Worker dengan JWT staf.
2. Worker verifikasi peran, mengirim `repository_dispatch` ke GitHub, mencatat baris `deployments`.
3. GitHub Actions membangun ulang web lalu memanggil `WEB_REVALIDATE_URL`.
4. Endpoint Next.js `/api/revalidate` menjalankan `revalidatePath` untuk rute yang berubah.
5. Admin menampilkan status build (Realtime Supabase atau polling `/v1/deployments/latest`).

> Mode demo tanpa backend: `publishDraft` mensimulasikan antrean dan status build sehingga alur UI tetap bisa dicoba.

## 4. Design system bersama

`packages/tokens/tokens.json` adalah satu sumber kebenaran. Script `packages/tokens/scripts/generate.mjs` menghasilkan:

- `apps/web/styles/tokens.css` — variabel CSS terang/gelap/musim
- `packages/tokens/src/index.ts` — konstanta TypeScript
- `apps/admin/src/theme.ts` — objek warna dan skala untuk React Native

Komponen React web memakai class CSS dengan token; komponen RN memakai `StyleSheet` dan objek `theme`. Prinsip visual PRD dipertahankan: krem hangat, hijau daun tua, emas lembut, kontur hidup, tipografi Fraunces + Plus Jakarta Sans.

## 5. Perbedaan dari PRD asli

| PRD v3 (Flutter) | Implementasi ini |
|---|---|
| Jaspr (Dart) untuk situs SEO | Next.js App Router (situs + `/app` dalam satu aplikasi) |
| Flutter Web `/app` | Rute Next.js `/app/*` dengan client components; tidak ada CanvasKit/WASM |
| `tokens.json` → Dart + CSS | `tokens.json` → CSS + TypeScript + tema RN |
| Riverpod + freezed + go_router | React hooks/context, TypeScript types, App Router |
| drift/SQLite di admin | AsyncStorage + SecureStore (MVP) |
| `shared_preferences` web | `localStorage` lewat hook `useLocalStorage` |
| Cloudflare Pages untuk semua | Vercel untuk Next.js; Worker + R2 tetap di Cloudflare |
| Widgetbook + golden test | Katalog komponen CSS + unit test logika (belum golden test) |
| APK Flutter | EAS Build Expo untuk APK internal |

Alasan lengkap ada di `docs/ADR-001-nextjs-react-native.md`.

## 6. Keamanan

- `service_role`, GitHub token, dan Turnstile secret hanya di Worker/Actions.
- Klien web tidak menyimpan kunci Supabase; klien admin hanya anon key + JWT pengguna.
- RLS aktif di semua tabel (lihat migrasi).
- Worker memeriksa magic bytes dan batas 2 MB pada unggahan.
- Markdown web dirender sebagai elemen React; tidak menyisipkan HTML mentah.
- Header `nosniff`, `Referrer-Policy`, dan `Permissions-Policy` ditambahkan di `next.config.ts`.

## 7. Opsi deploy

**Direkomendasikan:** Vercel untuk web (native Next.js), Cloudflare Worker untuk API, R2 untuk media, GitHub Actions untuk CI.

**Alternatif Cloudflare penuh:** gunakan `@opennextjs/cloudflare` untuk mengubah build Next.js menjadi Worker/Pages. Perlu uji ISR, `revalidatePath`, dan ukuran bundle sebelum produksi.

## 8. Pengujian

Saat ini: 8 unit test untuk rumus hitung, jendela kalender lintas tahun, musim, skor diagnosa, dan pencarian; typecheck seluruh workspace; build produksi Next.js.

Belum masuk MVP: golden test komponen, kontrak API otomatis, uji RLS pgTAP, Lighthouse CI, dan uji perangkat nyata.
