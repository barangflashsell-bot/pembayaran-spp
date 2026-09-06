// ==========================================
// Billable Items Manager Component (Admin)
// ==========================================

import { createElement, showToast, showConfirm, showModal, closeModal } from '../utils/dom';
import { formatRupiah } from '../utils/formatter';
import { schoolService } from '../services/schoolService';
import type { BillableItemTemplate, BillableCategory } from '../types';

/** Render Pos Pembayaran Management page */
export function renderBillableManager(): HTMLElement {
  const container = createElement('div', { className: 'page-enter' });

  container.innerHTML = `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
      <div>
        <h1 class="page-title">🏷️ Kelola Pos Pembayaran Siswa</h1>
        <p class="page-description">
          Tambahkan, edit nama & nominal, atau hapus pos tagihan sekolah. Perubahan akan langsung tampil di Portal Siswa dan Kasir.
        </p>
      </div>
      <div style="display: flex; gap: var(--space-2);">
        <button class="btn btn-secondary" id="btn-reset-billable">
          🔄 Reset Default
        </button>
        <button class="btn btn-primary" id="btn-add-billable">
          ➕ Tambah Pos Pembayaran
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid-stats mb-6" id="billable-stats">
      <!-- Dynamic Stats -->
    </div>

    <!-- Table of Billable Items -->
    <div class="card">
      <div class="section-header">
        <h3 class="section-title">📋 Daftar Tagihan & Biaya Sekolah Aktif</h3>
        <span class="badge badge-primary" id="badge-total-pos">0 Pos Tagihan</span>
      </div>

      <div class="table-container">
        <table class="data-table" id="billable-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pembayaran</th>
              <th>Kategori</th>
              <th>Nominal Pembayaran</th>
              <th>Tipe Tagihan</th>
              <th>Deskripsi Keperluan</th>
              <th style="text-align: center;">Aksi</th>
            </tr>
          </thead>
          <tbody id="billable-tbody">
            <!-- Dynamic rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Elements
  const tbody = container.querySelector('#billable-tbody') as HTMLElement;
  const statsContainer = container.querySelector('#billable-stats') as HTMLElement;
  const badgeTotal = container.querySelector('#badge-total-pos') as HTMLElement;
  const btnAdd = container.querySelector('#btn-add-billable') as HTMLButtonElement;
  const btnReset = container.querySelector('#btn-reset-billable') as HTMLButtonElement;

  function loadTable() {
    const items = schoolService.getBillableItems();
    badgeTotal.textContent = `${items.length} Pos Tagihan`;

    // Render stats
    const totalEstimasi = items.reduce((sum, it) => sum + (it.isCustomNominal ? 0 : it.nominalDefault), 0);
    const customCount = items.filter((it) => it.isCustomNominal).length;

    statsContainer.innerHTML = `
      <div class="stat-card primary">
        <div class="stat-header">
          <span class="stat-label">Total Pos Tagihan</span>
          <div class="stat-icon primary">🏷️</div>
        </div>
        <div class="stat-value">${items.length}</div>
        <div class="stat-footer">Termasuk SPP & Pos Lainnya</div>
      </div>

      <div class="stat-card success">
        <div class="stat-header">
          <span class="stat-label">Total Nominal Standar</span>
          <div class="stat-icon success">💰</div>
        </div>
        <div class="stat-value" style="font-size: var(--font-size-xl);">${formatRupiah(totalEstimasi)}</div>
        <div class="stat-footer">Akumulasi seluruh pos paket</div>
      </div>

      <div class="stat-card info">
        <div class="stat-header">
          <span class="stat-label">Nominal Fleksibel</span>
          <div class="stat-icon info">✨</div>
        </div>
        <div class="stat-value">${customCount} Pos</div>
        <div class="stat-footer">Bebas diisi berapapun oleh siswa</div>
      </div>
    `;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: var(--space-8);">
            Belum ada pos pembayaran. Klik "Tambah Pos Pembayaran" di atas.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div style="font-weight: 600; color: var(--color-text-primary);">${item.nama}</div>
          ${item.isMonthly ? '<span class="badge badge-info text-xs mt-1" style="font-size: 9px;">Berulang Tiap Bulan</span>' : ''}
        </td>
        <td>
          <span class="badge badge-secondary" style="font-size: 11px;">${item.kategori.toUpperCase()}</span>
        </td>
        <td style="font-weight: bold; color: var(--color-success); font-size: var(--font-size-sm);">
          ${item.isCustomNominal ? '<span class="text-muted">Nominal Bebas (Custom)</span>' : formatRupiah(item.nominalDefault)}
        </td>
        <td>
          ${item.isCustomNominal 
            ? '<span class="badge badge-warning text-xs">✨ Sukarela / Bebas</span>' 
            : '<span class="badge badge-primary text-xs">🔒 Tetap / Paket</span>'
          }
        </td>
        <td style="font-size: var(--font-size-xs); color: var(--color-text-muted); max-width: 250px;">
          ${item.deskripsi || '-'}
        </td>
        <td>
          <div style="display: flex; gap: var(--space-2); justify-content: center;">
            <button class="btn btn-ghost btn-sm btn-edit-pos" data-id="${item.id}" title="Edit Nama & Nominal Pembayaran">
              ✏️ Edit
            </button>
            <button class="btn btn-ghost btn-sm btn-delete-pos text-danger" data-id="${item.id}" title="Hapus Pos Pembayaran">
              🗑️ Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Bind Edit Buttons
    tbody.querySelectorAll('.btn-edit-pos').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        const item = items.find((it) => it.id === id);
        if (item) openItemFormModal(item);
      });
    });

    // Bind Delete Buttons
    tbody.querySelectorAll('.btn-delete-pos').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id')!;
        const item = items.find((it) => it.id === id);
        if (!item) return;

        const confirmed = await showConfirm(
          `Yakin ingin menghapus pos pembayaran "${item.nama}"?\n\nItem ini tidak akan lagi muncul di Portal Siswa.`
        );

        if (confirmed) {
          schoolService.deleteBillableItem(id);
          showToast(`Pos pembayaran "${item.nama}" berhasil dihapus`, 'success');
          loadTable();
        }
      });
    });
  }

  // Event: Add New Item
  btnAdd.addEventListener('click', () => {
    openItemFormModal();
  });

  // Event: Reset Default
  btnReset.addEventListener('click', async () => {
    const confirmed = await showConfirm(
      'Kembalikan seluruh daftar pos tagihan ke pengaturan bawaan sekolah?'
    );
    if (confirmed) {
      schoolService.resetBillableItems();
      showToast('Daftar pos pembayaran berhasil di-reset ke default', 'info');
      loadTable();
    }
  });

  /** Open Modal for Add / Edit Billable Item */
  function openItemFormModal(editItem?: BillableItemTemplate) {
    const isEdit = !!editItem;
    const modalDiv = document.createElement('div');

    modalDiv.innerHTML = `
      <form id="form-billable-item">
        <div class="form-group">
          <label class="form-label">Nama Pembayaran *</label>
          <input type="text" class="form-input" id="item-nama" required placeholder="Contoh: Paket Seragam, Biaya Wisuda, Uang Kas" value="${editItem?.nama || ''}">
        </div>

        <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <div class="form-group">
            <label class="form-label">Kategori Tagihan *</label>
            <select class="form-select" id="item-kategori" required>
              <option value="spp" ${editItem?.kategori === 'spp' ? 'selected' : ''}>SPP Bulanan</option>
              <option value="seragam" ${editItem?.kategori === 'seragam' ? 'selected' : ''}>Seragam & Atribut</option>
              <option value="buku" ${editItem?.kategori === 'buku' ? 'selected' : ''}>Buku & Modul</option>
              <option value="gedung" ${editItem?.kategori === 'gedung' ? 'selected' : ''}>Uang Gedung / DSP</option>
              <option value="ujian" ${editItem?.kategori === 'ujian' ? 'selected' : ''}>Ujian / Asesmen</option>
              <option value="kegiatan" ${editItem?.kategori === 'kegiatan' ? 'selected' : ''}>Kegiatan Siswa</option>
              <option value="bebas" ${editItem?.kategori === 'bebas' ? 'selected' : ''}>Donasi / Sukarela / Bebas</option>
              <option value="lainnya" ${editItem?.kategori === 'lainnya' ? 'selected' : ''}>Lain-Lain</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Nominal Pembayaran (Rp) *</label>
            <input type="number" class="form-input" id="item-nominal" min="0" step="5000" required placeholder="250000" value="${editItem?.nominalDefault ?? 100000}">
          </div>
        </div>

        <div class="form-group">
          <label class="custom-checkbox-wrapper" style="margin-top: var(--space-2); margin-bottom: var(--space-2);">
            <input type="checkbox" id="item-custom-check" ${editItem?.isCustomNominal ? 'checked' : ''}>
            <span class="custom-checkbox-label text-sm">
              Izinkan siswa membayar <strong>nominal bebas / sukarela</strong> untuk pos ini
            </span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Keterangan / Deskripsi Keperluan</label>
          <textarea class="form-textarea" id="item-deskripsi" rows="2" placeholder="Jelaskan rincian peruntukan biaya ini (opsional)">${editItem?.deskripsi || ''}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-4); border-top: 1px solid var(--color-border); padding-top: var(--space-4);">
          <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Batal</button>
          <button type="submit" class="btn btn-success">
            💾 ${isEdit ? 'Simpan Perubahan' : 'Tambah Pos Tagihan'}
          </button>
        </div>
      </form>
    `;

    modalDiv.querySelector('#btn-cancel-modal')?.addEventListener('click', () => {
      closeModal();
    });

    modalDiv.querySelector('#form-billable-item')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = (modalDiv.querySelector('#item-nama') as HTMLInputElement).value.trim();
      const kategori = (modalDiv.querySelector('#item-kategori') as HTMLSelectElement).value as BillableCategory;
      const nominal = Number((modalDiv.querySelector('#item-nominal') as HTMLInputElement).value) || 0;
      const isCustomNominal = (modalDiv.querySelector('#item-custom-check') as HTMLInputElement).checked;
      const deskripsi = (modalDiv.querySelector('#item-deskripsi') as HTMLTextAreaElement).value.trim();

      if (!nama) {
        showToast('Nama pembayaran tidak boleh kosong', 'warning');
        return;
      }

      if (isEdit && editItem) {
        schoolService.updateBillableItem(editItem.id, {
          nama,
          kategori,
          nominalDefault: nominal,
          isCustomNominal,
          deskripsi,
        });
        showToast(`Pos pembayaran "${nama}" berhasil diperbarui!`, 'success');
      } else {
        schoolService.addBillableItem({
          nama,
          kategori,
          nominalDefault: nominal,
          isCustomNominal,
          deskripsi,
          isMonthly: kategori === 'spp',
        });
        showToast(`Pos pembayaran baru "${nama}" berhasil ditambahkan!`, 'success');
      }

      closeModal();
      loadTable();
    });

    showModal(isEdit ? 'Edit Pos Pembayaran' : 'Tambah Pos Pembayaran Baru', modalDiv);
  }

  // Initial load
  loadTable();

  return container;
}
