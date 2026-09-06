// ==========================================
// Konfigurasi & Konstanta Aplikasi
// ==========================================

import type { AppConfig, MonthName, BillableItemTemplate } from '../types';

/** Konfigurasi utama aplikasi */
export const APP_CONFIG: AppConfig = {
  namaSekolah: 'SMP Negeri 1 Nusantara',
  alamatSekolah: 'Jl. Pendidikan No. 1, Kota Nusantara',
  tahunAjaran: '2026/2027',
  nominalSppDefault: 250000,
  // Ganti dengan URL Apps Script Anda setelah deploy
  appsScriptUrl: '',
};

/** Daftar bulan dalam Bahasa Indonesia */
export const MONTHS: MonthName[] = [
  'Januari', 'Februari', 'Maret', 'April',
  'Mei', 'Juni', 'Juli', 'Agustus',
  'September', 'Oktober', 'November', 'Desember',
];

/** Daftar kelas */
export const KELAS_LIST: string[] = [
  'VII-A', 'VII-B', 'VII-C',
  'VIII-A', 'VIII-B', 'VIII-C',
  'IX-A', 'IX-B', 'IX-C',
];

/** Metode pembayaran yang tersedia */
export const PAYMENT_METHODS = [
  { value: 'tunai', label: 'Tunai (Kasir)' },
  { value: 'transfer', label: 'Transfer Bank Manual' },
  { value: 'qris', label: 'QRIS (Semua Pembayaran)' },
  { value: 'va_bca', label: 'Virtual Account BCA' },
  { value: 'va_bri', label: 'Virtual Account BRI' },
  { value: 'va_mandiri', label: 'Virtual Account Mandiri' },
  { value: 'gopay', label: 'GoPay' },
  { value: 'dana', label: 'DANA' },
  { value: 'ovo', label: 'OVO' },
] as const;

/** Daftar Pos Tagihan Sekolah Default */
export const DEFAULT_BILLABLE_ITEMS: BillableItemTemplate[] = [
  {
    id: 'pos-spp',
    nama: 'SPP Bulanan',
    kategori: 'spp',
    nominalDefault: 250000,
    deskripsi: 'Iuran Pembinaan Pendidikan bulanan (dapat memilih bulan yang ingin dibayar)',
    isMonthly: true,
  },
  {
    id: 'pos-gedung',
    nama: 'Uang Gedung / DSP (Uang Pangkal)',
    kategori: 'gedung',
    nominalDefault: 500000,
    deskripsi: 'Dana Sumbangan Pendidikan / fasilitas sarana sekolah',
  },
  {
    id: 'pos-seragam',
    nama: 'Paket Seragam & Atribut Sekolah',
    kategori: 'seragam',
    nominalDefault: 350000,
    deskripsi: '3 stel seragam (OSIS, Pramuka, Batik) + bet & dasi',
  },
  {
    id: 'pos-buku',
    nama: 'Paket Buku Pelajaran & Modul LKS',
    kategori: 'buku',
    nominalDefault: 150000,
    deskripsi: 'Paket modul semester ganjil/genap lengkap',
  },
  {
    id: 'pos-ujian',
    nama: 'Biaya Ujian & Asesmen Semester (PTS/PAS)',
    kategori: 'ujian',
    nominalDefault: 100000,
    deskripsi: 'Operasional ujian berbasis komputer (CBT) & administrasi',
  },
  {
    id: 'pos-kegiatan',
    nama: 'Kegiatan Outing & Ekstrakurikuler',
    kategori: 'kegiatan',
    nominalDefault: 75000,
    deskripsi: 'Kegiatan luar kelas, kepramukaan, dan pengembangan minat',
  },
  {
    id: 'pos-bebas',
    nama: 'Tagihan Lainnya / Donasi Sukarela / Cicilan',
    kategori: 'bebas',
    nominalDefault: 50000,
    isCustomNominal: true,
    deskripsi: 'Nominal bebas! Anda dapat membayar berapapun sesuai kemampuan atau jenis keperluan khusus.',
  },
];

/** Key untuk localStorage */
export const STORAGE_KEYS = {
  STUDENTS: 'spp_students',
  PAYMENTS: 'spp_payments',
  CONFIG: 'spp_config',
  THEME: 'spp_theme',
  NOTIFICATIONS: 'spp_notifications',
  SCHOOL_INFO: 'spp_school_info',
  BILLABLE_ITEMS: 'spp_billable_items',
  AUTH_SESSION: 'spp_auth_session',
  ADMIN_PASSWORD: 'spp_admin_password',
} as const;

/** Warna status badge */
export const STATUS_COLORS: Record<string, string> = {
  lunas: 'var(--color-success)',
  belum: 'var(--color-danger)',
  sebagian: 'var(--color-warning)',
};
