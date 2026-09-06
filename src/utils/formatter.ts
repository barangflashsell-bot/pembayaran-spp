// ==========================================
// Formatter Utilities
// ==========================================

import type { PaymentMethod, PaymentStatus } from '../types';

/** Format angka ke Rupiah */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format tanggal ke format Indonesia */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Format tanggal pendek */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** Format tanggal ke ISO string (YYYY-MM-DD) */
export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/** Generate ID transaksi unik */
export function generateTransactionId(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SPP-${y}${m}${d}-${rand}`;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Get label for payment status */
export function getStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    lunas: 'Lunas',
    belum: 'Belum Bayar',
    sebagian: 'Sebagian',
  };
  return labels[status] ?? status;
}

/** Get badge class for payment status */
export function getStatusBadgeClass(status: PaymentStatus): string {
  const classes: Record<PaymentStatus, string> = {
    lunas: 'badge-success',
    belum: 'badge-danger',
    sebagian: 'badge-warning',
  };
  return classes[status] ?? 'badge-info';
}

/** Get label for payment method */
export function getMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    tunai: 'Tunai',
    transfer: 'Transfer Bank',
    qris: 'QRIS',
    va_bca: 'VA BCA',
    va_bri: 'BRIVA (BRI)',
    va_mandiri: 'VA Mandiri',
    gopay: 'GoPay',
    dana: 'DANA',
    ovo: 'OVO',
  };
  return labels[method] ?? method;
}

/** Get current month index (0-based) */
export function getCurrentMonthIndex(): number {
  return new Date().getMonth();
}

/** Get current year */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/** Truncate text */
export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}
