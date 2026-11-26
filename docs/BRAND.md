# Panduan merek SABDITANI

## Nama

**SABDITANI — sarana abdi tani.**

- *Sabda*: ucapan yang berbobot dan bisa dipegang.
- *Tani*: kerja nyata di lahan.
- Janji merek: *Kabar dan ilmu tani yang bisa dipercaya.*

Penulisan: `SABDITANI` untuk wordmark dan judul, `SABDITANI — sarana abdi tani` untuk identitas lengkap. Hindari `Sabdani` (ejaan lama) pada artefak baru.

## Logo

Aset given by user, disalin ke `packages/assets/brand/`:

| Berkas | Pemakaian |
|---|---|
| `logo-icon.png` | Icon asli |
| `logo-icon-transparent.png` | Turunan dengan latar putih dihapus; dipakai di web dan admin |
| `logo-wordmark.png` | Wordmark hijau–cokelat dengan latar transparan |

Aturan:

- Sediakan ruang kosong minimal 8 px di sekitar icon.
- Ukuran minimum icon: 24 px di web, 28 dp di mobile.
- Jangan mengubah warna, memutar, menambah bayangan, atau memotong icon.
- Di latar gelap, pakai `logo-icon-transparent.png`; wordmark PNG berwarna gelap sebaiknya diganti dengan teks CSS/React Native berwarna `green300`/`gold300`.
- Dilarang memakai logo sebagai tekstur latar atau menggabungkannya dengan logo lain.

## Warna

UI memakai token PRD: krem `#FBF8F1`, hijau dalam `#1F4D38`, emas lembut `#C39A3F`, tanah `#14110F`. Warna logo mentah:

| Peran | Warna |
|---|---|
| Hijau tua logo | `#005020` |
| Hijau daun cerah | `#40D000` |
| Emas/jingga logo | `#F0A800` |
| Cokelat tanah | `#984800` |
| Hijau wordmark | `#026712` |
| Cokelat wordmark | `#964903` |

Emas tua `#C39A3F` digunakan untuk aksen kepercayaan; untuk teks kecil pakai `#7A5C1D` agar kontras.

## Tipografi

- **Fraunces** untuk judul dan angka besar.
- **Plus Jakarta Sans** untuk antarmuka dan isi.
- Keduanya dikemas lokal via `@fontsource`, tidak dimuat dari CDN.
- Hindari emoji pada teks UI; ikon memakai SVG web atau glyph sederhana di RN.

## Suara bahasa

Bahasa Indonesia sehari-hari yang baku, sapaan **"Anda"**. Kalimat pendek, aktif, tidak mengguruji, tanpa janji hasil panen.

Contoh: "Luas lahan harus lebih dari 0.", "Belum ada hitungan tersimpan. Coba Hitung Pupuk.", "Angka ini panduan umum. Sesuaikan dengan kondisi lahan Anda."
