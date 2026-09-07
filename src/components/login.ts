// ==========================================
// Login Component — Satu Pintu (Otomatis Admin / Siswa)
// ==========================================

import { createElement, showToast } from '../utils/dom';
import { router } from '../utils/router';
import { authService } from '../services/authService';
import { schoolService } from '../services/schoolService';

/** Render Single Unified Login Page */
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

      <!-- Unified Single Login Form -->
      <form id="form-unified-login">
        <div class="form-group mb-3">
          <label class="form-label" id="label-login-id">NIS / Nama / Username</label>
          <input 
            type="text" 
            class="form-input form-input-lg" 
            id="input-login-id" 
            placeholder="Masukkan NIS, Nama, atau admin" 
            required 
            autofocus
            autocomplete="username"
          >
        </div>

        <div class="form-group mb-4" id="group-login-pass">
          <label class="form-label">Password</label>
          <input 
            type="password" 
            class="form-input form-input-lg" 
            id="input-login-pass" 
            placeholder="Masukkan password" 
            required
            autocomplete="current-password"
          >
        </div>

        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="btn-submit-login">
          Masuk
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#form-unified-login') as HTMLFormElement;
  const inputId = container.querySelector('#input-login-id') as HTMLInputElement;
  const inputPass = container.querySelector('#input-login-pass') as HTMLInputElement;
  const btnSubmit = container.querySelector('#btn-submit-login') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = inputId.value.trim();
    const pass = inputPass.value;
    if (!id || !pass) return;

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Memeriksa...';

    try {
      // 1. Jika pengguna adalah 'admin', verifikasi login Admin
      if (id.toLowerCase() === 'admin') {
        const res = authService.loginAsAdmin(id, pass);
        if (!res.success) {
          showToast(res.error || 'Password admin salah', 'error');
          inputPass.focus();
          inputPass.select();
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Masuk';
          return;
        }

        showToast('Login berhasil sebagai Administrator', 'success');
        router.navigate('/');
        return;
      }

      // 2. Jika bukan admin, verifikasi login Siswa (via NIS atau Nama + Password)
      const res = await authService.loginAsStudent(id, pass);
      if (!res.success) {
        showToast(res.error || 'Data siswa atau password salah', 'error');
        inputPass.focus();
        inputPass.select();
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Masuk';
        return;
      }

      showToast(`Selamat datang, ${res.student?.nama}!`, 'success');
      router.navigate('/portal-siswa');
    } catch {
      showToast('Terjadi kesalahan saat masuk', 'error');
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Masuk';
    }
  });

  return container;
}

