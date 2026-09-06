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

/** Download official student import CSV template with sample rows and guidance */
export function downloadStudentTemplateCsv(defaultSpp = 250000): void {
  const headers = ['NIS', 'Nama Siswa', 'Kelas', 'Nama Orang Tua / Wali', 'No WhatsApp / HP', 'Nominal SPP (Rp)'];
  const sampleRows = [
    ['2026011', 'Muhammad Rizky Pratama', 'VII-A', 'Bambang Pratama', '081234567890', defaultSpp],
    ['2026012', 'Anisa Rahmawati', 'VII-B', 'Hendra Gunawan', '085712345678', defaultSpp],
    ['2026013', 'Dimas Arya Saputra', 'VIII-A', 'Suryanto', '087812345678', defaultSpp],
    ['2026014', 'Zahra Putri Kirana', 'IX-B', 'Wahyudi', '089612345678', defaultSpp]
  ];

  const csvRows = [
    headers.map(escapeCsv).join(','),
    ...sampleRows.map(r => r.map(escapeCsv).join(','))
  ];

  const content = csvRows.join('\r\n');
  downloadCsv('Template_Data_Siswa.csv', content);
}

/** Split CSV line respecting quotes and commas/semicolons */
export function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/** Detect delimiter (, or ; or \t) from raw CSV text */
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r\n|\r|\n/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semiCount > commaCount && semiCount > tabCount) return ';';
  if (tabCount > commaCount && tabCount > semiCount) return '\t';
  return ',';
}

export interface ParseStudentResult {
  valid: Student[];
  errors: string[];
  totalRows: number;
}

/** Parse raw CSV text into validated Student objects */
export function parseStudentCsv(csvContent: string, defaultSpp = 250000): ParseStudentResult {
  const cleanContent = csvContent.replace(/^\uFEFF/, '').trim();
  const rawLines = cleanContent.split(/\r\n|\r|\n/).filter(l => l.trim().length > 0);

  if (rawLines.length < 2) {
    return { valid: [], errors: ['File kosong atau hanya berisi baris header.'], totalRows: 0 };
  }

  const delimiter = detectDelimiter(cleanContent);
  const headerCols = splitCsvLine(rawLines[0], delimiter).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  let nisIdx = headerCols.findIndex(h => h === 'nis' || h.includes('induk') || h.includes('id'));
  let namaIdx = headerCols.findIndex(h => h.includes('nama') && !h.includes('orang') && !h.includes('wali'));
  if (namaIdx === -1) namaIdx = headerCols.findIndex(h => h === 'nama' || h === 'name' || h.includes('siswa'));
  let kelasIdx = headerCols.findIndex(h => h.includes('kelas') || h.includes('tingkat') || h.includes('rombel'));
  let ortuIdx = headerCols.findIndex(h => h.includes('orang') || h.includes('wali') || h.includes('ortu') || h.includes('parent'));
  let hpIdx = headerCols.findIndex(h => h.includes('hp') || h.includes('wa') || h.includes('telepon') || h.includes('phone'));
  let sppIdx = headerCols.findIndex(h => h.includes('spp') || h.includes('nominal') || h.includes('biaya') || h.includes('tarif'));

  if (nisIdx === -1) nisIdx = 0;
  if (namaIdx === -1) namaIdx = 1;
  if (kelasIdx === -1) kelasIdx = 2;
  if (ortuIdx === -1) ortuIdx = 3;
  if (hpIdx === -1) hpIdx = 4;
  if (sppIdx === -1) sppIdx = 5;

  const valid: Student[] = [];
  const errors: string[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;
    const cols = splitCsvLine(line, delimiter);

    if (cols.length === 0 || cols.every(c => !c)) continue;

    const nis = cols[nisIdx]?.replace(/['"]/g, '').trim();
    const nama = cols[namaIdx]?.replace(/['"]/g, '').trim();
    const kelas = cols[kelasIdx]?.replace(/['"]/g, '').trim() || 'VII-A';
    const namaOrangTua = cols[ortuIdx]?.replace(/['"]/g, '').trim() || '-';
    let noHp = cols[hpIdx]?.replace(/['"]/g, '').trim() || '';

    // Standardize phone format
    noHp = noHp.replace(/[^\d+]/g, '');
    if (noHp.startsWith('+62')) noHp = '0' + noHp.slice(3);
    else if (noHp.startsWith('62')) noHp = '0' + noHp.slice(2);

    const rawSpp = cols[sppIdx]?.replace(/[^0-9]/g, '');
    const nominalSpp = rawSpp ? parseInt(rawSpp, 10) : defaultSpp;

    if (!nis) {
      errors.push(`Baris ${i + 1}: NIS tidak boleh kosong.`);
      continue;
    }
    if (!nama) {
      errors.push(`Baris ${i + 1} (NIS ${nis}): Nama siswa tidak boleh kosong.`);
      continue;
    }

    valid.push({
      nis,
      nama,
      kelas,
      namaOrangTua,
      noHp,
      nominalSpp: isNaN(nominalSpp) || nominalSpp <= 0 ? defaultSpp : nominalSpp
    });
  }

  return {
    valid,
    errors,
    totalRows: rawLines.length - 1
  };
}

