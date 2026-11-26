# SABDANI — PRD v3.0 (Rombak Total)

**Flutter Web Publik · Aplikasi Admin Mobile · Design System · Product Design**

| | |
|---|---|
| Versi | 3.0 (menggantikan seluruh PRD v1 dan v2) |
| Status | Draf siap dieksekusi |
| Bahasa antarmuka | Bahasa Indonesia sehari-hari yang baku, sapaan **"Anda"** |
| Bahasa teknis | Dart/Flutter (klien), TypeScript (API tipis), SQL (database) |
| Tanggal | November 2026 |

---

## Daftar Isi

0. Ringkasan Eksekutif & Log Keputusan
1. Visi, Tujuan, Metrik
2. Pengguna & Kebutuhan
3. Strategi Produk & Cakupan
4. Arsitektur Informasi & Peta Rute
5. Product Design: Alur & Layar
6. Design System "Sabdani DS"
7. Implementasi Design System di Flutter
8. Arsitektur Teknis
9. Flutter Web Publik
10. Situs Konten Statis (lapisan SEO)
11. Aplikasi Admin Mobile
12. Backend: Supabase, API Tipis, R2
13. Database & Keamanan Baris (SQL)
14. Auth & Otorisasi
15. Pipeline Rilis (CI/CD)
16. Keamanan & Privasi
17. Operasional: Backup, Pemantauan, Analitik
18. Batas Layanan Gratis & Biaya
19. Strategi Pengujian
20. Roadmap
21. Monetisasi & KPI
22. Risiko & Mitigasi
23. Checklist Peluncuran
Lampiran A–D

---

## 0. Ringkasan Eksekutif & Log Keputusan

**Sabdani** adalah platform referensi pertanian berbahasa Indonesia dengan tiga bagian yang saling terhubung:

1. **Situs konten statis** (`sabdani.id`): panduan, profil komoditas, hama dan penyakit. Cepat, bisa dibaca mesin pencari, menjadi sumber trafik jangka panjang.
2. **Sabdani Web App** (Flutter Web, `sabdani.id/app`): pengalaman interaktif premium berupa Kalender Tanam, Alat Hitung, Diagnosa Gejala, dan Pencarian Cepat.
3. **Sabdani Admin** (Flutter mobile): aplikasi untuk menulis, memotret, mengunggah, dan menerbitkan konten langsung dari ponsel, termasuk saat di lahan tanpa sinyal.

### 0.1 Log Keputusan

| # | Keputusan | Alasan | Konsekuensi |
|---|---|---|---|
| D1 | **Arsitektur hybrid**: konten teks memakai situs statis (Dart/Jaspr), pengalaman interaktif memakai Flutter Web | Dokumentasi resmi Flutter (diperbarui Oktober 2026) menyebut konten teks statis seperti artikel blog lebih cocok dengan model dokumen web, dan Flutter paling bernilai untuk aplikasi interaktif. Flutter Web menggambar ke kanvas (CanvasKit/Skwasm), sehingga indeks mesin pencari lemah, dan *server-side rendering* untuk Flutter Web tidak direncanakan oleh tim Flutter | Perpindahan antara artikel dan aplikasi adalah pemuatan halaman penuh; token desain harus dibagi agar tampilan seragam |
| D2 | Admin = **aplikasi Flutter mobile** (Android dulu, iOS opsional) | Mudah dikelola dari ponsel, kamera dan penyimpanan lokal tersedia | iOS memerlukan akun developer berbayar tahunan; ditunda |
| D3 | **Supabase** (Auth, Postgres, RLS, Realtime) + **Cloudflare R2** + **Cloudflare Worker** tipis | Gratis di tahap awal, sesuai stack awal | Ada batas layanan gratis (Bagian 18) |
| D4 | Web publik **tidak memanggil Supabase saat dijalankan**; data dibaca dari **snapshot JSON statis** yang dibuat saat build | Tahan beban, tetap hidup meski proyek Supabase gratis dijeda, hemat kuota | Perubahan data tampil setelah build ulang (±2–4 menit) |
| D5 | **Satu sumber token desain** (`tokens.json`) dihasilkan menjadi Dart dan CSS | Konsistensi Flutter dan situs statis | Perlu skrip generator kecil |
| D6 | **Monorepo Dart** dengan paket bersama (`sabdani_core`, `sabdani_ds`) | Model dan logika dipakai web, admin, dan situs statis | Perlu disiplin versi dan CI |
| D7 | Build dilakukan di **GitHub Actions**, hasilnya diunggah ke **Cloudflare Pages** | Versi Flutter terkunci, build dapat di-*cache* | Kuota menit Actions perlu dipantau |
| D8 | Distribusi admin lewat **APK privat / Firebase App Distribution** | Gratis, hanya untuk tim internal | Tidak ada di toko aplikasi pada tahap awal |
| D9 | Bahasa UI: Indonesia umum; kode dan nama teknis: Inggris | Standar industri; mudah dirawat | Panduan penulisan di Bagian 6.9 |

### 0.2 Jika Anda tetap ingin 100% Flutter Web

Bisa, dan desain serta kode Flutter di dokumen ini tetap berlaku. Namun siapkan konsekuensinya: peringkat dan trafik organik dari Google kemungkinan jauh lebih rendah, unduhan awal lebih berat, dan artikel panjang kurang optimal sebagai halaman Flutter. Minimal tetap sediakan halaman statis untuk 10–20 URL utama dan `sitemap.xml`. Rekomendasi saya tetap D1, karena tujuan awal Anda adalah aset penghasilan jangka panjang dari trafik pencarian.

---

## 1. Visi, Tujuan, Metrik

**Visi:** menjadi rujukan pertama petani dan calon petani Indonesia sebelum mengambil keputusan di lahan.

**Janji merek:** *Kabar dan ilmu tani yang bisa dipercaya.*

**Arti nama:** *sabda* (ucapan yang berbobot dan bisa dipegang) + *tani*.

### 1.1 Tujuan dan Non-Tujuan

| Tujuan | Ukuran |
|---|---|
| T1. Trafik organik jangka panjang | 10.000 sesi organik/bulan pada bulan ke-12 |
| T2. Alat yang dipakai berulang | ≥ 25% pengunjung memakai Kalender atau Alat Hitung |
| T3. Kepercayaan | 100% panduan memiliki penulis, tanggal, dan penanda verifikasi lapangan bila sudah diverifikasi |
| T4. Produksi konten cepat | Draf pertama dari lahan menjadi artikel terbit ≤ 24 jam |
| T5. Biaya awal minim | Rp0 per bulan di luar domain pada fase 1 |

**Non-tujuan (fase 1):** akun pengguna publik, komentar, marketplace jual-beli, aplikasi publik di toko aplikasi, fitur AI, pembayaran dalam aplikasi.

---

## 2. Pengguna & Kebutuhan

### 2.1 Persona

| Persona | Konteks | Kebutuhan utama | Hambatan |
|---|---|---|---|
| **Pak Joko**, petani cabai, 45 th | HP Android kelas menengah ke bawah, sinyal naik-turun | Dosis pupuk, penanganan hama cepat | Layar kecil, kuota terbatas, istilah teknis |
| **Rani**, calon petani, 27 th | Sering memakai Google dan YouTube | Kapan menanam, hitungan modal dan untung | Informasi bertebaran dan saling bertentangan |
| **Bu Sari**, penyuluh lapangan, 38 th | Membagikan informasi ke grup WhatsApp | Referensi yang bisa dirujuk dan dibagikan | Butuh sumber yang jelas dan bisa dicetak |
| **Admin/Penulis** (pemilik) | Sering di kebun, jarang di depan komputer | Menulis, memotret, menerbitkan dari ponsel | Sinyal lemah, waktu terbatas |

### 2.2 Pekerjaan yang Ingin Diselesaikan (JTBD)

1. "Saat musim berganti, saya ingin tahu **apa yang sebaiknya saya kerjakan sekarang**."
2. "Saat tanaman bermasalah, saya ingin **tahu penyebabnya dan cara mengatasinya** dengan cepat."
3. "Sebelum membeli input, saya ingin **menghitung kebutuhan dan biayanya**."
4. "Sebagai penulis, saya ingin **mencatat temuan lapangan saat itu juga** dan menerbitkannya tanpa laptop."

---

## 3. Strategi Produk & Cakupan

### 3.1 Empat Pilar Produk

| Pilar | Pertanyaan yang dijawab | Wujud |
|---|---|---|
| **Hari Ini** | Apa yang sebaiknya dikerjakan sekarang? | Beranda kontekstual berdasarkan bulan, musim, dan wilayah |
| **Hitung** | Berapa kebutuhan dan biayanya? | Alat Hitung interaktif |
| **Pelajari** | Bagaimana caranya? | Panduan terverifikasi lapangan (situs statis) |
| **Selamatkan** | Tanaman saya kenapa? | Diagnosa Gejala dan database hama/penyakit |

### 3.2 Fitur Pembeda

| Fitur | Deskripsi | Mengapa unik |
|---|---|---|
| **Kalender Tanam Interaktif** | Garis waktu 12 bulan yang bisa digeser; pilih komoditas dan wilayah, lihat jendela semai, tanam, pemupukan, panen | Menjawab pertanyaan paling sering, dengan sentuhan visual yang jarang dipakai situs tani |
| **Hasil Hitung Langsung** | Angka berubah seketika saat Anda menggeser input; ada skenario A/B dan grafik sensitivitas harga | Terasa seperti alat profesional |
| **Diagnosa Gejala** | Wizard visual: tanaman → bagian → gejala → kemungkinan penyebab | Bukan sekadar daftar artikel |
| **Cap Terverifikasi Lapangan** | Penanda pada konten yang sudah diuji di lahan, lengkap dengan nama dan bulan | Sinyal kepercayaan yang konsisten |
| **Kontur Hidup** | Latar garis kontur lahan terasering yang bergerak sangat pelan | Identitas visual khas, tanpa foto stok |
| **Admin dari Lahan** | Tulis, dikte, potret, simpan offline, terbitkan dari ponsel | Mempercepat produksi konten |

### 3.3 Prioritas (MoSCoW)

| Prioritas | Fitur |
|---|---|
| **Must** | Situs statis (panduan, komoditas, hama), Kalender Tanam, 3 Alat Hitung, Pencarian Cepat, Admin: login, artikel, editor, kamera/unggah, Publish, mode offline dasar |
| **Should** | Diagnosa Gejala, Tersimpan (lokal), Realtime status build, notifikasi pesan, tema musiman, mode gelap |
| **Could** | Ekspor PDF hasil hitung, tanam bersama pengingat (.ics), dikte suara, multi-penulis |
| **Won't (sekarang)** | Akun publik, komentar, belanja, AI, iOS admin |

---

## 4. Arsitektur Informasi & Peta Rute

### 4.1 Peta Rute Publik

**Situs statis (SEO)**

| Rute | Isi |
|---|---|
| `/` | Beranda: pernyataan "Hari ini di lahan", komoditas, panduan terbaru, pintu masuk ke aplikasi |
| `/panduan`, `/panduan/{slug}` | Daftar dan isi panduan |
| `/komoditas`, `/komoditas/{slug}` | Profil komoditas, ringkasan kalender, panduan terkait |
| `/hama`, `/hama/{slug}` | Daftar hama/penyakit dan detailnya |
| `/kategori/{slug}` | Kumpulan panduan per kategori |
| `/tentang`, `/metodologi`, `/kontak`, `/privasi` | Halaman kepercayaan |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | Teknis SEO |
| `/data/*.json` | Snapshot data untuk Flutter Web |

**Flutter Web (`/app`)**

| Rute | Isi |
|---|---|
| `/app/` | **Hari Ini** (beranda interaktif) |
| `/app/kalender?komoditas=&wilayah=` | Kalender Tanam Interaktif |
| `/app/alat` | Daftar Alat Hitung |
| `/app/alat/pupuk`, `/app/alat/populasi`, `/app/alat/usaha` | Alat Hitung (menerima parameter `?komoditas=`) |
| `/app/diagnosa` | Wizard Diagnosa Gejala |
| `/app/cari?q=` | Pencarian (juga lewat Ctrl/⌘+K di mana saja) |
| `/app/tersimpan` | Daftar panduan/hitungan yang disimpan (lokal di perangkat) |
| `/app/pengaturan` | Tema, ukuran huruf, satuan, wilayah |

### 4.2 Navigasi

| Layar | Pola |
|---|---|
| Desktop (≥ 840 dp) | **Rel samping** di kiri (ikon + label): Hari Ini · Kalender · Alat Hitung · Diagnosa · Tersimpan · Panduan ↗ |
| Ponsel (< 600 dp) | **Bilah bawah** 4 item: Hari Ini · Kalender · Alat · Diagnosa; Cari di pojok kanan atas |
| Pencarian | Palet pencarian (Ctrl/⌘+K, atau ketuk ikon cari) |

Tautan **Panduan ↗** membuka situs statis. Panduan menaut balik ke alat yang relevan.

---

## 5. Product Design: Alur & Layar

### 5.1 Alur Utama

**A1. Petani mencari dosis pupuk**
Google → panduan "Pemupukan Cabai" (situs statis) → kartu "Hitung kebutuhan pupuk" → `/app/alat/pupuk?komoditas=cabai` → isi luas lahan → hasil langsung muncul → **Salin** atau **Bagikan ke WhatsApp**.

**A2. Pemula memeriksa waktu tanam**
`/app/` → Kalender → pilih komoditas dan wilayah → geser garis waktu → ketuk batang "Tanam" → baca rincian dan tips → **Tambah pengingat** atau buka panduan terkait.

**A3. Diagnosa gejala**
`/app/diagnosa` → pilih tanaman → pilih bagian (daun/batang/buah/akar) → pilih gejala bergambar (boleh lebih dari satu) → daftar kemungkinan penyebab berurutan kecocokan → buka detail hama (situs statis) → cara pengendalian bertingkat.

**A4. Admin menulis dari kebun**
Buka Sabdani Admin (biometrik) → **Catatan Baru** → ketik atau dikte → ambil foto → simpan draf (offline) → saat ada sinyal sinkron otomatis → atur penerbitan → **Terbitkan** → lihat status build → notifikasi "Terbit".

**A5. Admin menanggapi pesan**
Notifikasi pesan baru → buka Pesan → **Balas via WhatsApp** (tautan langsung).

### 5.2 Layar Web App (desktop)

**Hari Ini**

```
┌─────────┬────────────────────────────────────────────────────────┐
│ Sabdani │ Kamis, 26 November 2026         Cari  ⌘K     ◐ Tema    │
│         ├────────────────────────────────────────────────────────┤
│ Hari Ini│ ░░░ kontur hidup (animasi halus) ░░░░░░░░░░░░░░░░░░░░░░ │
│ Kalender│ MUSIM HUJAN · AWAL                                     │
│ Alat    │ Saat yang tepat untuk                                  │
│ Diagnosa│ mengolah lahan dan menyemai.                           │
│ Tersimpan│ Wilayah: [ Jawa, dataran rendah ▾ ]                   │
│         │ [ Lihat yang cocok ditanam sekarang ]                  │
│ Panduan↗├────────────────────────────────────────────────────────┤
│         │ SEDANG WAKTUNYA          (kartu geser horizontal)       │
│         │ [Cabai · Tanam] [Padi · Semai] [Jagung · Pupuk] →      │
│         │ ALAT CEPAT                                             │
│         │ [Hitung Pupuk] [Populasi Tanam] [Analisis Usaha]       │
│         │ WASPADA MUSIM INI (hama yang sering muncul)            │
│         │ PANDUAN TERBARU ↗ (tautan ke situs)                    │
└─────────┴────────────────────────────────────────────────────────┘
```

**Kalender Tanam**

```
Kalender Tanam
Komoditas [ Cabai ▾ ]    Wilayah [ Jawa, dataran rendah ▾ ]

          Jan Feb Mar Apr Mei Jun Jul Agu Sep Okt Nov Des
Semai     ▒▒▒                                   ███ ███
Olah lahan                                      ▒▒▒ ███
Tanam         ███ ███                               ▒▒▒
Pemupukan         ▒▒▒ ███ ███
Panen                 ░░░ ███ ███ ███
                                              ▲ Hari ini
          ◀──────────── geser / seret ────────────▶

┌ Tanam · Februari – Maret ─────────────────────────────────┐
│ Yang dikerjakan: pindah tanam bibit umur 25–30 hari ...   │
│ Catatan Lapangan: hindari tanam saat curah hujan tinggi.   │
│ [ Buka panduan ↗ ]  [ Tambah pengingat ]  [ Bagikan ]     │
└────────────────────────────────────────────────────────────┘
```

**Alat Hitung (Pupuk)**

```
┌──────────────────────────────┬─────────────────────────────────┐
│ ALAT › PUPUK                 │ HASIL                           │
│ Berapa luas lahan Anda?      │   12,5 kg                       │
│ [ 1.000 ] [ m² ▾ ]           │   per aplikasi                  │
│ Komoditas   [ Cabai ▾ ]      │   3 kali · total 37,5 kg        │
│ Jenis pupuk [ NPK 16-16-16 ▾]│ ─────────────────────────────── │
│ Dosis (kg/ha) ──●────── 300  │ Grafik biaya vs dosis           │
│ Biaya/kg   [ Rp 14.000 ]     │ [ Salin ] [ WhatsApp ] [ Simpan ]│
│ Catatan: contoh pengisian... │ Skenario: [A] [B +]  bandingkan │
└──────────────────────────────┴─────────────────────────────────┘
```

**Diagnosa Gejala (langkah 2 dari 4)**

```
Diagnosa › Cabai › Bagian tanaman
Mana yang bermasalah?
[ Daun ] [ Batang ] [ Buah ] [ Akar ] [ Seluruh tanaman ]
─────────────────────────────────────────────
Langkah 3: pilih gejala (boleh lebih dari satu)
[foto] Daun menggulung   [foto] Bercak cokelat   [foto] Layu mendadak
Hasil sementara: 3 kemungkinan ▸
```

### 5.3 Layar Admin Mobile

```
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ Beranda           │ │ Editor            │ │ Terbitkan         │
│ Selamat pagi      │ │ ‹  Cabai: ...  ⋮  │ │ Kategori [ ▾ ]    │
│ ┌─────┬─────┬────┐│ │ ───────────────── │ │ Komoditas [ ▾ ]   │
│ │Draf │Terbit│Pesan││ │ Paragraf ...     │ │ Cover [ pilih ]   │
│ │  4  │ 38   │  2 ││ │ [Catatan Lapangan]│ │ ☑ Terverifikasi   │
│ └─────┴─────┴────┘│ │ [foto]            │ │   lapangan        │
│ Status situs:     │ │ ───────────────── │ │ Judul SEO         │
│ ● Terbit 10.42    │ │ B I ≡ 🔗 📷 ⌁ 🎤  │ │ Jadwal [ Sekarang▾]│
│ Draf terakhir ›   │ │ ● Tersimpan lokal │ │ [   TERBITKAN   ] │
│        (＋)       │ └───────────────────┘ └───────────────────┘
└───────────────────┘
 Beranda · Artikel · Media · Pesan · Lainnya
```

Layar admin lainnya: **Artikel** (daftar, cari, filter, geser untuk tindakan), **Media** (galeri, antrean unggah), **Komoditas & Kalender** (formulir jendela waktu), **Hama & Penyakit** (formulir + foto + gejala), **Pesan**, **Pengaturan** (akun, kunci biometrik, ekspor cadangan).

### 5.4 Kebutuhan Fungsional

**Situs statis (FS)**

| ID | Kebutuhan | Prio |
|---|---|---|
| FS-01 | Halaman panduan dengan penulis, tanggal terbit dan diperbarui, daftar isi, catatan samping, Cap Terverifikasi Lapangan | Must |
| FS-02 | Profil komoditas dengan ringkasan kalender dan tautan alat | Must |
| FS-03 | Database hama/penyakit dengan foto dan pengendalian bertingkat | Must |
| FS-04 | SEO: meta, Open Graph, JSON-LD (`Article`, `BreadcrumbList`), sitemap, RSS | Must |
| FS-05 | Penanda progres baca "Progres Tumbuh" | Should |
| FS-06 | Halaman Kontak (tautan WhatsApp/email; formulir + Turnstile di fase berikutnya) | Must |
| FS-07 | Pembuatan `/data/*.json` untuk Flutter Web | Must |
| FS-08 | Mode cetak panduan | Could |

**Flutter Web (FW)**

| ID | Kebutuhan | Kriteria penerimaan | Prio |
|---|---|---|---|
| FW-01 | Beranda "Hari Ini" menyesuaikan bulan, musim, wilayah | Wilayah tersimpan di perangkat; konten berubah saat wilayah diganti tanpa muat ulang | Must |
| FW-02 | Kalender Tanam Interaktif | 12 bulan, geser/seret, penanda hari ini, ketuk batang untuk rincian, dapat dibagikan lewat URL | Must |
| FW-03 | Alat Hitung Pupuk, Populasi, Analisis Usaha | Hasil langsung (< 100 ms), satuan dapat diganti, asumsi tampil, salin/WhatsApp | Must |
| FW-04 | Skenario A/B dan grafik sensitivitas pada Analisis Usaha | Perubahan harga ±30% terlihat pada grafik | Should |
| FW-05 | Diagnosa Gejala | Empat langkah, multi-pilih gejala, hasil berurutan | Should |
| FW-06 | Pencarian Cepat (Ctrl/⌘+K) | Hasil muncul saat mengetik; terkelompok (Panduan, Komoditas, Hama, Alat) | Must |
| FW-07 | Tersimpan (lokal) | Bertahan setelah tutup peramban | Should |
| FW-08 | Tema terang/gelap/otomatis, ukuran huruf | Mengikuti pengaturan sistem secara default | Must |
| FW-09 | Tema musiman otomatis | Aksen berubah sesuai musim wilayah | Should |
| FW-10 | Berfungsi tanpa sinyal setelah kunjungan pertama (aset ter-*cache*) | Layar terakhir tetap dapat dibuka | Could |
| FW-11 | Ekspor PDF hasil hitung (dimuat tertunda) | Tidak menambah ukuran muatan awal | Could |

**Admin Mobile (FA)**

| ID | Kebutuhan | Prio |
|---|---|---|
| FA-01 | Masuk dengan email + kata sandi (Supabase Auth); kunci biometrik setelah itu | Must |
| FA-02 | CRUD artikel; status draf/terjadwal/terbit | Must |
| FA-03 | Editor Markdown dengan bilah alat dan blok khusus (Catatan Lapangan, Peringatan, Foto, Tabel) | Must |
| FA-04 | Simpan otomatis lokal setiap 5 detik; berfungsi tanpa sinyal | Must |
| FA-05 | Kamera/galeri → kompres → unggah dua ukuran ke R2 dengan antrean ulang otomatis | Must |
| FA-06 | Tombol **Terbitkan** memicu build dan menampilkan statusnya | Must |
| FA-07 | CRUD komoditas, jendela kalender tanam, hama, gejala, parameter alat hitung | Must |
| FA-08 | Kotak masuk pesan + tautan balas WhatsApp | Should |
| FA-09 | Notifikasi: pesan baru, build selesai/gagal | Should |
| FA-10 | Dikte suara bahasa Indonesia | Could |
| FA-11 | Terima berbagi dari aplikasi lain (teks/foto dari WhatsApp) sebagai draf | Could |
| FA-12 | Deteksi konflik penyuntingan (versi) | Must |
| FA-13 | Ekspor cadangan konten (JSON/Markdown) | Should |

**Kebutuhan Nonfungsional (NFR)**

| ID | Kebutuhan | Target |
|---|---|---|
| N-01 | Situs statis (halaman panduan) | LCP ≤ 2,5 dtk di 4G lambat; CLS ≤ 0,05; total ≤ 150 KB tanpa gambar |
| N-02 | Flutter Web | Layar pertama tampil ≤ 4 dtk di 4G pada Android menengah (kunjungan pertama, ukur nyata); kunjungan berikutnya ≤ 1,5 dtk |
| N-03 | Kelancaran | ≥ 60 fps desktop; ≥ 45 fps Android entry-level pada layar interaktif |
| N-04 | Aksesibilitas | WCAG 2.2 AA (Bagian 6.10) |
| N-05 | Ketersediaan situs publik | Tidak bergantung Supabase saat runtime |
| N-06 | Keamanan | RLS di semua tabel; tanpa rahasia di klien |
| N-07 | Admin offline | Draf tidak hilang walau aplikasi ditutup paksa |

---

## 6. Design System "Sabdani DS"

### 6.1 Prinsip Desain

| Prinsip | Arti | Contoh penerapan |
|---|---|---|
| **Jelas dulu, indah kemudian** | Fungsi harus langsung dipahami di bawah sinar matahari dan sinyal buruk | Kontras tinggi, label teks di setiap ikon, tombol besar |
| **Berakar** | Visual berasal dari dunia tani nyata | Kontur lahan, warna tanah dan daun, foto asli |
| **Tenang dan presisi** | Premium lewat ruang kosong dan detail, bukan hiasan | Garis tipis, tipografi serif untuk judul, animasi lembut |
| **Jujur** | Angka disertai asumsi, klaim disertai sumber | Panel "Asumsi" di setiap hasil hitung |
| **Ramah semua perangkat** | Dari HP entry-level hingga monitor lebar | Tata letak adaptif, ukuran muatan dijaga |

**Kepribadian merek:** tepercaya · hangat · teliti · modern.

### 6.2 Konsep Visual: "Hijau Dalam & Emas Lembut"

Dasar krem hangat (kertas), hijau daun tua sebagai warna aksi, emas lembut sebagai aksen penanda kepercayaan. Tekstur hanya berupa garis kontur tipis. Tidak ada gradien norak, foto stok petani tersenyum, atau ikon daun generik.

**Yang sengaja dihindari:** karusel besar, grid kartu seragam sebagai pola utama, bayangan tebal, warna hijau neon, efek kaca buram generik.

### 6.3 Warna

**Palet merek (mentah)**

| Nama | Nilai |
|---|---|
| Hijau 900 / 800 / 700 / 600 / 500 | `#12261D` / `#1A3A2B` / `#1F4D38` / `#2B6849` / `#3A8460` |
| Hijau 300 / 100 / 50 | `#86B79B` / `#DCEBE2` / `#EEF5F0` |
| Emas 800 / 600 / 500 / 300 / 100 | `#7A5C1D` / `#A8802F` / `#C39A3F` / `#E2C77F` / `#F5EBCB` |
| Krem 50 / 100 / 200 / 300 | `#FBF8F1` / `#F4EEDF` / `#E9DFC8` / `#D9CCAE` |
| Tanah 900 / 800 / 700 | `#14110F` / `#1E1A16` / `#2A241D` |
| Tinta 900 | `#1B1A17` |

**Token semantik**

| Token | Terang | Gelap | Dipakai untuk |
|---|---|---|---|
| `canvas` | `#FBF8F1` | `#14110F` | Latar halaman |
| `surface` | `#FFFFFF` | `#1E1A16` | Kartu, panel |
| `sunken` | `#F0E9D8` | `#0F0D0B` | Area cekung (input, tabel) |
| `ink` | `#1B1A17` | `#EDE6D6` | Teks utama |
| `inkMuted` | `#5E5A51` | `#A39C8D` | Teks sekunder |
| `line` | `#E3DAC3` | `#3A332A` | Garis pemisah |
| `primary` | `#1F4D38` | `#86B79B` | Tombol utama, tautan |
| `onPrimary` | `#FBF8F1` | `#0F2A1E` | Teks di atas primary |
| `primaryContainer` | `#DCEBE2` | `#1F4D38` | Latar aksen lembut |
| `accent` | `#C39A3F` | `#E2C77F` | Dekoratif: segel, penanda |
| `accentText` | `#7A5C1D` | `#E2C77F` | Aksen berupa teks |
| `success` | `#2B6849` | `#7FC29B` | Berhasil |
| `warning` | `#9A6212` | `#E0B15A` | Peringatan |
| `danger` | `#B3382C` | `#F08A7E` | Bahaya, galat |
| `info` | `#2F5A8A` | `#9DB9DE` | Informasi |

**Token musim** (hanya aksen yang berubah)

| Musim | Terang | Gelap |
|---|---|---|
| Musim hujan | `#3A8460` | `#86B79B` |
| Peralihan (pancaroba) | `#C39A3F` | `#E2C77F` |
| Musim kemarau | `#B5653A` | `#E0976F` |

Aturan penggunaan: ±70% netral, ±20% hijau, ±8% emas, ±2% lainnya. **Emas murni (`accent`) tidak boleh dipakai untuk teks kecil**; gunakan `accentText`. Seluruh pasangan warna diuji dengan alat kontras sebelum finalisasi (target 4,5:1 teks biasa, 3:1 teks besar dan komponen UI). Informasi tidak boleh hanya dibedakan lewat warna.

> Pembagian musim bersifat indikatif dan berasal dari data wilayah di database (kolom `rainy_months`). Iklim berbeda antarwilayah dan antartahun; lengkapi dengan data resmi BMKG bila tersedia.

### 6.4 Tipografi

| Peran | Keluarga | Alasan |
|---|---|---|
| Judul dan angka besar | **Fraunces** (serif variabel) | Hangat, terasa terbitan bergengsi |
| Antarmuka dan isi | **Plus Jakarta Sans** | Dirancang di Indonesia, terbaca jelas di layar kecil |

Keduanya berlisensi SIL OFL; **dikemas sebagai aset aplikasi** (bukan diunduh saat runtime), subset Latin, tidak lebih dari dua keluarga.

| Gaya | Font | Ukuran/Tinggi baris (desktop) | Ponsel | Berat |
|---|---|---|---|---|
| Display XL | Fraunces | 64 / 68 | 40 / 44 | 500 |
| Display L | Fraunces | 48 / 52 | 34 / 40 | 500 |
| Headline L | Fraunces | 34 / 40 | 28 / 34 | 600 |
| Headline M | Fraunces | 26 / 32 | 22 / 28 | 600 |
| Title L | Plus Jakarta | 20 / 28 | 19 / 26 | 600 |
| Title M | Plus Jakarta | 17 / 24 | 17 / 24 | 600 |
| Body L | Plus Jakarta | 18 / 29 | 17 / 27 | 400 |
| Body M | Plus Jakarta | 16 / 26 | 16 / 25 | 400 |
| Body S | Plus Jakarta | 14 / 22 | 14 / 22 | 400 |
| Label L | Plus Jakarta | 15 / 20 | 15 / 20 | 600 |
| Label S (kapital) | Plus Jakarta | 12 / 16, jarak huruf +4% | sama | 600 |
| Angka XL | Fraunces, angka tabular | 72 / 72 | 52 / 52 | 500 |
| Angka M | Plus Jakarta, angka tabular | 28 / 32 | 24 / 28 | 600 |

Aturan: lebar baca maksimum ±68 karakter; skala huruf pengguna sampai 200% tidak boleh merusak tata letak; hindari emoji dan karakter di luar font (memicu pengunduhan font cadangan di Flutter Web).

### 6.5 Tata Letak, Jarak, Bentuk, Elevasi

**Titik henti (mengikuti kelas ukuran jendela Material)**

| Kelas | Lebar (dp) | Kolom | Jarak antar-kolom | Navigasi |
|---|---|---|---|---|
| Compact | < 600 | 4 | 16 | Bilah bawah |
| Medium | 600–839 | 8 | 24 | Rel samping ringkas |
| Expanded | 840–1199 | 12 | 24 | Rel samping |
| Large | 1200–1599 | 12 | 32 | Rel samping diperluas |
| XLarge | ≥ 1600 | 12 | 32 | Konten maks 1280, terpusat |

**Jarak (kelipatan 4):** 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 120.

**Bentuk (radius):** `xs` 4 · `sm` 8 · `md` 12 (tombol, input) · `lg` 16 (kartu) · `xl` 24 (panel besar, sheet) · `full` (chip, avatar).

**Elevasi:** utamakan garis 1 px; bayangan hangat sangat lembut untuk elemen melayang.

| Level | Pemakaian | Bayangan |
|---|---|---|
| 0 | Datar | tanpa bayangan |
| 1 | Kartu | `0 1 2` warna tanah 6% + garis |
| 2 | Menu, popover | `0 4 12` warna tanah 8% |
| 3 | Dialog, sheet | `0 12 32` warna tanah 12% |

### 6.6 Ikonografi

- Dasar: **Material Symbols (Rounded)** untuk ikon umum, diambil sebagian (*subset*) agar ringan.
- **Set ikon tani kustom** (dikemas sebagai ikon-font agar bisa di-*tree-shake*): benih, tunas, daun, cangkul, sabit, lumbung, tetes air, timbangan, matahari, awan hujan, serangga, bercak daun, kontur lahan, pot/polybag, karung pupuk.
- Spesifikasi: grid 24 dp, garis 1,75 dp, ujung membulat, tanpa isian. Ikon pada navigasi **selalu** disertai label.
- Area sentuh minimal 48 × 48 dp.

### 6.7 Gerak (Motion)

Gerak mengikuti metafora **tumbuh**: pelan, pasti, tidak melompat. Selalu dapat dimatikan.

| Token | Nilai |
|---|---|
| Durasi `instant` / `fast` / `base` / `slow` / `slower` | 80 / 150 / 250 / 400 / 700 ms |
| Kurva `standard` | `easeOutCubic` |
| Kurva `emphasized` | `Cubic(0.2, 0, 0, 1)` |
| Kurva `spring` | pegas teredam (stiffness sedang) |

| Momen | Gerak |
|---|---|
| Masuk halaman | Judul naik 8 dp dan memudar masuk; elemen lain bertahap 40 ms |
| Hover/fokus kartu | Garis berubah warna, naik 2 dp (desktop saja) |
| Geser kalender | Inersia halus; batang aktif menebal |
| Hasil hitung | Angka menghitung dari nilai lama ke baru (500 ms) |
| Kontur Hidup | Siklus 40 detik, berhenti saat di luar layar atau saat gerak dikurangi |
| Salin berhasil | Ikon salin berubah centang 1,5 dtk |
| Progres Tumbuh (artikel) | Batang tipis memanjang saat gulir, daun muncul di tiap subjudul |

Aturan: hormati pengaturan "kurangi gerak" sistem (`MediaQuery.disableAnimations`); tidak ada animasi berkedip; animasi kompleks diuji di Android entry-level, dan dinonaktifkan bila di bawah 45 fps.

### 6.8 Katalog Komponen

Awalan kelas Flutter: `Sd`. Setiap komponen memiliki: anatomi, varian, keadaan, aksesibilitas, contoh benar/salah, dan *golden test*.

| Komponen | Varian | Keadaan | Catatan |
|---|---|---|---|
| `SdButton` | primer, sekunder (garis), tonal, teks, ikon; ukuran S/M/L | normal, hover, fokus, ditekan, nonaktif, memuat | Tinggi 48 dp; maks 1 tombol primer per bagian |
| `SdTextField` | teks, angka, pencarian, area teks | fokus, galat, nonaktif, terisi | Label di atas; satuan sebagai akhiran; pesan galat terhubung |
| `SdNumberField` | dengan slider, dengan stepper | — | Format angka Indonesia (1.000,5) |
| `SdSelect` / `SdAutocomplete` | tunggal | membuka, mencari, kosong | Untuk komoditas, wilayah |
| `SdSegmented` | 2–4 opsi | terpilih | Untuk satuan, skenario |
| `SdChip` | filter, gejala bergambar, status | terpilih | Multi-pilih |
| `SdCard` | datar, bergaris, terangkat, ditekan | hover, fokus | Radius 16 |
| `SdListRow` | indeks komoditas, hasil cari | hover | Seluruh baris bisa ditekan |
| `SdTimeline` | kalender 12 bulan | geser, fokus, terpilih | Dapat dioperasikan keyboard (panah) |
| `SdSeal` | cap terverifikasi | hover/tooltip | Hanya pada konten yang benar-benar diverifikasi |
| `SdSideNote` | catatan, peringatan | buka/tutup (ponsel) | Peringatan tidak boleh dilipat |
| `SdStat` / `SdCounter` | angka besar | menganimasikan | Angka tabular |
| `SdChart` | garis, batang (sensitivitas) | — | Selalu disertai ringkasan teks |
| `SdNavRail` / `SdBottomBar` | — | aktif, hover | Label selalu tampil |
| `SdAppBar` | web, admin | menyusut saat gulir | — |
| `SdSheet` | bawah, samping | — | Untuk rincian dan penerbitan |
| `SdDialog`, `SdToast` | info, sukses, galat | — | `aria-live` setara untuk pembaca layar |
| `SdSearchPalette` | Ctrl/⌘+K | membuka, hasil, kosong | Hasil terkelompok |
| `SdEmptyState`, `SdErrorState`, `SdSkeleton` | — | — | Selalu ada tindakan lanjut |
| `SdImage` | dengan placeholder warna | memuat, gagal | Dimensi eksplisit; sumber via CORS |
| `SdContourBackdrop` | latar Kontur Hidup | jeda | `RepaintBoundary`; berhenti di luar layar |
| `SdProgressStem` | indikator progres | — | Dekoratif; ada padanan teks |
| `SdAlert` | info, sukses, peringatan, bahaya | — | Ikon + judul + isi |
| `SdTable` | data ringkas | baris disorot | Gulir horizontal di ponsel |

### 6.9 Penulisan UI (Bahasa Indonesia Umum)

**Suara:** tenang, jelas, membantu, tidak menggurui. Sapaan **"Anda"**. Kalimat pendek, kata kerja aktif, tanpa tanda seru berlebihan, tanpa janji hasil panen.

| Prinsip | Contoh benar | Hindari |
|---|---|---|
| Kata sehari-hari | "Simpan", "Bagikan", "Cari", "Unduh" | "Save", "Share", "Download" |
| Menjelaskan istilah | "Pupuk NPK (nitrogen, fosfor, kalium)" | Singkatan tanpa penjelasan |
| Galat membantu | "Luas lahan harus lebih dari 0." | "Input invalid" |
| Kosong yang mengarahkan | "Belum ada hitungan tersimpan. Coba Hitung Pupuk." | "Tidak ada data" |
| Asumsi jujur | "Angka ini panduan umum. Sesuaikan dengan kondisi lahan Anda." | Klaim pasti |
| Peringatan keselamatan | "Gunakan sarung tangan dan masker saat menyemprot." | Peringatan samar |

**Format:** angka `1.000,5` · mata uang `Rp 1.250.000` · tanggal `26 November 2026` · satuan `kg`, `ha`, `m²`, `L` · lokal `id_ID`.

**Istilah baku UI:** Hari Ini · Kalender Tanam · Alat Hitung · Diagnosa Gejala · Tersimpan · Panduan · Catatan Lapangan · Peringatan · Terverifikasi Lapangan · Terbitkan · Draf · Terjadwal.

### 6.10 Aksesibilitas

| Persyaratan | Standar |
|---|---|
| Kontras | Teks ≥ 4,5:1; teks besar dan komponen UI ≥ 3:1 |
| Sentuh | ≥ 48 × 48 dp |
| Keyboard (web) | Semua fungsi bisa dioperasikan; urutan fokus logis; cincin fokus terlihat |
| Pembaca layar | Aktifkan *semantics* Flutter Web; label pada semua kontrol; uji dengan NVDA dan TalkBack |
| Skala teks | Hingga 200% tanpa kehilangan fungsi |
| Gerak | Hormati "kurangi gerak"; tidak ada animasi berkedip |
| Warna | Tidak menjadi satu-satunya penanda (tambahkan teks/pola) |
| Formulir | Label permanen, galat dibacakan, jangan hanya placeholder |
| Bahasa | `id`; istilah teknis dijelaskan |
| Pintasan | `Ctrl/⌘+K` cari · `Esc` tutup · panah pada kalender · `Enter` pilih |

### 6.11 Tema Gelap & Mode Cetak

- Tema gelap memakai token gelap (Bagian 6.3), bukan inversi otomatis; foto diberi pengurangan kecerahan ringan.
- Mode cetak (situs statis dan hasil hitung): tanpa navigasi dan tekstur, hitam-putih yang hemat tinta.

### 6.12 Alat Kerja dan Tata Kelola Design System

| Aspek | Ketentuan |
|---|---|
| Sumber kebenaran token | `packages/sabdani_tokens/tokens.json` → dihasilkan ke `sd_tokens.g.dart` dan `tokens.css` |
| Figma | Pustaka: **Foundations** (warna, tipe, jarak, ikon), **Components**, **Patterns**, **Templates**; mode variabel: Terang/Gelap dan Musim |
| Katalog komponen hidup | **Widgetbook** untuk `sabdani_ds` (semua varian dan keadaan) |
| Pengujian | *Golden test* tiap komponen (terang/gelap, skala teks 1× dan 2×) |
| Versi | Semver pada `sabdani_ds`; `CHANGELOG.md`; perubahan merusak butuh persetujuan |
| Kontribusi | Komponen baru wajib: spesifikasi (anatomi, varian, keadaan, a11y), implementasi, golden test, entri Widgetbook |
| Penamaan | Token `color.primary`, `space.16`, `radius.md`, `motion.base`; komponen `Sd*` |

---

## 7. Implementasi Design System di Flutter

### 7.1 Struktur Paket `sabdani_ds`

```
packages/sabdani_ds/
├─ lib/
│  ├─ sabdani_ds.dart              # ekspor publik
│  └─ src/
│     ├─ tokens/ (sd_tokens.g.dart, colors.dart, spacing.dart, motion.dart)
│     ├─ theme/ (sd_theme.dart, text_theme.dart)
│     ├─ layout/ (breakpoints.dart, sd_shell.dart, sd_page.dart)
│     ├─ components/ (sd_button.dart, sd_text_field.dart, sd_timeline.dart, ...)
│     ├─ effects/ (contour_backdrop.dart, counter.dart, reveal.dart)
│     └─ icons/ (sd_icons.dart + font)
├─ assets/fonts/ (Fraunces, PlusJakartaSans — subset)
├─ widgetbook/                      # katalog komponen
└─ test/ (golden/, unit/)
```

### 7.2 Ekstensi Tema (token khusus merek)

```dart
import 'package:flutter/material.dart';

@immutable
class SdTheme extends ThemeExtension<SdTheme> {
  const SdTheme({
    required this.accent,
    required this.accentText,
    required this.season,
    required this.success,
    required this.warning,
    required this.info,
    required this.sunken,
  });

  final Color accent, accentText, season, success, warning, info, sunken;

  static const light = SdTheme(
    accent: Color(0xFFC39A3F),
    accentText: Color(0xFF7A5C1D),
    season: Color(0xFFC39A3F), // diganti sesuai musim aktif
    success: Color(0xFF2B6849),
    warning: Color(0xFF9A6212),
    info: Color(0xFF2F5A8A),
    sunken: Color(0xFFF0E9D8),
  );

  static const dark = SdTheme(
    accent: Color(0xFFE2C77F),
    accentText: Color(0xFFE2C77F),
    season: Color(0xFFE2C77F),
    success: Color(0xFF7FC29B),
    warning: Color(0xFFE0B15A),
    info: Color(0xFF9DB9DE),
    sunken: Color(0xFF0F0D0B),
  );

  @override
  SdTheme copyWith({
    Color? accent, Color? accentText, Color? season,
    Color? success, Color? warning, Color? info, Color? sunken,
  }) =>
      SdTheme(
        accent: accent ?? this.accent,
        accentText: accentText ?? this.accentText,
        season: season ?? this.season,
        success: success ?? this.success,
        warning: warning ?? this.warning,
        info: info ?? this.info,
        sunken: sunken ?? this.sunken,
      );

  @override
  SdTheme lerp(ThemeExtension<SdTheme>? other, double t) {
    if (other is! SdTheme) return this;
    return SdTheme(
      accent: Color.lerp(accent, other.accent, t)!,
      accentText: Color.lerp(accentText, other.accentText, t)!,
      season: Color.lerp(season, other.season, t)!,
      success: Color.lerp(success, other.success, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      info: Color.lerp(info, other.info, t)!,
      sunken: Color.lerp(sunken, other.sunken, t)!,
    );
  }
}

extension SdThemeX on BuildContext {
  SdTheme get sd => Theme.of(this).extension<SdTheme>()!;
}
```

### 7.3 ThemeData

```dart
ThemeData buildSdTheme(Brightness brightness) {
  final light = brightness == Brightness.light;

  final scheme = ColorScheme(
    brightness: brightness,
    primary: light ? const Color(0xFF1F4D38) : const Color(0xFF86B79B),
    onPrimary: light ? const Color(0xFFFBF8F1) : const Color(0xFF0F2A1E),
    primaryContainer: light ? const Color(0xFFDCEBE2) : const Color(0xFF1F4D38),
    onPrimaryContainer: light ? const Color(0xFF12261D) : const Color(0xFFDCEBE2),
    secondary: light ? const Color(0xFF7A5C1D) : const Color(0xFFE2C77F),
    onSecondary: light ? const Color(0xFFFBF8F1) : const Color(0xFF14110F),
    error: light ? const Color(0xFFB3382C) : const Color(0xFFF08A7E),
    onError: light ? const Color(0xFFFFFFFF) : const Color(0xFF14110F),
    surface: light ? const Color(0xFFFBF8F1) : const Color(0xFF14110F),
    onSurface: light ? const Color(0xFF1B1A17) : const Color(0xFFEDE6D6),
    onSurfaceVariant: light ? const Color(0xFF5E5A51) : const Color(0xFFA39C8D),
    outline: light ? const Color(0xFFE3DAC3) : const Color(0xFF3A332A),
    surfaceContainerLowest: light ? const Color(0xFFFFFFFF) : const Color(0xFF1E1A16),
    surfaceContainer: light ? const Color(0xFFF4EEDF) : const Color(0xFF1E1A16),
    surfaceContainerHigh: light ? const Color(0xFFE9DFC8) : const Color(0xFF2A241D),
  );

  const display = 'Fraunces';
  const ui = 'PlusJakartaSans';

  final text = TextTheme(
    displayLarge: const TextStyle(fontFamily: display, fontSize: 64, height: 68 / 64, fontWeight: FontWeight.w500, letterSpacing: -0.64),
    displayMedium: const TextStyle(fontFamily: display, fontSize: 48, height: 52 / 48, fontWeight: FontWeight.w500, letterSpacing: -0.48),
    headlineLarge: const TextStyle(fontFamily: display, fontSize: 34, height: 40 / 34, fontWeight: FontWeight.w600),
    headlineMedium: const TextStyle(fontFamily: display, fontSize: 26, height: 32 / 26, fontWeight: FontWeight.w600),
    titleLarge: const TextStyle(fontFamily: ui, fontSize: 20, height: 28 / 20, fontWeight: FontWeight.w600),
    titleMedium: const TextStyle(fontFamily: ui, fontSize: 17, height: 24 / 17, fontWeight: FontWeight.w600),
    bodyLarge: const TextStyle(fontFamily: ui, fontSize: 18, height: 29 / 18),
    bodyMedium: const TextStyle(fontFamily: ui, fontSize: 16, height: 26 / 16),
    bodySmall: const TextStyle(fontFamily: ui, fontSize: 14, height: 22 / 14),
    labelLarge: const TextStyle(fontFamily: ui, fontSize: 15, height: 20 / 15, fontWeight: FontWeight.w600),
    labelSmall: const TextStyle(fontFamily: ui, fontSize: 12, height: 16 / 12, fontWeight: FontWeight.w600, letterSpacing: 0.48),
  ).apply(bodyColor: scheme.onSurface, displayColor: scheme.onSurface);

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    textTheme: text,
    visualDensity: VisualDensity.standard,
    extensions: [light ? SdTheme.light : SdTheme.dark],
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(48, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: text.labelLarge,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: light ? const Color(0xFFF0E9D8) : const Color(0xFF0F0D0B),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: scheme.outline),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: scheme.primary, width: 2),
      ),
    ),
    pageTransitionsTheme: const PageTransitionsTheme(builders: {
      TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
    }),
  );
}
```

> Catatan: nama kelas transisi halaman dan beberapa properti `ColorScheme` dapat berbeda antarversi Flutter; sesuaikan dengan versi stabil yang dikunci pada proyek, dan hapus bagian yang tidak tersedia.

### 7.4 Breakpoint dan Cangkang Adaptif

```dart
enum SdSize { compact, medium, expanded, large, xlarge }

SdSize sdSizeOf(double width) {
  if (width < 600) return SdSize.compact;
  if (width < 840) return SdSize.medium;
  if (width < 1200) return SdSize.expanded;
  if (width < 1600) return SdSize.large;
  return SdSize.xlarge;
}

class SdShell extends StatelessWidget {
  const SdShell({super.key, required this.destinations, required this.index, required this.onSelect, required this.child});
  final List<NavigationDestination> destinations;
  final int index;
  final ValueChanged<int> onSelect;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final size = sdSizeOf(MediaQuery.sizeOf(context).width);
    if (size == SdSize.compact) {
      return Scaffold(
        body: SafeArea(child: child),
        bottomNavigationBar: NavigationBar(
          selectedIndex: index,
          onDestinationSelected: onSelect,
          destinations: destinations,
        ),
      );
    }
    return Scaffold(
      body: Row(children: [
        NavigationRail(
          extended: size.index >= SdSize.large.index,
          selectedIndex: index,
          onDestinationSelected: onSelect,
          labelType: size.index >= SdSize.large.index ? NavigationRailLabelType.none : NavigationRailLabelType.all,
          destinations: [
            for (final d in destinations)
              NavigationRailDestination(icon: d.icon, selectedIcon: d.selectedIcon, label: Text(d.label)),
          ],
        ),
        const VerticalDivider(width: 1),
        Expanded(child: Align(alignment: Alignment.topCenter,
          child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 1280), child: child))),
      ]),
    );
  }
}
```

### 7.5 Efek Premium (cuplikan)

**Angka menghitung (hasil langsung)**

```dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class SdCounter extends StatelessWidget {
  const SdCounter({super.key, required this.value, this.digits = 1, this.suffix = '', this.style});
  final double value;
  final int digits;
  final String suffix;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    final fmt = NumberFormat.decimalPatternDigits(locale: 'id_ID', decimalDigits: digits);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(end: value),
      duration: reduce ? Duration.zero : const Duration(milliseconds: 500),
      curve: Curves.easeOutCubic,
      builder: (_, v, __) => Text(
        '${fmt.format(v)}$suffix',
        style: (style ?? Theme.of(context).textTheme.displayMedium)
            ?.copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
      ),
    );
  }
}
```

**Kontur Hidup (latar)**

```dart
import 'dart:math' as math;
import 'package:flutter/material.dart';

class ContourPainter extends CustomPainter {
  ContourPainter({required this.t, required this.color, this.lines = 9});
  final double t; // 0..1, berulang
  final Color color;
  final int lines;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = color;
    for (var i = 0; i < lines; i++) {
      final y0 = size.height * (0.25 + i * 0.07);
      final path = Path()..moveTo(-20, y0);
      for (double x = 0; x <= size.width + 20; x += 24) {
        final y = y0 +
            math.sin((x / size.width) * math.pi * 2 + i * .5 + t * math.pi * 2) * (10 + i * 1.5);
        path.lineTo(x, y);
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(ContourPainter old) => old.t != t || old.color != color;
}
```

Pemakaian: bungkus dengan `RepaintBoundary`, gerakkan lewat `AnimationController(duration: 40 detik)..repeat()`, hentikan saat `TickerMode` mati, saat di luar layar, atau saat `disableAnimations` aktif. Warna: `line` dengan opasitas 40–60%.

---

## 8. Arsitektur Teknis

### 8.1 Diagram

```
                      ┌──────────────────────────────────────┐
   Pengunjung ───────►│ Cloudflare Pages + CDN (sabdani.id)  │
                      ├───────────────┬──────────────────────┤
                      │ Situs statis  │ Flutter Web (/app)   │
                      │ (Dart/Jaspr)  │ + /data/*.json       │
                      └───────────────┴──────────────────────┘
                              ▲ build & deploy (GitHub Actions)
 ┌──────────────────┐         │
 │ Sabdani Admin    │─────────┼──────────────────────────────┐
 │ (Flutter mobile) │         │                              │
 │ SQLite lokal     │         │                              │
 └───┬──────────┬───┘         │                              │
     │ Auth+CRUD│ upload/publish                             │
     ▼          ▼                                            │
┌──────────┐  ┌───────────────────────┐   ┌─────────────────┴──┐
│ Supabase │  │ Cloudflare Worker API │──►│ GitHub (dispatch)  │
│ Auth, PG,│◄─│ api.sabdani.id        │   └────────────────────┘
│ RLS, RT  │  │ (verifikasi JWT)      │──► R2 bucket (media.sabdani.id)
└────┬─────┘  └───────────────────────┘
     │ dibaca saat build (anon key + RLS)
     └────────────────────────────► snapshot JSON + HTML statis
```

### 8.2 Teknologi

| Lapisan | Pilihan |
|---|---|
| Bahasa/Framework | **Dart + Flutter** (klien), **Jaspr** (situs statis berbasis Dart) |
| State | **Riverpod** |
| Routing | **go_router** (strategi URL berbasis path pada web) |
| Model | `freezed` + `json_serializable` |
| Backend data | **Supabase** (`supabase_flutter`) hanya pada Admin |
| Penyimpanan lokal admin | **drift** (SQLite) + `flutter_secure_storage` |
| Penyimpanan lokal web | `shared_preferences` (Tersimpan, pengaturan) |
| Grafik | `fl_chart` |
| Animasi | API animasi bawaan Flutter (+ `flutter_animate` bila perlu) |
| Render Markdown | Pustaka perender Markdown yang masih dipelihara (periksa status paket sebelum memilih) |
| Kamera/Media | `image_picker`, `flutter_image_compress` |
| Notifikasi | Firebase Cloud Messaging (fase 2) |
| API tipis | **Cloudflare Worker** (TypeScript) |
| Media | **Cloudflare R2** |
| Build | **GitHub Actions** |
| Hosting | **Cloudflare Pages** (unggah langsung dengan `wrangler`) |
| Katalog komponen | **Widgetbook** |

> Versi paket dan Flutter dikunci pada `pubspec.lock`. Periksa status pemeliharaan tiap paket di pub.dev sebelum dipakai; ganti bila sudah tidak dipelihara.

### 8.3 Struktur Monorepo

```
sabdani/
├─ apps/
│  ├─ web_app/          # Flutter Web publik → /app
│  ├─ admin_mobile/     # Flutter Android (iOS opsional)
│  └─ site/             # Jaspr: situs statis SEO + pembuat /data/*.json
├─ packages/
│  ├─ sabdani_core/     # model, repositori, util (Dart murni)
│  ├─ sabdani_ds/       # design system Flutter
│  └─ sabdani_tokens/   # tokens.json + generator (Dart & CSS)
├─ services/
│  └─ api/              # Cloudflare Worker (TypeScript)
├─ supabase/            # migrations/, seed.sql, config.toml
├─ tools/               # skrip Python/Dart: ekspor cadangan, impor data
├─ .github/workflows/   # ci.yml, content-deploy.yml, admin-android.yml
└─ docs/                # PRD, ADR, panduan merek
```

Kelola dengan *Dart workspace* atau `melos`. Python hanya untuk skrip pembantu lokal (ekspor/impor), bukan bagian dari runtime.

### 8.4 Alur Penerbitan (end-to-end)

1. Admin menekan **Terbitkan** → aplikasi menyimpan `status`, `published_at` ke Supabase (dengan pengecekan versi).
2. Aplikasi memanggil `POST /v1/publish` (JWT) → Worker memverifikasi peran → mengirim `repository_dispatch` ke GitHub dan mencatat baris `deployments` (`queued`).
3. GitHub Actions: ambil data Supabase (anon + RLS) → buat HTML statis, `sitemap.xml`, `rss.xml`, `/data/*.json` → pulihkan *cache* build Flutter (atau bangun bila kode berubah) → rakit `dist/` → deploy ke Cloudflare Pages → perbarui `deployments` menjadi `success`/`failed`.
4. Aplikasi Admin menerima perubahan lewat Realtime → tampil "Terbit" dan notifikasi.
5. **Artikel terjadwal:** *cron* tiap jam di Actions memeriksa apakah ada artikel jatuh tempo; hanya bila ada, build dijalankan.

---

## 9. Flutter Web Publik

### 9.1 Pengaturan Dasar

| Item | Ketentuan |
|---|---|
| Rute dasar | `--base-href /app/`, strategi URL path, aturan *rewrite* `/app/* → /app/index.html` |
| Mode build | `flutter build web --release --wasm` (fallback otomatis ke CanvasKit bila peramban tak mendukung); ukur kedua mode pada perangkat nyata |
| Sumber aset mesin | Hindari ketergantungan CDN pihak ketiga: sajikan CanvasKit/aset mesin dari domain sendiri (periksa opsi build `--no-web-resources-cdn` pada versi yang dipakai) dan atur konfigurasi font cadangan agar tidak mengunduh dari luar |
| Font | Dikemas sebagai aset; hindari emoji/glyph di luar font |
| Gambar | Sumber `media.sabdani.id` wajib mengirim header CORS (R2 → CORS: izinkan `GET` dari `https://sabdani.id`) karena CanvasKit memerlukannya |
| Layar pemuatan | Splash HTML+CSS murni (< 3 KB) berisi wordmark dan garis kontur; hilang saat Flutter siap |
| Pemuatan tertunda | Fitur berat (ekspor PDF, grafik lanjutan) memakai *deferred import* |
| Pembaruan | Aset ber-hash di-*cache* `immutable`; `index.html` dan `flutter_bootstrap.js` tidak di-*cache* lama |
| Aksesibilitas | Aktifkan pohon semantik; uji dengan pembaca layar |
| Header khusus | Untuk Skwasm multi-utas dibutuhkan `Cross-Origin-Opener-Policy` dan `Cross-Origin-Embedder-Policy`; bila diaktifkan, uji dampaknya pada gambar lintas-origin. Tanpa header ini, Flutter berjalan satu utas |

**Contoh `_headers` (disesuaikan setelah pengujian):**

```
/app/*
  Cache-Control: public, max-age=0, must-revalidate
/app/assets/*
  Cache-Control: public, max-age=31536000, immutable
/app/canvaskit/*
  Cache-Control: public, max-age=31536000, immutable
/data/*
  Cache-Control: public, max-age=300, stale-while-revalidate=86400
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

> Content-Security-Policy untuk `/app/` perlu mengizinkan eksekusi WebAssembly (mis. `'wasm-unsafe-eval'`) dan *worker* berbasis `blob:`; susun bertahap dan uji pada semua peramban target.

### 9.2 Anggaran Performa

| Metrik | Target |
|---|---|
| Layar pertama tampil (kunjungan pertama, 4G, Android menengah) | ≤ 4 dtk (ukur nyata; unduhan awal Flutter Web wajarnya beberapa MB) |
| Kunjungan berikutnya | ≤ 1,5 dtk (aset ter-*cache*) |
| Splash HTML | < 3 KB |
| Pemuatan data layar | ≤ 150 KB JSON (kompresi Brotli), per layar |
| Kelancaran | ≥ 60 fps desktop, ≥ 45 fps Android entry-level |
| Regresi ukuran | CI gagal bila ukuran `main` (JS/Wasm) naik > 10% tanpa persetujuan |

### 9.3 Fitur Interaktif Premium: Spesifikasi

**1. Kalender Tanam Interaktif**
- Data: `crop_calendar.json` (komoditas × wilayah × aktivitas × bulan mulai/akhir).
- Aturan jendela: jendela boleh melintasi pergantian tahun (mis. Nov–Feb). Fungsi `isActive(month)` menangani `end < start`.
- Interaksi: geser/seret horizontal, klik/ketuk batang membuka rincian (`SdSheet`), panah keyboard menggeser bulan, penanda "hari ini", filter aktivitas.
- Bagikan: URL berisi `komoditas` dan `wilayah`; **Tambah pengingat** menghasilkan berkas `.ics` di sisi klien.

**2. Alat Hitung** (rumus dasar, parameter dapat diubah dari admin)

| Alat | Rumus utama |
|---|---|
| Pupuk | Kebutuhan total (kg) = luas (ha) × dosis (kg/ha). Per aplikasi = total ÷ jumlah aplikasi. Biaya = total × harga/kg. Konversi: 1 ha = 10.000 m² |
| Populasi tanam | Luas efektif = luas × (1 − proporsi non-tanam). Populasi = luas efektif ÷ (jarak antarbaris × jarak dalam baris). Kebutuhan benih = populasi × (1 + cadangan sulam) ÷ daya kecambah |
| Analisis usaha | Biaya total = biaya tetap + biaya variabel. Pendapatan = hasil × harga. Laba = pendapatan − biaya. R/C = pendapatan ÷ biaya. BEP harga = biaya ÷ hasil. BEP produksi = biaya ÷ harga |

Selalu tampilkan **Asumsi** dan nilai bawaan yang bisa diubah; hasil disebut panduan umum.

**3. Diagnosa Gejala (berbasis aturan, bukan AI)**
Skor kecocokan = jumlah gejala terpilih yang cocok (bobot `weight`) ÷ total bobot gejala hama/penyakit itu. Tampilkan 3–5 teratas dengan label "Kemungkinan", bukan kepastian, lengkap dengan peringatan "Pastikan dengan penyuluh atau petugas setempat".

**4. Pencarian Cepat**
Indeks `search-index.json` (judul, ringkasan, jenis, URL) dicari di sisi klien; kelompokkan hasil: Panduan ↗, Komoditas, Hama, Alat. Buka dengan `Ctrl/⌘+K`.

**5. Tersimpan & Pengaturan**
Disimpan lokal (`shared_preferences`); tanpa akun. Ekspor/impor JSON sederhana agar tidak hilang saat berganti perangkat (fase lanjut).

### 9.4 Keterhubungan dengan Situs Statis

- Setiap panduan memiliki kartu **"Hitung sendiri"** menaut ke alat dengan parameter (`?komoditas=cabai`).
- Aplikasi menaut ke panduan lewat **Panduan ↗**.
- Header dan wordmark identik di kedua sisi; token warna, tipografi, dan motif sama.
- Opsional fase lanjut: menyematkan widget Flutter (kalkulator mini) langsung di halaman statis lewat fitur *embedding* Flutter Web.

---

## 10. Situs Konten Statis (Lapisan SEO)

| Aspek | Ketentuan |
|---|---|
| Teknologi | **Jaspr** (Dart, mode statis). Cadangan bila terkendala: generator situs statis lain dengan templat yang memakai `tokens.css` yang sama |
| Sumber data | REST Supabase memakai anon key; hanya baris yang lolos RLS |
| Rendering Markdown | Dengan sintaks blok khusus: `:::catatan`, `:::peringatan`, `[[hitung:pupuk]]` (menyisipkan kartu alat) |
| Keluaran | HTML statis, `sitemap.xml`, `rss.xml`, `robots.txt`, `/data/*.json` |
| Interaktivitas | JS kecil (< 5 KB): tema musiman, Progres Tumbuh, pintasan cari |
| SEO | Meta, Open Graph, kanonik, JSON-LD, tautan internal otomatis (komoditas ↔ panduan ↔ hama ↔ alat) |
| E-E-A-T | Penulis nyata, tanggal diperbarui, Cap Terverifikasi Lapangan, halaman Metodologi |
| Gambar | `srcset` dari dua ukuran (480 dan 1600), `alt` wajib, dimensi eksplisit |
| Kontak | Tautan WhatsApp dan email; formulir + Turnstile di fase berikutnya |

**Isi `/data/*.json`:** `commodities.json`, `crop_calendar.json`, `zones.json`, `pests.json`, `symptoms.json`, `calc_params.json`, `search-index.json`, `manifest.json` (versi dan waktu build).

---

## 11. Aplikasi Admin Mobile

### 11.1 Arsitektur Aplikasi

| Lapisan | Isi |
|---|---|
| UI | Layar + `sabdani_ds` (komponen dan tema sama dengan web) |
| State | Riverpod; satu *controller* per layar |
| Domain | Kasus penggunaan: `SaveDraft`, `Publish`, `UploadMedia`, `SyncQueue` |
| Data | Repositori: sumber lokal (drift) dan jarak jauh (Supabase, Worker API) |
| Sinkronisasi | Antrean operasi (outbox) dengan pengulangan bertahap |

### 11.2 Offline-First

| Aspek | Aturan |
|---|---|
| Simpan lokal | Setiap ketikan disimpan ke SQLite (jeda 5 detik); draf tidak hilang walau aplikasi ditutup paksa |
| Antrean | Operasi (simpan artikel, unggah foto) masuk antrean; dijalankan saat ada sinyal; jeda ulang bertahap (mis. 5 dtk → 1 mnt → 15 mnt) |
| Foto | Dikompres di perangkat (sisi panjang maks 1600 px, WebP kualitas ±80) + miniatur 480 px; metadata EXIF dibuang; diunggah ke R2 via Worker |
| Konflik | Setiap artikel punya `version`. Pembaruan memakai `where id = ? and version = ?`. Bila gagal, tampilkan pilihan: **Pakai versi saya**, **Pakai versi server**, **Simpan keduanya** |
| Indikator | Lencana per item: ● Tersimpan lokal · ⟳ Menyinkronkan · ✓ Tersinkron · ! Perlu tindakan |
| Status build | Langganan Realtime ke tabel `deployments` |

### 11.3 Editor

- Sumber kebenaran: **Markdown**.
- Bilah alat: **Tebal, Miring, Judul, Daftar, Tautan, Foto, Catatan Lapangan, Peringatan, Tabel**, dikte suara (bila perangkat mendukung).
- Mode: **Tulis** dan **Pratinjau** (tab); pratinjau memakai komponen yang sama dengan situs (tampilan serupa).
- Daftar periksa sebelum terbit: judul, ringkasan, gambar sampul + teks alternatif, kategori, komoditas, judul dan deskripsi SEO ≤ 160 karakter, centang **Terverifikasi lapangan** (hanya bila benar).
- Foto lapangan: opsi mencatat lokasi umum (kabupaten) sebagai teks, bukan koordinat GPS, demi privasi.

### 11.4 Keamanan Aplikasi

| Aspek | Ketentuan |
|---|---|
| Sesi | Disimpan di penyimpanan aman perangkat |
| Kunci | Biometrik/PIN perangkat saat membuka aplikasi dan setelah 5 menit di latar belakang |
| Layar | Cegah tangkapan layar pada halaman login (opsional) |
| Data lokal | Basis data lokal hanya berisi konten milik admin; hapus saat logout |
| Kunci rahasia | Tidak ada `service_role` di aplikasi; hanya anon key + token pengguna |
| Pembaruan | Pemberitahuan versi minimum yang didukung (`app_config`) untuk memaksa pembaruan bila ada perbaikan keamanan |

### 11.5 Distribusi

| Tahap | Cara |
|---|---|
| Pengembangan | APK debug langsung |
| Internal | APK rilis bertanda tangan lewat **Firebase App Distribution** atau berkas privat |
| Lanjutan | Jalur *internal testing* di toko aplikasi Android (butuh akun developer berbayar sekali; verifikasi biaya terkini) |
| iOS | Ditunda; butuh akun developer berbayar tahunan |

Kunci penandatanganan (*keystore*) disimpan aman, dengan cadangan terenkripsi di luar repositori.

---

## 12. Backend: Supabase, API Tipis, R2

### 12.1 Cloudflare Worker `api.sabdani.id`

| Method | Path | Auth | Fungsi |
|---|---|---|---|
| POST | `/v1/media` | Staf (JWT) | Terima gambar (asli + miniatur) → simpan ke R2 → kembalikan URL; catat di `media_assets` |
| DELETE | `/v1/media/:id` | Admin | Hapus objek R2 dan barisnya |
| POST | `/v1/publish` | Staf | Kirim `repository_dispatch`; catat `deployments` |
| GET | `/v1/deployments/latest` | Staf | Status build terakhir (cadangan bila Realtime tak tersedia) |
| POST | `/v1/contact` | Publik (Turnstile) | Fase lanjut: simpan pesan |
| POST | `/v1/devices` | Staf | Daftarkan token notifikasi |
| GET | `/health` | Publik | Pemantauan waktu aktif |

**Variabel rahasia di Worker:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_DISPATCH_TOKEN` (izin minimal untuk satu repositori), `TURNSTILE_SECRET`; *binding* R2: `MEDIA`.

**Verifikasi staf (TypeScript, kerangka):**

```ts
export async function requireStaff(req: Request, env: Env) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: new Response('Unauthorized', { status: 401 }) };

  const h = { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` };
  const u = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, { headers: h });
  if (!u.ok) return { error: new Response('Unauthorized', { status: 401 }) };
  const user = await u.json<{ id: string }>();

  const p = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=role`, { headers: h });
  const [profile] = p.ok ? await p.json<{ role: string }[]>() : [];
  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return { error: new Response('Forbidden', { status: 403 }) };
  }
  return { user, role: profile.role };
}
```

**Aturan unggah:** tipe `image/webp|jpeg|png|avif` (periksa *magic bytes*); maks 2 MB per berkas; kunci `uploads/{yyyy}/{mm}/{uuid}.{ext}` dan `…_480.{ext}`; `Cache-Control: public, max-age=31536000, immutable`.

### 12.2 Cloudflare R2

| Item | Konfigurasi |
|---|---|
| Bucket | `sabdani-media` |
| Domain publik | `media.sabdani.id` (domain khusus, bukan `r2.dev`, untuk produksi) |
| CORS | Izinkan `GET` dari `https://sabdani.id` (wajib untuk gambar di Flutter Web) |
| Struktur | `uploads/{yyyy}/{mm}/{uuid}.webp` dan miniatur |
| Cadangan | Sinkron berkala ke penyimpanan lain (mis. `rclone`) |

---

## 13. Database & Keamanan Baris (SQL)

### 13.1 Skema

```sql
create extension if not exists pgcrypto;

-- ===== ENUM =====
create type user_role         as enum ('admin','editor','viewer');
create type article_status    as enum ('draft','scheduled','published');
create type calendar_activity as enum ('semai','olah_lahan','tanam','pemupukan','panen','pascapanen');
create type pest_kind         as enum ('hama','penyakit','gulma','kekurangan_hara');
create type deploy_status     as enum ('queued','running','success','failed');

-- ===== PENGGUNA =====
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       user_role not null default 'viewer',
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ===== TAKSONOMI =====
create table public.categories (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique, description text,
  sort_order int not null default 0
);
create table public.tags (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique
);
create table public.commodities (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique,
  group_name text check (group_name in ('pangan','hortikultura','perkebunan','peternakan','perikanan')),
  summary text, cover_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== WILAYAH & KALENDER TANAM =====
create table public.climate_zones (
  id bigint generated always as identity primary key,
  name text not null,                       -- mis. 'Jawa, dataran rendah'
  description text,
  rainy_months smallint[] not null default '{}'   -- indikatif, mis. {11,12,1,2,3}
);
create table public.crop_calendar_entries (
  id bigint generated always as identity primary key,
  commodity_id bigint not null references public.commodities(id) on delete cascade,
  zone_id bigint not null references public.climate_zones(id) on delete cascade,
  activity calendar_activity not null,
  start_month smallint not null check (start_month between 1 and 12),
  end_month   smallint not null check (end_month between 1 and 12),  -- boleh < start_month (melintasi tahun)
  note text
);
create index on public.crop_calendar_entries (commodity_id, zone_id);

-- ===== ARTIKEL =====
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique,
  summary text, body_md text not null default '',
  cover_url text, cover_thumb_url text, cover_alt text,
  category_id  bigint references public.categories(id)  on delete set null,
  commodity_id bigint references public.commodities(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status article_status not null default 'draft',
  field_verified boolean not null default false,
  verified_at date,
  seo_title text, seo_desc text, og_image_url text,
  published_at timestamptz,
  version int not null default 1,           -- kontrol konflik penyuntingan
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.articles (status, published_at desc);
create index on public.articles (commodity_id);

create table public.article_tags (
  article_id uuid   references public.articles(id) on delete cascade,
  tag_id     bigint references public.tags(id)     on delete cascade,
  primary key (article_id, tag_id)
);
create table public.article_revisions (
  id bigint generated always as identity primary key,
  article_id uuid references public.articles(id) on delete cascade,
  body_md text not null,
  edited_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ===== HAMA, PENYAKIT, GEJALA =====
create table public.pests (
  id bigint generated always as identity primary key,
  name text not null, slug text not null unique,
  kind pest_kind not null,
  summary text, cause text, control_md text,
  photos jsonb not null default '[]',       -- [{url, thumb_url, alt}]
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.pest_commodities (
  pest_id bigint references public.pests(id) on delete cascade,
  commodity_id bigint references public.commodities(id) on delete cascade,
  primary key (pest_id, commodity_id)
);
create table public.symptoms (
  id bigint generated always as identity primary key,
  name text not null,
  body_part text not null check (body_part in ('daun','batang','buah','akar','bunga','seluruh')),
  icon_key text, photo_url text,
  sort_order int not null default 0
);
create table public.pest_symptoms (
  pest_id bigint references public.pests(id) on delete cascade,
  symptom_id bigint references public.symptoms(id) on delete cascade,
  weight smallint not null default 1 check (weight between 1 and 5),
  primary key (pest_id, symptom_id)
);

-- ===== ALAT HITUNG & AFILIASI =====
create table public.calc_params (
  id bigint generated always as identity primary key,
  calc_key text not null,                   -- 'pupuk' | 'populasi' | 'usaha'
  name text not null,
  value jsonb not null,
  note text,
  updated_at timestamptz not null default now(),
  unique (calc_key, name)
);
create table public.affiliate_links (
  id bigint generated always as identity primary key,
  code text not null unique, product text not null,
  platform text, url text not null,
  is_active boolean not null default true
);

-- ===== MEDIA, PESAN, OPERASIONAL =====
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  r2_key text not null unique, url text not null, thumb_url text,
  width int, height int, bytes int, alt text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.messages (
  id bigint generated always as identity primary key,
  name text not null, contact text, body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.deployments (
  id bigint generated always as identity primary key,
  status deploy_status not null default 'queued',
  trigger text not null default 'manual',   -- manual | schedule | push
  commit_sha text, message text, url text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);
create table public.device_tokens (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique, platform text,
  created_at timestamptz not null default now()
);
create table public.settings (
  key text primary key, value jsonb not null
);

-- ===== TRIGGER =====
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create or replace function public.bump_version()
returns trigger language plpgsql as $$
begin new.version = old.version + 1; new.updated_at = now(); return new; end $$;

create trigger trg_articles_bump  before update on public.articles
  for each row execute function public.bump_version();
create trigger trg_pests_touch    before update on public.pests
  for each row execute function public.touch_updated_at();
create trigger trg_calc_touch     before update on public.calc_params
  for each row execute function public.touch_updated_at();
```

### 13.2 Fungsi Peran & RLS

```sql
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','editor') from public.profiles where id = auth.uid()), false)
$$;

-- Aktifkan RLS di semua tabel
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','categories','tags','commodities','climate_zones','crop_calendar_entries',
    'articles','article_tags','article_revisions','pests','pest_commodities','symptoms',
    'pest_symptoms','calc_params','affiliate_links','media_assets','messages',
    'deployments','device_tokens','settings']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Profil
create policy profiles_read_own on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_admin_all on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Data publik (dibaca saat build dengan anon key); staf boleh menulis
do $$
declare t text;
begin
  foreach t in array array['categories','tags','climate_zones','crop_calendar_entries',
                           'article_tags','pest_commodities','symptoms','pest_symptoms','calc_params']
  loop
    execute format('create policy %I on public.%I for select using (true)', t || '_read', t);
    execute format('create policy %I on public.%I for all using (public.is_staff()) with check (public.is_staff())', t || '_write', t);
  end loop;
end $$;

create policy commodities_read  on public.commodities for select using (is_active or public.is_staff());
create policy commodities_write on public.commodities for all using (public.is_staff()) with check (public.is_staff());

create policy pests_read  on public.pests for select using (is_published or public.is_staff());
create policy pests_write on public.pests for all using (public.is_staff()) with check (public.is_staff());

create policy affiliate_read  on public.affiliate_links for select using (is_active or public.is_staff());
create policy affiliate_write on public.affiliate_links for all using (public.is_staff()) with check (public.is_staff());

-- Artikel: publik hanya yang sudah terbit atau terjadwal yang sudah jatuh tempo
create policy articles_read on public.articles for select using (
  (status in ('published','scheduled') and published_at <= now()) or public.is_staff()
);
create policy articles_insert on public.articles for insert with check (public.is_staff());
create policy articles_update on public.articles for update using (public.is_staff()) with check (public.is_staff());
create policy articles_delete on public.articles for delete using (public.is_admin());
create policy revisions_staff on public.article_revisions for all using (public.is_staff()) with check (public.is_staff());

-- Internal staf
create policy media_staff       on public.media_assets for all using (public.is_staff()) with check (public.is_staff());
create policy messages_staff    on public.messages     for all using (public.is_staff()) with check (public.is_staff());
create policy deployments_read  on public.deployments  for select using (public.is_staff());
create policy device_own        on public.device_tokens for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Pengaturan: publik baca, admin tulis (JANGAN simpan rahasia di sini)
create policy settings_read  on public.settings for select using (true);
create policy settings_write on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Realtime untuk aplikasi admin (tetap mengikuti RLS)
alter publication supabase_realtime add table public.messages, public.deployments, public.articles;
```

> Tulis ke `deployments` dan `messages` (dari publik) dilakukan oleh Worker/Actions dengan `service_role` (melewati RLS); tidak ada kebijakan tulis untuk pengguna biasa pada `deployments`.

### 13.3 Admin Pertama

1. Dashboard Supabase → Authentication → **Add user** (email + kata sandi).
2. Jalankan:

```sql
insert into public.profiles (id, full_name, role)
select id, 'Nama Admin', 'admin' from auth.users where email = 'email-admin@contoh.com'
on conflict (id) do update set role = 'admin';
```

---

## 14. Auth & Otorisasi

| Aspek | Ketentuan |
|---|---|
| Metode | Supabase Auth, email + kata sandi |
| Pendaftaran publik | **Dimatikan** (Authentication → *Disable sign ups*); akun dibuat manual |
| Kata sandi | ≥ 12 karakter; aktifkan proteksi kata sandi bocor bila tersedia |
| MFA | TOTP untuk admin (fase 2) |
| Peran | `admin` (semua), `editor` (tulis konten, unggah media), `viewer` (tanpa akses) |
| Penegakan | Tiga lapis: RLS di database, verifikasi peran di Worker, penyembunyian menu di aplikasi (kosmetik) |
| Sesi | Penyimpanan aman perangkat; kunci biometrik; keluar menghapus data lokal |
| Pencabutan | Hapus/nonaktifkan pengguna lewat dashboard Supabase untuk mencabut akses |
| Web publik | Tidak ada login; tidak ada kunci rahasia di klien |

---

## 15. Pipeline Rilis (CI/CD)

### 15.1 Alur Kerja

| Workflow | Pemicu | Isi |
|---|---|---|
| `ci.yml` | Pull request | `flutter analyze`, tes unit, widget, *golden*; lint TypeScript; periksa ukuran build web |
| `content-deploy.yml` | `repository_dispatch`, `push` ke `main`, *cron* tiap jam | Bangun situs statis + data JSON, pulihkan/bangun Flutter Web, rakit `dist/`, deploy ke Cloudflare Pages, perbarui `deployments` |
| `admin-android.yml` | Tag `admin-v*` | Bangun APK/AAB rilis bertanda tangan, unggah ke App Distribution |
| `worker-deploy.yml` | Push yang mengubah `services/api` | Deploy Worker dengan `wrangler` |

### 15.2 Kerangka `content-deploy.yml`

```yaml
name: content-deploy
on:
  repository_dispatch:
    types: [publish]
  push:
    branches: [main]
  schedule:
    - cron: '7 * * * *'   # tiap jam; langkah awal memeriksa apakah ada yang perlu dibangun

concurrency:
  group: content-deploy
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    steps:
      - uses: actions/checkout@v4

      - uses: subosito/flutter-action@v2
        with:
          channel: stable
          cache: true

      - name: Cache build Flutter Web
        id: fcache
        uses: actions/cache@v4
        with:
          path: apps/web_app/build/web
          key: flutter-web-${{ hashFiles('apps/web_app/**', 'packages/**', 'pubspec.lock') }}

      - name: Build Flutter Web
        if: steps.fcache.outputs.cache-hit != 'true'
        working-directory: apps/web_app
        run: |
          flutter pub get
          flutter build web --release --wasm --base-href /app/

      - name: Build situs statis + data JSON
        working-directory: apps/site
        run: |
          dart pub get
          dart run tools/build_site.dart --out ../../dist

      - name: Rakit dist
        run: |
          mkdir -p dist/app
          cp -r apps/web_app/build/web/* dist/app/
          cp config/_headers config/_redirects dist/

      - name: Deploy ke Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=sabdani

      - name: Catat status build
        if: always()
        run: |
          STATUS=${{ job.status == 'success' && 'success' || 'failed' }}
          curl -sS -X POST "$SUPABASE_URL/rest/v1/deployments" \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d "{\"status\":\"$STATUS\",\"trigger\":\"${{ github.event_name }}\",\"commit_sha\":\"${{ github.sha }}\",\"finished_at\":\"$(date -u +%FT%TZ)\"}"
```

> Kerangka ini perlu disesuaikan (mis. langkah pemeriksaan artikel jatuh tempo untuk *cron*, pembaruan baris `deployments` yang sama alih-alih membuat baris baru, dan nama perintah/keluaran Jaspr sesuai versi yang dipakai). Aturan `_redirects` yang dibutuhkan: `/app/* /app/index.html 200`; uji bahwa berkas aset tetap dilayani lebih dulu.

### 15.3 Lingkungan

| Lingkungan | Cabang | Keterangan |
|---|---|---|
| Produksi | `main` | `sabdani.id` |
| Pratinjau | PR/`dev` | URL pratinjau Cloudflare Pages |
| Lokal | — | `flutter run -d chrome`, `jaspr serve`, `wrangler dev`, Supabase lokal opsional |

Rahasia hanya di *GitHub Secrets* dan *Worker secrets*; `.env.example` tanpa nilai nyata.

---

## 16. Keamanan & Privasi

| Area | Kontrol |
|---|---|
| Rahasia | `service_role`, token GitHub, kunci Turnstile hanya di Worker/Actions; tidak pernah di aplikasi atau repositori |
| RLS | Aktif di semua tabel; uji dengan akun tanpa peran dan tanpa login |
| Worker | Verifikasi JWT + peran di setiap rute; batasi ukuran dan tipe unggahan; *rate limiting* lewat aturan Cloudflare |
| XSS | Markdown disanitasi saat build; tanpa HTML mentah dari editor |
| Klien Flutter | Tanpa kunci rahasia; validasi input; tautan keluar `rel="noopener"` |
| Header | CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS (lihat Bagian 9.1) |
| Rantai pasok | Kunci versi paket; Dependabot; tinjau paket yang tidak lagi dipelihara |
| Privasi | Analitik tanpa cookie; tidak ada akun publik; EXIF dihapus dari foto; pesan kontak disimpan seperlunya; halaman Kebijakan Privasi |
| Konten berisiko | Dosis, pestisida, dan klaim kesehatan wajib disertai peringatan dan rujukan resmi; konten kimia selalu memuat urutan pengendalian budidaya → hayati → kimia |
| Penegakan hukum merek/hak cipta | Foto dan teks milik sendiri atau berlisensi; catat sumber |

---

## 17. Operasional: Backup, Pemantauan, Analitik

| Hal | Cara |
|---|---|
| Backup database | Ekspor terjadwal (mingguan) lewat skrip ke penyimpanan lain; paket Supabase berbayar menyediakan backup otomatis |
| Backup konten | Ekspor Markdown/JSON dari aplikasi Admin (FA-13) dan skrip, disimpan di repositori privat |
| Backup media | Sinkron bulanan bucket R2 ke penyimpanan lain |
| Uji pemulihan | Minimal sekali per kuartal ke proyek uji |
| Pemantauan waktu aktif | UptimeRobot/Better Stack untuk `/`, `/app/`, `/data/manifest.json`, dan `api.sabdani.id/health` |
| Galat aplikasi | Pelaporan galat (mis. Sentry atau Firebase Crashlytics) pada Web App dan Admin |
| Analitik | Cloudflare Web Analytics atau Plausible/Umami (tanpa cookie); peristiwa kustom: `calendar_view`, `tool_use`, `diagnose_complete`, `share_click`, `guide_open` |
| Proyek Supabase gratis | Dapat dijeda bila lama tidak aktif; karena web publik tidak bergantung Supabase saat runtime, hanya Admin yang terdampak. Jadwalkan panggilan ringan berkala atau naik ke paket berbayar saat penghasilan berjalan |
| Bangun ulang rutin | Build otomatis harian untuk menjaga data tetap segar |

---

## 18. Batas Layanan Gratis & Biaya

> Batas dan harga bisa berubah. **Verifikasi halaman harga resmi** Cloudflare, Supabase, GitHub, dan Firebase sebelum peluncuran.

| Layanan | Yang perlu dipantau | Pemicu upgrade |
|---|---|---|
| Cloudflare Pages | Jumlah berkas dan ukuran per deployment | Situs sangat besar |
| Cloudflare Workers | Kuota permintaan harian | Alat/API sangat ramai |
| Cloudflare R2 | Penyimpanan gratis (±10 GB) dan jumlah operasi | Media mendekati batas |
| Supabase | Ukuran database, pengguna aktif, penjedaan proyek tidak aktif, tidak ada backup otomatis | Penghasilan stabil → paket berbayar |
| GitHub Actions | Menit gratis per bulan (build Flutter lebih berat daripada situs biasa) | Menit mendekati habis → pertahankan *cache*, kurangi pemicu |
| Firebase (FCM, App Distribution) | Kuota gratis | — |
| Akun developer toko aplikasi | Biaya sekali/tahunan | Saat ingin distribusi di toko |
| Domain | Perpanjangan tahunan | — |

**Biaya awal:** domain (wajib). Semua lainnya dirancang berjalan di tingkat gratis. Pengeluaran pertama yang layak dipertimbangkan: **Supabase berbayar** (backup dan tanpa penjedaan).

---

## 19. Strategi Pengujian

| Jenis | Cakupan | Alat |
|---|---|---|
| Unit | Rumus alat hitung, logika jendela kalender (termasuk melintasi tahun), skor diagnosa, antrean sinkronisasi | `flutter_test` / `test` |
| Widget | Komponen `sabdani_ds` | `flutter_test` |
| **Golden** | Setiap komponen: terang/gelap, skala teks 1× dan 2× | `flutter_test` + golden |
| Integrasi | Alur A1–A5 | `integration_test` |
| Kontrak API | Worker: auth, batas unggah, penolakan peran | Tes TypeScript |
| Database | Kebijakan RLS (anon, viewer, editor, admin) | Skrip SQL/pgTAP |
| Performa web | Ukuran build, waktu muat, kelancaran | Lighthouse CI (situs statis), profil Flutter Web DevTools |
| Aksesibilitas | Kontras, semantik, keyboard | Pemeriksaan otomatis + uji manual NVDA/TalkBack |
| Uji pengguna | 5 petani/penyuluh per tonggak | Skrip tugas: "Hitung pupuk 1.000 m² cabai", "Kapan tanam cabai?" |

**Matriks perangkat minimum:** Android entry-level (RAM ±3 GB) dengan Chrome; Chrome/Edge/Firefox desktop; Safari iOS; Samsung Internet. Uji juga jaringan "Slow 4G".

**Definisi Selesai (fitur):** kriteria penerimaan terpenuhi · tes lulus · golden diperbarui · aksesibilitas diperiksa · performa tidak melampaui anggaran · konten UI sesuai panduan penulisan · dokumentasi diperbarui.

---

## 20. Roadmap

*Asumsi: 1 pengembang penuh waktu; tambahkan 30–50% bila paruh waktu.*

| Minggu | Fokus | Keluaran |
|---|---|---|
| 1–2 | **Penemuan & fondasi desain** | Wawancara 5 pengguna, verifikasi nama (domain, media sosial, DJKI), `tokens.json`, uji kontras, logo/wordmark, Figma *Foundations* |
| 3–4 | **Design system v0.1** | Tema Flutter, 12 komponen inti, Widgetbook, golden test, CI, monorepo |
| 5–6 | **Backend & data** | Skema + RLS, admin pertama, Worker (auth, unggah, publish), R2 + CORS, data awal 1 komoditas |
| 7–9 | **Admin mobile MVP** | Login + biometrik, artikel, editor, kamera/unggah, offline + antrean, Publish + status build |
| 10–11 | **Situs statis + pipeline** | Halaman panduan/komoditas/hama, SEO, `/data/*.json`, Actions end-to-end |
| 12–14 | **Flutter Web** | Hari Ini, Kalender Tanam, 3 Alat Hitung, Pencarian Cepat, tema musiman, mode gelap |
| 15–16 | **Diagnosa & kemantapan** | Diagnosa Gejala, Tersimpan, Realtime, performa, aksesibilitas, QA perangkat |
| 17 | **Peluncuran lunak** | 15 panduan inti, Search Console, pemantauan aktif |
| Paralel (mulai minggu 8) | **Produksi konten** | Target 15 panduan inti sebelum peluncuran; 40 dalam 6 bulan |
| Lanjutan | **Fase 2** | Notifikasi (FCM), formulir kontak + Turnstile, MFA, ekspor PDF, widget Flutter tersemat di panduan, produk digital |

---

## 21. Monetisasi & KPI

### 21.1 Monetisasi Bertahap

1. **Afiliasi** saprodi (benih, pupuk, alat) pada hasil Alat Hitung dan panduan; selalu diberi label jelas dan `rel="sponsored"`.
2. **Iklan** hanya pada situs statis (bukan di Web App, agar pengalaman tetap premium) setelah trafik stabil.
3. **Produk digital:** templat RAB, buku catatan kebun, kalender tanam cetak.
4. **Kemitraan/sponsor** dengan penanda sponsor transparan.
5. **Langganan/komunitas** (jangka panjang).

### 21.2 KPI

| KPI | 6 bulan | 12 bulan |
|---|---|---|
| Panduan terbit | 40 | 100 |
| Sesi organik/bulan | 2.000 | 10.000 |
| Pengunjung yang memakai alat/kalender | 15% | 25% |
| Hitungan diselesaikan per bulan | 1.000 | 8.000 |
| Diagnosa diselesaikan per bulan | 300 | 2.000 |
| Waktu dari catatan lapangan ke terbit | ≤ 48 jam | ≤ 24 jam |
| Core Web Vitals "Baik" (situs statis) | 90% URL | 95% URL |
| Pendapatan bulanan | Mulai tercatat | Menutup biaya + laba |

---

## 22. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Ukuran dan waktu muat Flutter Web pada HP lama | Pengunjung pergi sebelum aplikasi tampil | Splash ringan, *deferred import*, `--wasm` dengan fallback, anggaran ukuran di CI, uji perangkat nyata, jaga fitur Web App tetap fokus |
| SEO lemah bila konten dipindah ke Flutter | Trafik organik turun | Pertahankan D1 (konten statis) |
| Jaspr atau paket pihak ketiga kurang dipelihara | Kendala jangka panjang | Batasi ketergantungan, templat memakai `tokens.css`, rencana cadangan generator situs statis lain |
| Gambar di Flutter Web gagal karena CORS | Tampilan rusak | Atur CORS R2 sejak awal; uji lintas-origin |
| Font cadangan terunduh dari luar | Lambat, melanggar privasi | Kemas font, hindari emoji/glyph di luar font, atur sumber font cadangan |
| Proyek Supabase gratis dijeda | Admin berhenti sementara | Web publik tak bergantung; ping berkala; backup; rencana upgrade |
| Data kalender tanam keliru | Kerugian petani, reputasi | Verifikasi lapangan, label "panduan umum", tanggal revisi, rujukan resmi (mis. BMKG/penyuluh) |
| Dosis/pestisida salah | Bahaya | Peringatan wajib, urutan pengendalian bertingkat, tinjauan sebelum terbit |
| Kehilangan *keystore* Android | Tidak bisa merilis pembaruan | Cadangan terenkripsi di dua lokasi |
| Pengembang tunggal | Hambatan | Dokumentasi, ADR, otomatisasi CI, templat konten |
| Beban produksi konten | Situs mandek | Alur dari lahan (admin mobile), jadwal tetap, antrean draf |
| Perbedaan perilaku peramban (Skwasm/CanvasKit) | Bug tampilan | Uji di semua peramban target; fallback otomatis |
| Nama bentrok/merek | Sengketa | Verifikasi domain, media sosial, DJKI sejak minggu 1 |

---

## 23. Checklist Peluncuran

**Teknis**
- [ ] Domain aktif, HTTPS paksa, `www` ↔ apex dialihkan
- [ ] RLS diuji (anon, editor, admin); pendaftaran publik mati
- [ ] Tidak ada rahasia di aplikasi/repositori
- [ ] R2 + domain `media.` + CORS bekerja di Flutter Web
- [ ] Publish dari ponsel → situs diperbarui (end-to-end) dan status terlihat
- [ ] Mode offline Admin: draf aman setelah aplikasi ditutup paksa
- [ ] `sitemap.xml`, `robots.txt`, RSS tersedia; Search Console aktif
- [ ] Aturan `/app/*` rewrite dan header cache diuji
- [ ] Backup pertama dibuat dan diuji pulihkan
- [ ] Pemantauan waktu aktif dan pelaporan galat aktif

**Produk & Desain**
- [ ] Kalender, 3 Alat Hitung, Pencarian Cepat berfungsi di semua perangkat target
- [ ] Token desain tunggal dipakai Flutter dan situs statis (tampilan seragam)
- [ ] Semua pasangan warna lulus uji kontras; mode gelap diperiksa
- [ ] Skala teks 200% tidak merusak tata letak
- [ ] Teks UI sesuai panduan (bahasa Indonesia umum, "Anda", format angka `id_ID`)
- [ ] Halaman Tentang, Metodologi, Kontak, Privasi, dan *disclaimer* tersedia

**Konten**
- [ ] ≥ 15 panduan inti terbit dengan penulis, tanggal, dan foto asli
- [ ] Data kalender tanam untuk komoditas pilihan telah diverifikasi
- [ ] Peringatan keselamatan pada semua konten dosis/pestisida

---

## Lampiran A — Perintah Awal

```bash
# Prasyarat: Flutter stable terbaru, Dart, Node.js (untuk wrangler), akun GitHub/Cloudflare/Supabase

# 1) Monorepo
mkdir sabdani && cd sabdani && git init
flutter create --platforms=web apps/web_app
flutter create --platforms=android apps/admin_mobile
flutter create --template=package packages/sabdani_ds
dart create -t package packages/sabdani_core

# 2) Web Flutter (lokal)
cd apps/web_app && flutter run -d chrome

# 3) Build web produksi
flutter build web --release --wasm --base-href /app/

# 4) Worker API
cd ../../services/api && npm create cloudflare@latest .
npx wrangler dev

# 5) Supabase lokal (opsional)
npx supabase init && npx supabase start
```

## Lampiran B — Skema `tokens.json` (contoh)

```json
{
  "color": {
    "primary":   { "light": "#1F4D38", "dark": "#86B79B" },
    "onPrimary": { "light": "#FBF8F1", "dark": "#0F2A1E" },
    "canvas":    { "light": "#FBF8F1", "dark": "#14110F" },
    "accent":    { "light": "#C39A3F", "dark": "#E2C77F" },
    "accentText":{ "light": "#7A5C1D", "dark": "#E2C77F" }
  },
  "space":  { "4": 4, "8": 8, "12": 12, "16": 16, "24": 24, "32": 32, "48": 48 },
  "radius": { "sm": 8, "md": 12, "lg": 16, "xl": 24 },
  "motion": { "fast": 150, "base": 250, "slow": 400 }
}
```

Generator menghasilkan `sd_tokens.g.dart` (Flutter) dan `tokens.css` (`:root{ --color-primary: … }`, dengan varian gelap lewat `prefers-color-scheme`).

## Lampiran C — Contoh Teks Antarmuka

| Konteks | Teks |
|---|---|
| Judul beranda | "Hari ini di lahan" |
| Subjudul musim | "Saat yang tepat untuk mengolah lahan dan menyemai." |
| Tombol utama | "Lihat yang cocok ditanam sekarang" |
| Alat Hitung | "Berapa luas lahan Anda?" |
| Asumsi | "Angka ini panduan umum. Sesuaikan dengan kondisi lahan Anda." |
| Galat | "Luas lahan harus lebih dari 0." |
| Kosong | "Belum ada hitungan tersimpan. Coba Hitung Pupuk." |
| Diagnosa | "Hasil ini kemungkinan, bukan kepastian. Pastikan dengan penyuluh atau petugas setempat." |
| Cap | "Terverifikasi lapangan · November 2026 · oleh {nama}" |
| Admin: simpan | "Tersimpan di perangkat. Akan disinkronkan saat ada sinyal." |
| Admin: terbit | "Sedang membangun situs. Biasanya 2–4 menit." |
| Admin: konflik | "Artikel ini diubah di tempat lain. Pilih versi yang ingin dipakai." |

## Lampiran D — Glosarium

| Istilah | Arti |
|---|---|
| Komoditas | Jenis tanaman atau ternak yang diusahakan |
| Jendela tanam | Rentang bulan yang cocok untuk suatu kegiatan (semai, tanam, panen) |
| Pancaroba | Masa peralihan antara musim hujan dan kemarau |
| RLS | *Row Level Security*, aturan akses per baris di database |
| SSG | Pembuatan halaman statis saat build |
| Snapshot data | Berkas JSON statis berisi data terbaru untuk Web App |
| Cap Terverifikasi Lapangan | Penanda konten yang sudah dicoba/diuji langsung di lahan |
| Golden test | Uji tampilan yang membandingkan gambar komponen dengan acuan |

---

*Akhir dokumen — Sabdani PRD v3.0*
