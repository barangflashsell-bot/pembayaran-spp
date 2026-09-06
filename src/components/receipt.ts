// ==========================================
// Receipt Component — Print Kwitansi Resmi Sekolah
// ==========================================

import { showModal } from '../utils/dom';
import { formatRupiah, formatDate, getMethodLabel } from '../utils/formatter';
import { schoolService } from '../services/schoolService';
import type { Payment } from '../types';
import { spreadsheetService } from '../services/spreadsheet';
import { buildReceiptWhatsAppMessage, openWhatsAppChat } from '../utils/whatsapp';

/** Render and show receipt modal, then print */
export function renderReceipt(payment: Payment): void {
  const receiptHTML = buildReceiptHTML(payment);

  const container = document.createElement('div');
  container.innerHTML = `
    <div style="margin-bottom: var(--space-4);">
      ${receiptHTML}
    </div>
    <div style="display: flex; gap: var(--space-3); justify-content: center; padding-top: var(--space-4); border-top: 1px solid var(--color-border); flex-wrap: wrap;">
      <button class="btn btn-primary btn-print-action btn-lg" id="btn-print-receipt">🖨️ Cetak Kuitansi Resmi</button>
      <button class="btn btn-secondary btn-lg" id="btn-wa-receipt" style="background: #25d366; color: white; border: none; font-weight: 600;">
        📲 Kirim via WhatsApp
      </button>
    </div>
  `;

  showModal('Preview Kuitansi Pembayaran', container);

  // Print handler
  container.querySelector('#btn-print-receipt')?.addEventListener('click', () => {
    printReceipt(payment);
  });

  // WhatsApp handler
  container.querySelector('#btn-wa-receipt')?.addEventListener('click', async () => {
    try {
      const students = await spreadsheetService.getStudents();
      const student = students.find((s) => s.nis === payment.nis);
      const msg = buildReceiptWhatsAppMessage(payment, student);
      const phone = student?.noHp || '';
      openWhatsAppChat(phone, msg);
    } catch (err) {
      console.error(err);
      const msg = buildReceiptWhatsAppMessage(payment);
      openWhatsAppChat('', msg);
    }
  });
}

/** Build receipt HTML with dynamic school identity */
export function buildReceiptHTML(payment: Payment): string {
  const school = schoolService.getSchoolInfo();
  const hasItems = payment.items && payment.items.length > 0;
  const channelLabel = payment.channel === 'online' ? 'Online (Portal Siswa)' : 'Kasir Administrasi Sekolah';

  return `
    <div class="receipt" id="receipt-content">
      <!-- Kop Surat Sekolah Resmi -->
      <div class="receipt-header">
        <div class="receipt-school" style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
          ${school.namaSekolah}
        </div>
        <div class="receipt-address" style="font-size: 11px; color: #555; margin-top: 2px;">
          ${school.alamatSekolah}
        </div>
        <div style="font-size: 10px; color: #777; margin-top: 2px;">
          Telp: ${school.noTelepon || '-'} • Email: ${school.email || '-'}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #444; margin-top: 2px;">
          Tahun Ajaran ${school.tahunAjaran}
        </div>

        <div style="border-bottom: 2px double #333; margin: 8px 0;"></div>
        <div class="receipt-title" style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #111;">
          KUITANSI PEMBAYARAN RESMI
        </div>
        <div style="font-size: 10px; color: #666; margin-top: 2px;">
          Channel: <strong>${channelLabel}</strong>
        </div>
      </div>

      <!-- Data Transaksi & Siswa -->
      <div class="receipt-body">
        <div class="receipt-row">
          <span class="receipt-label">No. Kuitansi</span>
          <span class="receipt-value"><strong>${payment.idTransaksi}</strong></span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Tanggal Pembayaran</span>
          <span class="receipt-value">${formatDate(payment.tanggalBayar)}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Nama Siswa</span>
          <span class="receipt-value" style="font-size: 14px;"><strong>${payment.nama}</strong></span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Nomor Induk Siswa (NIS)</span>
          <span class="receipt-value">${payment.nis}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Kelas</span>
          <span class="receipt-value">${payment.kelas}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Metode Pembayaran</span>
          <span class="receipt-value">${getMethodLabel(payment.metodeBayar)}</span>
        </div>

        <!-- Rincian Item yang Dibayar -->
        <div class="receipt-items-section" style="margin-top: 10px; border-top: 1px dashed #bbb; padding-top: 8px;">
          <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; margin-bottom: 6px; color: #222;">
            Rincian Pos Pembayaran:
          </div>
          ${hasItems
            ? `
            <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 8px;">
              <thead>
                <tr style="border-bottom: 1px solid #ccc; text-align: left; color: #555; font-size: 11px;">
                  <th style="padding: 4px 0;">Uraian Pos Tagihan</th>
                  <th style="padding: 4px 0; text-align: right;">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody>
                ${payment.items!
                  .map(
                    (it) => `
                  <tr style="border-bottom: 1px dotted #eee;">
                    <td style="padding: 5px 0;">${it.nama}</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: 600;">${formatRupiah(it.nominal)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            `
            : `
            <div class="receipt-row">
              <span class="receipt-label">Uraian</span>
              <span class="receipt-value">${payment.rincianItemText || `SPP ${payment.bulan} ${payment.tahun}`}</span>
            </div>
            `
          }
        </div>

        ${payment.keterangan ? `
        <div class="receipt-row" style="margin-top: 4px;">
          <span class="receipt-label">Catatan Tambahan</span>
          <span class="receipt-value">${payment.keterangan}</span>
        </div>
        ` : ''}

        <div class="receipt-row receipt-total" style="border-top: 2px solid #111; margin-top: 10px; padding-top: 8px;">
          <span style="font-weight: 800; font-size: 13px;">TOTAL DIBAYAR</span>
          <span style="font-weight: 800; font-size: 15px; color: #000;">${formatRupiah(payment.nominal)}</span>
        </div>
        <div style="text-align: right; font-size: 10px; color: #15803d; font-weight: bold; margin-top: 3px;">
          STATUS: LUNAS / SAH
        </div>

        <!-- Kolom Tanda Tangan Resmi Atas Nama Sekolah -->
        <div style="display: flex; justify-content: space-between; margin-top: 25px; padding-top: 10px; font-size: 11px; text-align: center;">
          <div style="width: 140px;">
            <div>Mengetahui,</div>
            <div style="font-weight: 600;">Kepala Sekolah</div>
            <div style="margin-top: 42px; font-weight: 700; text-decoration: underline;">
              ${school.namaKepalaSekolah}
            </div>
            <div style="font-size: 10px; color: #666;">NIP. ${school.nipKepalaSekolah}</div>
          </div>

          <div style="width: 150px;">
            <div>Dicetak Pada: ${formatDate(payment.tanggalBayar)}</div>
            <div style="font-weight: 600;">Bendahara / Kasir Sekolah</div>
            <div style="margin-top: 42px; font-weight: 700; text-decoration: underline;">
              ${school.namaBendahara}
            </div>
            <div style="font-size: 10px; color: #666;">Petugas Administrasi Keuangan</div>
          </div>
        </div>
      </div>

      <div class="receipt-footer" style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 8px; font-size: 10px; text-align: center; color: #777;">
        <p>${school.catatanKuitansi || 'Kuitansi ini adalah bukti pembayaran yang sah dan tercatat di sistem sekolah.'}</p>
        <p style="margin-top: 4px; font-weight: 600;">~ ${school.namaSekolah} ~</p>
      </div>
    </div>
  `;
}

/** Print receipt in a new window */
export function printReceipt(payment: Payment): void {
  const school = schoolService.getSchoolInfo();
  const printWindow = window.open('', '_blank', 'width=500,height=750');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kuitansi ${payment.idTransaksi} - ${school.namaSekolah}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          padding: 24px;
          background: white;
          color: #1a1a1a;
        }

        .receipt {
          max-width: 440px;
          margin: 0 auto;
        }

        .receipt-header {
          text-align: center;
          padding-bottom: 8px;
        }

        .receipt-body { font-size: 12px; }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dotted #e5e5e5;
        }

        .receipt-row:last-child { border-bottom: none; }
        .receipt-label { color: #555; }
        .receipt-value { font-weight: 600; text-align: right; }

        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${buildReceiptHTML(payment)}
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
