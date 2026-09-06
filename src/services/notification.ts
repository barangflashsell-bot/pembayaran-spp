// ==========================================
// Notification Service — Browser & In-App Notifications
// ==========================================

import type { Student, Payment, AppNotification } from '../types';
import { APP_CONFIG, MONTHS, STORAGE_KEYS } from '../config/constants';
import { formatRupiah, getCurrentMonthIndex } from '../utils/formatter';
import { spreadsheetService } from './spreadsheet';
import { showToast } from '../utils/dom';

class NotificationService {
  private permission: NotificationPermission = 'default';
  private audioCtx: AudioContext | null = null;

  /** Request notification permission from browser */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    }

    return false;
  }

  /** Check if notifications are enabled */
  get isEnabled(): boolean {
    return this.permission === 'granted' || Notification?.permission === 'granted';
  }

  /**
   * Play a pleasant two-tone notification chime using Web Audio API.
   * Completely free, offline, and instant!
   */
  playNotificationSound(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Note 1: Higher pleasant chime (880Hz - A5)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Note 2: Cheerful confirmation chime (1174.66Hz - D6)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, now + 0.12);
      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (err) {
      console.warn('Audio playback not permitted or not supported:', err);
    }
  }

  /** Send a browser notification */
  send(title: string, body: string, icon: string = '🏫'): void {
    if (!this.isEnabled) {
      showToast(body, 'info');
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`,
        badge: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>`,
        tag: 'spp-notification',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 8 seconds
      setTimeout(() => notification.close(), 8000);
    } catch {
      showToast(body, 'info');
    }
  }

  /** Send payment reminder notification */
  sendReminder(student: Student): void {
    const bulan = MONTHS[getCurrentMonthIndex()];
    this.send(
      `⚠️ Pengingat SPP - ${APP_CONFIG.namaSekolah}`,
      `${student.nama} (${student.kelas}) belum membayar SPP bulan ${bulan}. Nominal: ${formatRupiah(student.nominalSpp)}`,
      '💰'
    );
  }

  /** Check and notify for unpaid students */
  async checkAndNotify(): Promise<void> {
    const bulan = MONTHS[getCurrentMonthIndex()];
    const tahun = new Date().getFullYear();

    try {
      const unpaid = await spreadsheetService.getUnpaidStudents(bulan, tahun);

      if (unpaid.length > 0) {
        this.send(
          `📋 Tunggakan SPP - ${bulan} ${tahun}`,
          `${unpaid.length} siswa belum membayar SPP bulan ${bulan} ${tahun}.`,
          '⚠️'
        );

        showToast(
          `${unpaid.length} siswa belum membayar SPP bulan ${bulan}`,
          'warning',
          6000
        );
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }

  /** Send payment success notification */
  sendPaymentSuccess(nama: string, bulan: string, nominal: number): void {
    this.playNotificationSound();
    this.send(
      '✅ Pembayaran Berhasil',
      `${nama} telah membayar SPP bulan ${bulan} sebesar ${formatRupiah(nominal)}.`,
      '✅'
    );
  }

  /**
   * Notify Admin when a student completes an online payment!
   * - Plays chime
   * - Triggers push notification
   * - Displays rich toast
   * - Records to in-app notification list
   * - Dispatches 'app:new-notification' event for reactive UI updates
   */
  notifyNewOnlinePayment(payment: Payment): void {
    this.playNotificationSound();

    const title = '🔔 Pembayaran Online Diterima!';
    const itemSummary = payment.rincianItemText || `Pembayaran ${payment.bulan} ${payment.tahun}`;
    const body = `${payment.nama} (${payment.kelas}) membayar ${formatRupiah(payment.nominal)} untuk [${itemSummary}].`;

    // 1. Browser push notification
    this.send(title, body, '💳');

    // 2. In-app toast
    showToast(`🎉 ${body}`, 'success', 7000);

    // 3. Save to localStorage notifications
    const notifs = this.getNotifications();
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      title,
      message: body,
      idTransaksi: payment.idTransaksi,
      nominal: payment.nominal,
      namaSiswa: payment.nama,
      read: false,
    };

    notifs.unshift(newNotif);
    // Keep max 50 recent notifications
    if (notifs.length > 50) notifs.length = 50;

    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.warn('Failed saving notifications to storage:', e);
    }

    // 4. Dispatch event for notification bell
    window.dispatchEvent(new CustomEvent('app:new-notification', { detail: newNotif }));
  }

  /** Get all notifications */
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /** Get unread notification count */
  getUnreadCount(): number {
    const notifs = this.getNotifications();
    return notifs.filter((n) => !n.read).length;
  }

  /** Mark all notifications as read */
  markAllAsRead(): void {
    const notifs = this.getNotifications();
    notifs.forEach((n) => (n.read = true));
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('app:notifications-read'));
  }

  /** Clear all notifications */
  clearNotifications(): void {
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    window.dispatchEvent(new CustomEvent('app:notifications-read'));
  }
}

// Singleton instance
export const notificationService = new NotificationService();
