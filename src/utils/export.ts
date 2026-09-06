// ==========================================
// Export Utilities (Excel / CSV UTF-8)
// ==========================================

import type { Student, Payment } from '../types';
import { formatDate, formatRupiah } from './formatter';

/** Trigger download of CSV file with UTF-8 BOM for Microsoft Excel compatibility */
export function downloadCsv(filename: string, csvContent: string): void {
  // UTF-8 BOM (\uFEFF) ensures Excel opens Indonesian characters and special accents without garbled text
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Escape CSV field */
function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/** Export array of students to CSV formatted for Excel */
export function exportStudentsToExcel(students: Student[], schoolName = 'SMP Nusantara Unggul'): void {
  const headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Nama Orang Tua / Wali', 'No. WhatsApp / HP', 'Nominal SPP (Rp)'];
  
  const rows = students.map((s, idx) => [
    idx + 1,
    s.nis,
    s.nama,
    s.kelas,
    s.namaOrangTua || '-',
    s.noHp || '-',
    s.nominalSpp
  ]);

  const csvRows = [
    [`Data Siswa - ${schoolName}`],
    [`Diunduh pada: ${new Date().toLocaleString('id-ID')}`],
    [],
    headers.map(escapeCsv).join(','),
    ...rows.map(r => r.map(escapeCsv).join(','))
  ];

  const content = csvRows.map(r => Array.isArray(r) ? r.join(',') : r).join('\r\n');
  const filename = `Data_Siswa_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCsv(filename, content);
}

/** Export array of payments to CSV formatted for Excel */
export function exportPaymentsToExcel(payments: Payment[], schoolName = 'SMP Nusantara Unggul'): void {
  const headers = [
    'No',
    'ID Transaksi',
    'Tanggal Bayar',
    'NIS',
    'Nama Siswa',
    'Kelas',
    'Rincian Pos / Item Dibayar',
    'Nominal (Rp)',
    'Channel',
    'Metode Bayar',
    'Status',
    'Catatan / Keterangan'
  ];

  const rows = payments.map((p, idx) => [
    idx + 1,
    p.idTransaksi,
    formatDate(p.tanggalBayar),
    p.nis,
    p.nama,
    p.kelas,
    p.rincianItemText || `SPP ${p.bulan} ${p.tahun}`,
    p.nominal,
    p.channel === 'online' ? 'Online (Siswa)' : 'Kasir Admin',
    p.metodeBayar.toUpperCase(),
    p.status.toUpperCase(),
    p.keterangan || '-'
  ]);

  const totalNominal = payments.reduce((acc, curr) => acc + (curr.nominal || 0), 0);

  const csvRows = [
    [`Laporan Rekap Transaksi Pembayaran - ${schoolName}`],
    [`Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`],
    [`Total Transaksi: ${payments.length} | Total Pemasukan: ${formatRupiah(totalNominal)}`],
    [],
    headers.map(escapeCsv).join(','),
    ...rows.map(r => r.map(escapeCsv).join(',')),
    [],
    ['', '', '', '', '', 'TOTAL DITERIMA', '', totalNominal, '', '', '', ''].map(escapeCsv).join(',')
  ];

  const content = csvRows.map(r => Array.isArray(r) ? r.join(',') : r).join('\r\n');
  const filename = `Laporan_Pembayaran_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCsv(filename, content);
}
