// ==========================================
// Payment Component
// ==========================================

import { createElement, showToast } from '../utils/dom';
import { formatRupiah, generateTransactionId, toISODate, getCurrentYear } from '../utils/formatter';
import { spreadsheetService } from '../services/spreadsheet';
import { notificationService } from '../services/notification';
import { MONTHS, PAYMENT_METHODS } from '../config/constants';
import { renderReceipt } from './receipt';
import { schoolService } from '../services/schoolService';
import type { Payment, PaymentMethod, MonthName, Student } from '../types';

/** Render payment page */
export function renderPayment(): HTMLElement {
  const page = createElement('div', { className: 'page-enter' });
  const school = schoolService.getSchoolInfo();

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Pembayaran SPP</h1>
      <p class="page-description">Catat pembayaran SPP siswa</p>
    </div>

    <div class="grid-2" style="grid-template-columns: 1fr 1.2fr;">
      <!-- Left: Payment Form -->
      <div class="card">
        <div class="section-header">
          <h3 class="section-title">📝 Form Pembayaran</h3>
        </div>

        <form id="payment-form">
          <div class="form-group">
            <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Pilih Siswa *</span>
              <span style="font-size: 11px; font-weight: normal; color: var(--color-text-muted);">Ketik nama siswa untuk mencari</span>
            </label>
            <div class="searchable-student-container" style="position: relative;">
              <div style="position: relative; display: flex; align-items: center;">
                <input 
                  type="text" 
                  class="form-input" 
                  id="pay-student-search" 
                  placeholder="🔍 Cari nama siswa, kelas, atau NIS..." 
                  autocomplete="off"
                  style="padding-right: 36px;"
                >
                <button 
                  type="button" 
                  id="pay-student-clear" 
                  title="Hapus pilihan siswa"
                  style="position: absolute; right: 10px; background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 14px; display: none; padding: 4px;"
                >✕</button>
              </div>
              <input type="hidden" id="pay-student" required>
              
              <div 
                id="pay-student-dropdown" 
                style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; max-height: 240px; overflow-y: auto; background: var(--color-bg-card, #1a2234); border: 1px solid var(--color-border); border-radius: var(--radius-md); z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);"
              ></div>
            </div>
          </div>

          <div class="form-group" id="student-info-box" style="display: none;">
            <div style="background: var(--color-bg-glass); border-radius: var(--radius-lg); padding: var(--space-4); border: 1px solid var(--color-border);">
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-2);">Informasi Siswa</div>
              <div id="student-info-content" style="font-size: var(--font-size-sm);"></div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Bulan *</label>
              <select class="form-select" id="pay-bulan" required>
                ${MONTHS.map((m, i) => `<option value="${m}" ${i === new Date().getMonth() ? 'selected' : ''}>${m}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tahun *</label>
              <select class="form-select" id="pay-tahun" required>
                ${[getCurrentYear() - 1, getCurrentYear(), getCurrentYear() + 1].map((y) => 
                  `<option value="${y}" ${y === getCurrentYear() ? 'selected' : ''}>${y}</option>`
                ).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nominal *</label>
            <input type="number" class="form-input" id="pay-nominal" min="0" placeholder="250000" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tanggal Bayar</label>
              <input type="date" class="form-input" id="pay-tanggal" value="${toISODate()}">
            </div>
            <div class="form-group">
              <label class="form-label">Metode Bayar</label>
              <select class="form-select" id="pay-metode">
                ${PAYMENT_METHODS.map((m) => `<option value="${m.value}">${m.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Penerima Pembayaran (Kasir / Petugas TU) *</label>
            <input type="text" class="form-input" id="pay-penerima" value="${school.namaBendahara}" placeholder="Nama petugas penerima pembayaran" required>
            <span style="font-size: 11px; color: var(--color-text-muted);">Nama ini akan tercantum di kuitansi resmi sebagai pihak yang menerima setoran.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Keterangan</label>
            <textarea class="form-textarea" id="pay-keterangan" placeholder="Catatan tambahan (opsional)" rows="2"></textarea>
          </div>

          <div style="padding-top: var(--space-4);">
            <button type="submit" class="btn btn-success btn-lg" style="width: 100%;">
              💰 Simpan Pembayaran
            </button>
          </div>
        </form>
      </div>

      <!-- Right: Payment Status Grid -->
      <div class="card">
        <div class="section-header">
          <h3 class="section-title">📊 Status Pembayaran</h3>
          <div class="filter-group">
            <select class="form-select" id="grid-filter-kelas" style="min-width: 120px;">
              <option value="">Semua Kelas</option>
            </select>
          </div>
        </div>
        <div id="payment-status-content">
          <p class="text-muted" style="font-size: var(--font-size-sm);">Pilih siswa pada form untuk melihat status pembayaran.</p>
        </div>
      </div>
    </div>
  `;

  // Setup searchable student selector
  setupStudentSearch(page);

  // Class filter for payment grid
  const kelasFilter = page.querySelector('#grid-filter-kelas') as HTMLSelectElement;
  kelasFilter.addEventListener('change', () => loadClassPaymentGrid(page, kelasFilter.value));

  // Form submit
  const form = page.querySelector('#payment-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => handlePaymentSubmit(e, page));

  return page;
}

/** Setup searchable student dropdown */
async function setupStudentSearch(page: HTMLElement): Promise<void> {
  const searchInput = page.querySelector('#pay-student-search') as HTMLInputElement;
  const hiddenInput = page.querySelector('#pay-student') as HTMLInputElement;
  const clearBtn = page.querySelector('#pay-student-clear') as HTMLButtonElement;
  const dropdown = page.querySelector('#pay-student-dropdown') as HTMLElement;
  const kelasFilter = page.querySelector('#grid-filter-kelas') as HTMLSelectElement;

  const students = await spreadsheetService.getStudents();

  if (kelasFilter) {
    const uniqueClasses = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean))).sort();
    kelasFilter.innerHTML = `
      <option value="">Semua Kelas</option>
      ${uniqueClasses.map((k) => `<option value="${k}">${k}</option>`).join('')}
    `;
  }

  function renderList(query: string = '') {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? students.filter(
          (s) =>
            s.nama.toLowerCase().includes(q) ||
            s.nis.toLowerCase().includes(q) ||
            s.kelas.toLowerCase().includes(q)
        )
      : students;

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 14px; text-align: center; color: var(--color-text-muted); font-size: 13px;">
          Siswa dengan nama atau NIS "<strong>${query}</strong>" tidak ditemukan
        </div>
      `;
      return;
    }

    dropdown.innerHTML = filtered
      .map(
        (s) => `
        <div 
          class="student-dropdown-item" 
          data-nis="${s.nis}" 
          data-label="${s.nama} — ${s.kelas} (${s.nis})"
          style="padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: space-between; transition: background 0.15s ease;"
        >
          <div>
            <div style="font-weight: 600; font-size: 13px; color: var(--color-text);">${s.nama}</div>
            <div style="font-size: 11px; color: var(--color-text-muted);">NIS: ${s.nis} • Kelas ${s.kelas}</div>
          </div>
          <span class="badge badge-primary text-xs">${s.kelas}</span>
        </div>
      `
      )
      .join('');

    // Add item click and hover listeners
    dropdown.querySelectorAll('.student-dropdown-item').forEach((item) => {
      const el = item as HTMLElement;
      el.addEventListener('mouseenter', () => {
        el.style.background = 'rgba(255, 255, 255, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.background = 'transparent';
      });
      el.addEventListener('click', () => {
        const nis = el.getAttribute('data-nis') || '';
        const label = el.getAttribute('data-label') || '';
        hiddenInput.value = nis;
        searchInput.value = label;
        clearBtn.style.display = 'block';
        dropdown.style.display = 'none';
        onStudentSelect(page, nis);
      });
    });
  }

  // Open dropdown on focus
  searchInput.addEventListener('focus', () => {
    dropdown.style.display = 'block';
    renderList(searchInput.value.trim());
  });

  // Filter on input
  searchInput.addEventListener('input', () => {
    dropdown.style.display = 'block';
    renderList(searchInput.value);
    if (!searchInput.value.trim()) {
      clearBtn.style.display = 'none';
      if (hiddenInput.value) {
        hiddenInput.value = '';
        onStudentSelect(page, '');
      }
    } else {
      clearBtn.style.display = 'block';
    }
  });

  // Clear button click
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hiddenInput.value = '';
    searchInput.value = '';
    clearBtn.style.display = 'none';
    dropdown.style.display = 'block';
    renderList('');
    onStudentSelect(page, '');
    searchInput.focus();
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!page.contains(target)) return;
    const container = page.querySelector('.searchable-student-container');
    if (container && !container.contains(target)) {
      dropdown.style.display = 'none';
      if (!hiddenInput.value) {
        searchInput.value = '';
        clearBtn.style.display = 'none';
      }
    }
  });
}

/** Handle student selection */
async function onStudentSelect(page: HTMLElement, nis: string): Promise<void> {
  const infoBox = page.querySelector('#student-info-box') as HTMLElement;
  const infoContent = page.querySelector('#student-info-content') as HTMLElement;
  const nominalInput = page.querySelector('#pay-nominal') as HTMLInputElement;
  const statusContent = page.querySelector('#payment-status-content') as HTMLElement;

  if (!nis) {
    infoBox.style.display = 'none';
    statusContent.innerHTML = '<p class="text-muted" style="font-size: var(--font-size-sm);">Pilih siswa pada form untuk melihat status pembayaran.</p>';
    return;
  }

  const student = await spreadsheetService.getStudentByNis(nis);
  if (!student) return;

  // Show student info
  infoBox.style.display = 'block';
  infoContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: var(--color-text-secondary);">Nama:</span>
      <span style="font-weight: var(--font-weight-semibold);">${student.nama}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: var(--color-text-secondary);">Kelas:</span>
      <span>${student.kelas}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span style="color: var(--color-text-secondary);">SPP/Bulan:</span>
      <span style="font-weight: var(--font-weight-semibold); color: var(--color-primary-light);">${formatRupiah(student.nominalSpp)}</span>
    </div>
  `;

  // Set nominal
  nominalInput.value = String(student.nominalSpp);

  // Show payment status grid
  await renderStudentPaymentGrid(page, student);
}

/** Render payment grid for selected student */
async function renderStudentPaymentGrid(page: HTMLElement, student: Student): Promise<void> {
  const container = page.querySelector('#payment-status-content') as HTMLElement;
  const tahun = getCurrentYear();
  const payments = await spreadsheetService.getStudentPayments(student.nis, tahun);
  const paidMonths = new Set(payments.filter((p) => p.status === 'lunas').map((p) => p.bulan));

  container.innerHTML = `
    <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-4);">
      Status pembayaran ${student.nama} — Tahun ${tahun}
    </p>
    <div class="payment-grid stagger-children">
      ${MONTHS.map((m) => {
        const isPaid = paidMonths.has(m);
        return `
          <div class="payment-month ${isPaid ? 'paid' : ''}">
            <span class="month-status-icon">${isPaid ? '✅' : '⬜'}</span>
            <span class="month-name">${m}</span>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top: var(--space-4); display: flex; gap: var(--space-4); font-size: var(--font-size-xs); color: var(--color-text-muted);">
      <span>✅ Lunas: ${paidMonths.size}</span>
      <span>⬜ Belum: ${12 - paidMonths.size}</span>
    </div>
  `;
}

/** Load class-wide payment grid */
async function loadClassPaymentGrid(page: HTMLElement, kelas: string): Promise<void> {
  const container = page.querySelector('#payment-status-content') as HTMLElement;

  if (!kelas) {
    container.innerHTML = '<p class="text-muted" style="font-size: var(--font-size-sm);">Pilih kelas untuk melihat status pembayaran per kelas.</p>';
    return;
  }

  const students = (await spreadsheetService.getStudents()).filter((s) => s.kelas === kelas);
  const payments = await spreadsheetService.getPayments();
  const tahun = getCurrentYear();

  if (students.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: var(--space-6);">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">Tidak ada siswa di kelas ${kelas}</div>
      </div>
    `;
    return;
  }

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = MONTHS[currentMonthIndex];

  let html = `<p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-4);">
    Status SPP kelas ${kelas} — Bulan ${currentMonth} ${tahun}
  </p>`;

  html += '<div style="display: flex; flex-direction: column; gap: var(--space-2);">';
  students.forEach((s) => {
    const isPaid = payments.some(
      (p) => p.nis === s.nis && p.bulan === currentMonth && p.tahun === tahun && p.status === 'lunas'
    );
    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); background: var(--color-bg-glass); border: 1px solid var(--color-border);">
        <div>
          <span style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">${s.nama}</span>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: var(--space-2);">${s.nis}</span>
        </div>
        <span class="badge ${isPaid ? 'badge-success' : 'badge-danger'}">
          <span class="badge-dot"></span> ${isPaid ? 'Lunas' : 'Belum'}
        </span>
      </div>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

/** Handle payment form submission */
async function handlePaymentSubmit(e: Event, page: HTMLElement): Promise<void> {
  e.preventDefault();

  const nis = (page.querySelector('#pay-student') as HTMLSelectElement).value;
  const bulan = (page.querySelector('#pay-bulan') as HTMLSelectElement).value as MonthName;
  const tahun = Number((page.querySelector('#pay-tahun') as HTMLSelectElement).value);
  const nominal = Number((page.querySelector('#pay-nominal') as HTMLInputElement).value);
  const tanggal = (page.querySelector('#pay-tanggal') as HTMLInputElement).value || toISODate();
  const metode = (page.querySelector('#pay-metode') as HTMLSelectElement).value as PaymentMethod;
  const penerima = (page.querySelector('#pay-penerima') as HTMLInputElement)?.value.trim() || schoolService.getSchoolInfo().namaBendahara;
  const keterangan = (page.querySelector('#pay-keterangan') as HTMLTextAreaElement).value.trim();

  if (!nis) {
    showToast('Mohon cari dan pilih siswa terlebih dahulu', 'warning');
    (page.querySelector('#pay-student-search') as HTMLInputElement)?.focus();
    return;
  }

  if (!bulan || !tahun || !nominal) {
    showToast('Mohon lengkapi semua field yang wajib', 'warning');
    return;
  }

  const student = await spreadsheetService.getStudentByNis(nis);
  if (!student) {
    showToast('Siswa tidak ditemukan', 'error');
    return;
  }

  const payment: Payment = {
    idTransaksi: generateTransactionId(),
    nis,
    nama: student.nama,
    kelas: student.kelas,
    bulan,
    tahun,
    nominal,
    tanggalBayar: tanggal,
    metodeBayar: metode,
    status: 'lunas',
    keterangan,
    channel: 'admin',
    diterimaOleh: penerima,
  };

  const success = await spreadsheetService.addPayment(payment);

  if (success) {
    showToast(`Pembayaran ${student.nama} bulan ${bulan} berhasil dicatat!`, 'success');
    notificationService.sendPaymentSuccess(student.nama, bulan, nominal);

    // Reset form partially
    (page.querySelector('#pay-keterangan') as HTMLTextAreaElement).value = '';

    // Refresh payment grid
    await onStudentSelect(page, nis);

    // Show receipt popup with Print & WhatsApp options
    renderReceipt(payment);
  } else {
    showToast(`${student.nama} sudah membayar SPP bulan ${bulan} ${tahun}`, 'warning');
  }
}
