// ==========================================
// Types & Interfaces - Aplikasi Pembayaran SPP
// ==========================================

/** Status pembayaran */
export type PaymentStatus = 'lunas' | 'belum' | 'sebagian';

/** Metode pembayaran */
export type PaymentMethod = 'tunai' | 'transfer' | 'qris' | 'va_bca' | 'va_bri' | 'va_mandiri' | 'gopay' | 'dana' | 'ovo';

/** Role pengguna aplikasi */
export type UserRole = 'admin' | 'siswa' | null;

/** Sesi login pengguna */
export interface AuthSession {
  role: 'admin' | 'siswa';
  username?: string;
  student?: Student;
  loginTime: number;
}

/** Channel pembayaran */
export type PaymentChannel = 'online' | 'admin';

/** Kategori pos tagihan */
export type BillableCategory = 'spp' | 'seragam' | 'buku' | 'gedung' | 'kegiatan' | 'ujian' | 'bebas' | 'lainnya';

/** Item detail yang dibayar dalam satu transaksi */
export interface PaymentItemDetail {
  id: string;
  nama: string;
  kategori: BillableCategory;
  nominal: number;
  bulan?: MonthName;
  tahun?: number;
  keterangan?: string;
}

/** Master template tagihan yang bisa dikelola (Tambah/Edit/Hapus) */
export interface BillableItemTemplate {
  id: string;
  nama: string;
  kategori: BillableCategory;
  nominalDefault: number;
  isCustomNominal?: boolean;
  deskripsi: string;
  isMonthly?: boolean;
}

/** Identitas / Profil Sekolah yang dapat diedit oleh Admin */
export interface SchoolIdentity {
  namaSekolah: string;
  alamatSekolah: string;
  noTelepon: string;
  email: string;
  tahunAjaran: string;
  nominalSppDefault: number;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaBendahara: string;
  nipBendahara?: string;
  catatanKuitansi: string;
  appsScriptUrl?: string;
}

/** Nama bulan dalam Bahasa Indonesia */
export type MonthName =
  | 'Januari' | 'Februari' | 'Maret' | 'April'
  | 'Mei' | 'Juni' | 'Juli' | 'Agustus'
  | 'September' | 'Oktober' | 'November' | 'Desember';

/** Data siswa */
export interface Student {
  nis: string;
  nama: string;
  kelas: string;
  namaOrangTua: string;
  noHp: string;
  nominalSpp: number;
  password?: string;
}

/** Data pembayaran */
export interface Payment {
  idTransaksi: string;
  nis: string;
  nama: string;
  kelas: string;
  bulan: MonthName;
  tahun: number;
  nominal: number;
  tanggalBayar: string;
  metodeBayar: PaymentMethod;
  status: PaymentStatus;
  keterangan: string;
  channel?: PaymentChannel;
  items?: PaymentItemDetail[];
  rincianItemText?: string;
}

/** Statistik dashboard */
export interface DashboardStats {
  totalSiswa: number;
  sudahBayar: number;
  belumBayar: number;
  totalPemasukan: number;
  totalTunggakan: number;
  totalOnline?: number;
}

/** Response dari API Google Apps Script */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/** Konfigurasi route */
export interface Route {
  path: string;
  title: string;
  icon: string;
  render: () => HTMLElement;
}

/** Opsi filter riwayat pembayaran */
export interface HistoryFilter {
  search?: string;
  kelas?: string;
  bulan?: MonthName | '';
  tahun?: number;
  status?: PaymentStatus | '';
  channel?: PaymentChannel | '';
}

/** Data kwitansi cetak */
export interface ReceiptData {
  idTransaksi: string;
  tanggal: string;
  namaSiswa: string;
  nis: string;
  kelas: string;
  bulan: MonthName;
  tahun: number;
  nominal: number;
  metodeBayar: PaymentMethod;
  namaSekolah: string;
  alamatSekolah: string;
  items?: PaymentItemDetail[];
  channel?: PaymentChannel;
}

/** Notifikasi transaksi untuk Admin */
export interface AppNotification {
  id: string;
  timestamp: number;
  title: string;
  message: string;
  idTransaksi?: string;
  nominal?: number;
  namaSiswa?: string;
  read: boolean;
}

/** Toast notification type */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Konfigurasi aplikasi */
export interface AppConfig {
  namaSekolah: string;
  alamatSekolah: string;
  tahunAjaran: string;
  nominalSppDefault: number;
  appsScriptUrl: string;
}
