// ==========================================
// Students Management Component
// ==========================================

import { createElement, showToast, showModal, closeModal, showConfirm } from '../utils/dom';
import { formatRupiah } from '../utils/formatter';
import { spreadsheetService } from '../services/spreadsheet';
import { APP_CONFIG, KELAS_LIST } from '../config/constants';
import type { Student } from '../types';

/** Render students page */
export function renderStudents(): HTMLElement {
  const page = createElement('div', { className: 'page-enter' });

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Data Siswa</h1>
      <p class="page-description">Kelola data siswa yang terdaftar</p>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="form-input" id="student-search" placeholder="Cari nama atau NIS...">
      </div>
      <div class="filter-group">
        <select class="form-select" id="student-filter-kelas">
          <option value="">Semua Kelas</option>
          ${KELAS_LIST.map((k) => `<option value="${k}">${k}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary" id="btn-add-student">
        <span>＋</span> Tambah Siswa
      </button>
    </div>

    <div class="table-container">
      <table class="data-table" id="students-table">
        <thead>
          <tr>
            <th>NIS</th>
            <th>Nama Siswa</th>
            <th>Kelas</th>
            <th>Orang Tua</th>
            <th>No. HP</th>
            <th>Nominal SPP</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="students-tbody">
          <tr><td colspan="7" class="text-center text-muted" style="padding: var(--space-8);">Memuat data...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  // Bind events
  const searchInput = page.querySelector('#student-search') as HTMLInputElement;
  const filterKelas = page.querySelector('#student-filter-kelas') as HTMLSelectElement;
  const addBtn = page.querySelector('#btn-add-student') as HTMLButtonElement;

  searchInput.addEventListener('input', () => loadStudentTable(page, searchInput.value, filterKelas.value));
  filterKelas.addEventListener('change', () => loadStudentTable(page, searchInput.value, filterKelas.value));
  addBtn.addEventListener('click', () => openStudentForm(page));

  // Initial load
  loadStudentTable(page);

  return page;
}

/** Load and render student table */
async function loadStudentTable(page: HTMLElement, search: string = '', kelas: string = ''): Promise<void> {
  const tbody = page.querySelector('#students-tbody');
  if (!tbody) return;

  try {
    let students = await spreadsheetService.getStudents();

    // Filter
    if (search) {
      const q = search.toLowerCase();
      students = students.filter(
        (s) => s.nama.toLowerCase().includes(q) || s.nis.includes(q)
      );
    }
    if (kelas) {
      students = students.filter((s) => s.kelas === kelas);
    }

    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-state-icon">👨‍🎓</div>
              <div class="empty-state-title">Belum Ada Siswa</div>
              <div class="empty-state-text">Klik "Tambah Siswa" untuk menambahkan data siswa baru.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = students.map((s) => `
      <tr>
        <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${s.nis}</code></td>
        <td style="font-weight: var(--font-weight-semibold);">${s.nama}</td>
        <td><span class="badge badge-info">${s.kelas}</span></td>
        <td>${s.namaOrangTua}</td>
        <td>${s.noHp}</td>
        <td style="font-weight: var(--font-weight-semibold);">${formatRupiah(s.nominalSpp)}</td>
        <td>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-ghost btn-sm btn-edit-student" data-nis="${s.nis}" title="Edit">✏️</button>
            <button class="btn btn-ghost btn-sm btn-delete-student" data-nis="${s.nis}" title="Hapus">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Bind row action buttons
    tbody.querySelectorAll('.btn-edit-student').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nis = btn.getAttribute('data-nis')!;
        const student = students.find((s) => s.nis === nis);
        if (student) openStudentForm(page, student);
      });
    });

    tbody.querySelectorAll('.btn-delete-student').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const nis = btn.getAttribute('data-nis')!;
        const student = students.find((s) => s.nis === nis);
        if (!student) return;

        const confirmed = await showConfirm(`Yakin ingin menghapus data siswa "${student.nama}" (${student.nis})?`);
        if (confirmed) {
          const success = await spreadsheetService.deleteStudent(nis);
          if (success) {
            showToast(`Data siswa ${student.nama} berhasil dihapus`, 'success');
            loadStudentTable(page);
          } else {
            showToast('Gagal menghapus data siswa', 'error');
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading students:', error);
    tbody.innerHTML = `
      <tr><td colspan="7" class="text-center text-danger" style="padding: var(--space-8);">Error memuat data siswa</td></tr>
    `;
  }
}

/** Open student form (add/edit) */
function openStudentForm(page: HTMLElement, student?: Student): void {
  const isEdit = !!student;
  const title = isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru';

  const formEl = createElement('div', {
    innerHTML: `
      <form id="student-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">NIS *</label>
            <input type="text" class="form-input" id="form-nis" value="${student?.nis ?? ''}" 
              placeholder="Nomor Induk Siswa" ${isEdit ? 'readonly style="opacity: 0.6;"' : ''} required>
          </div>
          <div class="form-group">
            <label class="form-label">Kelas *</label>
            <select class="form-select" id="form-kelas" required>
              <option value="">Pilih Kelas</option>
              ${KELAS_LIST.map((k) => `<option value="${k}" ${student?.kelas === k ? 'selected' : ''}>${k}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nama Lengkap *</label>
          <input type="text" class="form-input" id="form-nama" value="${student?.nama ?? ''}" 
            placeholder="Nama lengkap siswa" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nama Orang Tua *</label>
            <input type="text" class="form-input" id="form-ortu" value="${student?.namaOrangTua ?? ''}" 
              placeholder="Nama orang tua/wali" required>
          </div>
          <div class="form-group">
            <label class="form-label">No. HP</label>
            <input type="tel" class="form-input" id="form-hp" value="${student?.noHp ?? ''}" 
              placeholder="08xxxxxxxxxx">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nominal SPP per Bulan</label>
          <input type="number" class="form-input" id="form-nominal" 
            value="${student?.nominalSpp ?? APP_CONFIG.nominalSppDefault}" 
            placeholder="250000" min="0">
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="form-cancel">Batal</button>
          <button type="submit" class="btn btn-primary">${isEdit ? '💾 Simpan Perubahan' : '＋ Tambah Siswa'}</button>
        </div>
      </form>
    `,
  });

  showModal(title, formEl);

  // Cancel button
  formEl.querySelector('#form-cancel')?.addEventListener('click', closeModal);

  // Submit handler
  const form = formEl.querySelector('#student-form') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data: Student = {
      nis: (formEl.querySelector('#form-nis') as HTMLInputElement).value.trim(),
      nama: (formEl.querySelector('#form-nama') as HTMLInputElement).value.trim(),
      kelas: (formEl.querySelector('#form-kelas') as HTMLSelectElement).value,
      namaOrangTua: (formEl.querySelector('#form-ortu') as HTMLInputElement).value.trim(),
      noHp: (formEl.querySelector('#form-hp') as HTMLInputElement).value.trim(),
      nominalSpp: Number((formEl.querySelector('#form-nominal') as HTMLInputElement).value) || APP_CONFIG.nominalSppDefault,
    };

    if (!data.nis || !data.nama || !data.kelas || !data.namaOrangTua) {
      showToast('Mohon lengkapi semua field yang wajib (*)', 'warning');
      return;
    }

    let success: boolean;
    if (isEdit) {
      success = await spreadsheetService.updateStudent(data.nis, data);
    } else {
      success = await spreadsheetService.addStudent(data);
    }

    if (success) {
      showToast(
        isEdit ? `Data ${data.nama} berhasil diperbarui` : `Siswa ${data.nama} berhasil ditambahkan`,
        'success'
      );
      closeModal();
      loadStudentTable(page);
    } else {
      showToast(
        isEdit ? 'Gagal memperbarui data' : 'NIS sudah terdaftar atau gagal menyimpan',
        'error'
      );
    }
  });
}
