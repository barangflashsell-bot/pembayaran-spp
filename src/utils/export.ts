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

/** Download official student import Excel (.xls) file with styled colored headers, gridlines, and instructions */
export function downloadStudentTemplateExcel(defaultSpp = 250000, schoolName = 'SMP Nusantara Unggul'): void {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Template Data Siswa</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; }
        .text { mso-number-format: "\\@"; }
        .num { mso-number-format: "#,##0"; text-align: right; }
        .center { text-align: center; }
        .title { font-size: 14pt; font-weight: bold; color: #1e1b4b; padding: 10px 0; }
        .subtitle { font-size: 9.5pt; color: #475569; padding-bottom: 6px; }
        .petunjuk { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 8px; font-size: 9pt; }
        .th-primary { background-color: #4338ca; color: #ffffff; font-weight: bold; border: 1px solid #312e81; padding: 10px; text-align: center; font-size: 11pt; }
        .th-info { background-color: #0284c7; color: #ffffff; font-weight: bold; border: 1px solid #0369a1; padding: 10px; text-align: center; font-size: 11pt; }
        .td-data { border: 1px solid #cbd5e1; padding: 8px 10px; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="6" class="title">TEMPLATE RESMI DATA SISWA - ${schoolName.toUpperCase()}</td>
        </tr>
        <tr>
          <td colspan="6" class="subtitle">Isi data siswa di bawah baris judul kolom. Jangan mengubah nama atau urutan kolom header (Baris 6).</td>
        </tr>
        <tr>
          <td colspan="6" class="petunjuk">
            <strong>PETUNJUK PENGISIAN:</strong><br/>
            1. Kolom <strong>NIS</strong>, <strong>Nama Siswa</strong>, dan <strong>Kelas</strong> WAJIB diisi.<br/>
            2. Kolom <strong>No WhatsApp / HP</strong> isi dengan awalan 08 (misal: 081234567890) untuk pengiriman kuitansi otomatis.<br/>
            3. Kolom <strong>Nominal SPP</strong> isi angka saja tanpa titik atau koma (misal: ${defaultSpp}).
          </td>
        </tr>
        <tr><td colspan="6"></td></tr>
        <tr><td colspan="6"></td></tr>
        <tr>
          <th class="th-primary" style="width: 140px;">NIS (Wajib)</th>
          <th class="th-primary" style="width: 260px;">Nama Lengkap Siswa (Wajib)</th>
          <th class="th-primary" style="width: 110px;">Kelas (Wajib)</th>
          <th class="th-info" style="width: 210px;">Nama Orang Tua / Wali</th>
          <th class="th-info" style="width: 170px;">No WhatsApp / HP</th>
          <th class="th-info" style="width: 160px;">Nominal SPP (Rp)</th>
        </tr>
        <tr>
          <td class="td-data text center">2026011</td>
          <td class="td-data">Muhammad Rizky Pratama</td>
          <td class="td-data center">VII-A</td>
          <td class="td-data">Bambang Pratama</td>
          <td class="td-data text">081234567890</td>
          <td class="td-data num">${defaultSpp}</td>
        </tr>
        <tr>
          <td class="td-data text center">2026012</td>
          <td class="td-data">Anisa Rahmawati</td>
          <td class="td-data center">VII-B</td>
          <td class="td-data">Hendra Gunawan</td>
          <td class="td-data text">085712345678</td>
          <td class="td-data num">${defaultSpp}</td>
        </tr>
        <tr>
          <td class="td-data text center">2026013</td>
          <td class="td-data">Dimas Arya Saputra</td>
          <td class="td-data center">VIII-A</td>
          <td class="td-data">Suryanto</td>
          <td class="td-data text">087812345678</td>
          <td class="td-data num">${defaultSpp}</td>
        </tr>
        <tr>
          <td class="td-data text center">2026014</td>
          <td class="td-data">Zahra Putri Kirana</td>
          <td class="td-data center">IX-B</td>
          <td class="td-data">Wahyudi</td>
          <td class="td-data text">089612345678</td>
          <td class="td-data num">${defaultSpp}</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Template_Data_Siswa.xls');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

/** Parse HTML Table from .xls file */
function parseStudentHtmlTable(html: string, defaultSpp = 250000): ParseStudentResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('tr'));

  if (rows.length === 0) {
    return { valid: [], errors: ['Tabel Excel kosong atau tidak terbaca.'], totalRows: 0 };
  }

  let headerIdx = -1;
  let headerCols: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const cells = Array.from(rows[i].querySelectorAll('th, td')).map(c =>
      c.textContent?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || ''
    );
    if (cells.some(c => c === 'nis' || c.includes('induk')) && cells.some(c => c.includes('nama') || c.includes('kelas'))) {
      headerIdx = i;
      headerCols = cells;
      break;
    }
  }

  if (headerIdx === -1) {
    return { valid: [], errors: ['Kolom header (NIS, Nama Siswa, Kelas) tidak ditemukan pada tabel Excel.'], totalRows: 0 };
  }

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

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const cells = Array.from(rows[i].querySelectorAll('td, th')).map(c => c.textContent?.trim() || '');
    if (cells.length === 0 || cells.every(c => !c)) continue;

    const nis = cells[nisIdx]?.replace(/['"]/g, '').trim();
    const nama = cells[namaIdx]?.replace(/['"]/g, '').trim();
    const kelas = cells[kelasIdx]?.replace(/['"]/g, '').trim() || 'VII-A';
    const namaOrangTua = cells[ortuIdx]?.replace(/['"]/g, '').trim() || '-';
    let noHp = cells[hpIdx]?.replace(/['"]/g, '').trim() || '';

    noHp = noHp.replace(/[^\d+]/g, '');
    if (noHp.startsWith('+62')) noHp = '0' + noHp.slice(3);
    else if (noHp.startsWith('62')) noHp = '0' + noHp.slice(2);

    const rawSpp = cells[sppIdx]?.replace(/[^0-9]/g, '');
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

  return { valid, errors, totalRows: rows.length - (headerIdx + 1) };
}

/** Parse raw text (Excel HTML, CSV, or TSV) into validated Student objects */
export function parseStudentCsv(rawContent: string, defaultSpp = 250000): ParseStudentResult {
  const cleanContent = rawContent.replace(/^\uFEFF/, '').trim();

  // 1. Check if the file is an Excel HTML table (.xls)
  if (cleanContent.includes('<table') || cleanContent.includes('<tr')) {
    return parseStudentHtmlTable(cleanContent, defaultSpp);
  }

  // 2. Parse as CSV / TSV
  let rawLines = cleanContent.split(/\r\n|\r|\n/).filter(l => l.trim().length > 0);

  if (rawLines.length === 0) {
    return { valid: [], errors: ['File kosong.'], totalRows: 0 };
  }

  // If first line is sep=;, remove it
  if (rawLines[0].toLowerCase().startsWith('sep=')) {
    rawLines = rawLines.slice(1);
  }

  if (rawLines.length === 0) {
    return { valid: [], errors: ['File hanya berisi konfigurasi separator tanpa baris data.'], totalRows: 0 };
  }

  // Find header row (in case there's title rows before header)
  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(rawLines.length, 10); i++) {
    const lower = rawLines[i].toLowerCase();
    if (lower.includes('nis') && (lower.includes('nama') || lower.includes('kelas'))) {
      headerRowIdx = i;
      break;
    }
  }

  const delimiter = detectDelimiter(cleanContent);
  const headerCols = splitCsvLine(rawLines[headerRowIdx], delimiter).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

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

  for (let i = headerRowIdx + 1; i < rawLines.length; i++) {
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
    totalRows: rawLines.length - (headerRowIdx + 1)
  };
}


