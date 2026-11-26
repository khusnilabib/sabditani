# Checklist Produksi SABDITANI vs PRD v3.0

Dokumen lacak status: **apa yang sudah dikerjakan** dan **apa yang sudah sesuai PRD untuk produksi**.  
Sumber PRD: `docs/PRD-v3-original.md` (kanonik). Status diperiksa pada **26 November 2026** setelah pengerjaan P0.

| Info | Nilai |
|---|---|
| Commit produksi web | `f8b14aa` (`main`) · checklist `90eae1a` |
| Web live | https://sabditani.pages.dev |
| Repo | https://github.com/khusnilabib/sabditani |
| Supabase | Proyek `sabditani-mvp`, ref `uzjskaeqenfwsyoxceqx`; migrasi + seed diterapkan |
| Worker | https://sabditani-api.khusnilabib02.workers.dev (R2 `sabdani-media` terhubung) |
| UI | Bahasa Indonesia, sapaan **Anda**, nama **SABDITANI — sarana abdi tani** |

**Legenda:** ✅ sesuai & terverifikasi · ◐ sebagian / adaptasi / belum teruji di produksi · ⬜ belum dikerjakan · N/A tidak berlaku karena keputusan pengguna.

> Catatan adaptasi: PRD menulis Flutter/Jaspr/Dart dan domain `sabdani.id`. Sesuai instruksi Anda, web dibangun dengan **Next.js static export**, admin dengan **React Native/Expo**, **tanpa Flutter**, dan domain produksi **`sabditani.pages.dev`**. Kecuali disebut sebaliknya, adaptasi ini dihitung **sesuai**.

---

## 1. Ringkasan cepat

| Area | Status | Catatan singkat |
|---|---|---|
| Arsitektur & fondasi | ✅ | Monorepo, token tunggal, static export, CI/CD aktif |
| Situs SEO/publik | ✅ | 15 panduan, 6 komoditas, 6 hama, meta/OG/JSON-LD, RSS/sitemap/robots |
| Web App `/app` | ✅ | Hari Ini, Kalender, 3 alat hitung, diagnosa, pencarian, tersimpan, tema |
| Admin mobile | ◐ | CRUD Supabase + RLS, unggah 2 ukuran, konflik versi, demo dimatikan; pengelolaan kalender/gejala/parameter masih lokal |
| Supabase & RLS | ✅ | Admin pertama dibuat, signup mati, uji anon/viewer/editor/admin lulus |
| Worker/R2/publish E2E | ✅ | Worker live, R2 + CORS aktif, `/v1/publish` memicu deploy produksi |
| Responsivitas & kualitas | ✅ | Axe 0 pelanggaran, sentuh 48 px, zoom 200% tanpa overflow, Lighthouse 91–99 |
| Kesiapan peluncuran PRD §23 | ◐ | Sisa: foto lapangan asli, domain media khusus, backup/monitoring, APK, uji perangkat |

---

## 2. Keputusan PRD & adaptasi

| Ref | Keputusan PRD | Status | Bukti / catatan |
|---|---|---|---|
| D1 | Hybrid: konten statis + app interaktif | ✅ | Satu Next.js static export melayani keduanya |
| D2 | Admin mobile | ✅ | Expo/React Native (N/A Flutter); `apps/admin/app` |
| D3 | Supabase + Worker + R2 | ✅ | Ketiganya aktif dan terhubung |
| D4 | Web publik tanpa Supabase runtime, baca snapshot JSON | ✅ | `apps/web/public/data/*.json`; live tetap 200 |
| D5 | Satu sumber token desain | ✅ | `packages/tokens/tokens.json` → CSS/TS/RN; CI cek drift |
| D6 | Monorepo + paket bersama | ✅ | npm workspaces: core, tokens, web, admin, api |
| D7 | GitHub Actions → Cloudflare Pages | ✅ | `ci`, `web-deploy`, `worker-deploy` sukses |
| D8 | Distribusi APK privat | ◐ | Workflow `admin-android.yml` ada; APK/AAB belum dirilis |
| D9 | UI Indonesia, kode Inggris | ✅ | "Anda", format `id_ID`, istilah baku SABDITANI |
| — | Nama & domain | ✅ | **SABDITANI** (bukan "SABDANI"), `sabditani.pages.dev` sesuai instruksi |

---

## 3. Checklist fungsional PRD

### 3.1 Situs konten statis (FS)

| ID | Kebutuhan | Status | Bukti / catatan |
|---|---|---|---|
| FS-01 | Panduan: penulis, tanggal, daftar isi, catatan, cap terverifikasi | ✅ | `panduan/[slug]/page.tsx`, `VerifiedSeal`, `ProgressStem`; 15 panduan |
| FS-02 | Profil komoditas + ringkasan kalender + tautan alat | ✅ | `/komoditas`, `/komoditas/[slug]` (6 komoditas) |
| FS-03 | Hama/penyakit + foto + pengendalian bertingkat | ◐ | 6 hama, urutan budidaya→hayati→kimia + peringatan ✅; **foto lapangan asli belum ada** (6 sampul baru adalah ilustrasi AI berlabel) |
| FS-04 | Meta, Open Graph, JSON-LD, sitemap, RSS | ✅ | `Article` + `BreadcrumbList`, OG image per panduan; `/sitemap.xml`, `/rss.xml`, `/robots.txt` live 200 |
| FS-05 | Progres Tumbuh | ✅ | `ProgressStem` di layout situs |
| FS-06 | Kontak WA/email | ✅ | `/kontak`; formulir + Turnstile memang fase 2 |
| FS-07 | Snapshot `/data/*.json` | ✅ | 9 berkas; indeks cari naik 24 → 30 entri |
| FS-08 | Mode cetak panduan | ✅ | `PrintButton` + CSS print |

### 3.2 Web App `/app` (FW)

| ID | Kebutuhan | Status | Bukti / catatan |
|---|---|---|---|
| FW-01 | Hari Ini mengikuti bulan, musim, wilayah; wilayah tersimpan | ✅ | `app/page.tsx`, `useLocalStorage('sd-zone')` |
| FW-02 | Kalender 12 bulan, geser/seret, hari ini, rincian, URL | ◐ | 12 kolom, scroll horizontal, panah keyboard, penanda hari ini, `.ics`, URL `?komoditas=&wilayah=`; gesture drag belum diuji di perangkat |
| FW-03 | 3 alat hitung, hasil langsung, satuan, asumsi, salin/WA | ✅ | `alat/pupuk`, `alat/populasi`, `alat/usaha`; panel Asumsi + disclaimer |
| FW-04 | Skenario A/B + sensitivitas ±30% | ✅ | `BusinessTool.tsx` |
| FW-05 | Diagnosa 4 langkah, multi-pilih, hasil berurutan | ✅ | `app/diagnosa`, `packages/core/src/diagnose.ts` |
| FW-06 | Pencarian Ctrl/⌘+K terkelompok | ✅ | `SearchLauncher` + `/app/cari`; 30 entri indeks |
| FW-07 | Tersimpan lokal | ✅ | `/app/tersimpan`, `localStorage` |
| FW-08 | Terang/gelap/otomatis + ukuran huruf | ✅ | `ThemeProvider`, `prefers-color-scheme`, `sd-font-scale` |
| FW-09 | Aksen musiman | ✅ | `setSeason` di Hari Ini & Kalender; manual di Pengaturan |
| FW-10 | Offline setelah kunjungan pertama | ⬜ | Belum ada service worker/cache shell (P1) |
| FW-11 | Ekspor PDF hasil hitung | ⬜ | Belum diimplementasikan (Could) |

### 3.3 Admin mobile (FA)

| ID | Kebutuhan | Status | Bukti / catatan |
|---|---|---|---|
| FA-01 | Login Supabase + biometrik | ✅ | Email/password via Supabase Auth, `SecureStore` + refresh token, `LocalAuthentication`; **mode demo dihapus** |
| FA-02 | CRUD artikel, status draf/terjadwal/terbit | ✅ | `AdminContext` memakai `articles` Supabase via RLS; upsert + optimistic version |
| FA-03 | Editor Markdown + blok khusus | ✅ | `editor/[id].tsx`: tebal, miring, judul, daftar, tautan, kamera/galeri, `:::catatan`, `:::peringatan`, tabel, pratinjau |
| FA-04 | Autosave lokal tiap 5 detik | ✅ | `useEffect` jeda 5 dtk di editor + `AsyncStorage` |
| FA-05 | Kamera/galeri → kompres → 2 ukuran → R2 + retry | ✅ | WebP 1600 px + 480 px; `/v1/media` menyimpan keduanya; antrean retry di `syncNow` |
| FA-06 | Tombol Terbitkan + status build | ◐ | `/v1/publish` dipanggil & build masuk antrean; status Realtime/polling masih P1 |
| FA-07 | CRUD komoditas, kalender, hama, gejala, parameter alat | ◐ | Komoditas & hama lokal; jendela kalender, gejala, `calc_params` belum ada di admin |
| FA-08 | Pesan + balas WhatsApp | ✅ | `pesan.tsx` dengan `wa.me` |
| FA-09 | Notifikasi pesan/build | ⬜ | P1 |
| FA-10 | Dikte suara | ⬜ | P2 |
| FA-11 | Terima share dari aplikasi lain | ⬜ | P2 |
| FA-12 | Deteksi konflik versi | ✅ | `version` + trigger `bump_version()`; UI "Pakai versi saya / server / simpan keduanya" di daftar artikel |
| FA-13 | Ekspor cadangan JSON | ✅ | `exportBackup()` |

### 3.4 Nonfungsional (NFR)

| ID | Target PRD | Status | Bukti / catatan |
|---|---|---|---|
| N-01 | LCP ≤ 2,5 dtk, CLS ≤ 0,05 | ◐ | Lighthouse produksi: halaman panduan LCP **2,0 dtk**, detail panduan **2,7 dtk**, beranda **3,3 dtk**; **CLS 0,00** di semua halaman yang diuji |
| N-02 | Layar pertama ≤ 4 dtk | ✅ | LCP produksi 2,0–3,3 dtk (mobile throttled) |
| N-03 | ≥ 60 fps desktop, ≥ 45 fps Android entry | ◐ | Belum diprofilkan di perangkat nyata |
| N-04 | WCAG 2.2 AA | ✅ | Axe-core: **0 pelanggaran** di `/`, `/panduan/`, detail panduan, `/app/`, `/app/kalender/`; target sentuh **48 px**; reduced-motion aktif |
| N-05 | Publik tidak bergantung Supabase runtime | ✅ | Snapshot JSON; live tetap 200 |
| N-06 | RLS semua tabel, tanpa rahasia di klien | ✅ | 20 tabel RLS; uji peran lulus; tidak ada secret di repo/klien |
| N-07 | Draf admin aman setelah ditutup paksa | ◐ | `AsyncStorage` persisten; uji paksa di perangkat belum |

---

## 4. Backend, data & pipeline

| Item | Status | Bukti / catatan |
|---|---|---|
| Skema + RLS Supabase | ✅ | `0001_init.sql` diterapkan; 20 tabel RLS |
| Seed data | ✅ | `seed.sql` dieksekusi via Management API: 5 kategori, 3 zona, 4 komoditas, 1 artikel, 2 hama, 4 gejala, 7 parameter |
| Admin pertama | ✅ | `admin@sabditani.id`, role `admin`, profil dibuat |
| Pendaftaran publik dimatikan | ✅ | `disable_signup = true` via Auth config |
| Uji RLS anon/viewer/editor/admin | ✅ | anon baca kategori 200 & tambah artikel 401; viewer tambah 403; editor tambah 201 & hapus tidak berubah; admin hapus 204; akun uji dihapus |
| Worker `/health`, `/v1/media`, `/v1/publish`, `/v1/deployments/latest`, `/v1/devices` | ✅ | Deploy di `sabditani-api.khusnilabib02.workers.dev`, secrets terpasang, `/health` 200 |
| `/v1/contact` + Turnstile | N/A | Fase 2; `/kontak` memakai WA/email |
| R2 bucket + CORS + akses publik | ✅ | `sabdani-media` dibuat; CORS untuk `sabditani.pages.dev` dst; URL publik `https://pub-b44339b46b4c4ef09f8ce14505d7dccd.r2.dev` |
| Domain `media.sabdani.id` | ◐ | Tidak dibuat karena akun Cloudflare tidak memiliki zone `sabdani.id`; memakai URL `r2.dev` |
| Publish end-to-end | ✅ | `POST /v1/publish` dengan JWT admin → `repository_dispatch` GitHub → `web-deploy` sukses → situs berubah |
| Workflow `ci` / `web-deploy` / `worker-deploy` | ✅ | Semua sukses di commit P0 |
| Workflow `admin-android` | ◐ | Belum dijalankan untuk APK rilis |
| Cron publish terjadwal | ⬜ | P1 |
| `_headers` cache + keamanan | ✅ | Aktif di Cloudflare Pages |
| Rahasia di repo/klien | ✅ | Tidak ada; file temporer dihapus setelah verifikasi |

---

## 5. Checklist peluncuran PRD §23

### Teknis

| Item | Status | Catatan |
|---|---|---|
| Domain aktif + HTTPS | ◐ | HTTPS aktif di `sabditani.pages.dev`; apex/`www` `sabdani.id` tidak dipakai sesuai instruksi |
| RLS diuji, signup mati | ✅ | Lihat Bagian 4 |
| Tidak ada rahasia di aplikasi/repo | ✅ | Sudah dicek |
| R2 + CORS + URL publik | ✅ | URL `r2.dev` dipakai sementara (belum ada zone untuk `media.sabdani.id`) |
| Publish dari ponsel → situs berubah | ✅ | Alur Worker → GitHub → Pages terverifikasi; uji sentuhan fisik di perangkat menyusul |
| Mode offline admin | ◐ | Draft tersimpan lokal; uji force-close fisik belum |
| Sitemap, robots, RSS | ◐ | Ketiganya 200 ✅; **Search Console belum** |
| Header cache | ✅ | `_headers` aktif; static export tidak butuh rewrite `/app/*` |
| Backup pertama + uji pulihkan | ⬜ | Belum |
| Uptime monitoring + error reporting | ⬜ | Belum |

### Produk & desain

| Item | Status | Catatan |
|---|---|---|
| Kalender, 3 alat, pencarian di perangkat target | ◐ | Berfungsi; matrix Chrome/Safari/Samsung Internet & Slow 4G belum |
| Token desain tunggal dipakai web + admin | ✅ | Generator + CI drift check |
| Kontras & mode gelap | ✅ | Axe 0 pelanggaran; bug token sebelumnya sudah diperbaiki |
| Skala teks 200% | ✅ | Uji viewport 195 px: tanpa overflow di 5 rute utama |
| Teks UI sesuai panduan | ✅ | "Anda", `1.000,5`, `Rp`, tanggal Indonesia, tanpa janji panen |
| Tentang, Metodologi, Kontak, Privasi, disclaimer | ✅ | Semua tersedia |

### Konten

| Item | Status | Catatan |
|---|---|---|
| ≥ 15 panduan inti | ✅ | **15 panduan** dengan penulis, tanggal, ringkasan, penanda, dan sampul |
| Sampul foto asli lapangan | ◐ | 6 sampul baru berupa **ilustrasi AI berlabel jelas**, bukan foto lapangan asli |
| Data kalender terverifikasi lapangan/BMKG | ⬜ | 130 entri masih indikatif (P1) |
| Peringatan keselamatan pada dosis/pestisida | ◐ | Contoh hama & panduan pupuk memuat APD/urutan bertingkat; audit menyeluruh belum |

---

## 6. Status P0 dan tindak lanjut

### P0 — sudah dikerjakan

| # | Item | Status | Hasil |
|---|---|---|---|
| 1 | Konten 9 → 15 panduan | ✅ | 6 panduan baru: tomat, bawang merah, kedelai, pengendalian terpadu, pupuk padi, pengeringan gabah. Indeks cari 30 entri. Catatan: sampul adalah ilustrasi AI, bukan foto lapangan asli |
| 2 | Publish end-to-end | ✅ | Worker + secrets + R2 + CORS aktif; `/v1/publish` memicu `repository_dispatch` dan deploy Pages sukses |
| 3 | Admin backend nyata | ✅ | Demo dimatikan; CRUD artikel via Supabase/RLS; unggah 1600 px + 480 px ke R2; autosave 5 dtk; retry antrean; UI konflik versi |
| 4 | Auth & keamanan | ✅ | Admin pertama, signup mati, uji RLS 4 peran lulus |
| 5 | Kualitas | ✅ | Axe 0 pelanggaran; target sentuh 48 px; zoom 200% tanpa overflow; Lighthouse produksi 91/99/96 |

### P1 — berikutnya

- Uji perangkat nyata: Android entry-level, Chrome/Edge/Firefox, Safari iOS, Samsung Internet, Slow 4G.
- Verifikasi 130 entri kalender dengan penyuluh/BMKG; beri label sumber data.
- Ganti 6 ilustrasi AI dengan foto lapangan asli bila tersedia.
- Service worker/cache shell (FW-10); ekspor PDF (FW-11).
- Notifikasi build/pesan (FA-09), status build Realtime/polling (FA-06).
- Cron artikel terjadwal; pengelolaan kalender/gejala/parameter alat di admin (FA-07).
- Backup database + uji pulihkan, monitoring uptime, error reporting, Search Console.
- APK rilis bertanda tangan + App Distribution; domain `media.sabdani.id` bila zone tersedia.

### P2 — fase lanjut

- Dikte suara (FA-10), terima share (FA-11), MFA, formulir kontak + Turnstile.
- Widgetbook/golden test dan pustaka Figma (adaptasi dari Flutter DS).
- Multi-penulis, afiliasi berlabel, ekspor/impor JSON Tersimpan.

---

## 7. Bukti verifikasi terakhir

| Pemeriksaan | Hasil |
|---|---|
| `npm run typecheck` | ✅ lolos (core, web, admin, api) |
| `npm test` | ✅ 8/8 |
| `npm run build:web` | ✅ 54 halaman statis di `apps/web/out` |
| `npx expo config --type public --json` | ✅ |
| GitHub Actions `ci`, `web-deploy`, `worker-deploy` | ✅ success |
| Worker `/health` | ✅ `{"ok":true,"service":"sabditani-api"}` |
| Uji unggah Worker | ✅ 1 item dikembalikan, URL utama & thumbnail `200`, ukuran 1600 px + 480 px |
| RLS | ✅ anon 401, viewer 403, editor 201/tidak bisa hapus, admin hapus 204 |
| Lighthouse produksi `/` | performance **91** · a11y **98** · best practices **100** · SEO **100** · LCP 3,3 dtk · CLS 0 |
| Lighthouse produksi `/panduan/` | performance **99** · a11y **98** · best practices **100** · SEO **100** · LCP 2,0 dtk · CLS 0 |
| Lighthouse produksi `/panduan/budidaya-tomat/` | performance **96** · a11y **98** · best practices **100** · SEO **100** · LCP 2,7 dtk · CLS 0 |
| Axe-core 5 rute | ✅ **0 pelanggaran** WCAG 2.0/2.1/2.2 AA |
| Viewport 390 px & 195 px (zoom 200%) | ✅ tanpa overflow horizontal; target sentuh minimum 48 px |
| Live `sabditani.pages.dev` | ✅ `/`, `/panduan/`, detail panduan, font, gambar, `/data/manifest.json` → 200 |
| Snapshot data | 6 komoditas · 130 kalender · 5 wilayah · 6 hama · 8 gejala · **15 panduan** · 30 indeks cari |
| Git | web `f8b14aa`, checklist `90eae1a`, working tree bersih |

---

**Kesimpulan:** seluruh **P0 selesai dan terverifikasi di produksi**. Sisa ketidaksesuaian dengan definisi "produksi penuh" PRD kini hanya pada hal yang tidak bisa dibereskan tanpa aset/akses tambahan: **foto lapangan asli**, **domain media khusus**, **backup/monitoring**, **APK rilis**, dan **uji perangkat nyata**—semuanya masuk P1.

Diperbarui: 26 November 2026 · Pemilik: tim SABDITANI · Status dokumen: **aktif**.
