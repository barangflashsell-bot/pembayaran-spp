// ==========================================
// Sidebar Navigation Component
// ==========================================

import { createElement, $, showModal } from '../utils/dom';
import { router } from '../utils/router';
import { notificationService } from '../services/notification';
import { schoolService } from '../services/schoolService';
import { formatDateShort } from '../utils/formatter';

/** Render sidebar */
export function renderSidebar(): HTMLElement {
  const sidebar = createElement('aside', { className: 'sidebar', id: 'sidebar' });
  const school = schoolService.getSchoolInfo();

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="sidebar-logo">🏫</div>
        <div>
          <div class="sidebar-title">SPP & Kasir</div>
          <div class="sidebar-subtitle" id="sidebar-school-name">${school.namaSekolah}</div>
        </div>
      </div>
      <!-- Notification Bell with reactive badge -->
      <button class="notification-bell-btn" id="sidebar-bell-btn" title="Notifikasi Pembayaran">
        🔔
        <span class="bell-badge" id="bell-badge-count" style="display: none;">0</span>
      </button>
    </div>

    <!-- Student Online Quick Switcher Banner -->
    <div class="portal-quick-link-box">
      <a href="#/portal-siswa" class="portal-quick-btn" id="btn-quick-portal">
        <span class="pulse-indicator"></span>
        <span>💳 <strong>Portal Siswa</strong> (Bayar Online)</span>
      </a>
    </div>

    <nav class="sidebar-nav" id="sidebar-nav">
      <span class="nav-label">Menu Administrasi</span>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-footer-info" id="sidebar-footer-info">
        Tahun Ajaran ${school.tahunAjaran}<br>
        <span style="opacity: 0.6">v1.3.0 • Multi-Pos Active</span>
      </div>
    </div>
  `;

  // Render nav links
  const nav = sidebar.querySelector('#sidebar-nav')!;
  const routes = router.getRoutes();

  routes.forEach((route) => {
    const isStudentPortal = route.path === '/portal-siswa';
    const link = createElement('a', {
      className: `nav-link ${isStudentPortal ? 'nav-link-portal' : ''}`,
      'data-path': route.path,
      innerHTML: `
        <span class="nav-icon">${route.icon}</span>
        <span>${route.title}</span>
        ${isStudentPortal ? '<span class="badge badge-primary text-xs ml-auto">ONLINE</span>' : ''}
      `,
    });

    link.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(route.path);
      closeSidebarMobile();
    });

    nav.appendChild(link);
  });

  // Setup Notification Bell functionality
  const bellBtn = sidebar.querySelector('#sidebar-bell-btn') as HTMLButtonElement;
  const bellBadge = sidebar.querySelector('#bell-badge-count') as HTMLElement;
  const schoolNameEl = sidebar.querySelector('#sidebar-school-name') as HTMLElement;
  const schoolFooterEl = sidebar.querySelector('#sidebar-footer-info') as HTMLElement;

  const updateBadge = () => {
    const unread = notificationService.getUnreadCount();
    if (unread > 0) {
      bellBadge.textContent = unread > 99 ? '99+' : String(unread);
      bellBadge.style.display = 'flex';
      bellBtn.classList.add('has-unread');
    } else {
      bellBadge.style.display = 'none';
      bellBtn.classList.remove('has-unread');
    }
  };

  updateBadge();

  // Listen for notification events
  window.addEventListener('app:new-notification', () => {
    updateBadge();
  });
  window.addEventListener('app:notifications-read', () => {
    updateBadge();
  });

  // Listen for school identity updates
  window.addEventListener('app:school-info-updated', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && schoolNameEl) {
      schoolNameEl.textContent = detail.namaSekolah;
    }
    if (detail && schoolFooterEl) {
      schoolFooterEl.innerHTML = `Tahun Ajaran ${detail.tahunAjaran}<br><span style="opacity: 0.6">v1.3.0 • Multi-Pos Active</span>`;
    }
  });

  bellBtn.addEventListener('click', () => {
    openNotificationModal(updateBadge);
  });

  return sidebar;
}

/** Open Notification Center Modal */
function openNotificationModal(onUpdate: () => void): void {
  const notifs = notificationService.getNotifications();
  const modalContent = document.createElement('div');

  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-3);">
      <div>
        <div style="font-weight: bold; font-size: var(--font-size-base);">Pemberitahuan Transaksi Siswa</div>
        <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Notifikasi pembayaran online real-time</div>
      </div>
      <div style="display: flex; gap: var(--space-2);">
        <button class="btn btn-ghost btn-sm" id="btn-mark-all-read">Tandai Dibaca</button>
        <button class="btn btn-ghost btn-sm text-danger" id="btn-clear-all-notifs">Hapus</button>
      </div>
    </div>

    <div class="notifications-list" style="max-height: 400px; overflow-y: auto;">
      ${notifs.length === 0 ? `
        <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
          <div class="empty-state-icon">🔕</div>
          <div class="empty-state-title">Belum Ada Notifikasi</div>
          <div class="empty-state-text">Notifikasi akan muncul secara instan begitu ada siswa yang membayar online.</div>
        </div>
      ` : notifs.map((n) => `
        <div class="notification-item ${n.read ? 'read' : 'unread'}">
          <div class="notif-icon">💳</div>
          <div class="notif-content">
            <div class="notif-title">
              ${n.title}
              ${!n.read ? '<span class="badge badge-primary text-xs" style="font-size: 9px;">BARU</span>' : ''}
            </div>
            <div class="notif-message">${n.message}</div>
            <div class="notif-time">${formatDateShort(new Date(n.timestamp).toISOString())} • ${new Date(n.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  modalContent.querySelector('#btn-mark-all-read')?.addEventListener('click', () => {
    notificationService.markAllAsRead();
    onUpdate();
    openNotificationModal(onUpdate);
  });

  modalContent.querySelector('#btn-clear-all-notifs')?.addEventListener('click', () => {
    notificationService.clearNotifications();
    onUpdate();
    openNotificationModal(onUpdate);
  });

  showModal('🔔 Pusat Notifikasi Admin', modalContent);
}

/** Update active nav link */
export function updateActiveNav(path: string): void {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    const linkPath = link.getAttribute('data-path');
    link.classList.toggle('active', linkPath === path);
  });
}

/** Create mobile menu button */
export function renderMobileMenuBtn(): HTMLElement {
  const btn = createElement('button', {
    className: 'mobile-menu-btn',
    id: 'mobile-menu-btn',
    innerHTML: '☰',
  });

  btn.addEventListener('click', toggleSidebar);
  return btn;
}

/** Create sidebar overlay for mobile */
export function renderSidebarOverlay(): HTMLElement {
  const overlay = createElement('div', {
    className: 'sidebar-overlay',
    id: 'sidebar-overlay',
  });

  overlay.addEventListener('click', closeSidebarMobile);
  return overlay;
}

/** Toggle sidebar on mobile */
function toggleSidebar(): void {
  const sidebar = $('#sidebar');
  const overlay = $('#sidebar-overlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('visible');
}

/** Close sidebar on mobile */
function closeSidebarMobile(): void {
  const sidebar = $('#sidebar');
  const overlay = $('#sidebar-overlay');
  sidebar?.classList.remove('open');
  overlay?.classList.remove('visible');
}
