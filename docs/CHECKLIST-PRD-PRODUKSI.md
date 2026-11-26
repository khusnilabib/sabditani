# Checklist Produksi SABDITANI vs PRD v3.0

Dokumen lacak status: **apa yang sudah dikerjakan** dan **apa yang sudah sesuai PRD untuk produksi**.  
Sumber PRD: `docs/PRD-v3-original.md` (kanonik). Status diperiksa pada **26 November 2026**.

| Info | Nilai |
|---|---|
| Commit produksi | `3d27ec5` (`main`) |
| Web live | https://sabditani.pages.dev |
| Repo | https://github.com/khusnilabib/sabditani |
| Supabase | Proyek `sabditani-mvp`, ref `uzjskaeqenfwsyoxceqx`, migrasi `0001_init.sql` sudah diterapkan |
| UI | Bahasa Indonesia, sapaan **Anda**, nama **SABDITANI — sarana abdi tani** |

**Legenda:** ✅ sesuai & terverifikasi · ◐ sebagian / adaptasi / belum teruji di produksi · ⬜ belum dikerjakan · N/A tidak berlaku karena keputusan pengguna.

> Catatan adaptasi: PRD menulis Flutter/Jaspr/Dart dan domain `sabdani.id`. Sesuai instruksi Anda, web dibangun dengan **Next.js static export**, admin dengan **React Native/Expo**, **tanpa Flutter**, dan domain produksi adalah **`sabditani.pages.dev`**. Kecuali disebut sebaliknya, adaptasi ini dihitung **sesuai**.

---

## 1. Ringkasan cepat

| Area | Status | Catatan singkat |
|---|---|---|
| Arsitektur & fondasi | ✅ | Monorepo, token tunggal, static export, CI/CD aktif |
| Situs SEO/publik | ✅ | 9 panduan, 6 komoditas, 6 hama, meta/OG/JSON-LD, RSS/sitemap/robots |
| Web App `/app` | ✅ | Hari Ini, Kalender, 3 alat hitung, diagnosa, pencarian, tersimpan, tema |
| Admin mobile | ◐ | Inti berjalan; sinkronisasi backend nyata, autosave 5 dtk, conflict UI belum |
| Supabase & RLS | ◐ | Skema + RLS terpasang; uji kebijakan formal & admin pertama belum |
| Worker/R2/publish E2E | ◐ | Kode Worker ada; R2, domain API, dan alur terbit dari ponsel belum terverifikasi |
| Responsivitas & UI premium | ✅ | Overflow nol di 390 px; ikon search 20 px; kontras tombol diperbaiki |
| Kesiapan peluncuran PRD §23 | ◐ | 4 blk production blocker, rincian di Bagian 5 |

---

## 2. Keputusan PRD & adaptasi

| Ref | Keputusan PRD | Status | Bukti / catatan |
|---|---|---|---|
| D1 | Hybrid: konten statis + app interaktif | ✅ | Satu Next.js static export melayani keduanya; lebih sederhana dan tetap SEO-friendly |
| D2 | Admin mobile | ✅ | Expo/React Native (N/A Flutter); layar di `apps/admin/app` |
| D3 | Supabase + Worker + R2 | ◐ | Supabase ✅, Worker ✅ (kode), R2 ⬜ |
| D4 | Web publik tanpa Supabase runtime, baca snapshot JSON | ✅ | `apps/web/public/data/*.json`;manifest: 24 entri indeks cari |
| D5 | Satu sumber token desain | ✅ | `packages/tokens/tokens.json` → `tokens.css`, TS, `src/theme.ts`; CI menolak drift |
| D6 | Monorepo + paket bersama | ✅ | npm workspaces: `core`, `tokens`, `web`, `admin`, `api` |
| D7 | GitHub Actions → Cloudflare Pages | ✅ | `ci` dan `web-deploy` sukses di `3d27ec5` |
| D8 | Distribusi APK privat | ◐ | Workflow `admin-android.yml` ada; APK/AAB belum dibangun/didistribusikan |
| D9 | UI Indonesia, kode Inggris | ✅ | Teks UI "Anda", format `id_ID`, istilah baku SABDITANI |
| — | Nama & domain | ✅ | **SABDITANI** (bukan "SABDANI"), `sabditani.pages.dev` sesuai instruksi Anda |

---

## 3. Checklist fungsional PRD

### 3.1 Situs konten statis (FS)

| ID | Kebutuhan | Status | Bukti / catatan |
|---|---|---|---|
| FS-01 | Panduan: penulis, tanggal, daftar isi, catatan samping, cap terverifikasi | ✅ | `panduan/[slug]/page.tsx`, `VerifiedSeal`, `Markdown`, `ProgressStem` |
| FS-02 | Profil komoditas + ringkasan kalender + tautan alat | ✅ | `/komoditas`, `/komoditas/[slug]` (6 komoditas) |
| FS-03 | Hama/penyakit + foto + pengendalian bertingkat | ◐ | 6 hama, urutan budidaya→hayati→kimia & peringatan ada; **foto asli belum ada** |
| FS-04 | Meta, Open Graph, JSON-LD, sitemap, RSS | ✅ | `Article` + `BreadcrumbList`; `/sitemap.xml`, `/rss.xml`, `/robots.txt` live 200 |
| FS-05 | Progres Tumbuh | ✅ | `components/ProgressStem.tsx` dipasang di layout situs |
| FS-06 | Kontak WA/email | ✅ | `/kontak`; formulir + Turnstile memang fase berikutnya (sesuai PRD) |
| FS-07 | Snapshot `/data/*.json` | ✅ | 9 berkas: commodities, crop_calendar, zones, pests, symptoms, calc_params, guides, search-index, manifest |
| FS-08 | Mode cetak panduan | ✅ | `PrintButton` + CSS print |

### 3.2 Web App `/app` (FW)

| ID | Kebutuhan | Status | Bukti / catatan |
|---|---|---|---|
| FW-01 | Hari Ini mengikuti bulan, musim, wilayah; wilayah tersimpan | ✅ | `app/page.tsx`, `useLocalStorage('sd-zone')`, `seasonForMonth` |
| FW-02 | Kalender 12 bulan, geser/seret, hari ini, rincian, URL dapat dibagikan | ◐ | `CalendarClient.tsx`: 12 kolom, scroll horizontal, panah keyboard, penanda hari ini, `.ics`, URL `?komoditas=&wilayah=`; gesture drag belum diuji di perangkat |
| FW-03 | 3 alat hitung, hasil langsung, satuan, asumsi, salin/WA | ✅ | `alat/pupuk`, `alat/populasi`, `alat/usaha`; panel Asumsi + disclaimer |
| FW-04 | Skenario A/B + sensitivitas ±30% | ✅ | `BusinessTool.tsx` |
| FW-05 | Diagnosa 4 langkah, multi-pilih, hasil berurutan | ✅ | `app/diagnosa`, skor di `packages/core/src/diagnose.ts` |
| FW-06 | Pencarian Ctrl/⌘+K terkelompok | ✅ | `SearchLauncher.tsx` + `/app/cari`; indeks 24 entri |
| FW-07 | Tersimpan lokal | ✅ | `/app/tersimpan`, `localStorage` |
| FW-08 | Terang/gelap/otomatis + ukuran huruf | ✅ | `ThemeProvider`, prefers-color-scheme, `sd-font-scale` |
| FW-09 | Aksen musiman | ✅ | `setSeason` di Hari Ini & Kalender; pilihan manual di Pengaturan |
| FW-10 | Offline setelah kunjungan pertama | ⬜ | Belum ada service worker/cache shell |
| FW-11 | Ekspor PDF hasil hitung | ⬜ | Belum diimplementasikan (Could) |

### 3.3 Admin mobile (FA)

| ID | Kebutuhan | Status | Bukti / catatan |
|---|---|---|---|
| FA-01 | Login Supabase + biometrik | ◐ | Email/password + `SecureStore` + `LocalAuthentication` ✅; **mode demo lokal aktif jika env kosong** — harus dimatikan sebelum rilis |
| FA-02 | CRUD artikel, status draf/terjadwal/terbit | ◐ | CRUD lokal + UI terbitkan ✅; tulis/article sync ke Supabase belum lewat RLS |
| FA-03 | Editor Markdown + blok khusus | ✅ | `editor/[id].tsx`: tebal, miring, judul, daftar, tautan, foto, `:::catatan`, `:::peringatan`, tabel, pratinjau |
| FA-04 | Autosave lokal tiap 5 detik | ◐ | Tersimpan di `AsyncStorage`, tapi **Simpan masih manual**, belum interval 5 dtk |
| FA-05 | Kamera → kompres → 2 ukuran → R2 + retry | ◐ | Kamera + WebP 1600 px ✅; unggah ke R2 dua ukuran belum tersambung di `syncNow` |
| FA-06 | Tombol Terbitkan + status build | ◐ | `/v1/publish` dipanggil, status `queued` muncul; **Realtime/polling status belum** |
| FA-07 | CRUD komoditas, kalender, hama, gejala, parameter alat | ◐ | Komoditas & hama ✅ (lokal); jendela kalender, gejala, `calc_params` belum ada di admin |
| FA-08 | Pesan + balas WhatsApp | ✅ | `pesan.tsx` dengan `wa.me` |
| FA-09 | Notifikasi pesan/build | ⬜ | Belum ada |
| FA-10 | Dikte suara | ⬜ | Belum ada (Could) |
| FA-11 | Terima share dari aplikasi lain | ⬜ | Belum ada (Could) |
| FA-12 | Deteksi konflik versi | ◐ | Kolom `version` + `bump_version()` ada; UI "Pakai versi saya/server" belum |
| FA-13 | Ekspor cadangan JSON | ✅ | `exportBackup()` di `AdminContext` |

### 3.4 Nonfungsional (NFR)

| ID | Target PRD | Status | Bukti / catatan |
|---|---|---|---|
| N-01 | LCP ≤ 2,5 dtk, CLS ≤ 0,05, ≤ 150 KB | ◐ | Static export + font self-hosted; **Lighthouse belum dijalankan** |
| N-02 | Layar pertama ≤ 4 dtk / ≤ 1,5 dtk | ◐ | Tidak ada angka terukur di perangkat target |
| N-03 | ≥ 60 fps desktop, ≥ 45 fps Android entry | ◐ | Belum diprofilkan |
| N-04 | WCAG 2.2 AA | ◐ | `aria-label`, fokus terlihat, reduced-motion ✅; **audit kontras/semantik penuh + target sentuh 48 px belum** (CTA mobile sekarang 44 px) |
| N-05 | Publik tidak bergantung Supabase runtime | ✅ | Snapshot JSON; live tetap 200 |
| N-06 | RLS semua tabel, tanpa rahasia di klien | ✅ | 20 tabel RLS di `0001_init.sql`; secret scan bersih; uji kebijakan per role masih menyusul |
| N-07 | Draf admin aman setelah ditutup paksa | ◐ | `AsyncStorage` persisten; uji paksa di perangkat belum |

---

## 4. Backend, data & pipeline

| Item | Status | Bukti / catatan |
|---|---|---|
| Skema + RLS Supabase | ✅ | `supabase/migrations/0001_init.sql` diterapkan; tabel sesuai PRD §13 |
| Seed data | ◐ | `supabase/seed.sql` ada; **isi produksi belum diverifikasi** |
| Admin pertama | ⬜ | Perlu dibuat manual + update role `admin` sesuai PRD §13.3 |
| Pendaftaran publik dimatikan | ⬜ | Pengaturan Auth Supabase belum diverifikasi |
| Worker `/health`, `/v1/media`, `/v1/publish`, `/v1/deployments/latest`, `/v1/devices` | ◐ | Kode & verifikasi peran ada di `services/api/src/index.ts`; **deploy + secrets + URL produksi belum terverifikasi** |
| `/v1/contact` + Turnstile | N/A | PRD menunda ke fase 2; `/kontak` memakai WA/email |
| R2 bucket `sabdani-media`, `media.` domain, CORS | ⬜ | Belum dibuat/dikonfigurasi |
| Workflow `ci` | ✅ | typecheck, 8 tes, build web, validasi Expo, cek drift token |
| Workflow `web-deploy` | ✅ | Push `main` + `repository_dispatch publish` → `wrangler pages deploy` |
| Workflow `worker-deploy` | ◐ | File ada; status deploy belum diverifikasi |
| Workflow `admin-android` | ◐ | File ada; belum dijalankan untuk APK rilis |
| Cron publish terjadwal | ⬜ | Belum ada (PRD §8.4 langkah 5) |
| `_headers` cache + keamanan | ✅ | `apps/web/public/_headers` aktif; rewrite `/app/*` tidak diperlukan pada static export |
| Secret GitHub Actions | ✅ | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` terdaftar |
| Rahasia di repo/klien | ✅ | Tidak ada; file temporer sudah dihapus |

---

## 5. Checklist peluncuran PRD §23

### Teknis

| Item | Status | Catatan |
|---|---|---|
| Domain aktif + HTTPS | ◐ | HTTPS aktif di `sabditani.pages.dev`; apex/`www` `sabdani.id` tidak dipakai sesuai instruksi |
| RLS diuji (anon/editor/admin), signup mati | ◐ | RLS terpasang; uji role & setting Auth belum |
| Tidak ada rahasia di aplikasi/repo | ✅ | Sudah dicek |
| R2 + domain `media.` + CORS | ⬜ | Belum |
| Publish dari ponsel → situs berubah + status terlihat | ⬜ | End-to-end dengan perangkat & backend nyata belum |
| Mode offline admin: draf aman setelah force close | ◐ | Dasar lokal ada; uji perangkat belum |
| Sitemap, robots, RSS | ◐ | Ketiganya 200 ✅; **Search Console belum** |
| Aturan `/app/*` & header cache | ◐ | Static export memakai rute nyata; header cache aktif; uji header produksi menyusul |
| Backup pertama + uji pulihkan | ⬜ | Belum |
| Uptime monitoring + error reporting | ⬜ | Belum |

### Produk & desain

| Item | Status | Catatan |
|---|---|---|
| Kalender, 3 alat, pencarian di perangkat target | ◐ | Berfungsi secara lokal; matrix Chrome/Safari/Samsung Internet & Slow 4G belum |
| Token desain tunggal dipakai web + admin | ✅ | Generator + CI drift check |
| Kontras & mode gelap | ◐ | Bug `--onPrimary` / `--accentText` sudah diperbaiki; audit penuh belum |
| Skala teks 200% | ◐ | Pengaturan `font-scale` ada; uji 200% belum |
| Teks UI sesuai panduan | ✅ | "Anda", `1.000,5`, `Rp`, tanggal Indonesia, tanpa janji panen |
| Tentang, Metodologi, Kontak, Privasi, disclaimer | ✅ | Semua tersedia; disclaimer di artikel & alat hitung |

### Konten

| Item | Status | Catatan |
|---|---|---|
| ≥ 15 panduan inti | ⬜ | Baru **9 panduan**; butuh +6 |
| Data kalender terverifikasi lapangan/BMKG | ⬜ | 130 entri masih data contoh indikatif |
| Peringatan keselamatan pada dosis/pestisida | ◐ | Contoh hama sudah memuat APD & urutan bertingkat; audit menyeluruh belum |

---

## 6. Prioritas tindak lanjut

### P0 — sebelum disebut "siap produksi penuh"
1. **Konten:** tambah 6 panduan inti (9 → 15) dengan penulis, tanggal, dan foto asli.
2. **Publish end-to-end:** aktifkan Worker + secrets + R2 (`sabdani-media`, domain `media.`, CORS), lalu uji Terbitkan dari ponsel sampai situs berubah.
3. **Admin backend nyata:** matikan mode demo, sambungkan CRUD artikel/media ke Supabase via RLS, unggah 2 ukuran ke R2, autosave 5 detik, dan UI konflik versi.
4. **Auth & keamanan:** buat admin pertama, matikan pendaftaran publik, jalankan uji RLS anon/viewer/editor/admin.
5. **Kualitas:** Lighthouse + audit WCAG 2.2 AA, uji skala teks 200%, dan naikkan target sentuh mobile ke **48 × 48 px** (sekarang 44 px).

### P1 — segera setelah P0
- Service worker/cache shell untuk FW-10; ekspor PDF (FW-11).
- Notifikasi build/pesan (FA-09), notifikasi & izin perangkat.
- Cron artikel terjadwal + status build Realtime/polling.
- Verifikasi 130 entri kalender dengan penyuluh/BMKG; labelkan sumber data.
- Monitoring uptime/error reporting, backup database + uji pulihkan, Search Console.
- APK rilis bertanda tangan + Firebase App Distribution; keystore cadangan.
- Uji perangkat: Android entry-level, Chrome/Edge/Firefox, Safari iOS, Samsung Internet, Slow 4G.

### P2 — fase lanjut sesuai PRD
- Dikte suara (FA-10), terima share (FA-11), MFA, formulir kontak + Turnstile.
- Widgetbook/golden test/katalog komponen hidup dan pustaka Figma (adaptasi dari Flutter DS).
- Multi-penulis, afiliasi berlabel, ekspor/impor JSON Tersimpan.

---

## 7. Bukti verifikasi terakhir

| Pemeriksaan | Hasil |
|---|---|
| `npm run typecheck` | ✅ lolos (core, web, admin, api) |
| `npm test` | ✅ 8/8 (pupuk, populasi, usaha, kalender lintas tahun, musim, diagnosa, pencarian) |
| `npm run build:web` | ✅ 48 halaman statis di `apps/web/out` |
| `npx expo config --type public --json` | ✅ |
| GitHub Actions `ci` @ `3d27ec5` | ✅ success |
| GitHub Actions `web-deploy` @ `3d27ec5` | ✅ success |
| Live `https://sabditani.pages.dev` | ✅ `/`, `/app/`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/data/manifest.json` → 200 |
| Playwright viewport 390×844 | `scrollWidth = clientWidth = 390` (tanpa overflow); ikon search 20×20 px; CTA "Buka" teks krem `rgb(251,248,241)` di atas hijau; tanpa dev badge |
| Snapshot data | 6 komoditas · 130 kalender · 5 wilayah · 6 hama · 8 gejala · 9 panduan · 24 indeks cari |
| `git status` | Bersih (`main` = `3d27ec5`) |

---

**Kesimpulan:** fondasi MVP, seluruh rute utama, desain, dan deployment publik **sudah sesuai PRD yang telah dialihkan ke Next.js + React Native**. Yang belum memenuhi definisi "produksi penuh" PRD terutama berada di **konten (9/15 panduan)**, **R2 + publish end-to-end dari ponsel**, **sinkronisasi admin backend nyata**, dan **pengujian formal performa/a11y/RLS**.

Diperbarui: 26 November 2026 · Pemilik: tim SABDITANI · Status dokumen: **aktif**.
