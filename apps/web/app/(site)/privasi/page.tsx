import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Kebijakan Privasi', description: 'Kebijakan privasi SABDITANI.' };

export default function PrivacyPage() {
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>/</span><span>Privasi</span></div>
          <span className="eyebrow">Kebijakan</span><h1>Kebijakan Privasi</h1>
          <p>Website ini dibuat sesederhana mungkin agar tidak perlu meminta data Anda.</p>
        </div>
      </header>
      <div className="container-narrow" style={{ padding: '56px 0 96px' }}>
        <div className="article">
          <h2>Apa yang kami kumpulkan</h2>
          <p>Situs publik dan aplikasi web tidak meminta akun, tidak memasang cookie iklan, dan tidak menyimpan identitas Anda di server. Preferensi seperti tema, wilayah, dan hitungan tersimpan disimpan di perangkat Anda sendiri melalui <code>localStorage</code>.</p>
          <h2>Analitik</h2>
          <p>Kami merencanakan analitik tanpa cookie dan tanpa pelacakan lintas situs. bila diaktifkan, hanya jumlah kunjungan dan halaman yang dihitung, bukan identitas pribadi.</p>
          <h2>Pesan yang Anda kirim</h2>
          <p>Bila Anda menghubungi kami lewat WhatsApp atau email, pesan disimpan seperlunya untuk menjawab pertanyaan Anda. Jangan mengirim data sensitif seperti koordinat lahan pribadi.</p>
          <h2>Foto dari aplikasi admin</h2>
          <p>Aplikasi admin menghapus metadata EXIF sebelum mengunggah foto. Lokasi yang dicatat sebagai Catatan Lapangan cukup berupa nama kabupaten, bukan titik koordinat.</p>
          <h2>Hak Anda</h2>
          <p>Anda dapat menghapus preferensi dan hitungan tersimpan kapan saja lewat halaman Pengaturan di aplikasi. Untuk permintaan penghapusan pesan, hubungi kami melalui halaman Kontak.</p>
          <h2>Perubahan</h2>
          <p>Perubahan kebijakan akan diperbarui pada halaman ini dengan tanggal yang jelas.</p>
        </div>
      </div>
    </>
  );
}
