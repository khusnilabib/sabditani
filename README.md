# SABDITANI — sarana abdi tani

MVP platform referensi pertanian berbahasa Indonesia. **Arsitektur telah diubah dari Flutter ke Next.js + React Native**, tanpa Flutter.

- **Web (SEO + aplikasi interaktif):** Next.js 16 App Router, TypeScript, CSS design tokens
- **Admin mobile:** Expo / React Native 0.81, TypeScript
- **API tipis:** Cloudflare Worker (TypeScript)
- **Data:** Supabase Postgres + RLS, Cloudflare R2, snapshot JSON statis untuk web
- **Sumber kebenaran bersama:** `@sabditani/tokens` dan `@sabditani/core`

---

## Mulai cepat

```bash
npm install
npm run tokens        # generates CSS + TS + tema RN dari tokens.json
npm run data          # tulis snapshot /public/data/*.json
npm run dev:web       # http://localhost:3000
npm run dev:admin     # Expo Metro, lalu tekan a untuk Android
```

Server web juga bisa dijalankan lewat live preview pada port 3000.

### Script penting

| Perintah | Fungsi |
|---|---|
| `npm run build:web` | Build produksi Next.js |
| `npm run start:web` | Jalankan hasil build |
| `npm run typecheck` | Cek tipe semua workspace |
| `npm test` | Unit test logika hitung, kalender, diagnosa, pencarian |
| `npm run tokens` | Generate token desain |
| `npm run data` | Generate snapshot JSON |
| `npm run dev:admin` | Jalankan Expo dev server |
| `npm run dev -w @sabditani/api` | Jalankan Worker lokal (wrangler dev) |

---

## Peta aplikasi

### Situs publik (SSR/SSG, ramah mesin pencari)

`/` · `/panduan` · `/panduan/[slug]` · `/komoditas` · `/komoditas/[slug]` · `/hama` · `/hama/[slug]` · `/kategori/[slug]` · `/tentang` · `/metodologi` · `/kontak` · `/privasi` · `/sitemap.xml` · `/robots.txt` · `/rss.xml`

### Web aplikasi interaktif

`/app` Hari Ini · `/app/kalender` · `/app/alat` · `/app/alat/pupuk` · `/app/alat/populasi` · `/app/alat/usaha` · `/app/diagnosa` · `/app/cari` · `/app/tersimpan` · `/app/pengaturan`

### Admin mobile (Expo Router)

`/(tabs)/home` · `/(tabs)/artikel` · `/(tabs)/media` · `/(tabs)/pesan` · `/(tabs)/lainnya` · `/editor/[id]` · `/terbitkan/[id]` · `/komoditas` · `/hama`

---

## Fitur MVP yang sudah berjalan

**Web:** beranda kontekstual mengikuti bulan dan wilayah; kalender 12 bulan dengan jendela melintasi tahun, filter, keyboard, detail, pengingat `.ics`, dan bagikan URL; tiga alat hitung dengan hasil langsung, skenario A/B, grafik sensitivitas, salin, WhatsApp, dan simpan lokal; diagnosa empat langkah berbasis aturan; pencarian Ctrl/⌘+K; tersimpan localStorage; tema terang/gelap, aksen musim, ukuran huruf; SEO meta/OG/JSON-LD/sitemap/RSS; mode cetak panduan.

**Admin:** login Supabase atau mode demo lokal; kunci biometrik; daftar dan filter artikel; editor Markdown dengan bilah alat, pratinjau, dan autosave 5 detik; status sinkronisasi; kamera/galeri → WebP 1600 px + miniatur 480 px; antrean unggah; halaman penerbitan dengan daftar periksa dan status build; pengelolaan komoditas dan hama lokal; pesan dengan balasan WhatsApp; ekspor cadangan JSON.

**Backend:** Worker dengan verifikasi JWT + peran, unggah media ke R2 dengan pemeriksaan magic bytes, `POST /v1/publish` dengan GitHub dispatch dan revalidasi web, status deployment, dan pendaftaran perangkat.

---

## Konfigurasi lingkungan

Salin `.env.example` dan isi nilai yang diperlukan. Tanpa kredensial:

- Web tetap sepenuhnya fungsional memakai data seed/snapsho.
- Admin berjalan dalam **mode demo lokal** (semua data tersimpan di perangkat).
- Worker dapat dijalankan, tetapi rute `/v1/*` memerlukan Supabase dan secrets.

Web di-build sebagai **static export** (`apps/web/out`) dan di-deploy ke **Cloudflare Pages** pada `https://sabditani.pages.dev`. Karena itu, pembaruan konten tampil setelah build ulang. Lihat `docs/ARCHITECTURE.md` untuk detailnya.

---

## Struktur

```
apps/web/           Next.js 16 (situs + /app)
apps/admin/         Expo 54 + React Native 0.81
packages/core/      Tipe, data seed, rumus, kalender, diagnosa, pencarian
packages/tokens/    tokens.json + generator CSS/TS/RN
packages/assets/    logo resmi SABDITANI
services/api/       Cloudflare Worker
supabase/           Migrasi SQL + seed
docs/               Arsitektur, ADR, merek, cakupan
.github/workflows/  CI, web, worker, APK admin
```

---

## Catatan penting

- Data web dibaca dari **snapshot JSON statis** di `public/data`. Web tidak memanggil Supabase saat runtime.
- Setelah admin menekan **Terbitkan**, Worker memicu GitHub Actions dan `/api/revalidate` menyegarkan halaman Next.js.
- Semua angka pertanian adalah **panduan umum**, bukan janji hasil panen.
- Logo dan wordmark yang dipakai berasal dari aset yang diberikan; lihat `docs/BRAND.md`.
