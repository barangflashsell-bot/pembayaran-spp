// ==========================================
// Google Apps Script — Backend API untuk SPP
// ==========================================
// Copy seluruh kode ini ke Google Apps Script Editor
// (Extensions > Apps Script di Google Spreadsheet Anda)

// ID Spreadsheet (otomatis didapat dari spreadsheet yang terkait)
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
const SHEET_SISWA = SPREADSHEET.getSheetByName('Siswa');
const SHEET_PEMBAYARAN = SPREADSHEET.getSheetByName('Pembayaran');

// ==========================================
// HTTP Handlers
// ==========================================

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getStudents':
        result = getStudents();
        break;
      case 'getPayments':
        result = getPayments();
        break;
      case 'getStudentPayments':
        result = getStudentPayments(e.parameter.nis, Number(e.parameter.tahun) || null);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { success: false, error: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'addStudent':
        result = addStudent(data.student);
        break;
      case 'updateStudent':
        result = updateStudent(data.nis, data.student);
        break;
      case 'deleteStudent':
        result = deleteStudent(data.nis);
        break;
      case 'addPayment':
        result = addPayment(data.payment);
        break;
      case 'deletePayment':
        result = deletePayment(data.idTransaksi);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { success: false, error: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// Student Functions
// ==========================================

function getStudents() {
  const data = SHEET_SISWA.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };

  const students = data.slice(1).map(function(row) {
    return {
      nis: String(row[0]),
      nama: row[1],
      kelas: row[2],
      namaOrangTua: row[3],
      noHp: String(row[4]),
      nominalSpp: Number(row[5])
    };
  });

  return { success: true, data: students };
}

function addStudent(student) {
  // Check duplicate NIS
  const existing = findStudentRow(student.nis);
  if (existing > 0) {
    return { success: false, error: 'NIS sudah terdaftar' };
  }

  SHEET_SISWA.appendRow([
    student.nis,
    student.nama,
    student.kelas,
    student.namaOrangTua,
    student.noHp,
    student.nominalSpp
  ]);

  return { success: true, message: 'Siswa berhasil ditambahkan' };
}

function updateStudent(nis, studentData) {
  const rowIndex = findStudentRow(nis);
  if (rowIndex <= 0) {
    return { success: false, error: 'Siswa tidak ditemukan' };
  }

  const row = rowIndex + 1; // +1 for header
  if (studentData.nama) SHEET_SISWA.getRange(row, 2).setValue(studentData.nama);
  if (studentData.kelas) SHEET_SISWA.getRange(row, 3).setValue(studentData.kelas);
  if (studentData.namaOrangTua) SHEET_SISWA.getRange(row, 4).setValue(studentData.namaOrangTua);
  if (studentData.noHp !== undefined) SHEET_SISWA.getRange(row, 5).setValue(studentData.noHp);
  if (studentData.nominalSpp) SHEET_SISWA.getRange(row, 6).setValue(studentData.nominalSpp);

  return { success: true, message: 'Data siswa berhasil diperbarui' };
}

function deleteStudent(nis) {
  const rowIndex = findStudentRow(nis);
  if (rowIndex <= 0) {
    return { success: false, error: 'Siswa tidak ditemukan' };
  }

  SHEET_SISWA.deleteRow(rowIndex + 1);
  return { success: true, message: 'Siswa berhasil dihapus' };
}

function findStudentRow(nis) {
  const data = SHEET_SISWA.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(nis)) return i;
  }
  return -1;
}

// ==========================================
// Payment Functions
// ==========================================

function getPayments() {
  const data = SHEET_PEMBAYARAN.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };

  const payments = data.slice(1).map(function(row) {
    let items = undefined;
    if (row[13]) {
      try {
        items = JSON.parse(row[13]);
      } catch (e) {
        items = undefined;
      }
    }

    return {
      idTransaksi: row[0],
      nis: String(row[1]),
      nama: row[2],
      kelas: row[3],
      bulan: row[4],
      tahun: Number(row[5]),
      nominal: Number(row[6]),
      tanggalBayar: row[7] instanceof Date ? row[7].toISOString().split('T')[0] : String(row[7]),
      metodeBayar: row[8],
      status: row[9],
      keterangan: row[10] || '',
      channel: row[11] || 'admin',
      rincianItemText: row[12] || '',
      items: items
    };
  });

  return { success: true, data: payments };
}

function addPayment(payment) {
  // Check duplicate only for single SPP payment
  if (!payment.items || payment.items.length <= 1) {
    const data = SHEET_PEMBAYARAN.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]) === String(payment.nis) &&
          data[i][4] === payment.bulan &&
          Number(data[i][5]) === Number(payment.tahun) &&
          data[i][9] === 'lunas') {
        return { success: false, error: 'Sudah dibayar untuk bulan tersebut' };
      }
    }
  }

  const itemsJson = payment.items ? JSON.stringify(payment.items) : '';

  SHEET_PEMBAYARAN.appendRow([
    payment.idTransaksi,
    payment.nis,
    payment.nama,
    payment.kelas,
    payment.bulan,
    payment.tahun,
    payment.nominal,
    payment.tanggalBayar,
    payment.metodeBayar,
    payment.status,
    payment.keterangan || '',
    payment.channel || 'admin',
    payment.rincianItemText || '',
    itemsJson
  ]);

  return { success: true, message: 'Pembayaran berhasil dicatat' };
}

function getStudentPayments(nis, tahun) {
  const result = getPayments();
  if (!result.success) return result;

  var filtered = result.data.filter(function(p) {
    return p.nis === nis && (!tahun || p.tahun === tahun);
  });

  return { success: true, data: filtered };
}

function deletePayment(idTransaksi) {
  const data = SHEET_PEMBAYARAN.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === idTransaksi) {
      SHEET_PEMBAYARAN.deleteRow(i + 1);
      return { success: true, message: 'Pembayaran berhasil dihapus' };
    }
  }
  return { success: false, error: 'Transaksi tidak ditemukan' };
}

// ==========================================
// Setup — Run once to create sheet headers
// ==========================================

function setupSheets() {
  // Create Siswa sheet if not exists
  var siswa = SPREADSHEET.getSheetByName('Siswa');
  if (!siswa) {
    siswa = SPREADSHEET.insertSheet('Siswa');
  }
  siswa.getRange(1, 1, 1, 6).setValues([['NIS', 'Nama', 'Kelas', 'Nama Orang Tua', 'No HP', 'Nominal SPP']]);
  siswa.getRange(1, 1, 1, 6).setFontWeight('bold');
  siswa.setFrozenRows(1);

  // Create Pembayaran sheet if not exists
  var pembayaran = SPREADSHEET.getSheetByName('Pembayaran');
  if (!pembayaran) {
    pembayaran = SPREADSHEET.insertSheet('Pembayaran');
  }
  pembayaran.getRange(1, 1, 1, 14).setValues([['ID Transaksi', 'NIS', 'Nama', 'Kelas', 'Bulan', 'Tahun', 'Nominal', 'Tanggal Bayar', 'Metode Bayar', 'Status', 'Keterangan', 'Channel', 'Rincian Item', 'Items JSON']]);
  pembayaran.getRange(1, 1, 1, 14).setFontWeight('bold');
  pembayaran.setFrozenRows(1);

  SpreadsheetApp.getUi().alert('Setup selesai! Sheet Siswa dan Pembayaran berhasil dibuat dengan kolom Rincian Item.');
}
