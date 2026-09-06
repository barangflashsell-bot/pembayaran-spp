// ==========================================
// School Service — Identitas Sekolah & Master Pos Tagihan
// ==========================================

import type { SchoolIdentity, BillableItemTemplate } from '../types';
import { APP_CONFIG, DEFAULT_BILLABLE_ITEMS, STORAGE_KEYS } from '../config/constants';

const DEFAULT_SCHOOL_INFO: SchoolIdentity = {
  namaSekolah: APP_CONFIG.namaSekolah,
  alamatSekolah: APP_CONFIG.alamatSekolah,
  noTelepon: '(021) 789-0123',
  email: 'info@smpn1nusantara.sch.id',
  tahunAjaran: APP_CONFIG.tahunAjaran,
  nominalSppDefault: APP_CONFIG.nominalSppDefault,
  namaKepalaSekolah: 'Dr. H. Bambang Sudiro, M.Pd.',
  nipKepalaSekolah: '19750812 200003 1 002',
  namaBendahara: 'Siti Rahmawati, S.E.',
  nipBendahara: '19820415 200801 2 007',
  catatanKuitansi: 'Kuitansi ini adalah bukti pembayaran yang sah dan tersimpan secara elektronik di database sekolah.',
  appsScriptUrl: APP_CONFIG.appsScriptUrl || '',
};

class SchoolService {
  // ==========================================
  // Identitas Sekolah
  // ==========================================

  /** Dapatkan data identitas sekolah */
  getSchoolInfo(): SchoolIdentity {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHOOL_INFO);
      if (data) {
        return { ...DEFAULT_SCHOOL_INFO, ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_SCHOOL_INFO };
  }

  /** Update identitas sekolah */
  updateSchoolInfo(updated: Partial<SchoolIdentity>): SchoolIdentity {
    const current = this.getSchoolInfo();
    const merged = { ...current, ...updated };
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOOL_INFO, JSON.stringify(merged));
      // Sinkronkan juga ke APP_CONFIG memory
      APP_CONFIG.namaSekolah = merged.namaSekolah;
      APP_CONFIG.alamatSekolah = merged.alamatSekolah;
      APP_CONFIG.tahunAjaran = merged.tahunAjaran;
      APP_CONFIG.nominalSppDefault = merged.nominalSppDefault;
      if (merged.appsScriptUrl !== undefined) {
        APP_CONFIG.appsScriptUrl = merged.appsScriptUrl;
      }
    } catch (e) {
      console.warn('Gagal menyimpan identitas sekolah ke storage:', e);
    }
    window.dispatchEvent(new CustomEvent('app:school-info-updated', { detail: merged }));
    return merged;
  }

  // ==========================================
  // Master Pos Pembayaran (CRUD)
  // ==========================================

  /** Ambil semua pos pembayaran aktif */
  getBillableItems(): BillableItemTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BILLABLE_ITEMS);
      if (data) {
        const items = JSON.parse(data) as BillableItemTemplate[];
        if (Array.isArray(items) && items.length > 0) {
          return items;
        }
      }
    } catch {
      // ignore
    }
    // Inisialisasi dari default
    this.saveBillableItems([...DEFAULT_BILLABLE_ITEMS]);
    return [...DEFAULT_BILLABLE_ITEMS];
  }

  private saveBillableItems(items: BillableItemTemplate[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLABLE_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn('Gagal menyimpan pos pembayaran:', e);
    }
    window.dispatchEvent(new CustomEvent('app:billable-items-updated', { detail: items }));
  }

  /** Tambah pos pembayaran baru */
  addBillableItem(item: Omit<BillableItemTemplate, 'id'>): BillableItemTemplate {
    const items = this.getBillableItems();
    const id = 'pos-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newItem: BillableItemTemplate = { id, ...item };
    items.push(newItem);
    this.saveBillableItems(items);
    return newItem;
  }

  /** Update nama atau nominal pos pembayaran */
  updateBillableItem(id: string, updated: Partial<BillableItemTemplate>): boolean {
    const items = this.getBillableItems();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return false;
    items[idx] = { ...items[idx], ...updated };
    this.saveBillableItems(items);
    return true;
  }

  /** Hapus pos pembayaran */
  deleteBillableItem(id: string): boolean {
    const items = this.getBillableItems();
    const filtered = items.filter((it) => it.id !== id);
    if (filtered.length === items.length) return false;
    this.saveBillableItems(filtered);
    return true;
  }

  /** Reset ke daftar pos tagihan default */
  resetBillableItems(): void {
    this.saveBillableItems([...DEFAULT_BILLABLE_ITEMS]);
  }
}

export const schoolService = new SchoolService();
