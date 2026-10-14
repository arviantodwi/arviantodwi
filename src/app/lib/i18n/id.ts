import type { Dictionary } from './types';

export const idDictionary: Dictionary = {
  metadata: {
    description:
      'Developer UI dan front-end papan atas yang dikenal lewat desain dengan piksel yang presisi, kode yang bersih, visi kreatif, dan kolaborasi yang luar biasa. Dipercaya oleh tim dan manajer proyek untuk menghadirkan antarmuka berkualitas tinggi yang memukau dan meningkatkan pengalaman pengguna.',
    ogLocale: 'id_ID',
  },
  header: {
    status: {
      available: 'Siap untuk dipekerjakan',
      open: 'Terbuka untuk penawaran',
      unavailable: 'Tidak tersedia untuk penawaran',
    },
  },
  hero: {
    rolePrefix: 'Front End Developer &',
    roles: ['Penggemar TypeScript', 'Ahli Visual', 'Trader Harian', 'Bapak-bapak Kocak'],
    location: 'Yogyakarta, Indonesia',
    stats: {
      projects: { short: 'Proyek selesai', long: 'Proyek selesai' },
      tools: { short: 'Tools dikuasai', long: 'Tools dikuasai' },
      years: { short: 'Tahun pengalaman', long: 'Tahun pengalaman' },
    },
    photoAlt: 'Foto Arvianto',
  },
  about: {
    headline: ['Hai, sobat.', 'Salam kenal ya!'],
    cta: 'Unduh Resume/CV saya',
    bio: [
      [
        {
          text: 'Saya seorang pengembang software yang saat ini mencari petualangan baru di pekerjaan berikutnya. ',
        },
        { text: 'Saya berspesialisasi di pengembangan Front End dengan ' },
        { text: 'pengalaman lebih dari 12+ tahun', tone: 'strong' },
        {
          text: ' di industri teknologi; 8 tahun sebagai UI Designer dan 6 tahun sebagai Front End Developer.',
        },
      ],
      [
        {
          text: 'Saya umumnya bekerja remote dari tempat tinggal saya di Indonesia, yang memungkinkan saya membangun portofolio kuat berupa ',
        },
        { text: '50+ proyek dengan klien/perusahaan di seluruh dunia', tone: 'strong' },
        { text: '. ' },
        {
          text: 'Di luar pekerjaan, saya sepenuhnya menghabiskan waktu sebagai ayah dan suami, sekaligus trader harian di pasar komoditas.',
        },
      ],
    ],
  },
  techStack: {
    heading: [
      { text: 'Saya membangun ' },
      { text: 'pengalaman luar biasa', tone: 'goldUnderline' },
      { text: ' di internet!' },
    ],
    subline: [
      { text: 'Minimalis selalu menjadi inti dari karya-karya saya, dan saya memanfaatkan ' },
      { text: '32+ alat pengembangan', tone: 'gold' },
      { text: ' serta teknologi untuk mencapai hasil pekerjaan yang luar biasa.' },
    ],
  },
  aiWorkflow: {
    headline: ['Intensi pada manusia.', 'Momentum dengan AI.'],
    intro: [
      {
        text: 'Sebagai desainer dan developer yang AI-native, saya membawa AI ke setiap tahapan proses kreatif saya. Dari pertanyaan pertama hingga sentuhan akhir, ',
        tone: 'dim',
      },
      { text: 'saya yang menentukan arahnya', tone: 'gold' },
      {
        text: '. Hasilnya adalah produk-produk luar biasa yang diarahkan oleh manusia.',
        tone: 'dim',
      },
    ],
    stages: {
      plan: {
        description:
          'Saya merumuskan rencana, menemukan berbagai kemungkinan, dan memetakan arah yang jelas.',
        imageAlt: 'Ilustrasi brief perencanaan',
      },
      design: {
        description:
          'Saya mengeksplorasi arah visual, menyempurnakan interaksi, dan menjaga pengalaman tetap berpadu.',
        imageAlt: 'Ilustrasi studi komposisi desain',
      },
      develop: {
        description:
          'Saya mempercepat implementasi, melakukan iterasi dengan cermat, dan menghaluskan detilnya.',
        imageAlt: 'Ilustrasi artefak proses pengembangan',
      },
    },
    toolkit: [
      { text: 'Kumpulan perangkat AI ini membantu saya ', tone: 'dim' },
      { text: 'mengurangi pekerjaan repetitif ' },
      { text: 'dan ', tone: 'dim' },
      { text: 'lebih banyak ruang untuk berkarya!' },
    ],
  },
  portfolio: {
    tagline: {
      muted: 'Tantangan yang berbeda-beda.',
      plain: 'Perhatian yang sama pada pengalaman.',
    },
    projects: {
      tours: {
        description:
          'Eksplorasi, kompetisi, dan penemuan. Pengalaman yang benar-benar mengajak berkarya melampaui layar.',
      },
      sports: {
        description:
          'Rumah bagi pelajaran, podcast, dan webinar. Konten yang kaya, tersaji ramah di setiap layar.',
      },
      voice: {
        description:
          'Mengubah suaramu menjadi sesuatu yang bisa dianalisis. Panduan yang menyenangkan dengan umpan balik yang jelas dan ekspresif.',
      },
      vehicle: {
        description:
          'Dari ringkasan rute sampai detail pengiriman, pengalaman terhubung untuk memantau perjalanan setiap kendaraan.',
      },
      charity: {
        description:
          'Platform dengan manusia di pusatnya. Menghubungkan berbagai tujuan bermakna dengan komunitas yang mendukungnya.',
      },
    },
  },
  testimonial: {
    heading: [
      { text: 'Baca kata klien & rekan tentang ' },
      { text: 'hasil kerja saya!', tone: 'goldUnderline' },
    ],
    testimonies: [
      {
        photo: '/people/profile_logo_24449541.jpg.webp',
        name: 'David Seek',
        title: 'Mantan Software Engineer di Amazon',
        quotes: [
          {
            text: 'Arvi adalah desainer paling berbakat yang pernah saya lihat. Saya sudah bekerja dengan dia di beberapa proyek dan dia ',
          },
          {
            text: ' terus bertumbuh mengikuti kebutuhan. Dia memiliki mata yang jeli untuk detail dan kepresisian piksel.',
            tone: 'gold',
          },
          {
            text: ' UI adalah 50% dari yang membuat sebuah App hebat dan Arvi mampu memenuhi sepenuhnya kebutuhan akan UI yang memukau.',
          },
        ],
      },
      {
        photo: '/people/1744129672250.jpeg',
        name: 'Lucas Brancher',
        title: 'Core UI/UX Designer di Automata Network',
        quotes: [
          {
            text: 'Sepanjang tahun, saya mendapat kesempatan bekerja bersama Arvianto,',
            tone: 'gold',
          },
          {
            text: ' dan kebahagiaan berbagi desain, ide, dan konsep saya dengan seseorang yang benar-benar peduli pada semuanya, selalu memberikan yang terbaik untuk mencapai kualitas maksimal produk akhir!',
          },
        ],
      },
      {
        photo: '/people/1516639420540.jpeg',
        name: 'Putra R. Mahardhika',
        title: 'Blockchain & Web3 Analyst',
        quotes: [
          { text: 'Ahli UI/UX dengan kode yang terkelola baik. Bekerja cepat, ' },
          {
            text: 'mendengarkan dengan baik di dalam tim dan selalu punya ide bagus untuk meningkatkan hasil kerja.',
            tone: 'gold',
          },
        ],
      },
      {
        photo: '/people/1624592440235.jpeg',
        name: 'Nasir Iqbal',
        title: 'System Engineer di ICT Innovations',
        quotes: [
          {
            text: 'Luar biasa! Kreativitas, desain, visi, atau pemahaman — Arvianto unggul dalam segala hal! ',
          },
          { text: "Saya menilai dia sebagai developer 'Kelas A'.", tone: 'gold' },
          {
            text: " Sebagai manajer proyek saya berharap memiliki 'permata' seperti dia di tim saya. Untuk hasil berkualitas, saya sangat merekomendasikannya.",
          },
        ],
      },
      {
        photo: '/people/1656478335697.jpeg',
        name: 'Irsam S. Gana',
        title: 'Senior System Analyst di Agronum Tech',
        quotes: [{ text: 'Desain UI yang menarik dan memukau mata!' }],
      },
      {
        photo: '/people/1740735553903.jpeg',
        name: 'Gustavo Costa',
        title: 'Senior Consultant di Clancys Sports',
        quotes: [
          { text: 'Arvi adalah ' },
          { text: 'salah satu freelancer terbaik yang pernah saya ajak bekerja.', tone: 'gold' },
          {
            text: ' Dia melakukan pekerjaan dengan hebat. Akan terus bekerja bersama dia di proyek saya berikutnya.',
          },
        ],
      },
      {
        photo: '/people/profile_logo_9172955.jpg.webp',
        name: 'Steven M. Carlson',
        title: 'Co-Founder di AutoCorner',
        quotes: [
          { text: 'Kerja yang mengagumkan. Programmer yang hebat. ' },
          { text: 'Pekerja yang sangat keras!', tone: 'gold' },
          { text: ' SAYA AKAN MEMPEKERJAKANNYA LAGI!' },
        ],
      },
      {
        photo: '/people/profile_logo_32764036.jpg.webp',
        name: 'Theo Hannisse',
        title: 'Founder di RLLY NaviGames',
        quotes: [{ text: 'Menyenangkan untuk diajak bekerja. Pekerja yang kreatif.' }],
      },
    ],
  },
  footer: {
    copyright:
      'Merek dagang dan merek adalah milik pemiliknya masing-masing. Desain berkolaborasi dengan <link>Lucas Brancher</link> 🇧🇷 pada 2025.',
  },
};
