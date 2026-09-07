// ==========================================
// Export & Import Utilities (SheetJS XLSX & CSV)
// ==========================================

import * as XLSX from 'xlsx';
import type { Student, Payment } from '../types';
import { formatDate } from './formatter';

/** Trigger download of CSV file with UTF-8 BOM for Microsoft Excel compatibility */
export function downloadCsv(filename: string, csvContent: string): void {
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

/** Export array of students to genuine Excel (.xlsx) */
export function exportStudentsToExcel(students: Student[], schoolName = 'SMP Nusantara Unggul'): void {
  const wb = XLSX.utils.book_new();
  const wsData = [
    [`DATA SISWA - ${schoolName.toUpperCase()}`],
    [`Diunduh pada: ${new Date().toLocaleString('id-ID')}`],
    [],
    ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Nama Orang Tua / Wali', 'No. WhatsApp / HP', 'Nominal SPP (Rp)'],
    ...students.map((s, idx) => [
      idx + 1,
      s.nis,
      s.nama,
      s.kelas,
      s.namaOrangTua || '-',
      s.noHp || '-',
      s.nominalSpp
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 28 },
    { wch: 12 },
    { wch: 24 },
    { wch: 18 },
    { wch: 16 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Data_Siswa_${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.xlsx`);
}

/** Export payments history to genuine Excel (.xlsx) */
export function exportPaymentsToExcel(payments: Payment[], schoolName = 'SMP Nusantara Unggul'): void {
  const wb = XLSX.utils.book_new();
  const wsData = [
    [`LAPORAN RIWAYAT PEMBAYARAN - ${schoolName.toUpperCase()}`],
    [`Diunduh pada: ${new Date().toLocaleString('id-ID')}`],
    [],
    ['No', 'ID Transaksi', 'Tanggal', 'NIS', 'Nama Siswa', 'Kelas', 'Keterangan Tagihan', 'Channel', 'Metode', 'Nominal (Rp)', 'Status'],
    ...payments.map((p, idx) => [
      idx + 1,
      p.idTransaksi,
      formatDate(p.tanggalBayar),
      p.nis,
      p.nama,
      p.kelas,
      p.rincianItemText || `SPP ${p.bulan} ${p.tahun}`,
      p.channel === 'online' ? 'Online' : 'Kasir',
      p.metodeBayar.toUpperCase(),
      p.nominal,
      p.status.toUpperCase()
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
    { wch: 26 },
    { wch: 12 },
    { wch: 32 },
    { wch: 10 },
    { wch: 12 },
    { wch: 16 },
    { wch: 10 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Pembayaran');
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Laporan_Pembayaran_${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.xlsx`);
}

/** Download official student import Excel template (.xlsx) */
export function downloadStudentTemplateExcel(defaultSpp = 250000, schoolName = 'SMP Nusantara Unggul'): void {
  const wb = XLSX.utils.book_new();
  const wsData = [
    [`TEMPLATE RESMI DATA SISWA - ${schoolName.toUpperCase()}`],
    ['Petunjuk: Kolom NIS, Nama Siswa, dan Kelas wajib diisi. Jangan merubah judul kolom di baris 4.'],
    [],
    ['NIS (Wajib)', 'Nama Lengkap Siswa (Wajib)', 'Kelas (Wajib)', 'Nama Orang Tua / Wali', 'No WhatsApp / HP', 'Nominal SPP (Rp)'],
    ['2026011', 'Muhammad Rizky Pratama', 'VII-A', 'Bambang Pratama', '081234567890', defaultSpp],
    ['2026012', 'Anisa Rahmawati', 'VII-B', 'Hendra Gunawan', '085712345678', defaultSpp],
    ['2026013', 'Dimas Arya Saputra', 'VIII-A', 'Suryanto', '087812345678', defaultSpp],
    ['2026014', 'Zahra Putri Kirana', 'IX-B', 'Wahyudi', '089612345678', defaultSpp]
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 15 },
    { wch: 28 },
    { wch: 12 },
    { wch: 24 },
    { wch: 18 },
    { wch: 16 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Template Siswa');
  XLSX.writeFile(wb, 'Template_Data_Siswa.xlsx');
}

/** Download official student import CSV template formatted for Indonesian Excel */
export function downloadStudentTemplateCsv(defaultSpp = 250000): void {
  const delimiter = ';';
  const headers = ['NIS', 'Nama Siswa', 'Kelas', 'Nama Orang Tua / Wali', 'No WhatsApp / HP', 'Nominal SPP (Rp)'];
  const sampleRows = [
    ['2026011', 'Muhammad Rizky Pratama', 'VII-A', 'Bambang Pratama', '081234567890', String(defaultSpp)],
    ['2026012', 'Anisa Rahmawati', 'VII-B', 'Hendra Gunawan', '085712345678', String(defaultSpp)],
    ['2026013', 'Dimas Arya Saputra', 'VIII-A', 'Suryanto', '087812345678', String(defaultSpp)],
    ['2026014', 'Zahra Putri Kirana', 'IX-B', 'Wahyudi', '089612345678', String(defaultSpp)]
  ];

  const content = [
    `sep=${delimiter}`,
    headers.map(escapeCsv).join(delimiter),
    ...sampleRows.map(r => r.map(escapeCsv).join(delimiter))
  ].join('\r\n');

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
  const lines = text.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l.length > 0);
  const firstLine = lines[0] || '';
  if (firstLine.toLowerCase().startsWith('sep=')) {
    return firstLine.substring(4).trim() || ';';
  }
  const checkLine = lines[1] || firstLine;
  const commaCount = (checkLine.match(/,/g) || []).length;
  const semiCount = (checkLine.match(/;/g) || []).length;
  const tabCount = (checkLine.match(/\t/g) || []).length;

  if (semiCount >= commaCount && semiCount >= tabCount) return ';';
  if (tabCount > commaCount && tabCount > semiCount) return '\t';
  return ',';
}

export interface ParseStudentResult {
  valid: Student[];
  errors: string[];
  totalRows: number;
}

/**
 * Universal Student File Parser
 * Supports:
 * - Native .xlsx (Excel 2007+)
 * - Native .xls (BIFF8 binary Excel 97-2004)
 * - HTML Table .xls
 * - CSV (.csv) with comma, semicolon, or tab
 */
export function parseStudentFile(data: ArrayBuffer | string, defaultSpp = 250000): ParseStudentResult {
  try {
    let workbook: XLSX.WorkBook;

    if (typeof data === 'string') {
      workbook = XLSX.read(data, { type: 'string' });
    } else {
      workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
    }

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { valid: [], errors: ['File tidak memiliki lembar kerja (worksheet) yang terbaca.'], totalRows: 0 };
    }

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rawRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return { valid: [], errors: ['Tabel Excel kosong atau tidak terbaca.'], totalRows: 0 };
    }

    let headerIdx = -1;
    let headerCols: string[] = [];

    for (let i = 0; i < Math.min(rawRows.length, 25); i++) {
      const rowCells = (rawRows[i] || []).map((c) =>
        String(c ?? '')
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
      );

      const hasNis = rowCells.some((c) => c === 'nis' || c.includes('induk') || c === 'id');
      const hasNama = rowCells.some((c) => c.includes('nama') || c === 'siswa' || c === 'name');
      const hasKelas = rowCells.some((c) => c.includes('kelas') || c.includes('rombel'));

      if (hasNis && (hasNama || hasKelas)) {
        headerIdx = i;
        headerCols = rowCells;
        break;
      }
    }

    if (headerIdx === -1) {
      for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
        const rowCells = (rawRows[i] || []).map((c) =>
          String(c ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
        );
        if (rowCells.length >= 2 && rowCells.some((c) => c.length > 0)) {
          headerIdx = i;
          headerCols = rowCells;
          break;
        }
      }
    }

    if (headerIdx === -1) {
      headerIdx = 0;
      headerCols = [];
    }

    let nisIdx = headerCols.findIndex((h) => h === 'nis' || h.includes('induk') || h === 'id' || h === 'noinduk');
    let namaIdx = headerCols.findIndex((h) => h.includes('nama') && !h.includes('orang') && !h.includes('wali') && !h.includes('ortu'));
    if (namaIdx === -1) namaIdx = headerCols.findIndex((h) => h === 'nama' || h === 'name' || h.includes('siswa') || h.includes('namalengkap'));
    let kelasIdx = headerCols.findIndex((h) => h.includes('kelas') || h.includes('tingkat') || h.includes('rombel') || h.includes('jurusan'));
    let ortuIdx = headerCols.findIndex((h) => h.includes('orang') || h.includes('wali') || h.includes('ortu') || h.includes('ayah') || h.includes('ibu'));
    let hpIdx = headerCols.findIndex((h) => h.includes('hp') || h.includes('wa') || h.includes('telepon') || h.includes('telp') || h.includes('whatsapp') || h.includes('phone'));
    let sppIdx = headerCols.findIndex((h) => h.includes('spp') || h.includes('nominal') || h.includes('biaya') || h.includes('tarif'));

    if (nisIdx === -1) nisIdx = 0;
    if (namaIdx === -1) namaIdx = 1;
    if (kelasIdx === -1) kelasIdx = 2;
    if (ortuIdx === -1) ortuIdx = 3;
    if (hpIdx === -1) hpIdx = 4;
    if (sppIdx === -1) sppIdx = 5;

    const valid: Student[] = [];
    const errors: string[] = [];

    for (let i = headerIdx + 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || !Array.isArray(row) || row.length === 0) continue;
      if (row.every((c) => c === null || c === undefined || String(c).trim() === '')) continue;

      const rawNis = String(row[nisIdx] ?? '').replace(/['"]/g, '').trim();
      const rawNama = String(row[namaIdx] ?? '').replace(/['"]/g, '').trim();
      const rawKelas = String(row[kelasIdx] ?? '').replace(/['"]/g, '').trim() || 'VII-A';
      const rawOrtu = String(row[ortuIdx] ?? '').replace(/['"]/g, '').trim() || '-';
      let rawHp = String(row[hpIdx] ?? '').replace(/['"]/g, '').trim();

      rawHp = rawHp.replace(/[^\d+]/g, '');
      if (rawHp.startsWith('+62')) rawHp = '0' + rawHp.slice(3);
      else if (rawHp.startsWith('62')) rawHp = '0' + rawHp.slice(2);

      const sppStr = String(row[sppIdx] ?? '').replace(/[^0-9]/g, '');
      const nominalSpp = sppStr ? parseInt(sppStr, 10) : defaultSpp;

      if (rawNis.toLowerCase().includes('petunjuk') || rawNama.toLowerCase().includes('petunjuk')) continue;
      if (rawNis.toLowerCase().includes('wajib') && rawNama.toLowerCase().includes('wajib')) continue;
      if (rawNis.toLowerCase().includes('template') || rawNama.toLowerCase().includes('template')) continue;

      if (!rawNis) {
        errors.push(`Baris ${i + 1}: NIS tidak boleh kosong.`);
        continue;
      }
      if (!rawNama) {
        errors.push(`Baris ${i + 1} (NIS ${rawNis}): Nama siswa tidak boleh kosong.`);
        continue;
      }

      valid.push({
        nis: rawNis,
        nama: rawNama,
        kelas: rawKelas,
        namaOrangTua: rawOrtu,
        noHp: rawHp,
        nominalSpp: isNaN(nominalSpp) || nominalSpp <= 0 ? defaultSpp : nominalSpp,
      });
    }

    return { valid, errors, totalRows: rawRows.length - (headerIdx + 1) };
  } catch (err) {
    if (typeof data === 'string') {
      return parseStudentCsv(data, defaultSpp);
    }
    return {
      valid: [],
      errors: ['Gagal membaca file Excel/CSV: ' + (err instanceof Error ? err.message : String(err))],
      totalRows: 0,
    };
  }
}

/** Legacy / Fallback parser string CSV murni */
export function parseStudentCsv(cleanContent: string, defaultSpp = 250000): ParseStudentResult {
  let rawLines = cleanContent.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0);

  if (rawLines.length === 0) {
    return { valid: [], errors: ['File kosong.'], totalRows: 0 };
  }

  if (rawLines[0].toLowerCase().startsWith('sep=')) {
    rawLines = rawLines.slice(1);
  }

  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(rawLines.length, 10); i++) {
    const lower = rawLines[i].toLowerCase();
    if (lower.includes('nis') && (lower.includes('nama') || lower.includes('kelas'))) {
      headerRowIdx = i;
      break;
    }
  }

  const delimiter = detectDelimiter(cleanContent);
  const headerCols = splitCsvLine(rawLines[headerRowIdx], delimiter).map((h) =>
    h.toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  let nisIdx = headerCols.findIndex((h) => h === 'nis' || h.includes('induk') || h.includes('id'));
  let namaIdx = headerCols.findIndex((h) => h.includes('nama') && !h.includes('orang') && !h.includes('wali'));
  if (namaIdx === -1) namaIdx = headerCols.findIndex((h) => h === 'nama' || h === 'name' || h.includes('siswa'));
  let kelasIdx = headerCols.findIndex((h) => h.includes('kelas') || h.includes('tingkat') || h.includes('rombel'));
  let ortuIdx = headerCols.findIndex((h) => h.includes('orang') || h.includes('wali') || h.includes('ortu'));
  let hpIdx = headerCols.findIndex((h) => h.includes('hp') || h.includes('wa') || h.includes('telepon'));
  let sppIdx = headerCols.findIndex((h) => h.includes('spp') || h.includes('nominal'));

  if (nisIdx === -1) nisIdx = 0;
  if (namaIdx === -1) namaIdx = 1;
  if (kelasIdx === -1) kelasIdx = 2;
  if (ortuIdx === -1) ortuIdx = 3;
  if (hpIdx === -1) hpIdx = 4;
  if (sppIdx === -1) sppIdx = 5;

  const valid: Student[] = [];
  const errors: string[] = [];

  for (let i = headerRowIdx + 1; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;
    const cols = splitCsvLine(line, delimiter);
    if (cols.length === 0 || cols.every((c) => !c)) continue;

    const nis = cols[nisIdx]?.replace(/['"]/g, '').trim();
    const nama = cols[namaIdx]?.replace(/['"]/g, '').trim();
    const kelas = cols[kelasIdx]?.replace(/['"]/g, '').trim() || 'VII-A';
    const namaOrangTua = cols[ortuIdx]?.replace(/['"]/g, '').trim() || '-';
    let noHp = cols[hpIdx]?.replace(/['"]/g, '').trim() || '';

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
      nominalSpp: isNaN(nominalSpp) || nominalSpp <= 0 ? defaultSpp : nominalSpp,
    });
  }

  return { valid, errors, totalRows: rawLines.length - (headerRowIdx + 1) };
}
