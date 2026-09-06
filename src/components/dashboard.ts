// ==========================================
// Dashboard Component
// ==========================================

import { createElement } from '../utils/dom';
import { formatRupiah, getCurrentMonthIndex, getCurrentYear } from '../utils/formatter';
import { MONTHS } from '../config/constants';
import { spreadsheetService } from '../services/spreadsheet';
import type { Student } from '../types';

/** Render dashboard page */
export function renderDashboard(): HTMLElement {
  const page = createElement('div', { className: 'page-enter' });

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-description">Ringkasan pembayaran SPP & tagihan sekolah bulan ${MONTHS[getCurrentMonthIndex()]} ${getCurrentYear()}</p>
    </div>

    <div class="grid-stats stagger-children" id="stats-container" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      ${renderStatSkeleton()}
      ${renderStatSkeleton()}
      ${renderStatSkeleton()}
      ${renderStatSkeleton()}
      ${renderStatSkeleton()}
    </div>

    <div class="grid-2" id="dashboard-grid">
      <div class="card" id="unpaid-card">
        <div class="section-header">
          <h3 class="section-title">⚠️ Belum Bayar Bulan Ini</h3>
        </div>
        <div id="unpaid-list" class="animate-pulse" style="min-height: 100px;">
          <p class="text-muted" style="font-size: var(--font-size-sm);">Memuat data...</p>
        </div>
      </div>

      <div class="card" id="recent-card">
        <div class="section-header">
          <h3 class="section-title">📋 Pembayaran Terakhir</h3>
          <span class="badge badge-primary text-xs">Semua Channel</span>
        </div>
        <div id="recent-list" class="animate-pulse" style="min-height: 100px;">
          <p class="text-muted" style="font-size: var(--font-size-sm);">Memuat data...</p>
        </div>
      </div>
    </div>
  `;

  // Load data async
  loadDashboardData(page);

  return page;
}

/** Render loading skeleton for stat card */
function renderStatSkeleton(): string {
  return `
    <div class="stat-card">
      <div class="skeleton skeleton-text" style="width: 60%; height: 14px;"></div>
      <div class="skeleton skeleton-text" style="width: 40%; height: 32px; margin-top: 12px;"></div>
    </div>
  `;
}

/** Load dashboard data */
async function loadDashboardData(page: HTMLElement): Promise<void> {
  const bulan = MONTHS[getCurrentMonthIndex()];
  const tahun = getCurrentYear();

  try {
    const [stats, unpaid, payments] = await Promise.all([
      spreadsheetService.getDashboardStats(bulan, tahun),
      spreadsheetService.getUnpaidStudents(bulan, tahun),
      spreadsheetService.getPayments(),
    ]);

    const onlinePayments = payments.filter((p) => p.channel === 'online');
    const onlineNominal = onlinePayments.reduce((sum, p) => sum + p.nominal, 0);

    // Render stat cards
    const statsContainer = page.querySelector('#stats-container');
    if (statsContainer) {
      statsContainer.innerHTML = '';
      statsContainer.classList.add('stagger-children');

      statsContainer.appendChild(createStatCard(
        '👨‍🎓', 'Total Siswa', stats.totalSiswa.toString(), 'Terdaftar aktif', 'primary'
      ));
      statsContainer.appendChild(createStatCard(
        '✅', 'Sudah Bayar SPP', stats.sudahBayar.toString(), `Bulan ${bulan}`, 'success'
      ));
      statsContainer.appendChild(createStatCard(
        '⚠️', 'Belum Bayar SPP', stats.belumBayar.toString(), `Bulan ${bulan}`, 'warning'
      ));
      statsContainer.appendChild(createStatCard(
        '💳', 'Setoran Online', formatRupiah(onlineNominal), `${onlinePayments.length} transaksi online`, 'primary'
      ));
      statsContainer.appendChild(createStatCard(
        '💰', 'Total Pemasukan', formatRupiah(stats.totalPemasukan), `Semua pos tagihan`, 'info'
      ));
    }

    // Render unpaid students list
    const unpaidList = page.querySelector('#unpaid-list');
    if (unpaidList) {
      unpaidList.classList.remove('animate-pulse');
      if (unpaid.length === 0) {
        unpaidList.innerHTML = `
          <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
            <div class="empty-state-icon">🎉</div>
            <div class="empty-state-title">Semua Lunas!</div>
            <div class="empty-state-text">Semua siswa sudah membayar SPP bulan ini.</div>
          </div>
        `;
      } else {
        unpaidList.innerHTML = unpaid.slice(0, 8).map((s: Student) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border);">
            <div>
              <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-primary);">${s.nama}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${s.kelas} • NIS: ${s.nis}</div>
            </div>
            <span class="badge badge-danger"><span class="badge-dot"></span> Belum</span>
          </div>
        `).join('');

        if (unpaid.length > 8) {
          unpaidList.innerHTML += `
            <p class="text-muted mt-4" style="font-size: var(--font-size-xs); text-align: center;">
              +${unpaid.length - 8} siswa lainnya
            </p>
          `;
        }
      }
    }

    // Render recent payments
    const recentList = page.querySelector('#recent-list');
    if (recentList) {
      recentList.classList.remove('animate-pulse');
      const recentPayments = payments
        .sort((a, b) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime())
        .slice(0, 8);

      if (recentPayments.length === 0) {
        recentList.innerHTML = `
          <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-title">Belum Ada Data</div>
            <div class="empty-state-text">Belum ada pembayaran yang tercatat.</div>
          </div>
        `;
      } else {
        recentList.innerHTML = recentPayments.map((p) => {
          const isOnline = p.channel === 'online';
          const rincianText = p.rincianItemText || `SPP ${p.bulan} ${p.tahun}`;
          const rincianShort = rincianText.length > 30 ? rincianText.substring(0, 30) + '...' : rincianText;

          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border);">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  <span style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-primary);">${p.nama}</span>
                  ${isOnline ? '<span class="badge badge-primary text-xs">ONLINE</span>' : '<span class="badge badge-secondary text-xs">KASIR</span>'}
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  ${rincianShort}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-success);">${formatRupiah(p.nominal)}</div>
                <span class="badge badge-success" style="font-size: 10px;"><span class="badge-dot"></span> Lunas</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (error) {
    console.error('Dashboard data error:', error);
  }
}

/** Create a stat card element */
function createStatCard(
  icon: string,
  label: string,
  value: string,
  footer: string,
  variant: string
): HTMLElement {
  const card = createElement('div', {
    className: `stat-card ${variant}`,
    innerHTML: `
      <div class="stat-header">
        <span class="stat-label">${label}</span>
        <div class="stat-icon ${variant}">${icon}</div>
      </div>
      <div class="stat-value count-up">${value}</div>
      <div class="stat-footer">${footer}</div>
    `,
  });
  return card;
}
