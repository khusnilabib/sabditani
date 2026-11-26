# ADR-001: Next.js + React Native menggantikan Flutter

- Status: Diterima
- Tanggal: 26 November 2026
- Pengganti: PRD v3.0 bagian 0.1 (D1, D2, D5, D6, D7), 8, 9, 10, 11

## Konteks

PRD v3 merancang tiga klien Flutter: situs statis Jaspr, Flutter Web `/app`, dan admin Flutter mobile. Pengguna meminta arsitektur diubah menjadi **Next.js** untuk web dan **React Native** untuk admin, tanpa Flutter, dengan tetap mempertahankan nama dan logo SABDITANI serta cakupan MVP.

## Keputusan

1. Satu aplikasi **Next.js 16 App Router** melayani situs SEO dan rute `/app`.
2. Admin mobile dibangun dengan **Expo SDK 54 / React Native 0.81**, bukan Flutter.
3. Model data, rumus, dan teks UI ditulis sekali di paket TypeScript `@sabditani/core` dan dipakai kedua klien.
4. Token desain tetap satu sumber (`tokens.json`), di-generate ke CSS, TypeScript, dan objek tema React Native.
5. Supabase, Cloudflare Worker, dan R2 tetap dipertahankan sesuai PRD.
6. Web tidak memanggil Supabase saat runtime; snapshot JSON tetap dipakai.

## Alasan

- Next.js menyediakan SSR/SSG dan metadata per rute secara native, sehingga tidak perlu Jaspr terpisah untuk SEO.
- Flutter Web memakai kanvas dan tidak ideal untuk teks panjang; App Router memberi HTML yang dapat dibaca mesin pencari untuk panduan sekaligus interaktivitas React untuk alat hitung.
- React Native + Expo memberi akses kamera, penyimpanan, dan biometrik dengan satu basis kode TypeScript yang sama dengan web.
- Menghapus Flutter menghilangkan duplikasi bahasa (Dart vs TypeScript) dan kebutuhan akan widgetbook/golden test Dart pada tahap MVP.
- Node 20.19.4 di lingkungan pengembangan mendukung Next.js 16 dan Expo SDK 54; Expo 58 memerlukan Node 22+, sehingga SDK 54 dipilih.

## Konsekuensi

- Perlu menyesuaikan pipeline deploy: Vercel (atau OpenNext) untuk Next.js, bukan Pages statis murni.
- `revalidatePath` menggantikan "build ulang penuh" untuk sebagian pembaruan konten.
- Admin memakai AsyncStorage pada MVP; bila concurrency tinggi diperlukan, migrasi ke SQLite dengan Drizzle disiapkan.
- Komponen design system tidak bisa dibagi langsung sebagai kode (CSS vs StyleSheet); yang dibagi adalah token, teks UI, dan logika.

## Alternatif yang ditolak

- **Tetap Flutter Web + Jaspr**: ditolak sesuai permintaan pengguna.
- **React Native CLI tanpa Expo**: lebih banyak konfigurasi native untuk Manifests, kamera, dan biometrik; tidak diperlukan pada MVP.
- **Monorepo Turborepo penuh**: npm workspaces sudah cukup untuk tiga aplikasi dan dua paket.

## Status implementasi

Lihat `docs/MVP-SCOPE.md`.
