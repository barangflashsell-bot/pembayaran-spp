// ==========================================
// App — Core Application Setup
// ==========================================

import { router } from './utils/router';
import { $ } from './utils/dom';
import { renderSidebar, renderMobileMenuBtn, renderSidebarOverlay, updateActiveNav } from './components/sidebar';
import { renderDashboard } from './components/dashboard';
import { renderStudents } from './components/students';
import { renderPayment } from './components/payment';
import { renderHistory } from './components/history';
import { renderStudentPortal } from './components/studentPortal';
import { renderBillableManager } from './components/billableManager';
import { renderSchoolSettings } from './components/schoolSettings';
import { notificationService } from './services/notification';
import { schoolService } from './services/schoolService';
import { spreadsheetService } from './services/spreadsheet';

/** Initialize the application */
export function initApp(): void {
  // Register routes
  router.registerAll([
    {
      path: '/',
      title: 'Dashboard',
      icon: '🏠',
      render: renderDashboard,
    },
    {
      path: '/portal-siswa',
      title: 'Portal Siswa',
      icon: '💳',
      render: renderStudentPortal,
    },
    {
      path: '/pembayaran',
      title: 'Kasir Pembayaran',
      icon: '💰',
      render: renderPayment,
    },
    {
      path: '/riwayat',
      title: 'Riwayat Pembayaran',
      icon: '📋',
      render: renderHistory,
    },
    {
      path: '/siswa',
      title: 'Data Siswa',
      icon: '👨‍🎓',
      render: renderStudents,
    },
    {
      path: '/pos-pembayaran',
      title: 'Pos Pembayaran',
      icon: '🏷️',
      render: renderBillableManager,
    },
    {
      path: '/identitas-sekolah',
      title: 'Identitas Sekolah',
      icon: '⚙️',
      render: renderSchoolSettings,
    },
  ]);

  // Build app shell
  const app = $('#app');
  if (!app) return;

  app.innerHTML = '';
  app.classList.add('app-shell');

  // Render sidebar, overlay, and mobile menu
  app.appendChild(renderMobileMenuBtn());
  app.appendChild(renderSidebarOverlay());
  app.appendChild(renderSidebar());

  // Main content container
  const main = document.createElement('main');
  main.className = 'main-content';
  main.id = 'main-content';
  app.appendChild(main);

  // Route change handler
  router.onRouteChange((path) => {
    const route = router.getCurrentRoute();
    if (route) {
      // Update active nav
      updateActiveNav(path);

      // Update document title with dynamic school name
      const school = schoolService.getSchoolInfo();
      document.title = `${route.title} — ${school.namaSekolah}`;

      // Render page
      main.innerHTML = '';

      // Show config banner if Google Spreadsheet API is not connected
      if (!spreadsheetService.useApi) {
        const banner = document.createElement('div');
        banner.className = 'config-banner animate-fade-in-down';
        banner.innerHTML = `
          <span class="config-banner-icon">⚠️</span>
          <div class="config-banner-text">
            <div class="config-banner-title">Mode Offline / Demo</div>
            <div class="config-banner-desc">
              Data tersimpan di browser ini. Untuk menghubungkan ke <strong>Google Spreadsheet Asli (Real Live)</strong>, 
              masukkan URL Web App di menu <a href="#/identitas-sekolah" style="color: var(--color-primary-light); text-decoration: underline; font-weight: 600;">Identitas Sekolah & Database Real</a>.
            </div>
          </div>
        `;
        main.appendChild(banner);
      }

      main.appendChild(route.render());
    }
  });

  // Start router
  router.start();

  // Request notification permission
  notificationService.requestPermission();

  // Check for unpaid students after 3 seconds
  setTimeout(() => {
    notificationService.checkAndNotify();
  }, 3000);
}
