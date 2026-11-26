import type {
  Activity,
  CalendarEntry,
  Commodity,
  Guide,
  Pest,
  SearchItem,
  Symptom,
  Zone,
} from '../types';

export const commodities: Commodity[] = [
  {
    id: 'cabai', slug: 'cabai', name: 'Cabai', group: 'hortikultura',
    summary: 'Tanaman buah bernilai tinggi yang sensitif terhadap air dan suhu.',
    detail: 'Cabai cocok ditanam pada dataran rendah sampai menengah dengan drainase baik. Kunci budidayanya adalah pengaturan air, dosis nitrogen yang tidak berlebihan, dan pengawasan hama sejak awal pertumbuhan.',
    accent: '#B3382C', seedRate: '± 0,5–1 kg benih per ha',
  },
  {
    id: 'padi', slug: 'padi', name: 'Padi', group: 'pangan',
    summary: 'Tanaman pangan utama dengan kebutuhan air dan jadwal tanam yang jelas.',
    detail: 'Padi sawah memerlukan pengelolaan air bertahap: penggenangan dangkal saat vegetatif, pengeringan sebelum panen. Varietas dan wilayah menentukan umur panen.',
    accent: '#C39A3F', seedRate: '± 25–30 kg benih per ha',
  },
  {
    id: 'jagung', slug: 'jagung', name: 'Jagung', group: 'pangan',
    summary: 'Tanaman serbaguna untuk pangan dan pakan dengan jarak tanam menghasilkan.',
    detail: 'Jagung responsif terhadap pupuk nitrogen dan pengaturan jarak tanam. Penentuan waktu tanam yang tepat menghindari fase bunga saat kemarau puncak.',
    accent: '#A8802F', seedRate: '± 20–25 kg benih per ha',
  },
  {
    id: 'tomat', slug: 'tomat', name: 'Tomat', group: 'hortikultura',
    summary: 'Buah bernilai tinggi yang mudah terserang penyakit daun bila lembap.',
    detail: 'Tomat memerlukan sirkulasi udara yang baik, mulsa, dan pemangkasan untuk mengurangi kelembapan kanopi. Hindari menyiram daun saat sore.',
    accent: '#B3382C', seedRate: '± 0,3–0,5 kg benih per ha',
  },
  {
    id: 'bawang-merah', slug: 'bawang-merah', name: 'Bawang Merah', group: 'hortikultura',
    summary: 'Komoditas musiman dengan toleransi rendah terhadap genangan.',
    detail: 'Bawang merah sebaiknya ditanam menjelang musim kemarau dengan mulsa. Persiapan bibit dan pengendalian jamur menjadi penentu keberhasilan.',
    accent: '#7A5C1D', seedRate: '± 700–1.000 kg umbi per ha',
  },
  {
    id: 'kedelai', slug: 'kedelai', name: 'Kedelai', group: 'pangan',
    summary: 'Tanaman leguminosa yang menyumbang nitrogen dan cocok sebagai tanaman rotasi.',
    detail: 'Kedelai cocok sebagai tanaman rotasi setelah padi. Inokulasi rizobium dan pengaturan air pada fase pengisian polong meningkatkan hasil.',
    accent: '#2B6849', seedRate: '± 30–40 kg benih per ha',
  },
];

export const zones: Zone[] = [
  { id: 'jawa-rendah', slug: 'jawa-rendah', name: 'Jawa, dataran rendah', description: 'Musim hujan November–Maret. Cocok untuk cabai, padi, dan jagung.', rainyMonths: [11, 12, 1, 2, 3] },
  { id: 'jawa-tinggi', slug: 'jawa-tinggi', name: 'Jawa, dataran tinggi', description: 'Lebih sejuk dengan musim hujan lebih panjang; cocok untuk sayur dan bawang.', rainyMonths: [11, 12, 1, 2, 3, 4] },
  { id: 'sumatera', slug: 'sumatera', name: 'Sumatera, dataran rendah', description: 'Hujan mulai lebih awal. Jendela tanam disesuaikan lebih awal.', rainyMonths: [10, 11, 12, 1, 2, 3, 4] },
  { id: 'sulawesi', slug: 'sulawesi', name: 'Sulawesi, dataran rendah', description: 'Pola hujan mirip Jawa dengan variasi antarkabupaten.', rainyMonths: [11, 12, 1, 2, 3, 4] },
  { id: 'kalimantan', slug: 'kalimantan', name: 'Kalimantan, dataran rendah', description: 'Curah hujan tinggi; perhatikan drainase dan pengendalian penyakit.', rainyMonths: [11, 12, 1, 2, 3] },
];

const templates: Record<string, Partial<Record<Activity, [number, number, string]>>> = {
  cabai: {
    semai: [10, 11, 'Semai di bedengan teduh, sirup embun dan hindari genangan.'],
    olah_lahan: [10, 11, 'Olah lahan, tambahkan kompos, dan buat bedengan tinggi 20–30 cm.'],
    tanam: [11, 12, 'Pindah tanam bibit umur 25–30 hari pada pagi atau sore hari.'],
    pemupukan: [12, 2, 'Pupuk susulan bertahap: NPK dasar, lalu urea/kalium sesuai analisis tanah.'],
    panen: [2, 5, 'Panen bertahap saat buah merah penuh, 2–3 hari sekali.'],
  },
  padi: {
    semai: [10, 11, 'Semai benih di pesemaian, genangan 2–3 cm.'],
    olah_lahan: [10, 11, 'Bajak, perata, dan perbaiki pematang tangki air.'],
    tanam: [11, 12, 'Tanam bibit umur 18–25 hari dengan jarak 20 × 20 cm.'],
    pemupukan: [12, 1, 'Urea dan NPK pada 7, 21, dan 35 hari setelah tanam.'],
    panen: [3, 4, 'Panen saat 80–90% malai menguning dan butir mengeras.'],
  },
  jagung: {
    olah_lahan: [10, 11, 'Olah minimal, buat larikan, dan siapkan mulsa.'],
    tanam: [11, 12, 'Tanam pada awal hujan, jarak 70 × 25 cm, 2 benih per lubang.'],
    pemupukan: [12, 1, 'NPK dasar saat tanam, urea saat 21 dan 42 hari.'],
    panen: [2, 3, 'Panen tongkol saat kelopak kering dan biji keras.'],
  },
  tomat: {
    semai: [10, 11, 'Semai di tray, gunakan media steril untuk cegah layu.'],
    tanam: [11, 12, 'Tanam dengan jarak 60 × 60 cm dan pasang ajir.'],
    pemupukan: [12, 2, 'Berikan kalium lebih banyak saat pembentukan buah.'],
    panen: [2, 4, 'Panen buah yang mulai merah untuk menekan serangan jamur.'],
  },
  'bawang-merah': {
    olah_lahan: [5, 6, 'Buat bedengan tinggi dan gunakan mulsa hitam/putih.'],
    tanam: [6, 7, 'Tanam umbi bibit di awal kemarau, kedalaman 2–3 cm.'],
    pemupukan: [7, 8, 'Pupuk NPK dan kalium, hentikan nitrogen menjelang pembentukan umbi.'],
    panen: [9, 10, 'Panen saat daun menguning dan umbi mengeras.'],
  },
  kedelai: {
    olah_lahan: [10, 11, 'Olah lahan setelah padi, pertahankan mulsa jerami.'],
    tanam: [11, 12, 'Tanam dengan jarak 40 × 20 cm setelah lahan cukup lembap.'],
    pemupukan: [12, 1, 'Inokulasi rizobium dan berikan P dasar.'],
    panen: [2, 3, 'Panen saat 90% polong cokelat dan biji lepas dari kulit.'],
  },
};

const zoneShift: Record<string, number> = {
  'jawa-rendah': 0,
  'jawa-tinggi': 1,
  sumatera: -1,
  sulawesi: 0,
  kalimantan: 1,
};

const wrap = (month: number) => ((month - 1 + 12) % 12) + 1;

export const calendarEntries: CalendarEntry[] = zones.flatMap((zone) =>
  commodities.flatMap((commodity) =>
    Object.entries(templates[commodity.id] ?? {}).map(([activity, window], index) => {
      const [start, end, note] = window as [number, number, string];
      const shift = zoneShift[zone.id] ?? 0;
      return {
        id: `${commodity.id}-${zone.id}-${activity}`,
        commodityId: commodity.id,
        zoneId: zone.id,
        activity: activity as Activity,
        startMonth: wrap(start + shift),
        endMonth: wrap(end + shift),
        note: `${note} (${zone.name})`,
        _index: index,
      } as CalendarEntry & { _index: number };
    })
  )
);

export const symptoms: Symptom[] = [
  { id: 'daun-menggulung', name: 'Daun menggulung', bodyPart: 'daun', description: 'Daun menggulung ke dalam, sering disertai kutu halus di bawah daun.' },
  { id: 'bercak-cokelat', name: 'Bercak cokelat', bodyPart: 'daun', description: 'Bercak cokelat dengan tepi gelap, dapat melebar dan berlubang.' },
  { id: 'daun-kuning', name: 'Daun menguning', bodyPart: 'daun', description: 'Kuning merata atau pada tulang daun, pertumbuhan terhambat.' },
  { id: 'layu-mendadak', name: 'Layu mendadak', bodyPart: 'seluruh', description: 'Tanaman layu meski tanah lembap, sering dimulai dari satu sisi.' },
  { id: 'bintik-putih', name: 'Bintik putih halus', bodyPart: 'daun', description: 'Bintik putih keperakan dan kotoran hitam di permukaan daun.' },
  { id: 'bunga-rontok', name: 'Bunga rontok', bodyPart: 'bunga', description: 'Bunga dan bunga muda rontok sebelum membentuk buah.' },
  { id: 'buah-bercak-hitam', name: 'Buah berbercak hitam', bodyPart: 'buah', description: 'Bercak hitam lunak pada buah, sering diawali bercak pada daun.' },
  { id: 'akar-busuk', name: 'Akar berwarna cokelat dan busuk', bodyPart: 'akar', description: 'Akar lunak, berbau, dan tanaman mudah dicabut.' },
];

export const pests: Pest[] = [
  {
    id: 'kutu-keputih', slug: 'kutu-keputih', name: 'Kutu Keputih (Whitefly)', kind: 'hama',
    summary: 'Serangga kecil bersayap putih yang mengisap cairan daun dan menularkan virus.',
    cause: 'Populasi meningkat pada kanopi lembap dan hangat. Serial tanam tanpa jeda memudahkan perpindahan.',
    controlMd: `## Pengendalian bertingkat\n\n1. **Budidaya:** gunakan mulsa perak, bersihkan gulma inang, dan jaga jarak tanam.\n2. **Hayati:** pasang perangkap kuning lengket dan lepaskan predator alami bila tersedia.\n3. **Kimia:** gunakan insektisida terdaftar hanya bila ambang batas terlampaui. Baca label dan gunakan APD.\n\n:::peringatan\nGunakan sarung tangan dan masker saat menyemprot. Jangan menyemprot saat tanaman berbunga dan serangga penyerbuk aktif.\n:::`,
    commodityIds: ['cabai', 'tomat'], symptomIds: ['daun-menggulung', 'daun-kuning', 'bintik-putih'],
  },
  {
    id: 'hawar-daun', slug: 'hawar-daun', name: 'Hawar Daun (Jamur)', kind: 'penyakit',
    summary: 'Penyakit jamur yang menimbulkan bercak cokelat dan dapat merusak daun dalam waktu singkat.',
    cause: 'Kelembapan tinggi, daun basa terlalu lama, dan sirkulasi udara buruk.',
    controlMd: `## Pengendalian bertingkat\n\n1. **Budidaya:** tingkatkan drainase, pangkas daun bawah, dan sirap pada pagi hari.\n2. **Hayati:** gunakan jamur antagonis yang terdaftar bila tersedia.\n3. **Kimia:** fungisida terdaftar dengan rotasi golongan aktif untuk mencegah resistensi.\n\n:::catatan\nBuang daun sakit ke luar lahan. Jangan mengomposkan material yang masih aktif terinfeksi.\n:::`,
    commodityIds: ['cabai', 'tomat', 'jagung'], symptomIds: ['bercak-cokelat', 'daun-kuning', 'buah-bercak-hitam'],
  },
  {
    id: 'layu-bakteri', slug: 'layu-bakteri', name: 'Layu Bakteri', kind: 'penyakit',
    summary: 'Penyakit yang menyebabkan layu mendadak karena pembuluh air tersumbat.',
    cause: 'Bakteri tanah menginfeksi akar melalui luka, favorit pada tanah lembap dan suhu tinggi.',
    controlMd: `## Pengendalian bertingkat\n\n1. **Budidaya:** gunakan bibit sehat, rotasi tanaman 2–3 musim, dan perbaiki drainase.\n2. **Hayati:** aplikasikan mikroba antagonis yang terdaftar ke media tanam.\n3. **Kimia:** tidak ada obat yang menyembuhkan tanaman terinfeksi; fokus pada pencegahan.\n\n:::peringatan\nCabut dan musnahkan tanaman terinfeksi agar tidak menular ke tanaman sehat.\n:::`,
    commodityIds: ['cabai', 'tomat'], symptomIds: ['layu-mendadak', 'daun-kuning'],
  },
  {
    id: 'busuk-akar', slug: 'busuk-akar', name: 'Busuk Akar', kind: 'penyakit',
    summary: 'Akar membusuk karena tanah terlalu basa dan kurang oksigen.',
    cause: 'Drainase buruk, penyiraman berlebihan, dan media tanam padat.',
    controlMd: `## Pengendalian bertingkat\n\n1. **Budidaya:** perbaiki bedengan, tambahkan bahan organik matang, dan kurangi frekuensi siraman.\n2. **Hayati:** gunakan trichoderma yang terdaftar sesuai dosis.\n3. **Kimia:** hindari fungisida tanpa diagnosis yang jelas.\n\n:::catatan\nPeriksa akar satu tanaman contoh sebelum mengambil tindakan.\n:::`,
    commodityIds: ['cabai', 'tomat', 'bawang-merah'], symptomIds: ['akar-busuk', 'layu-mendadak', 'daun-kuning'],
  },
  {
    id: 'kekurangan-nitrogen', slug: 'kekurangan-nitrogen', name: 'Kekurangan Nitrogen', kind: 'kekurangan_hara',
    summary: 'Daun tua menguning merata karena pasokan nitrogen tidak mencukupi.',
    cause: 'Dosis nitrogen rendah, pencucian hara akibat hujan, atau media tanam miskin.',
    controlMd: `## Pengendalian bertingkat\n\n1. **Budidaya:** tambahkan kompos matang dan kurangi pencucian hara.\n2. **Hayati:** gunakan pupuk hijau atau leguminosa pada rotasi tanaman.\n3. **Kimia:** aplikasikan urea sesuai dosis hasil hitung, bukan sekadar perkiraan.\n\n[[hitung:pupuk]]\n\n:::peringatan\nKelebihan nitrogen dapat menekan pembungaan dan meningkatkan serangan hama. Sesuaikan dengan fase tanaman.\n:::`,
    commodityIds: ['cabai', 'padi', 'jagung'], symptomIds: ['daun-kuning'],
  },
  {
    id: 'thrips', slug: 'thrips', name: 'Thrips', kind: 'hama',
    summary: 'Serangga kecil ramping yang merusak bunga dan mencatat goresan perak pada daun.',
    cause: 'Populasi melonjak pada musim kering dan bunga yang banyak.',
    controlMd: `## Pengendalian bertingkat\n\n1. **Budidaya:** gunakan mulsa reflektif dan perangkap biru lengket.\n2. **Hayati:** predator alami seperti phytoseiid bila tersedia.\n3. **Kimia:** insektisida terdaftar dengan rotasi golongan aktif.\n\n:::peringatan\nSemprot pada pagi atau sore, hindari fase bunga terbuka agar penyerbuk tidak terdampak.\n:::`,
    commodityIds: ['cabai', 'tomat', 'bawang-merah'], symptomIds: ['bintik-putih', 'bunga-rontok', 'bercak-cokelat'],
  },
];

const guide = (g: Omit<Guide, 'readingMinutes'> & { readingMinutes?: number }): Guide => ({
  ...g,
  readingMinutes: g.readingMinutes ?? 5,
});

export const guides: Guide[] = [
  guide({
    id: 'g01', slug: 'pemupukan-cabai', title: 'Pemupukan Cabai: Dosis dan Waktu yang Aman',
    summary: 'Cara menentukan kebutuhan NPK untuk cabai, kapan diberikan, dan kesalahan yang sering terjadi.',
    category: 'pemupukan', commodityId: 'cabai', author: 'Andi Wijaya', authorRole: 'Penulis pertanian',
    publishedAt: '2026-10-18', updatedAt: '2026-11-12', fieldVerified: true, verifiedAt: 'November 2026', verifiedBy: 'Andi Wijaya',
    readingMinutes: 7, tags: ['cabai', 'npk', 'pupuk'],
    body: `Pemupukan cabai bukan sekadar menambah urea. Kebutuhan hara berubah sesuai fase pertumbuhan: vegetatif membutuhkan nitrogen, fase bunga dan buah membutuhkan lebih banyak fosfor dan kalium.

## Ringkasan dosis

Untuk lahan dengan analisis tanah menengah, dosis NPK 16-16-16 berkisar 300–400 kg per hektar, dibagi 3 aplikasi. Urea ditambahkan hanya bila tanaman menunjukkan gejala kekurangan nitrogen.

[[hitung:pupuk]]

## Jadwal aplikasi

| Waktu | Kegiatan | Catatan |
|---|---|---|
| Saat tanam | NPK dasar | Campur dengan tanah, jangan menempel akar |
| 21 hari setelah tanam | Urea + NPK | Siram setelah aplikasi |
| 45 hari setelah tanam | NPK + kalium | Menjelang pembungaan |

:::peringatan
Gunakan sarung tangan dan masker saat memupuk. Jangan mengaplikasikan pupuk saat daun basa atau menjelang hujan deras.
:::

:::catatan
Dosis di atas adalah panduan umum. Lakukan analisis tanah jika memungkinkan dan sesuaikan dengan kondisi lahan Anda.
:::`,
  }),
  guide({
    id: 'g02', slug: 'persiapan-lahan-cabai', title: 'Menyiapkan Lahan Cabai agar Tidak Genangan',
    summary: 'Langkah mengolah lahan, membuat bedengan, dan mengatur drainase sebelum tanam cabai.',
    category: 'budidaya', commodityId: 'cabai', author: 'Andi Wijaya', authorRole: 'Penulis pertanian',
    publishedAt: '2026-09-29', updatedAt: '2026-10-20', fieldVerified: true, verifiedAt: 'Oktober 2026', verifiedBy: 'Andi Wijaya',
    tags: ['cabai', 'lahan', 'drainase'],
    body: `Cabai tidak tahan genangan. Persiapan lahan yang baik dimulai 2–3 minggu sebelum tanam.

## Langkah kerja

1. Bersihkan gulma dan sisa tanaman sebelumnya.
2. Olah tanah selebar bedengan 100–120 cm dengan tinggi 20–30 cm.
3. Tambahkan kompos matang 10–15 ton per hektar.
4. Buat parit drainase di sisi bedengan dengan lebar 30 cm.
5. Pasang mulsa untuk menekan gulma dan menjaga kelembapan.

:::catatan
Pada lahan berat (lempung), tinggikan bedengan dan perbanyak bahan organik.
:::`,
  }),
  guide({
    id: 'g03', slug: 'pengairan-padi', title: 'Pengaturan Air Padi Sawah dari Tanam sampai Panen',
    summary: 'Kedalaman air yang disarankan pada setiap fase pertumbuhan padi.',
    category: 'budidaya', commodityId: 'padi', author: 'Sari Rahmawati', authorRole: 'Penyuluh lapangan',
    publishedAt: '2026-10-02', updatedAt: '2026-11-05', fieldVerified: true, verifiedAt: 'November 2026', verifiedBy: 'Sari Rahmawati',
    tags: ['padi', 'air', 'sawah'],
    body: `Air yang terlalu dalam menekan anakan, sedangkan kekeringan pada fase bunga menurunkan hasil secara tajam.

## Kedalaman air

| Fase | Kedalaman |
|---|---|
| 0–15 hari setelah tanam | 2–3 cm |
| Vegetatif | 3–5 cm |
| Pembentukan malai | 5–7 cm |
| Mengising | Keringkan bertahap |
| 10 hari sebelum panen | Keringkan penuh |

:::peringatan
Jangan biarkan sawah kering pada fase bunga. Pastikan pematang tidak bocor.
:::`,
  }),
  guide({
    id: 'g04', slug: 'budidaya-jagung-manis', title: 'Budidaya Jagung Manis: Jarak Tanam dan Waktu Panen',
    summary: 'Pengaturan jarak tanam, pemupukan, dan ciri tongkol siap panen.',
    category: 'budidaya', commodityId: 'jagung', author: 'Andi Wijaya', authorRole: 'Penulis pertanian',
    publishedAt: '2026-09-12', updatedAt: '2026-10-15', fieldVerified: false,
    tags: ['jagung', 'jarak tanam'],
    body: `Jagung manis panen lebih awal daripada jagung biasa, sehingga jadwal tanamnya perlu diperhitungkan dengan musim hujan.

## Jarak tanam

Gunakan jarak 70 × 25 cm dengan dua benih per lubang, lalu sisakan satu tanaman sehat. Populasi akhir sekitar 110.000 tanaman per hektar.

[[hitung:populasi]]

## Ciri panen

Kelopak tongkol berwarna cokelat kering, rambut tongkol cokelat, dan biji keras bila ditekan. Panen pagi hari untuk menjaga kemanisan.`,
  }),
  guide({
    id: 'g05', slug: 'mengenali-kutu-keputih', title: 'Mengenali dan Mengendalikan Kutu Keputih',
    summary: 'Ciri serangan, ambang pengendalian, dan urutan tindakan yang aman.',
    category: 'hama-penyakit', commodityId: 'cabai', author: 'Sari Rahmawati', authorRole: 'Penyuluh lapangan',
    publishedAt: '2026-10-25', updatedAt: '2026-11-18', fieldVerified: true, verifiedAt: 'November 2026', verifiedBy: 'Sari Rahmawati',
    tags: ['hama', 'cabai', 'whitefly'],
    body: `Kutu keputih dikenali dari serangga putih kecil yang terbang saat daun digoyang. Serangan berat menyebabkan daun menggulung, kuning, dan pertumbuhan terhambat.

## Cara memeriksa

Goyang atau balik daun bagian bawah secara perlahan. Perhatikan bintik putih, kotoran hitam, dan semut yang sering mengikuti kutu.

[[diagnosa]]

:::peringatan
Pastikan dengan penyuluh atau petugas setempat sebelum menggunakan pestisida. Gunakan sarung tangan dan masker saat menyemprot.
:::`,
  }),
  guide({
    id: 'g06', slug: 'menghitung-populasi-tanam', title: 'Menghitung Populasi Tanam dan Kebutuhan Benih',
    summary: 'Rumus sederhana untuk menentukan jumlah tanaman dan benih berdasarkan jarak tanam.',
    category: 'usaha-tani', author: 'Andi Wijaya', authorRole: 'Penulis pertanian',
    publishedAt: '2026-08-20', updatedAt: '2026-11-01', fieldVerified: false,
    tags: ['alat', 'populasi', 'benih'],
    body: `Populasi tanaman menentukan dosis pupuk, kebutuhan benih, dan perkiraan hasil.

## Rumus

Luas efektif = luas lahan × (1 − bagian non-tanam). Populasi = luas efektif ÷ (jarak baris × jarak dalam baris). Kebutuhan benih = populasi × (1 + cadangan sulam) ÷ daya kecambah.

[[hitung:populasi]]

:::catatan
Satuan jarak harus konsisten. Alat ini memakai meter, sedangkan luas dapat dimasukkan dalam m² atau ha.
:::`,
  }),
  guide({
    id: 'g07', slug: 'menyusun-rab-usaha-tani', title: 'Menyusun RAB Usaha Tani yang Realistis',
    summary: 'Memisahkan biaya tetap dan variabel, lalu menghitung R/C, BEP harga, dan BEP produksi.',
    category: 'usaha-tani', author: 'Sari Rahmawati', authorRole: 'Penyuluh lapangan',
    publishedAt: '2026-09-05', updatedAt: '2026-10-28', fieldVerified: true, verifiedAt: 'Oktober 2026', verifiedBy: 'Sari Rahmawati',
    tags: ['usaha', 'rab', 'bep'],
    body: `RAB yang baik jujur tentang asumsi. Tuliskan harga input yang benar-benar Anda bayar, bukan harga di pasar yang berbeda wilayah.

## Komponen biaya

- **Biaya tetap:** sewa lahan, alat, dan tenaga tetap.
- **Biaya variabel:** benih, pupuk, pestisida, irigasi, dan tenaga panen.

[[hitung:usaha]]

:::catatan
Laba = pendapatan − biaya. R/C = pendapatan ÷ biaya. BEP harga = biaya ÷ hasil. Semua angka merupakan panduan umum.
:::`,
  }),
  guide({
    id: 'g08', slug: 'kompos-matang', title: 'Membuat Kompos Matang untuk Kebun Rumahan',
    summary: 'Ciri kompos siap pakai dan cara menghindari bau serta hama.',
    category: 'pemupukan', author: 'Andi Wijaya', authorRole: 'Penulis pertanian',
    publishedAt: '2026-07-14', updatedAt: '2026-09-02', fieldVerified: false,
    tags: ['kompos', 'organik'],
    body: `Kompos matang berwarna cokelat gelap, remah, dan tidak berbau busuk. Bahan yang belum matang dapat menarik hama dan mengikat nitrogen.

## Langkah singkat

1. Campur bahan hijau dan cokelat dengan perbandingan 1:2.
2. Basahi hingga lembap, bukan becek.
3. Balik tumpukan setiap 7–10 hari.
4. Hemati 4–8 minggu sampai suhu turun dan warna merata.`,
  }),
  guide({
    id: 'g09', slug: 'panen-cabai', title: 'Panen Cabai: Ciri Matang dan Penanganan Pasca Panen',
    summary: 'Kapan memetik cabai, cara menjaga kualitas, dan kesalahan penyimpanan.',
    category: 'pascapanen', commodityId: 'cabai', author: 'Sari Rahmawati', authorRole: 'Penyuluh lapangan',
    publishedAt: '2026-10-30', updatedAt: '2026-11-10', fieldVerified: true, verifiedAt: 'November 2026', verifiedBy: 'Sari Rahmawati',
    tags: ['cabai', 'panen'],
    body: `Cabai dipetik saat buah mencapai warna merah penuh dan kulit mengkilap. Pemotongan dengan gunung atau pisau bersih mengurangi kerusakan tangkai.

## Penanganan

- Petik pada pagi hari setelah embun kering.
- Gunakan wadah berlubang agar udara beredar.
- Jangan mencuci sebelum disimpan.
- Simpan di tempat teduh dengan sirkulasi udara baik.`,
  }),
];

export const calcParams = {
  pupuk: {
    defaultDosis: 300,
    defaultApplications: 3,
    defaultPrice: 14000,
    note: 'Dosis contoh untuk NPK 16-16-16 pada kondisi tanah menengah.',
  },
  populasi: {
    defaultRow: 0.7,
    defaultPlant: 0.25,
    defaultNonPlant: 0.1,
    defaultReserve: 0.1,
    defaultGermination: 0.85,
    note: 'Satuan jarak dalam meter; cadangan sulam dan daya kecambah dalam persentase.',
  },
  usaha: {
    defaultYield: 4000,
    defaultPrice: 18000,
    defaultFixedCost: 4500000,
    defaultVariableCost: 12000000,
    note: 'Contoh untuk satu hektar. Ganti dengan angka lapangan Anda.',
  },
} as const;

export const categories = [
  { slug: 'budidaya', name: 'Budidaya', description: 'Langkah kerja dari lahan sampai panen.' },
  { slug: 'pemupukan', name: 'Pemupukan', description: 'Dosis, waktu, dan cara aplikasi hara.' },
  { slug: 'hama-penyakit', name: 'Hama & Penyakit', description: 'Pengenalan gejala dan pengendalian bertingkat.' },
  { slug: 'usaha-tani', name: 'Usaha Tani', description: 'Perhitungan populasi, biaya, dan keuntungan.' },
  { slug: 'pascapanen', name: 'Pascapanen', description: 'Penanganan hasil setelah panen.' },
];

export const tools = [
  { slug: 'pupuk', name: 'Hitung Pupuk', summary: 'Kebutuhan pupuk dan biaya per aplikasi.' },
  { slug: 'populasi', name: 'Populasi Tanam', summary: 'Jumlah tanaman dan kebutuhan benih.' },
  { slug: 'usaha', name: 'Analisis Usaha', summary: 'Laba, R/C, dan titik impas.' },
];

export const searchIndex: SearchItem[] = [
  ...guides.map((g) => ({ type: 'panduan' as const, title: g.title, summary: g.summary, url: `/panduan/${g.slug}`, keywords: g.tags.join(' ') })),
  ...commodities.map((c) => ({ type: 'komoditas' as const, title: c.name, summary: c.summary, url: `/komoditas/${c.slug}`, keywords: c.group })),
  ...pests.map((p) => ({ type: 'hama' as const, title: p.name, summary: p.summary, url: `/hama/${p.slug}`, keywords: p.kind })),
  ...tools.map((t) => ({ type: 'alat' as const, title: t.name, summary: t.summary, url: `/app/alat/${t.slug}`, keywords: 'alat hitung kalkulator' })),
];

export const site = {
  name: 'SABDITANI',
  tagline: 'sarana abdi tani',
  domain: 'https://sabditani.id',
  description: 'Panduan pertanian berbahasa Indonesia: kalender tanam, alat hitung, diagnosa gejala, dan panduan terverifikasi lapangan.',
  whatsapp: 'https://wa.me/6281234567890',
  email: 'halo@sabditani.id',
};
