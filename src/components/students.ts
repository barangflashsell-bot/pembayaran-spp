// ==========================================
// Students Management Component
// ==========================================

import { createElement, showToast, showModal, closeModal, showConfirm } from '../utils/dom';
import { formatRupiah } from '../utils/formatter';
import { spreadsheetService } from '../services/spreadsheet';
import { APP_CONFIG, MONTHS } from '../config/constants';
import { exportStudentsToExcel, downloadStudentTemplateExcel, downloadStudentTemplateCsv, parseStudentFile } from '../utils/export';
import { schoolService } from '../services/schoolService';
import { buildSppReminderWhatsAppMessage, openWhatsAppChat } from '../utils/whatsapp';
import type { Student, Payment, MonthName } from '../types';

let currentDisplayedStudents: Student[] = [];
const selectedNisSet = new Set<string>();

/** Update bulk selection bar and check-all state */
function updateBulkBar(page: HTMLElement): void {
  const bulkBar = page.querySelector('#bulk-action-bar') as HTMLElement | null;
  const countLabel = page.querySelector('#bulk-selected-count') as HTMLElement | null;
  const checkAll = page.querySelector('#check-all-students') as HTMLInputElement | null;
  const btnToggle = page.querySelector('#btn-toggle-mark-all') as HTMLElement | null;

  if (!bulkBar || !countLabel) return;

  const count = selectedNisSet.size;
  if (count > 0) {
    bulkBar.style.display = 'flex';
    countLabel.textContent = `${count} Siswa Ditandai`;
    if (btnToggle) btnToggle.innerHTML = `<span>☑️</span> Ditandai (${count})`;
  } else {
    bulkBar.style.display = 'none';
    if (btnToggle) btnToggle.innerHTML = `<span>☑️</span> Tandai Siswa`;
  }

  if (checkAll) {
    if (currentDisplayedStudents.length > 0) {
      const allChecked = currentDisplayedStudents.every((s) => selectedNisSet.has(s.nis));
      const someChecked = currentDisplayedStudents.some((s) => selectedNisSet.has(s.nis));
      checkAll.checked = allChecked;
      checkAll.indeterminate = !allChecked && someChecked;
    } else {
      checkAll.checked = false;
      checkAll.indeterminate = false;
    }
  }
}

/** Render students page */
export function renderStudents(): HTMLElement {
  const page = createElement('div', { className: 'page-enter' });

  page.innerHTML = `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
      <div>
        <h1 class="page-title">Data Siswa</h1>
        <p class="page-description">Kelola data siswa yang terdaftar & status kontak wali murid</p>
      </div>
      <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
        <button class="btn btn-secondary" id="btn-naik-kelas" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
          <span>🎓</span> Naik Kelas
        </button>
        <button class="btn btn-secondary" id="btn-toggle-mark-all" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
          <span>☑️</span> Tandai Siswa
        </button>
        <button class="btn btn-secondary" id="btn-import-students" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
          <span>📥</span> Import Excel / CSV
        </button>
        <button class="btn btn-secondary" id="btn-export-students" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
          <span>📊</span> Export Excel / CSV
        </button>
      </div>
    </div>

    <!-- Bulk Action Bar for Marked Students -->
    <div id="bulk-action-bar" style="display: none; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-md); padding: 12px 18px; margin-bottom: var(--space-4); animation: fadeIn 0.2s ease;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">☑️</span>
        <div>
          <span style="font-weight: 700; color: #fca5a5; font-size: var(--font-size-sm);" id="bulk-selected-count">0 Siswa Ditandai</span>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: 8px;">Siswa yang ditandai siap untuk dinaikkan kelas atau dihapus bersamaan</span>
        </div>
      </div>
      <div style="display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm" id="btn-cancel-bulk-select" style="font-size: var(--font-size-xs);">
          Batal Tandai
        </button>
        <button class="btn btn-primary btn-sm" id="btn-bulk-promote" style="font-weight: 700; font-size: var(--font-size-xs); background: #6366f1; border-color: #6366f1; color: white; display: inline-flex; align-items: center; gap: 6px;">
          <span>🎓</span> Naik Kelas
        </button>
        <button class="btn btn-danger btn-sm" id="btn-bulk-delete" style="font-weight: 700; font-size: var(--font-size-xs); background: #ef4444; border-color: #ef4444; color: white; display: inline-flex; align-items: center; gap: 6px;">
          <span>🗑️</span> Hapus Siswa Ditandai
        </button>
      </div>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="form-input" id="student-search" placeholder="Cari nama atau NIS...">
      </div>
      <div class="filter-group">
        <select class="form-select" id="student-filter-kelas">
          <option value="">Semua Kelas</option>
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
            <th style="width: 44px; text-align: center;">
              <input type="checkbox" id="check-all-students" title="Tandai / Batalkan Semua" style="cursor: pointer; accent-color: #ef4444; width: 16px; height: 16px; vertical-align: middle;">
            </th>
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
          <tr><td colspan="8" class="text-center text-muted" style="padding: var(--space-8);">Memuat data...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  // Bind events
  const searchInput = page.querySelector('#student-search') as HTMLInputElement;
  const filterKelas = page.querySelector('#student-filter-kelas') as HTMLSelectElement;
  const addBtn = page.querySelector('#btn-add-student') as HTMLButtonElement;

  // Toggle mark all currently visible students
  page.querySelector('#btn-toggle-mark-all')?.addEventListener('click', () => {
    if (currentDisplayedStudents.length === 0) {
      showToast('Tidak ada data siswa untuk ditandai', 'warning');
      return;
    }
    const allSelected = currentDisplayedStudents.every((s) => selectedNisSet.has(s.nis));
    if (allSelected) {
      currentDisplayedStudents.forEach((s) => selectedNisSet.delete(s.nis));
    } else {
      currentDisplayedStudents.forEach((s) => selectedNisSet.add(s.nis));
    }
    loadStudentTable(page, searchInput.value, filterKelas.value);
  });

  // Check-all checkbox in table header
  page.querySelector('#check-all-students')?.addEventListener('change', (e) => {
    const checkAll = e.target as HTMLInputElement;
    const shouldCheck = checkAll.checked;
    currentDisplayedStudents.forEach((s) => {
      if (shouldCheck) {
        selectedNisSet.add(s.nis);
      } else {
        selectedNisSet.delete(s.nis);
      }
    });
    loadStudentTable(page, searchInput.value, filterKelas.value);
  });

  // Cancel bulk selection
  page.querySelector('#btn-cancel-bulk-select')?.addEventListener('click', () => {
    selectedNisSet.clear();
    loadStudentTable(page, searchInput.value, filterKelas.value);
  });

  // Execute bulk delete
  page.querySelector('#btn-bulk-delete')?.addEventListener('click', async () => {
    if (selectedNisSet.size === 0) return;
    const count = selectedNisSet.size;
    const confirmed = await showConfirm(
      `Yakin ingin menghapus ${count} data siswa yang ditandai? Tindakan ini tidak dapat dibatalkan.`
    );
    if (confirmed) {
      const list = Array.from(selectedNisSet);
      const deleted = await spreadsheetService.deleteStudents(list);
      selectedNisSet.clear();
      showToast(`Berhasil menghapus ${deleted} data siswa!`, 'success');
      loadStudentTable(page, searchInput.value, filterKelas.value);
    }
  });

  // Export Excel handler
  page.querySelector('#btn-export-students')?.addEventListener('click', () => {
    if (currentDisplayedStudents.length === 0) {
      showToast('Tidak ada data siswa untuk diexport', 'warning');
      return;
    }
    const school = schoolService.getSchoolInfo();
    exportStudentsToExcel(currentDisplayedStudents, school.namaSekolah);
    showToast(`Berhasil mengekspor ${currentDisplayedStudents.length} siswa ke file Excel/CSV!`, 'success');
  });

  // Naik Kelas handlers
  page.querySelector('#btn-naik-kelas')?.addEventListener('click', () => {
    openNaikKelasModal(page, Array.from(selectedNisSet));
  });
  page.querySelector('#btn-bulk-promote')?.addEventListener('click', () => {
    openNaikKelasModal(page, Array.from(selectedNisSet));
  });

  // Import Excel / CSV handler
  page.querySelector('#btn-import-students')?.addEventListener('click', () => openImportStudentsModal(page));

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
    const allStudents = await spreadsheetService.getStudents();

    // Dynamically populate class filter options from all registered classes
    const filterSelect = page.querySelector('#student-filter-kelas') as HTMLSelectElement;
    if (filterSelect) {
      const selectedVal = kelas || filterSelect.value;
      const uniqueClasses = Array.from(new Set(allStudents.map((s) => s.kelas).filter(Boolean))).sort();
      filterSelect.innerHTML = `
        <option value="">Semua Kelas (${uniqueClasses.length} kelas)</option>
        ${uniqueClasses.map((k) => `<option value="${k}" ${k === selectedVal ? 'selected' : ''}>${k}</option>`).join('')}
      `;
    }

    let students = allStudents;

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
    currentDisplayedStudents = students;

    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">👨‍🎓</div>
              <div class="empty-state-title">Belum Ada Siswa</div>
              <div class="empty-state-text">Klik "Tambah Siswa" untuk menambahkan data siswa baru.</div>
            </div>
          </td>
        </tr>
      `;
      updateBulkBar(page);
      return;
    }

    tbody.innerHTML = students.map((s) => {
      const isChecked = selectedNisSet.has(s.nis);
      return `
      <tr class="${isChecked ? 'row-marked-delete' : ''}" style="${isChecked ? 'background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444;' : ''}">
        <td style="text-align: center; vertical-align: middle;">
          <input type="checkbox" class="student-checkbox" data-nis="${s.nis}" ${isChecked ? 'checked' : ''} style="cursor: pointer; accent-color: #ef4444; width: 16px; height: 16px; vertical-align: middle;">
        </td>
        <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${s.nis}</code></td>
        <td style="font-weight: var(--font-weight-semibold);">${s.nama}</td>
        <td><span class="badge badge-info">${s.kelas}</span></td>
        <td>${s.namaOrangTua}</td>
        <td>${s.noHp}</td>
        <td style="font-weight: var(--font-weight-semibold);">${formatRupiah(s.nominalSpp)}</td>
        <td>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-ghost btn-sm btn-remind-wa" data-nis="${s.nis}" title="Kirim Pengingat Tagihan SPP via WhatsApp" style="color: #25d366;">📲</button>
            <button class="btn btn-ghost btn-sm btn-edit-student" data-nis="${s.nis}" title="Edit">✏️</button>
            <button class="btn btn-ghost btn-sm btn-delete-student" data-nis="${s.nis}" title="Hapus">🗑️</button>
          </div>
        </td>
      </tr>
    `}).join('');

    // Update bulk bar counts and states
    updateBulkBar(page);

    // Bind row checkbox events
    tbody.querySelectorAll<HTMLInputElement>('.student-checkbox').forEach((cb) => {
      cb.addEventListener('change', () => {
        const nis = cb.getAttribute('data-nis')!;
        const row = cb.closest('tr');
        if (cb.checked) {
          selectedNisSet.add(nis);
          if (row) {
            row.style.background = 'rgba(239, 68, 68, 0.08)';
            row.style.borderLeft = '3px solid #ef4444';
          }
        } else {
          selectedNisSet.delete(nis);
          if (row) {
            row.style.background = '';
            row.style.borderLeft = '';
          }
        }
        updateBulkBar(page);
      });
    });

    // Bind row action buttons
    tbody.querySelectorAll('.btn-remind-wa').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nis = btn.getAttribute('data-nis')!;
        const student = students.find((s) => s.nis === nis);
        if (student) openSppReminderDialog(student);
      });
    });

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
            selectedNisSet.delete(nis);
            showToast(`Data siswa ${student.nama} berhasil dihapus`, 'success');
            const searchInput = page.querySelector('#student-search') as HTMLInputElement;
            const filterKelas = page.querySelector('#student-filter-kelas') as HTMLSelectElement;
            loadStudentTable(page, searchInput?.value || '', filterKelas?.value || '');
          } else {
            showToast('Gagal menghapus data siswa', 'error');
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading students:', error);
    tbody.innerHTML = `
      <tr><td colspan="8" class="text-center text-danger" style="padding: var(--space-8);">Error memuat data siswa</td></tr>
    `;
  }
}

/** Show WhatsApp SPP reminder dialog */
async function openSppReminderDialog(student: Student): Promise<void> {
  const payments = await spreadsheetService.getStudentPayments(student.nis);
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();
  
  const elapsedMonths = MONTHS.slice(0, currentMonthIdx + 1);
  const paidMonthsThisYear = payments
    .filter((p: Payment) => p.tahun === currentYear && p.status === 'lunas')
    .map((p: Payment) => p.bulan);
    
  const unpaidMonths = elapsedMonths.filter((m) => !paidMonthsThisYear.includes(m as MonthName));
  const totalTunggakan = unpaidMonths.length * (student.nominalSpp || 150000);

  const modalEl = createElement('div', {
    innerHTML: `
      <div style="margin-bottom: var(--space-4);">
        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-3);">
          Kirim pesan pemberitahuan tagihan SPP langsung ke WhatsApp orang tua/wali siswa secara resmi dan otomatis.
        </p>

        <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-4); font-size: var(--font-size-sm);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">Nama Siswa:</span>
            <strong>${student.nama} (${student.nis} - ${student.kelas})</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">Nama Wali:</span>
            <strong>${student.namaOrangTua || '-'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">No. WhatsApp:</span>
            <strong>${student.noHp || '(Belum ada nomor)'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">Status Tagihan:</span>
            <span style="color: ${unpaidMonths.length > 0 ? 'var(--color-danger)' : 'var(--color-success)'}; font-weight: 700;">
              ${unpaidMonths.length > 0 ? `${unpaidMonths.join(', ')} (${formatRupiah(totalTunggakan)})` : 'Semua Lunas'}
            </span>
          </div>
        </div>

        <div class="form-group mb-4">
          <label class="form-label">Catatan Tambahan (Opsional)</label>
          <input type="text" class="form-input" id="wa-reminder-note" placeholder="Contoh: Pembayaran ditunggu sebelum tanggal 10">
        </div>

        <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
          <button class="btn btn-secondary" id="btn-cancel-wa-reminder">Batal</button>
          <button class="btn btn-primary" id="btn-send-wa-reminder" style="background: #25d366; border-color: #25d366; color: white; font-weight: 600;">
            📲 Buka WhatsApp
          </button>
        </div>
      </div>
    `
  });

  showModal(`Pengingat SPP - ${student.nama}`, modalEl);

  modalEl.querySelector('#btn-cancel-wa-reminder')?.addEventListener('click', closeModal);
  modalEl.querySelector('#btn-send-wa-reminder')?.addEventListener('click', () => {
    const note = (modalEl.querySelector('#wa-reminder-note') as HTMLInputElement).value;
    const monthsToSend = unpaidMonths.length > 0 ? unpaidMonths : ['Bulan Berjalan'];
    const nominalToSend = unpaidMonths.length > 0 ? totalTunggakan : student.nominalSpp;
    const msg = buildSppReminderWhatsAppMessage(student, monthsToSend, nominalToSend, note);
    openWhatsAppChat(student.noHp, msg);
    closeModal();
  });
}

/** Open student form (add/edit) */
async function openStudentForm(page: HTMLElement, student?: Student): Promise<void> {
  const isEdit = !!student;
  const title = isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru';

  const allStudents = await spreadsheetService.getStudents();
  const existingClasses = Array.from(new Set(allStudents.map((s) => s.kelas).filter(Boolean))).sort();

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
            <label class="form-label">Kelas * (Ketik Manual)</label>
            <input type="text" class="form-input" id="form-kelas" value="${student?.kelas ?? ''}" 
              placeholder="Ketik manual nama kelas (contoh: VII-A, X-MIPA 1, 1-A)" list="list-kelas-manual" required autocomplete="off">
            <datalist id="list-kelas-manual">
              ${existingClasses.map((k) => `<option value="${k}">`).join('')}
            </datalist>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 3px;">
              Bebas ketik format kelas apapun sesuai kebutuhan sekolah
            </div>
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

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nominal SPP per Bulan</label>
            <input type="number" class="form-input" id="form-nominal" 
              value="${student?.nominalSpp ?? APP_CONFIG.nominalSppDefault}" 
              placeholder="250000" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Password Siswa</label>
            <input type="text" class="form-input" id="form-password" 
              value="${student?.password ?? ''}" 
              placeholder="Default: sama dengan NIS">
          </div>
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

    const passInput = (formEl.querySelector('#form-password') as HTMLInputElement).value.trim();

    const data: Student = {
      nis: (formEl.querySelector('#form-nis') as HTMLInputElement).value.trim(),
      nama: (formEl.querySelector('#form-nama') as HTMLInputElement).value.trim(),
      kelas: (formEl.querySelector('#form-kelas') as HTMLInputElement).value.trim(),
      namaOrangTua: (formEl.querySelector('#form-ortu') as HTMLInputElement).value.trim(),
      noHp: (formEl.querySelector('#form-hp') as HTMLInputElement).value.trim(),
      nominalSpp: Number((formEl.querySelector('#form-nominal') as HTMLInputElement).value) || APP_CONFIG.nominalSppDefault,
      password: passInput || undefined,
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

/** Open Excel/CSV Import Dialog for Students */
function openImportStudentsModal(page: HTMLElement): void {
  const school = schoolService.getSchoolInfo();
  let parsedStudentsList: Student[] = [];

  const modalEl = createElement('div', {
    innerHTML: `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: 680px;">
        <!-- Step 1: Download Template -->
        <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-3);">
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-primary); margin-bottom: 2px;">
                📋 1. Unduh Format Template Resmi
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                Pilih format yang paling nyaman dibuka di Microsoft Excel komputer Anda:
              </div>
            </div>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" id="btn-download-excel" style="font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; background: #16a34a; border-color: #16a34a;">
                <span>📊</span> Unduh Excel (.xlsx)
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-download-csv" style="font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;">
                <span>📄</span> Unduh CSV (.csv)
              </button>
            </div>
          </div>

          <!-- Petunjuk Judul Kolom -->
          <div style="background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-md); padding: var(--space-3); border: 1px solid var(--color-border-subtle); font-size: 11px;">
            <div style="font-weight: 700; color: var(--color-primary-light); margin-bottom: 4px;">Urutan Judul Kolom yang Benar:</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px; color: var(--color-text-secondary);">
              <div>• <strong>NIS</strong> (Wajib: misal <code>2026011</code>)</div>
              <div>• <strong>Nama Siswa</strong> (Wajib: Nama Lengkap)</div>
              <div>• <strong>Kelas</strong> (Wajib: misal <code>VII-A</code>)</div>
              <div>• <strong>Nama Orang Tua</strong> (Nama Wali)</div>
              <div>• <strong>No WhatsApp</strong> (misal <code>081234567890</code>)</div>
              <div>• <strong>Nominal SPP</strong> (Angka misal <code>250000</code>)</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Upload Area / Dropzone -->
        <div>
          <div style="font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); margin-bottom: 6px;">
            📂 2. Upload File yang Sudah Diisi
          </div>
          <div id="import-dropzone" style="border: 2px dashed var(--color-border); border-radius: var(--radius-lg); padding: var(--space-5); text-align: center; cursor: pointer; transition: all 0.2s ease; background: rgba(255, 255, 255, 0.02);">
            <input type="file" id="import-file-input" accept=".xls,.xlsx,.csv,.txt" style="display: none;">
            <div style="font-size: 32px; margin-bottom: var(--space-1);">📂</div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); margin-bottom: 2px;">
              Klik untuk pilih file atau seret file ke sini
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
              Mendukung file <strong>.xlsx / .xls (Excel)</strong>, <strong>.csv</strong>, atau <strong>.txt</strong>
            </div>
            <div id="import-file-name" style="margin-top: var(--space-2); font-weight: 700; color: var(--color-primary-light); font-size: var(--font-size-sm); display: none;"></div>
          </div>
        </div>

        <!-- Step 3: Options & Preview Area -->
        <div id="import-preview-section" style="display: none; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2);">
            <label style="display: flex; align-items: center; gap: 8px; font-size: var(--font-size-xs); cursor: pointer; user-select: none;">
              <input type="checkbox" id="import-update-existing" checked style="accent-color: var(--color-primary); cursor: pointer;">
              <span>Perbarui data jika NIS sudah terdaftar di sistem</span>
            </label>
            <div id="import-status-badge" class="badge badge-success text-xs"></div>
          </div>

          <!-- Error Alert Box -->
          <div id="import-errors-box" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: var(--space-3); font-size: var(--font-size-xs); color: #fca5a5; max-height: 90px; overflow-y: auto;"></div>

          <!-- Preview Table -->
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); max-height: 180px; overflow: auto; background: var(--color-bg-dark);">
            <table class="data-table" style="font-size: 11px; margin: 0; width: 100%;">
              <thead>
                <tr>
                  <th style="padding: 6px 8px;">NIS</th>
                  <th style="padding: 6px 8px;">Nama Siswa</th>
                  <th style="padding: 6px 8px;">Kelas</th>
                  <th style="padding: 6px 8px;">Nama Wali</th>
                  <th style="padding: 6px 8px;">No. WhatsApp</th>
                  <th style="padding: 6px 8px;">SPP (Rp)</th>
                </tr>
              </thead>
              <tbody id="import-preview-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- Modal Actions -->
        <div style="display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-3); border-top: 1px solid var(--color-border);">
          <button class="btn btn-secondary" id="btn-cancel-import">Batal</button>
          <button class="btn btn-primary" id="btn-confirm-import" disabled style="font-weight: 600;">
            🚀 Mulai Impor Data Siswa
          </button>
        </div>
      </div>
    `
  });

  showModal('📥 Impor Data Siswa dari Excel / CSV', modalEl);

  // Excel template download handler
  modalEl.querySelector('#btn-download-excel')?.addEventListener('click', () => {
    downloadStudentTemplateExcel(school.nominalSppDefault, school.namaSekolah);
    showToast('Template Excel (.xlsx) berhasil diunduh! Buka langsung di Microsoft Excel.', 'success');
  });

  // CSV template download handler
  modalEl.querySelector('#btn-download-csv')?.addEventListener('click', () => {
    downloadStudentTemplateCsv(school.nominalSppDefault);
    showToast('Template CSV (.csv) berhasil diunduh!', 'success');
  });

  const fileInput = modalEl.querySelector('#import-file-input') as HTMLInputElement;
  const dropzone = modalEl.querySelector('#import-dropzone') as HTMLElement;
  const fileNameEl = modalEl.querySelector('#import-file-name') as HTMLElement;
  const previewSection = modalEl.querySelector('#import-preview-section') as HTMLElement;
  const previewTbody = modalEl.querySelector('#import-preview-tbody') as HTMLElement;
  const statusBadge = modalEl.querySelector('#import-status-badge') as HTMLElement;
  const errorsBox = modalEl.querySelector('#import-errors-box') as HTMLElement;
  const confirmBtn = modalEl.querySelector('#btn-confirm-import') as HTMLButtonElement;
  const cancelBtn = modalEl.querySelector('#btn-cancel-import') as HTMLButtonElement;
  const updateExistingCheckbox = modalEl.querySelector('#import-update-existing') as HTMLInputElement;

  cancelBtn.addEventListener('click', closeModal);

  // Trigger file select on dropzone click
  dropzone.addEventListener('click', () => fileInput.click());

  // Drag & drop handlers
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-primary)';
    dropzone.style.background = 'rgba(99, 102, 241, 0.08)';
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--color-border)';
    dropzone.style.background = 'rgba(255, 255, 255, 0.02)';
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-border)';
    dropzone.style.background = 'rgba(255, 255, 255, 0.02)';
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file: File): void {
    fileNameEl.style.display = 'block';
    fileNameEl.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (!buffer) {
        showToast('File tidak memiliki konten', 'warning');
        return;
      }

      const parseResult = parseStudentFile(buffer, school.nominalSppDefault);
      parsedStudentsList = parseResult.valid;

      // Update UI
      previewSection.style.display = 'flex';

      if (parseResult.errors.length > 0) {
        errorsBox.style.display = 'block';
        errorsBox.innerHTML = `<strong>Peringatan / Catatan (${parseResult.errors.length}):</strong><br>` + 
          parseResult.errors.map((err) => `• ${err}`).join('<br>');
      } else {
        errorsBox.style.display = 'none';
      }

      if (parsedStudentsList.length === 0) {
        statusBadge.className = 'badge badge-danger text-xs';
        statusBadge.textContent = '0 Data Valid Ditemukan';
        confirmBtn.disabled = true;
        previewTbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 12px;">Format tidak dikenali. Silakan periksa atau gunakan template resmi.</td></tr>`;
        return;
      }

      statusBadge.className = 'badge badge-success text-xs';
      statusBadge.textContent = `✅ ${parsedStudentsList.length} Siswa Siap Diimpor`;
      confirmBtn.disabled = false;
      confirmBtn.textContent = `🚀 Impor ${parsedStudentsList.length} Data Siswa`;

      // Render preview rows (show first 15 rows)
      const previewRows = parsedStudentsList.slice(0, 15);
      previewTbody.innerHTML = previewRows
        .map(
          (s) => `
          <tr>
            <td style="padding: 5px 8px;"><code>${s.nis}</code></td>
            <td style="padding: 5px 8px; font-weight: 600;">${s.nama}</td>
            <td style="padding: 5px 8px;"><span class="badge badge-info text-xs">${s.kelas}</span></td>
            <td style="padding: 5px 8px;">${s.namaOrangTua}</td>
            <td style="padding: 5px 8px;">${s.noHp || '-'}</td>
            <td style="padding: 5px 8px;">${formatRupiah(s.nominalSpp)}</td>
          </tr>
        `
        )
        .join('');

      if (parsedStudentsList.length > 15) {
        previewTbody.innerHTML += `
          <tr>
            <td colspan="6" class="text-center text-muted" style="padding: 6px 8px; font-style: italic;">
              ...dan ${parsedStudentsList.length - 15} siswa lainnya
            </td>
          </tr>
        `;
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // Import button handler
  confirmBtn.addEventListener('click', async () => {
    if (parsedStudentsList.length === 0) return;

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Menyimpan ke database...';

    const updateExisting = updateExistingCheckbox.checked;
    const result = await spreadsheetService.importStudents(parsedStudentsList, updateExisting);

    showToast(
      `Berhasil mengimpor data siswa: ${result.added} siswa baru ditambahkan, ${result.updated} diperbarui!`,
      'success'
    );
    closeModal();
    loadStudentTable(page);
  });
}

/** Suggest next grade/class level from current class name */
function suggestNextClass(currentClass: string): string {
  const c = currentClass.trim();
  if (!c) return '';

  // Roman numerals check (SMP / SMA)
  if (/^VII\b/i.test(c)) return c.replace(/^VII\b/i, 'VIII');
  if (/^VIII\b/i.test(c)) return c.replace(/^VIII\b/i, 'IX');
  if (/^IX\b/i.test(c)) return 'Lulus';

  if (/^X\b/i.test(c) && !/^XI\b/i.test(c) && !/^XII\b/i.test(c)) return c.replace(/^X\b/i, 'XI');
  if (/^XI\b/i.test(c)) return c.replace(/^XI\b/i, 'XII');
  if (/^XII\b/i.test(c)) return 'Lulus';

  // Arabic numbers check (SD/MI 1-6 or SMA 10-12)
  const numMatch = c.match(/^(\d+)(.*)$/);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    const suffix = numMatch[2] || '';
    if (num === 6 || num === 9 || num === 12) return 'Lulus';
    return `${num + 1}${suffix}`;
  }

  return '';
}

/** Open Modal for Naik Kelas (Grade Promotion) */
async function openNaikKelasModal(page: HTMLElement, preselectedNis: string[] = []): Promise<void> {
  const allStudents = await spreadsheetService.getStudents();
  if (allStudents.length === 0) {
    showToast('Belum ada data siswa untuk diproses naik kelas', 'warning');
    return;
  }

  const school = schoolService.getSchoolInfo();
  const uniqueClasses = Array.from(new Set(allStudents.map((s) => s.kelas).filter(Boolean))).sort();
  const hasSelection = preselectedNis.length > 0;

  const modalEl = createElement('div', {
    innerHTML: `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: 620px;">
        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0;">
          Fitur ini mempermudah pemindahan siswa ke tingkat kelas berikutnya secara serentak (rombongan belajar) atau berdasarkan siswa yang ditandai.
        </p>

        <!-- Method Selection -->
        <div class="form-group">
          <label class="form-label" style="font-weight: 700;">Metode Pemilihan Siswa</label>
          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap; margin-top: 4px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: var(--font-size-sm);">
              <input type="radio" name="promote-method" id="radio-by-class" value="by-class" ${!hasSelection ? 'checked' : ''} style="accent-color: var(--color-primary); cursor: pointer;">
              <span>Satu Rombel / Berdasarkan Kelas Asal</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: var(--font-size-sm); ${!hasSelection ? 'opacity: 0.5;' : ''}">
              <input type="radio" name="promote-method" id="radio-by-selection" value="by-selection" ${hasSelection ? 'checked' : ''} ${!hasSelection ? 'disabled' : ''} style="accent-color: var(--color-primary); cursor: pointer;">
              <span>Siswa yang Sedang Ditandai (${preselectedNis.length} siswa)</span>
            </label>
          </div>
        </div>

        <!-- Source Class Group -->
        <div class="form-group" id="group-source-class" style="${hasSelection ? 'display: none;' : ''}">
          <label class="form-label" style="font-weight: 700;">Pilih Kelas Asal *</label>
          <select class="form-select" id="promote-source-class">
            <option value="">-- Pilih Kelas Asal --</option>
            ${uniqueClasses.map((cls) => {
              const count = allStudents.filter((s) => s.kelas === cls).length;
              return `<option value="${cls}">${cls} (${count} siswa)</option>`;
            }).join('')}
          </select>
        </div>

        <!-- Destination Class Group -->
        <div class="form-group">
          <label class="form-label" style="font-weight: 700;">Kelas Tujuan / Baru *</label>
          <input 
            type="text" 
            class="form-input" 
            id="promote-target-class" 
            placeholder="Ketik nama kelas baru (contoh: VIII-A atau Lulus)" 
            list="list-kelas-rekomendasi"
            required
            autocomplete="off"
          >
          <datalist id="list-kelas-rekomendasi">
            ${uniqueClasses.map((c) => `<option value="${c}">`).join('')}
            <option value="Lulus">
            <option value="Alumni">
          </datalist>

          <!-- Quick suggestions badges -->
          <div id="promote-suggestions" style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; align-items: center;">
            <span style="font-size: 11px; color: var(--color-text-muted);">Saran cepat:</span>
            <button type="button" class="badge badge-info btn-suggest" data-val="VIII-A" style="cursor: pointer; border: none;">VIII-A</button>
            <button type="button" class="badge badge-info btn-suggest" data-val="IX-A" style="cursor: pointer; border: none;">IX-A</button>
            <button type="button" class="badge badge-success btn-suggest" data-val="Lulus" style="cursor: pointer; border: none;">🎓 Lulus / Alumni</button>
          </div>
        </div>

        <!-- SPP Fee Update Option -->
        <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3);">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: var(--font-size-sm); user-select: none;">
            <input type="checkbox" id="promote-update-spp" style="accent-color: var(--color-primary); cursor: pointer;">
            <strong>Sesuaikan Tarif Nominal SPP di Kelas Baru</strong>
          </label>
          <div id="group-target-spp" style="display: none; margin-top: var(--space-3); padding-left: 24px;">
            <label class="form-label" style="font-size: var(--font-size-xs);">Nominal SPP Baru per Bulan (Rp)</label>
            <input type="number" class="form-input" id="promote-new-spp" placeholder="${school.nominalSppDefault}" min="0" step="5000">
            <span style="font-size: 11px; color: var(--color-text-muted);">Biarkan kosong jika tetap menggunakan tarif sekarang.</span>
          </div>
        </div>

        <!-- Students Preview Area -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-secondary);">
              Pratinjau Siswa yang Akan Diproses:
            </span>
            <span id="promote-count-badge" class="badge badge-info text-xs">0 Siswa</span>
          </div>
          <div style="max-height: 140px; overflow-y: auto; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-dark);">
            <table class="data-table" style="font-size: 11px; margin: 0; width: 100%;">
              <thead>
                <tr>
                  <th style="padding: 6px 8px;">NIS</th>
                  <th style="padding: 6px 8px;">Nama Siswa</th>
                  <th style="padding: 6px 8px;">Kelas Sekarang</th>
                  <th style="padding: 6px 8px;">Kelas Tujuan</th>
                </tr>
              </thead>
              <tbody id="promote-preview-tbody">
                <tr><td colspan="4" class="text-center text-muted" style="padding: 12px;">Pilih kelas asal atau siswa untuk melihat pratinjau</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal Actions -->
        <div style="display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-3); border-top: 1px solid var(--color-border);">
          <button class="btn btn-secondary" id="btn-cancel-promote">Batal</button>
          <button class="btn btn-primary" id="btn-confirm-promote" disabled style="font-weight: 700; background: #6366f1; border-color: #6366f1;">
            🎓 Konfirmasi Naik Kelas
          </button>
        </div>
      </div>
    `
  });

  showModal('🎓 Naik Kelas / Pindah Rombel Siswa', modalEl);

  // Element references
  const radioByClass = modalEl.querySelector('#radio-by-class') as HTMLInputElement;
  const radioBySelection = modalEl.querySelector('#radio-by-selection') as HTMLInputElement;
  const groupSourceClass = modalEl.querySelector('#group-source-class') as HTMLElement;
  const selectSourceClass = modalEl.querySelector('#promote-source-class') as HTMLSelectElement;
  const inputTargetClass = modalEl.querySelector('#promote-target-class') as HTMLInputElement;
  const checkboxUpdateSpp = modalEl.querySelector('#promote-update-spp') as HTMLInputElement;
  const groupTargetSpp = modalEl.querySelector('#group-target-spp') as HTMLElement;
  const inputNewSpp = modalEl.querySelector('#promote-new-spp') as HTMLInputElement;
  const countBadge = modalEl.querySelector('#promote-count-badge') as HTMLElement;
  const previewTbody = modalEl.querySelector('#promote-preview-tbody') as HTMLElement;
  const confirmBtn = modalEl.querySelector('#btn-confirm-promote') as HTMLButtonElement;
  const cancelBtn = modalEl.querySelector('#btn-cancel-promote') as HTMLButtonElement;
  const suggestionsBox = modalEl.querySelector('#promote-suggestions') as HTMLElement;

  cancelBtn.addEventListener('click', closeModal);

  // Toggle SPP group
  checkboxUpdateSpp.addEventListener('change', () => {
    groupTargetSpp.style.display = checkboxUpdateSpp.checked ? 'block' : 'none';
  });

  // Suggestion buttons
  suggestionsBox.querySelectorAll<HTMLButtonElement>('.btn-suggest').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (val) {
        inputTargetClass.value = val;
        updatePreview();
      }
    });
  });

  // Method radios change
  radioByClass.addEventListener('change', () => {
    groupSourceClass.style.display = 'block';
    updatePreview();
  });
  radioBySelection?.addEventListener('change', () => {
    groupSourceClass.style.display = 'none';
    updatePreview();
  });

  // Source class change
  selectSourceClass.addEventListener('change', () => {
    const src = selectSourceClass.value;
    if (src) {
      const suggested = suggestNextClass(src);
      if (suggested) {
        inputTargetClass.value = suggested;
      }
    }
    updatePreview();
  });

  // Target class input
  inputTargetClass.addEventListener('input', updatePreview);

  function getTargetStudents(): Student[] {
    const isBySelection = radioBySelection?.checked;
    if (isBySelection) {
      const set = new Set(preselectedNis);
      return allStudents.filter((s) => set.has(s.nis));
    } else {
      const src = selectSourceClass.value;
      if (!src) return [];
      return allStudents.filter((s) => s.kelas === src);
    }
  }

  function updatePreview(): void {
    const targetStudents = getTargetStudents();
    const targetClass = inputTargetClass.value.trim();

    countBadge.textContent = `${targetStudents.length} Siswa`;

    if (targetStudents.length === 0) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = '🎓 Konfirmasi Naik Kelas';
      previewTbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding: 12px;">Pilih kelas asal atau siswa untuk melihat pratinjau</td></tr>`;
      return;
    }

    if (!targetClass) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = '🎓 Konfirmasi Naik Kelas';
      previewTbody.innerHTML = targetStudents.slice(0, 15).map((s) => `
        <tr>
          <td style="padding: 4px 8px;"><code>${s.nis}</code></td>
          <td style="padding: 4px 8px; font-weight: 600;">${s.nama}</td>
          <td style="padding: 4px 8px;"><span class="badge badge-info text-xs">${s.kelas}</span></td>
          <td style="padding: 4px 8px; color: var(--color-text-muted); font-style: italic;">(Isi kelas tujuan)</td>
        </tr>
      `).join('');
      return;
    }

    confirmBtn.disabled = false;
    confirmBtn.textContent = `🎓 Naikkan ${targetStudents.length} Siswa ke "${targetClass}"`;

    previewTbody.innerHTML = targetStudents.slice(0, 15).map((s) => `
      <tr>
        <td style="padding: 4px 8px;"><code>${s.nis}</code></td>
        <td style="padding: 4px 8px; font-weight: 600;">${s.nama}</td>
        <td style="padding: 4px 8px;"><span class="badge badge-info text-xs">${s.kelas}</span></td>
        <td style="padding: 4px 8px; font-weight: 700; color: #a5b4fc;">➜ ${targetClass}</td>
      </tr>
    `).join('');

    if (targetStudents.length > 15) {
      previewTbody.innerHTML += `
        <tr>
          <td colspan="4" class="text-center text-muted" style="padding: 4px 8px; font-style: italic;">
            ...dan ${targetStudents.length - 15} siswa lainnya
          </td>
        </tr>
      `;
    }
  }

  // Initial update
  updatePreview();

  // Confirm Naik Kelas handler
  confirmBtn.addEventListener('click', async () => {
    const targetStudents = getTargetStudents();
    const targetClass = inputTargetClass.value.trim();
    if (targetStudents.length === 0 || !targetClass) return;

    let newSpp: number | undefined;
    if (checkboxUpdateSpp.checked && inputNewSpp.value.trim()) {
      newSpp = Number(inputNewSpp.value.trim());
      if (isNaN(newSpp) || newSpp <= 0) newSpp = undefined;
    }

    const confirmed = await showConfirm(
      `Yakin ingin menaikkan ${targetStudents.length} siswa ke kelas "${targetClass}"?` + 
      (newSpp ? `\nTarif SPP akan diperbarui menjadi ${formatRupiah(newSpp)}/bulan.` : '')
    );

    if (confirmed) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Memproses...';

      const nisList = targetStudents.map((s) => s.nis);
      const count = await spreadsheetService.promoteStudents(nisList, targetClass, newSpp);

      selectedNisSet.clear();
      showToast(`Berhasil menaikkan ${count} siswa ke kelas "${targetClass}"!`, 'success');
      closeModal();
      loadStudentTable(page);
    }
  });
}

