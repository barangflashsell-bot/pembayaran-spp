// ==========================================
// Payment History Component
// ==========================================

import { createElement, showToast, showConfirm, showModal } from '../utils/dom';
import { formatRupiah, formatDateShort, formatDate, getStatusLabel, getStatusBadgeClass, getMethodLabel } from '../utils/formatter';
import { spreadsheetService } from '../services/spreadsheet';
import { MONTHS, KELAS_LIST } from '../config/constants';
import { renderReceipt } from './receipt';
import type { Payment, HistoryFilter, MonthName, PaymentStatus, PaymentChannel } from '../types';

/** Render history page */
export function renderHistory(): HTMLElement {
  const page = createElement('div', { className: 'page-enter' });
  const currentYear = new Date().getFullYear();

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Riwayat Pembayaran</h1>
      <p class="page-description">Lihat dan kelola catatan pembayaran SPP & tagihan sekolah (Online & Kasir)</p>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="form-input" id="history-search" placeholder="Cari nama, NIS, atau ID transaksi...">
      </div>
      <div class="filter-group">
        <select class="form-select" id="history-channel">
          <option value="">Semua Channel</option>
          <option value="online">💳 Online (Siswa)</option>
          <option value="admin">🏢 Kasir Admin</option>
        </select>
        <select class="form-select" id="history-kelas">
          <option value="">Semua Kelas</option>
          ${KELAS_LIST.map((k) => `<option value="${k}">${k}</option>`).join('')}
        </select>
        <select class="form-select" id="history-bulan">
          <option value="">Semua Bulan</option>
          ${MONTHS.map((m) => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <select class="form-select" id="history-tahun">
          ${[currentYear - 1, currentYear, currentYear + 1].map((y) =>
            `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`
          ).join('')}
        </select>
      </div>
    </div>

    <div id="history-summary" class="mb-6" style="display: flex; gap: var(--space-4); flex-wrap: wrap;"></div>

    <div class="table-container">
      <table class="data-table" id="history-table">
        <thead>
          <tr>
            <th>ID Transaksi</th>
            <th>Tanggal</th>
            <th>Nama Siswa</th>
            <th>Kelas</th>
            <th>Rincian Item yang Dibayar</th>
            <th>Total Nominal</th>
            <th>Channel / Metode</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="history-tbody">
          <tr><td colspan="9" class="text-center text-muted" style="padding: var(--space-8);">Memuat data...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  // Bind filter events
  const searchInput = page.querySelector('#history-search') as HTMLInputElement;
  const filterChannel = page.querySelector('#history-channel') as HTMLSelectElement;
  const filterKelas = page.querySelector('#history-kelas') as HTMLSelectElement;
  const filterBulan = page.querySelector('#history-bulan') as HTMLSelectElement;
  const filterTahun = page.querySelector('#history-tahun') as HTMLSelectElement;

  const applyFilters = () => {
    const filter: HistoryFilter = {
      search: searchInput.value,
      channel: filterChannel.value as PaymentChannel | '',
      kelas: filterKelas.value,
      bulan: filterBulan.value as MonthName | '',
      tahun: Number(filterTahun.value),
      status: '' as PaymentStatus | '',
    };
    loadHistoryTable(page, filter);
  };

  searchInput.addEventListener('input', applyFilters);
  filterChannel.addEventListener('change', applyFilters);
  filterKelas.addEventListener('change', applyFilters);
  filterBulan.addEventListener('change', applyFilters);
  filterTahun.addEventListener('change', applyFilters);

  // Initial load
  applyFilters();

  return page;
}

/** Load and render history table */
async function loadHistoryTable(page: HTMLElement, filter: HistoryFilter): Promise<void> {
  const tbody = page.querySelector('#history-tbody') as HTMLElement;
  const summaryEl = page.querySelector('#history-summary') as HTMLElement;

  try {
    let payments = await spreadsheetService.getPayments();

    // Apply filters
    if (filter.search) {
      const q = filter.search.toLowerCase();
      payments = payments.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.nis.includes(q) ||
          p.idTransaksi.toLowerCase().includes(q) ||
          (p.rincianItemText && p.rincianItemText.toLowerCase().includes(q))
      );
    }
    if (filter.channel) {
      payments = payments.filter((p) => (p.channel || 'admin') === filter.channel);
    }
    if (filter.kelas) {
      payments = payments.filter((p) => p.kelas === filter.kelas);
    }
    if (filter.bulan) {
      payments = payments.filter((p) => p.bulan === filter.bulan);
    }
    if (filter.tahun) {
      payments = payments.filter((p) => p.tahun === filter.tahun);
    }
    if (filter.status) {
      payments = payments.filter((p) => p.status === filter.status);
    }

    // Sort by date descending
    payments.sort((a, b) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime());

    // Summary
    const totalNominal = payments.reduce((sum, p) => sum + p.nominal, 0);
    const onlineCount = payments.filter((p) => p.channel === 'online').length;
    const onlineNominal = payments.filter((p) => p.channel === 'online').reduce((sum, p) => sum + p.nominal, 0);

    summaryEl.innerHTML = `
      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5); font-size: var(--font-size-sm);">
        <span style="color: var(--color-text-muted);">Total Transaksi:</span>
        <span style="font-weight: var(--font-weight-bold); margin-left: var(--space-2);">${payments.length}</span>
      </div>
      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5); font-size: var(--font-size-sm);">
        <span style="color: var(--color-text-muted);">Total Pemasukan:</span>
        <span style="font-weight: var(--font-weight-bold); color: var(--color-success); margin-left: var(--space-2);">${formatRupiah(totalNominal)}</span>
      </div>
      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5); font-size: var(--font-size-sm);">
        <span style="color: var(--color-text-muted);">Transaksi Online:</span>
        <span style="font-weight: var(--font-weight-bold); color: var(--color-primary-light); margin-left: var(--space-2);">${onlineCount} (${formatRupiah(onlineNominal)})</span>
      </div>
    `;

    // Table
    if (payments.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Tidak Ada Data</div>
              <div class="empty-state-text">Belum ada riwayat pembayaran yang cocok dengan filter.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = payments.map((p) => {
      const isOnline = p.channel === 'online';
      const itemsCount = p.items ? p.items.length : 1;
      const rincianPreview = p.rincianItemText 
        ? (p.rincianItemText.length > 35 ? p.rincianItemText.substring(0, 35) + '...' : p.rincianItemText)
        : `SPP ${p.bulan} ${p.tahun}`;

      return `
        <tr>
          <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${p.idTransaksi}</code></td>
          <td>${formatDateShort(p.tanggalBayar)}</td>
          <td style="font-weight: var(--font-weight-semibold);">${p.nama}</td>
          <td><span class="badge badge-info">${p.kelas}</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="font-size: var(--font-size-xs); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.rincianItemText || ''}">
                ${rincianPreview}
              </span>
              <button class="btn btn-ghost btn-sm btn-view-items" data-id="${p.idTransaksi}" title="Lihat Apa Saja yang Dibayar" style="padding: 2px 6px; font-size: 11px;">
                🔍 ${itemsCount > 1 ? `${itemsCount} item` : 'Detail'}
              </button>
            </div>
          </td>
          <td style="font-weight: var(--font-weight-semibold); color: var(--color-success);">${formatRupiah(p.nominal)}</td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              ${isOnline ? '<span class="badge badge-primary text-xs" style="width: fit-content;">💳 ONLINE</span>' : '<span class="badge badge-secondary text-xs" style="width: fit-content;">🏢 KASIR</span>'}
              <span style="font-size: 11px; color: var(--color-text-muted);">${getMethodLabel(p.metodeBayar)}</span>
            </div>
          </td>
          <td><span class="badge ${getStatusBadgeClass(p.status)}"><span class="badge-dot"></span> ${getStatusLabel(p.status)}</span></td>
          <td>
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn btn-ghost btn-sm btn-print" data-id="${p.idTransaksi}" title="Cetak Kwitansi">🖨️</button>
              <button class="btn btn-ghost btn-sm btn-delete-payment" data-id="${p.idTransaksi}" title="Hapus">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind action buttons
    bindHistoryActions(page, payments, filter);
  } catch (error) {
    console.error('Error loading history:', error);
    tbody.innerHTML = `
      <tr><td colspan="9" class="text-center text-danger" style="padding: var(--space-8);">Error memuat riwayat</td></tr>
    `;
  }
}

/** Bind print, detail, and delete actions */
function bindHistoryActions(page: HTMLElement, payments: Payment[], filter: HistoryFilter): void {
  // Detail "Dia Bayar Apa Saja" button
  page.querySelectorAll('.btn-view-items').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id')!;
      const payment = payments.find((p) => p.idTransaksi === id);
      if (payment) {
        showItemizedDetailModal(payment);
      }
    });
  });

  // Print buttons
  page.querySelectorAll('.btn-print').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id')!;
      const payment = payments.find((p) => p.idTransaksi === id);
      if (payment) {
        renderReceipt(payment);
      }
    });
  });

  // Delete buttons
  page.querySelectorAll('.btn-delete-payment').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id')!;
      const payment = payments.find((p) => p.idTransaksi === id);
      if (!payment) return;

      const confirmed = await showConfirm(
        `Yakin ingin menghapus pembayaran ${payment.nama}?\n\nID: ${payment.idTransaksi}\nNominal: ${formatRupiah(payment.nominal)}`
      );

      if (confirmed) {
        const success = await spreadsheetService.deletePayment(id);
        if (success) {
          showToast('Pembayaran berhasil dihapus', 'success');
          loadHistoryTable(page, filter);
        } else {
          showToast('Gagal menghapus pembayaran', 'error');
        }
      }
    });
  });
}

/** Show Modal of what student paid for (Itemized Breakdown) */
function showItemizedDetailModal(payment: Payment): void {
  const container = document.createElement('div');
  const isOnline = payment.channel === 'online';
  const hasItems = payment.items && payment.items.length > 0;

  container.innerHTML = `
    <div style="margin-bottom: var(--space-4);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
        <div>
          <div style="font-size: var(--font-size-lg); font-weight: bold;">${payment.nama}</div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
            NIS: ${payment.nis} • Kelas: ${payment.kelas}
          </div>
        </div>
        <div>
          ${isOnline ? '<span class="badge badge-primary">💳 PEMBAYARAN ONLINE</span>' : '<span class="badge badge-secondary">🏢 KASIR SEKOLAH</span>'}
        </div>
      </div>

      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-4); font-size: var(--font-size-sm);">
        <div><strong>ID Transaksi:</strong> <code>${payment.idTransaksi}</code></div>
        <div><strong>Tanggal Bayar:</strong> ${formatDate(payment.tanggalBayar)}</div>
        <div><strong>Metode:</strong> ${getMethodLabel(payment.metodeBayar)}</div>
        ${payment.keterangan ? `<div><strong>Catatan:</strong> ${payment.keterangan}</div>` : ''}
      </div>

      <div style="font-weight: 600; margin-bottom: var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-primary);">
        📋 Rincian Pos Tagihan yang Dibayar:
      </div>

      <div class="table-container" style="margin-bottom: var(--space-4);">
        <table class="data-table" style="font-size: var(--font-size-sm);">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Item Tagihan</th>
              <th>Kategori</th>
              <th style="text-align: right;">Nominal</th>
            </tr>
          </thead>
          <tbody>
            ${hasItems ? payment.items!.map((it, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td style="font-weight: 500;">${it.nama}</td>
                <td><span class="badge badge-secondary text-xs">${it.kategori.toUpperCase()}</span></td>
                <td style="text-align: right; font-weight: 600;">${formatRupiah(it.nominal)}</td>
              </tr>
            `).join('') : `
              <tr>
                <td>1</td>
                <td style="font-weight: 500;">${payment.rincianItemText || `SPP ${payment.bulan} ${payment.tahun}`}</td>
                <td><span class="badge badge-secondary text-xs">SPP</span></td>
                <td style="text-align: right; font-weight: 600;">${formatRupiah(payment.nominal)}</td>
              </tr>
            `}
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid var(--color-border); font-weight: bold; background: var(--color-bg-glass);">
              <td colspan="3">TOTAL KESELURUHAN DIBAYAR:</td>
              <td style="text-align: right; color: var(--color-success); font-size: var(--font-size-base);">${formatRupiah(payment.nominal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: var(--space-2);">
        <button class="btn btn-primary" id="modal-print-btn">🖨️ Cetak Kwitansi</button>
      </div>
    </div>
  `;

  showModal(`Rincian Pembayaran — ${payment.idTransaksi}`, container);

  container.querySelector('#modal-print-btn')?.addEventListener('click', () => {
    renderReceipt(payment);
  });
}
