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
        <div class="form-group mb-4">
          <label class="form-label" id="label-login-id">Nama Siswa / NIS / Username</label>
          <input 
            type="text" 
            class="form-input form-input-lg" 
            id="input-login-id" 
            placeholder="Masukkan Nama, NIS, atau Username" 
            required 
            autofocus
            autocomplete="username"
          >
        </div>

        <div class="form-group mb-4 animate-fade-in" id="group-login-pass" style="display: none;">
          <label class="form-label">Password Admin</label>
          <input 
            type="password" 
            class="form-input form-input-lg" 
            id="input-login-pass" 
            placeholder="Masukkan password"
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
  const groupPass = container.querySelector('#group-login-pass') as HTMLElement;
  const inputPass = container.querySelector('#input-login-pass') as HTMLInputElement;
  const btnSubmit = container.querySelector('#btn-submit-login') as HTMLButtonElement;

  // Auto-detect when 'admin' is typed to reveal password field smoothly
  inputId.addEventListener('input', () => {
    const val = inputId.value.trim().toLowerCase();
    if (val === 'admin') {
      groupPass.style.display = 'block';
    } else {
      groupPass.style.display = 'none';
      inputPass.value = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = inputId.value.trim();
    if (!id) return;

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Memeriksa...';

    try {
      // 1. Jika pengguna mengetik 'admin', periksa sebagai Admin
      if (id.toLowerCase() === 'admin') {
        if (groupPass.style.display === 'none' || !inputPass.value) {
          groupPass.style.display = 'block';
          inputPass.focus();
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Masuk';
          return;
        }

        const res = authService.loginAsAdmin(id, inputPass.value);
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

      // 2. Jika bukan 'admin', secara otomatis proses sebagai Siswa (via Nama atau NIS)
      const res = await authService.loginAsStudent(id);
      if (!res.success) {
        showToast(res.error || 'Data siswa tidak ditemukan', 'error');
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

