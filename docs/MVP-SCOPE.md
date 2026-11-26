# Cakupan MVP

Status per 26 November 2026.

## Selesai

### Web publik (Next.js)
- Beranda "Hari ini di lahan", ringkasan musim/wilayah, komoditas, panduan, alat, diagnosa.
- Halaman panduan dengan penulis, tanggal, cap terverifikasi, daftar isi, blok khusus, cetak, JSON-LD Article/Breadcrumb.
- Halaman komoditas, hama, kategori, tentang, metodologi, kontak, privasi.
- SEO: metadata, Open Graph, sitemap, robots, RSS.
- Snapshot `/data/*.json` dan manifest.

### Web aplikasi
- Beranda kontekstual dengan pilihan wilayah/komoditas tersimpan.
- Kalender 12 bulan: jendela lintas tahun, filter, keyboard, marker hari ini, detail, `.ics`, URL bagikan.
- Alat Pupuk, Populasi, Analisis Usaha: hasil langsung, asumsi, salin, WhatsApp, simpan, skenario A/B, grafik sensitivitas.
- Diagnosa 4 langkah dengan skor kemungkinan dan disclaimer.
- Pencarian Ctrl/⌘+K dan halaman pencarian.
- Tersimpan localStorage + ekspor JSON.
- Tema terang/gelap, aksen musim, ukuran huruf hingga 200%.

### Admin mobile
- Login Supabase atau mode demo, kunci biometrik, SecureStore untuk token.
- Beranda statistik, status build, draf terakhir, sinkronisasi manual.
- Daftar artikel dengan filter dan pencarian.
- Editor Markdown dengan bilah alat, pratinjau, foto, autosave 5 detik.
- Halaman penerbitan dengan daftar periksa, kategori, komoditas, SEO, verifikasi, jadwal.
- Media: kamera/galeri → WebP 1600 px + miniatur 480 px, antrean unggah.
- Komoditas dan hama: tambah data lokal.
- Pesan dengan balasan WhatsApp.
- Pengaturan biometrik, auto-sync, ekspor cadangan, logout.

### Backend & infra
- Worker: health, media upload/delete, publish, deployments, devices; JWT + peran.
- Migrasi SQL lengkap dengan RLS dari PRD + seed.
- GitHub Actions: CI, web deploy, worker deploy, APK admin.
- Design token generator lintas platform.

## Belum masuk MVP (fase lanjut)

- Realtime status build di admin (saat ini polling manual + status lokal).
- Formulir kontak publik + Turnstile.
- Notifikasi push FCM.
- Dikte suara dan terima share dari aplikasi lain.
- Deteksi konflik versi penuh (field `version` sudah ada, UI resolusi belum).
- Ekspor PDF hasil hitung.
- Mode offline web dengan service worker.
- Migrasi admin AsyncStorage → SQLite/Drizzle.
- Golden test, uji RLS otomatis, Lighthouse CI, uji perangkat nyata.
- Monetisasi afiliasi dan iklan.

## Kriteria penerimaan yang terpenuhi

- `npm run typecheck`, `npm test`, `npm run build:web` lulus.
- Web dapat dijalankan di `http://localhost:3000` beserta semua rute.
- Tidak ada ketergantungan Supabase pada runtime web.
- Admin dapat dibuka dengan Expo dan memakai data demo tanpa kredensial.
