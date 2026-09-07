// ==========================================
// Login Component — Pemilihan Masuk Siswa vs Admin (Sederhana & Bersih)
// ==========================================

import { createElement, showToast } from '../utils/dom';
import { router } from '../utils/router';
import { authService } from '../services/authService';
import { schoolService } from '../services/schoolService';

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
        <p class="login-school-sub">${school.alamatSekolah}</p>
      </div>

      <!-- Role Selection Tabs -->
      <div class="login-role-tabs">
        <button class="role-tab-btn active" id="tab-login-siswa">
          👨‍🎓 Siswa
        </button>
        <button class="role-tab-btn" id="tab-login-admin">
          🔐 Admin
        </button>
      </div>

      <!-- Student Login Box -->
      <div class="login-form-box" id="box-login-siswa">
        <form id="form-login-siswa">
          <div class="form-group mb-4">
            <label class="form-label">Nama atau NIS Siswa</label>
            <input 
              type="text" 
              class="form-input form-input-lg" 
              id="input-siswa-identity" 
              placeholder="Masukkan Nama atau NIS" 
              required 
              autofocus
            >
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="btn-submit-siswa">
            Masuk
          </button>
        </form>
      </div>

      <!-- Admin Login Box (Hidden by default) -->
      <div class="login-form-box" id="box-login-admin" style="display: none;">
        <form id="form-login-admin">
          <div class="form-group mb-3">
            <label class="form-label">Username</label>
            <input 
              type="text" 
              class="form-input" 
              id="input-admin-user" 
              value="admin" 
              required 
              placeholder="Username"
            >
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-input" 
              id="input-admin-pass" 
              required 
              placeholder="Password"
            >
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="btn-submit-admin">
            Masuk
          </button>
        </form>
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

  // Handle Student Login Submit
  formSiswa.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = inputSiswa.value.trim();
    if (!query) return;

    const res = await authService.loginAsStudent(query);
    if (!res.success) {
      showToast(res.error || 'Data siswa tidak ditemukan', 'error');
      return;
    }
    showToast(`Selamat datang, ${res.student?.nama}!`, 'success');
    router.navigate('/portal-siswa');
  });

  // Handle Admin Login Submit
  formAdmin.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = inputAdminUser.value.trim();
    const p = inputAdminPass.value;

    const res = authService.loginAsAdmin(u, p);
    if (!res.success) {
      showToast(res.error || 'Username atau password salah', 'error');
      return;
    }
    showToast('Login berhasil', 'success');
    router.navigate('/');
  });

  return container;
}

