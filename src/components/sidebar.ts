// ==========================================
// Sidebar Navigation Component (Role-Based)
// ==========================================

import { createElement, $, showModal, showToast } from '../utils/dom';
import { router } from '../utils/router';
import { notificationService } from '../services/notification';
import { schoolService } from '../services/schoolService';
import { authService } from '../services/authService';
import { themeService } from '../services/themeService';
import { formatDateShort } from '../utils/formatter';

/** Render sidebar */
export function renderSidebar(): HTMLElement {
  const sidebar = createElement('aside', { className: 'sidebar', id: 'sidebar' });

  // Function to render content according to role
  function updateSidebarContent() {
    const role = authService.getRole();
    const school = schoolService.getSchoolInfo();
    const student = authService.getCurrentStudent();

    // If on login page or no role, hide sidebar
    const currentPath = window.location.hash.slice(1) || '/';
    if (currentPath === '/login' || !role) {
      sidebar.style.display = 'none';
      return;
    }

    sidebar.style.display = 'flex';

    if (role === 'siswa' && student) {
      // ---- SIDEBAR KHUSUS SISWA (Terbatas & Aman) ----
      sidebar.innerHTML = `
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <div class="sidebar-logo">👨‍🎓</div>
            <div>
              <div class="sidebar-title" style="font-size: var(--font-size-sm);">${student.nama}</div>
              <div class="sidebar-subtitle">Kelas ${student.kelas} • ${student.nis}</div>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav" id="sidebar-nav">
          <span class="nav-label">Menu Siswa</span>
          <a href="#/portal-siswa" class="nav-link active" data-path="/portal-siswa">
            <span class="nav-icon">💳</span>
            <span>Tagihan & Pembayaran</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button type="button" class="sidebar-theme-btn mb-2" id="btn-sidebar-theme" title="Ubah Mode Tampilan (Cerah / Gelap)">
            <span>${themeService.isLight() ? '🌙' : '☀️'}</span>
            <span>${themeService.isLight() ? 'Mode Gelap' : 'Mode Cerah'}</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-sidebar-logout" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-2);">
            <span>🚪</span>
            <span>Keluar</span>
          </button>
          <div class="sidebar-footer-info mt-2" style="text-align: center; font-size: 10px;">
            ${school.namaSekolah}
          </div>
        </div>
      `;

      sidebar.querySelector('#btn-sidebar-theme')?.addEventListener('click', () => {
        themeService.toggleTheme();
      });

      sidebar.querySelector('#btn-sidebar-logout')?.addEventListener('click', () => {
        authService.logout();
        showToast('Anda telah keluar', 'info');
        router.navigate('/login');
      });

      return;
    }

    // ---- SIDEBAR ADMINISTRATOR (Akses Lengkap) ----
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-logo">🏫</div>
          <div>
            <div class="sidebar-title">SPP & Kasir</div>
            <div class="sidebar-subtitle" id="sidebar-school-name">${school.namaSekolah}</div>
          </div>
        </div>
        <button class="notification-bell-btn" id="sidebar-bell-btn" title="Notifikasi Pembayaran">
          🔔
          <span class="bell-badge" id="bell-badge-count" style="display: none;">0</span>
        </button>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        <span class="nav-label">Menu Utama</span>
      </nav>

      <div class="sidebar-footer">
        <button type="button" class="sidebar-theme-btn mb-2" id="btn-sidebar-theme" title="Ubah Mode Tampilan (Cerah / Gelap)">
          <span>${themeService.isLight() ? '🌙' : '☀️'}</span>
          <span>${themeService.isLight() ? 'Mode Gelap' : 'Mode Cerah'}</span>
        </button>
        <button class="btn btn-secondary btn-sm mb-3" id="btn-sidebar-logout" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-2);">
          <span>🚪</span>
          <span>Keluar</span>
        </button>
        <div class="sidebar-footer-info" id="sidebar-footer-info">
          Tahun Ajaran ${school.tahunAjaran}
        </div>
      </div>
    `;

    sidebar.querySelector('#btn-sidebar-theme')?.addEventListener('click', () => {
      themeService.toggleTheme();
    });

    // Render Admin nav links
    const nav = sidebar.querySelector('#sidebar-nav')!;
    const adminRoutes = [
      { path: '/', title: 'Dashboard', icon: '🏠' },
      { path: '/siswa', title: 'Data Siswa', icon: '👨‍🎓' },
      { path: '/pembayaran', title: 'Kasir Pembayaran', icon: '💰' },
      { path: '/riwayat', title: 'Riwayat Pembayaran', icon: '📋' },
      { path: '/pos-pembayaran', title: 'Pos Pembayaran', icon: '🏷️' },
      { path: '/identitas-sekolah', title: 'Identitas Sekolah', icon: '⚙️' },
      { path: '/portal-siswa', title: 'Pratinjau Portal Siswa', icon: '💳' },
    ];

    adminRoutes.forEach((route) => {
      const isPortal = route.path === '/portal-siswa';
      const link = createElement('a', {
        className: `nav-link ${isPortal ? 'nav-link-portal' : ''}`,
        'data-path': route.path,
        innerHTML: `
          <span class="nav-icon">${route.icon}</span>
          <span>${route.title}</span>
          ${isPortal ? '<span class="badge badge-primary text-xs ml-auto">SISWA</span>' : ''}
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

    bellBtn.addEventListener('click', () => {
      openNotificationModal(updateBadge);
    });

    sidebar.querySelector('#btn-sidebar-logout')?.addEventListener('click', () => {
      authService.logout();
      showToast('Anda telah logout dari Panel Admin', 'info');
      router.navigate('/login');
    });
  }

  // Initial render
  updateSidebarContent();

  // Listen for auth changes
  window.addEventListener('app:auth-changed', () => {
    updateSidebarContent();
    const path = window.location.hash.slice(1) || '/';
    updateActiveNav(path);
  });

  // Listen for school identity updates
  window.addEventListener('app:school-info-updated', () => {
    updateSidebarContent();
  });

  // Listen for notifications
  window.addEventListener('app:new-notification', () => {
    const bellBadge = sidebar.querySelector('#bell-badge-count') as HTMLElement;
    const bellBtn = sidebar.querySelector('#sidebar-bell-btn') as HTMLButtonElement;
    if (bellBadge && bellBtn) {
      const unread = notificationService.getUnreadCount();
      if (unread > 0) {
        bellBadge.textContent = unread > 99 ? '99+' : String(unread);
        bellBadge.style.display = 'flex';
        bellBtn.classList.add('has-unread');
      }
    }
  });

  window.addEventListener('app:theme-changed', () => {
    const btn = sidebar.querySelector('#btn-sidebar-theme');
    if (btn) {
      const isLight = themeService.isLight();
      btn.innerHTML = `
        <span>${isLight ? '🌙' : '☀️'}</span>
        <span>${isLight ? 'Mode Gelap' : 'Mode Cerah'}</span>
      `;
    }
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
