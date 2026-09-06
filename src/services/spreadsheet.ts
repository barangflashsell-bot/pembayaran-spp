// ==========================================
// Spreadsheet Service — Google Sheets Integration
// ==========================================

import type { Student, Payment, ApiResponse, DashboardStats } from '../types';
import { APP_CONFIG, STORAGE_KEYS } from '../config/constants';
import { formatRupiah } from '../utils/formatter';

import { schoolService } from './schoolService';

/**
 * SpreadsheetService handles data persistence.
 * - If Apps Script URL is configured, syncs with Google Spreadsheet.
 * - Falls back to localStorage for offline/demo usage.
 */
class SpreadsheetService {
  private get apiUrl(): string {
    const school = schoolService.getSchoolInfo();
    return school.appsScriptUrl || APP_CONFIG.appsScriptUrl || '';
  }

  get useApi(): boolean {
    return !!this.apiUrl;
  }

  // ==========================================
  // API Communication
  // ==========================================

  /** Test connection to Google Apps Script */
  async testConnection(targetUrl?: string): Promise<{ success: boolean; message: string }> {
    const urlStr = targetUrl || this.apiUrl;
    if (!urlStr) {
      return { success: false, message: 'URL Google Apps Script belum diisi.' };
    }

    try {
      const url = new URL(urlStr);
      url.searchParams.set('action', 'getStudents');
      const res = await fetch(url.toString());
      const json = await res.json() as ApiResponse<unknown>;
      if (json && json.success !== undefined) {
        return { success: true, message: 'Koneksi ke Google Spreadsheet BERHASIL & AKTIF!' };
      }
      return { success: false, message: 'Respons API tidak valid. Pastikan Who has access diatur Anyone.' };
    } catch (err) {
      return { success: false, message: 'Gagal menghubungi URL: ' + String(err) };
    }
  }

  /** Send GET request to Apps Script */
  private async apiGet<T>(action: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    if (!this.useApi) {
      throw new Error('API URL not configured');
    }

    const url = new URL(this.apiUrl);
    url.searchParams.set('action', action);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    try {
      const res = await fetch(url.toString());
      return await res.json() as ApiResponse<T>;
    } catch (error) {
      console.error(`API GET error (${action}):`, error);
      return { success: false, error: String(error) };
    }
  }

  /** Send POST request to Apps Script */
  private async apiPost<T>(action: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    if (!this.useApi) {
      throw new Error('API URL not configured');
    }

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action, ...data }),
      });
      return await res.json() as ApiResponse<T>;
    } catch (error) {
      console.error(`API POST error (${action}):`, error);
      return { success: false, error: String(error) };
    }
  }

  // ==========================================
  // LocalStorage Helpers
  // ==========================================

  private getLocal<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setLocal<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ==========================================
  // Student Operations
  // ==========================================

  /** Get all students */
  async getStudents(): Promise<Student[]> {
    if (this.useApi) {
      const res = await this.apiGet<Student[]>('getStudents');
      return res.data ?? [];
    }
    return this.getLocal<Student>(STORAGE_KEYS.STUDENTS);
  }

  /** Add a new student */
  async addStudent(student: Student): Promise<boolean> {
    if (this.useApi) {
      const res = await this.apiPost('addStudent', { student });
      return res.success;
    }

    const students = this.getLocal<Student>(STORAGE_KEYS.STUDENTS);
    // Check duplicate NIS
    if (students.some((s) => s.nis === student.nis)) {
      return false;
    }
    students.push(student);
    this.setLocal(STORAGE_KEYS.STUDENTS, students);
    return true;
  }

  /** Update student data */
  async updateStudent(nis: string, updated: Partial<Student>): Promise<boolean> {
    if (this.useApi) {
      const res = await this.apiPost('updateStudent', { nis, student: updated });
      return res.success;
    }

    const students = this.getLocal<Student>(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex((s) => s.nis === nis);
    if (index === -1) return false;
    students[index] = { ...students[index], ...updated };
    this.setLocal(STORAGE_KEYS.STUDENTS, students);
    return true;
  }

  /** Delete a student */
  async deleteStudent(nis: string): Promise<boolean> {
    if (this.useApi) {
      const res = await this.apiPost('deleteStudent', { nis });
      return res.success;
    }

    const students = this.getLocal<Student>(STORAGE_KEYS.STUDENTS);
    const filtered = students.filter((s) => s.nis !== nis);
    if (filtered.length === students.length) return false;
    this.setLocal(STORAGE_KEYS.STUDENTS, filtered);
    return true;
  }

  /** Get student by NIS */
  async getStudentByNis(nis: string): Promise<Student | undefined> {
    const students = await this.getStudents();
    return students.find((s) => s.nis.trim().toLowerCase() === nis.trim().toLowerCase());
  }

  // ==========================================
  // Payment Operations
  // ==========================================

  /** Get all payments */
  async getPayments(): Promise<Payment[]> {
    if (this.useApi) {
      const res = await this.apiGet<Payment[]>('getPayments');
      return res.data ?? [];
    }
    return this.getLocal<Payment>(STORAGE_KEYS.PAYMENTS);
  }

  /** Add a new payment record */
  async addPayment(payment: Payment): Promise<boolean> {
    // Generate item summary if not present
    if (!payment.rincianItemText && payment.items && payment.items.length > 0) {
      payment.rincianItemText = payment.items
        .map((it) => `${it.nama} (${formatRupiah(it.nominal)})`)
        .join(', ');
    } else if (!payment.rincianItemText) {
      payment.rincianItemText = `SPP ${payment.bulan} ${payment.tahun}`;
    }

    if (!payment.channel) {
      payment.channel = 'admin';
    }

    if (this.useApi) {
      const res = await this.apiPost('addPayment', { payment });
      return res.success;
    }

    const payments = this.getLocal<Payment>(STORAGE_KEYS.PAYMENTS);

    // If this payment is exclusively a single-month SPP and already paid, block duplicate
    if (!payment.items || payment.items.length <= 1) {
      const exists = payments.some(
        (p) =>
          p.nis === payment.nis &&
          p.bulan === payment.bulan &&
          p.tahun === payment.tahun &&
          p.status === 'lunas' &&
          (!p.items || p.items.some((it) => it.kategori === 'spp'))
      );
      if (exists) return false;
    }

    payments.push(payment);
    this.setLocal(STORAGE_KEYS.PAYMENTS, payments);
    return true;
  }

  /** Get payments for a specific student */
  async getStudentPayments(nis: string, tahun?: number): Promise<Payment[]> {
    const payments = await this.getPayments();
    return payments.filter(
      (p) => p.nis === nis && (!tahun || p.tahun === tahun)
    );
  }

  /** Delete a payment */
  async deletePayment(idTransaksi: string): Promise<boolean> {
    if (this.useApi) {
      const res = await this.apiPost('deletePayment', { idTransaksi });
      return res.success;
    }

    const payments = this.getLocal<Payment>(STORAGE_KEYS.PAYMENTS);
    const filtered = payments.filter((p) => p.idTransaksi !== idTransaksi);
    if (filtered.length === payments.length) return false;
    this.setLocal(STORAGE_KEYS.PAYMENTS, filtered);
    return true;
  }

  /** Get payment by transaction ID */
  async getPaymentById(idTransaksi: string): Promise<Payment | undefined> {
    const payments = await this.getPayments();
    return payments.find((p) => p.idTransaksi === idTransaksi);
  }

  // ==========================================
  // Statistics
  // ==========================================

  /** Get dashboard statistics for current month/year */
  async getDashboardStats(bulan: string, tahun: number): Promise<DashboardStats> {
    const students = await this.getStudents();
    const payments = await this.getPayments();

    const monthPayments = payments.filter(
      (p) =>
        (p.bulan === bulan && p.tahun === tahun && p.status === 'lunas') ||
        (p.items && p.items.some((it) => it.bulan === bulan && it.tahun === tahun))
    );

    const paidNis = new Set(monthPayments.map((p) => p.nis));
    const sudahBayar = students.filter((s) => paidNis.has(s.nis)).length;
    const belumBayar = Math.max(0, students.length - sudahBayar);

    const totalPemasukan = payments
      .filter((p) => p.status === 'lunas')
      .reduce((sum, p) => sum + p.nominal, 0);

    const totalOnline = payments
      .filter((p) => p.channel === 'online' && p.status === 'lunas')
      .reduce((sum, p) => sum + p.nominal, 0);

    const totalTunggakan = belumBayar * (APP_CONFIG.nominalSppDefault);

    return {
      totalSiswa: students.length,
      sudahBayar,
      belumBayar,
      totalPemasukan,
      totalTunggakan,
      totalOnline,
    };
  }

  /** Get students who haven't paid for a specific month */
  async getUnpaidStudents(bulan: string, tahun: number): Promise<Student[]> {
    const students = await this.getStudents();
    const payments = await this.getPayments();

    const paidNis = new Set(
      payments
        .filter((p) => 
          (p.bulan === bulan && p.tahun === tahun && p.status === 'lunas') ||
          (p.items && p.items.some((it) => it.bulan === bulan && it.tahun === tahun))
        )
        .map((p) => p.nis)
    );

    return students.filter((s) => !paidNis.has(s.nis));
  }
}

// Singleton instance
export const spreadsheetService = new SpreadsheetService();
