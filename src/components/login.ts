// ==========================================
// Login Component — Pemilihan Masuk Siswa vs Admin
// ==========================================

import { createElement, showToast } from '../utils/dom';
import { router } from '../utils/router';
import { authService } from '../services/authService';
import { schoolService } from '../services/schoolService';
import { spreadsheetService } from '../services/spreadsheet';

/** Render Universal Login Page */
export function renderLogin(): HTMLElement {
  const container = createElement('div', { className: 'login-page-container animate-fade-in' });
  const school = schoolService.getSchoolInfo();

  container.innerHTML = `
    <div class="login-card-wrapper">
      <!-- School Branding Header -->
      <div class="login-header text-center">
        <div class="login-logo">🏫</div>
        <h1 class="login-school-name">${school.namaSekolah}</h1>
        <p class="login-school-sub">${school.alamatSekolah} • Tahun Ajaran ${school.tahunAjaran}</p>
        <div class="login-tagline-badge">Sistem Pembayaran SPP & Tagihan Sekolah Resmi</div>
      </div>

      <!-- Role Selection Tabs -->
      <div class="login-role-tabs">
        <button class="role-tab-btn active" id="tab-login-siswa">
          👨‍🎓 Masuk Sebagai Siswa
        </button>
        <button class="role-tab-btn" id="tab-login-admin">
          🔐 Masuk Sebagai Admin
        </button>
      </div>

      <!-- Student Login Box -->
      <div class="login-form-box" id="box-login-siswa">
        <div class="login-box-header">
          <div class="box-title">Portal Mandiri Siswa & Wali Murid</div>
          <div class="box-desc">
            Masukkan Nama Lengkap atau NIS untuk melihat rincian tagihan yang harus dibayar, melakukan pembayaran online, serta mencetak kuitansi.
          </div>
        </div>

        <form id="form-login-siswa">
          <div class="form-group">
            <label class="form-label">Nama Siswa atau NIS *</label>
            <input type="text" class="form-input form-input-lg" id="input-siswa-identity" placeholder="Contoh: Budi Santoso atau 2026001" required autofocus>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-4);" id="btn-submit-siswa">
            🚀 Masuk Portal Siswa
          </button>
        </form>

        <!-- Quick Select Student Chips -->
        <div class="quick-students-section mt-6">
          <span class="text-xs text-muted" style="display: block; margin-bottom: var(--space-2);">
            Pilih cepat nama siswa terdaftar:
          </span>
          <div id="login-quick-chips" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <span class="text-xs text-muted">Memuat daftar siswa...</span>
          </div>
        </div>

        <div class="login-role-notice mt-4">
          ℹ️ <strong>Catatan Akses Siswa:</strong> Siswa hanya dapat melihat dan membayar tagihan secara online serta mengunduh kuitansi resmi. Siswa tidak memiliki izin untuk merubah data sekolah atau data siswa lainnya.
        </div>
      </div>

      <!-- Admin Login Box (Hidden by default) -->
      <div class="login-form-box" id="box-login-admin" style="display: none;">
        <div class="login-box-header">
          <div class="box-title">Panel Administrasi Sekolah</div>
          <div class="box-desc">
            Khusus petugas tata usaha, kasir, dan bendahara sekolah untuk mengelola data siswa, pos pembayaran, dan laporan keuangan.
          </div>
        </div>

        <form id="form-login-admin">
          <div class="form-group">
            <label class="form-label">Username Admin *</label>
            <input type="text" class="form-input" id="input-admin-user" value="admin" required placeholder="admin">
          </div>

          <div class="form-group">
            <label class="form-label">Password Admin *</label>
            <input type="password" class="form-input" id="input-admin-pass" required placeholder="Masukkan password admin">
            <span class="text-xs text-muted">Kredensial bawaan awal: <code>admin</code> / <code>admin123</code></span>
          </div>

          <button type="submit" class="btn btn-success btn-lg" style="width: 100%; margin-top: var(--space-4);" id="btn-submit-admin">
            🔐 Masuk Sebagai Admin
          </button>
        </form>

        <div class="login-role-notice mt-4" style="border-left-color: var(--color-success);">
          🛡️ <strong>Hak Akses Admin:</strong> Akses penuh Dashboard, Data Siswa (Tambah/Edit/Hapus), Kelola Pos Tagihan Sekolah, Kasir Pembayaran, dan Pengaturan Identitas Sekolah.
        </div>
      </div>
    </div>
  `;

  // Elements
  const tabSiswa = container.querySelector('#tab-login-siswa') as HTMLButtonElement;
  const tabAdmin = container.querySelector('#tab-login-admin') as HTMLButtonElement;
  const boxSiswa = container.querySelector('#box-login-siswa') as HTMLElement;
  const boxAdmin = container.querySelector('#box-login-admin') as HTMLElement;
  const formSiswa = container.querySelector('#form-login-siswa') as HTMLFormElement;
  const formAdmin = container.querySelector('#form-login-admin') as HTMLFormElement;
  const inputSiswa = container.querySelector('#input-siswa-identity') as HTMLInputElement;
  const inputAdminUser = container.querySelector('#input-admin-user') as HTMLInputElement;
  const inputAdminPass = container.querySelector('#input-admin-pass') as HTMLInputElement;
  const quickChips = container.querySelector('#login-quick-chips') as HTMLElement;

  // Tab switching
  tabSiswa.addEventListener('click', () => {
    tabSiswa.classList.add('active');
    tabAdmin.classList.remove('active');
    boxSiswa.style.display = 'block';
    boxAdmin.style.display = 'none';
    inputSiswa.focus();
  });

  tabAdmin.addEventListener('click', () => {
    tabAdmin.classList.add('active');
    tabSiswa.classList.remove('active');
    boxAdmin.style.display = 'block';
    boxSiswa.style.display = 'none';
    inputAdminPass.focus();
  });

  // Load Quick Chips for students
  loadQuickStudentChips();

  async function loadQuickStudentChips() {
    const students = await spreadsheetService.getStudents();
    if (students.length === 0) {
      quickChips.innerHTML = '<span class="text-xs text-muted">Belum ada data siswa terdaftar.</span>';
      return;
    }
    quickChips.innerHTML = '';
    students.forEach((s) => {
      const chip = createElement('button', {
        className: 'btn btn-ghost btn-sm',
        style: 'border: 1px solid var(--color-border); border-radius: var(--radius-full); padding: 4px 12px; font-size: 11px;',
        innerHTML: `👨‍🎓 ${s.nama} (${s.nis})`,
      });
      chip.addEventListener('click', () => {
        executeStudentLogin(s.nis);
      });
      quickChips.appendChild(chip);
    });
  }

  // Handle Student Login Submit
  formSiswa.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = inputSiswa.value.trim();
    if (!query) return;
    await executeStudentLogin(query);
  });

  async function executeStudentLogin(query: string) {
    const res = await authService.loginAsStudent(query);
    if (!res.success) {
      showToast(res.error || 'Gagal masuk sebagai siswa', 'error');
      return;
    }
    showToast(`Selamat datang, ${res.student?.nama}!`, 'success');
    router.navigate('/portal-siswa');
  }

  // Handle Admin Login Submit
  formAdmin.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = inputAdminUser.value.trim();
    const p = inputAdminPass.value;

    const res = authService.loginAsAdmin(u, p);
    if (!res.success) {
      showToast(res.error || 'Login admin gagal', 'error');
      return;
    }
    showToast('Login berhasil sebagai Administrator!', 'success');
    router.navigate('/');
  });

  return container;
}
