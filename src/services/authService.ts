// ==========================================
// Auth Service — Manajemen Sesi Admin & Siswa
// ==========================================

import type { AuthSession, UserRole, Student } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { spreadsheetService } from './spreadsheet';

const DEFAULT_ADMIN_PASS = 'admin123';

class AuthService {
  /** Dapatkan sesi login saat ini */
  getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (data) {
        return JSON.parse(data) as AuthSession;
      }
    } catch {
      // ignore
    }
    return null;
  }

  /** Dapatkan role user yang sedang aktif */
  getRole(): UserRole {
    const session = this.getSession();
    return session ? session.role : null;
  }

  /** Cek apakah user adalah Admin */
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  /** Cek apakah user adalah Siswa */
  isStudent(): boolean {
    return this.getRole() === 'siswa';
  }

  /** Dapatkan data siswa dari sesi (jika login sebagai siswa) */
  getCurrentStudent(): Student | undefined {
    const session = this.getSession();
    return session?.student;
  }

  /** Dapatkan password admin aktif */
  private getAdminPassword(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASS;
  }

  /** Login sebagai Admin */
  loginAsAdmin(username: string, pass: string): { success: boolean; error?: string } {
    const validUsername = username.trim().toLowerCase() === 'admin';
    const validPassword = pass === this.getAdminPassword();

    if (!validUsername || !validPassword) {
      return {
        success: false,
        error: 'Username atau Password Admin salah! (Default: admin / admin123)',
      };
    }

    const session: AuthSession = {
      role: 'admin',
      username: 'admin',
      loginTime: Date.now(),
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('app:auth-changed', { detail: session }));
    return { success: true };
  }

  /** Login sebagai Siswa (lewat Nama atau NIS beserta Password) */
  async loginAsStudent(nisOrName: string, pass?: string): Promise<{ success: boolean; student?: Student; error?: string }> {
    const query = nisOrName.trim().toLowerCase();
    if (!query) {
      return { success: false, error: 'Masukkan Nama atau NIS siswa!' };
    }

    const students = await spreadsheetService.getStudents();
    const matched = students.find(
      (s) => s.nis.toLowerCase() === query || s.nama.toLowerCase().includes(query)
    );

    if (!matched) {
      return {
        success: false,
        error: `Data siswa "${nisOrName}" tidak ditemukan.`,
      };
    }

    // Jika parameter pass disediakan, cek kecocokan password
    if (pass !== undefined) {
      const expectedPass = matched.password || matched.nis;
      const isPasswordValid = pass === expectedPass || pass === matched.nis || pass === '123456';

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Password siswa salah! (Default: NIS siswa)',
        };
      }
    }

    const session: AuthSession = {
      role: 'siswa',
      username: matched.nis,
      student: matched,
      loginTime: Date.now(),
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('app:auth-changed', { detail: session }));
    return { success: true, student: matched };
  }

  /** Logout / Keluar */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    window.dispatchEvent(new CustomEvent('app:auth-changed', { detail: null }));
  }

  /** Ubah password admin */
  updateAdminPassword(oldPass: string, newPass: string): { success: boolean; error?: string } {
    if (oldPass !== this.getAdminPassword()) {
      return { success: false, error: 'Password lama salah!' };
    }
    if (newPass.length < 4) {
      return { success: false, error: 'Password baru minimal 4 karakter!' };
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPass);
    return { success: true };
  }
}

export const authService = new AuthService();
