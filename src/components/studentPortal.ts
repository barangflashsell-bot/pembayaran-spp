// ==========================================
// Student Portal Component — Masuk via Nama/NIS, Tagihan & Riwayat
// ==========================================

import { createElement, showToast } from '../utils/dom';
import { formatRupiah, formatDateShort, generateTransactionId, toISODate, getCurrentYear } from '../utils/formatter';
import { spreadsheetService } from '../services/spreadsheet';
import { notificationService } from '../services/notification';
import { schoolService } from '../services/schoolService';
import { authService } from '../services/authService';
import { router } from '../utils/router';
import { MONTHS } from '../config/constants';
import { renderReceipt } from './receipt';
import type { Student, Payment, PaymentMethod, PaymentItemDetail, MonthName } from '../types';

interface SelectedItem {
  id: string;
  nama: string;
  kategori: 'spp' | 'seragam' | 'buku' | 'gedung' | 'kegiatan' | 'ujian' | 'bebas' | 'lainnya';
  nominal: number;
  bulan?: MonthName;
  tahun?: number;
  keterangan?: string;
}

/** Render Student Online Payment Portal */
export function renderStudentPortal(): HTMLElement {
  const container = createElement('div', { className: 'page-enter' });
  const school = schoolService.getSchoolInfo();

  // Internal state
  let currentStudent: Student | null = null;
  let selectedItems: Map<string, SelectedItem> = new Map();
  let studentPaidMonths: Set<string> = new Set();
  let studentPaymentHistory: Payment[] = [];

  container.innerHTML = `
    <!-- Hero Banner -->
    <div class="portal-hero">
      <div class="portal-hero-badge">💳 Portal Mandiri Siswa & Wali Murid</div>
      <h1 class="portal-hero-title">Pembayaran Online ${school.namaSekolah}</h1>
      <p class="portal-hero-desc">
        Masuk menggunakan <strong>Nama Siswa</strong> atau <strong>NIS</strong> untuk melihat rincian tagihan yang harus dibayar,
        melakukan pembayaran online praktis, serta melihat sejumlah apa saja yang sudah dibayar lengkap dengan kuitansi resmi.
      </p>
    </div>

    <!-- Login / Identity Card (Displayed when no student selected) -->
    <div class="card mb-6" id="portal-login-card" style="border: 1px solid var(--color-primary-light);">
      <div class="section-header">
        <h3 class="section-title">🔑 Masuk ke Akun Siswa</h3>
        <span class="badge badge-primary">Nama atau NIS</span>
      </div>
      <p class="text-sm text-muted mb-4">
        Silakan masukkan Nama Siswa atau Nomor Induk Siswa (NIS) untuk membuka akun pembayaran:
      </p>

      <form id="portal-login-form" style="max-width: 600px;">
        <div class="form-group">
          <label class="form-label">Nama Siswa atau NIS *</label>
          <div style="display: flex; gap: var(--space-2);">
            <input type="text" class="form-input" id="portal-input-identity" placeholder="Ketik Nama (misal: Budi) atau NIS (misal: 2026001)" required autofocus>
            <button class="btn btn-primary" type="submit" id="btn-login-student">
              🚀 Masuk
            </button>
          </div>
        </div>
      </form>

      <!-- Quick Select Registered Students -->
      <div style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px dashed var(--color-border);">
        <span class="text-xs text-muted" style="display: block; margin-bottom: var(--space-2);">
          Atau pilih langsung siswa terdaftar di bawah ini untuk masuk instan:
        </span>
        <div id="quick-student-chips" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
          <span class="text-muted text-xs">Memuat daftar siswa...</span>
        </div>
      </div>
    </div>

    <!-- Student Active Session Area (Hidden until logged in) -->
    <div id="portal-session-area" style="display: none;">
      <!-- Logged-in Student Card with Switch Button -->
      <div class="card mb-6" style="background: var(--color-bg-glass); border: 1px solid var(--color-primary-light);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4);">
          <div class="portal-profile-grid" style="flex: 1;">
            <div class="profile-avatar">👨‍🎓</div>
            <div class="profile-details">
              <div class="profile-name" id="session-student-name">Nama Siswa</div>
              <div class="profile-meta" id="session-student-meta">NIS: - • Kelas: - • Wali: -</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-switch-student">
            🚪 Keluar / Ganti Siswa
          </button>
        </div>

        <!-- Portal Tabs Navigation -->
        <div class="portal-tabs-nav mt-4" style="display: flex; gap: var(--space-2); border-top: 1px solid var(--color-border); padding-top: var(--space-4);">
          <button class="btn btn-primary" id="tab-btn-tagihan">
            💳 Tagihan Yang Harus Dibayar
          </button>
          <button class="btn btn-secondary" id="tab-btn-riwayat">
            📋 Sejumlah Yang Sudah Dibayar (<span id="count-history-badge">0</span>)
          </button>
        </div>
      </div>

      <!-- Tab Content 1: Tagihan Yang Harus Dibayar -->
      <div id="tab-content-tagihan">
        <div class="portal-layout-grid">
          <!-- Left: Items Selection -->
          <div class="portal-items-column">
            <!-- SPP Bulanan -->
            <div class="card mb-4">
              <div class="section-header">
                <div>
                  <h3 class="section-title">📅 SPP Bulanan (${getCurrentYear()})</h3>
                  <p class="text-sm text-muted">Centang satu atau beberapa bulan yang ingin Anda bayar</p>
                </div>
                <span class="badge badge-success" id="spp-rate-badge">Rp 250.000 / bln</span>
              </div>
              <div class="portal-spp-grid" id="portal-spp-months-container">
                <!-- Rendered dynamically -->
              </div>
            </div>

            <!-- Pos Tagihan Lainnya (Dikelola Admin) -->
            <div class="card mb-4">
              <div class="section-header">
                <div>
                  <h3 class="section-title">📦 Pos Tagihan Sekolah Lainnya</h3>
                  <p class="text-sm text-muted">Pos tagihan aktif yang ditetapkan pihak sekolah</p>
                </div>
              </div>
              <div class="portal-other-items" id="portal-other-items-container">
                <!-- Rendered dynamically from schoolService -->
              </div>
            </div>

            <!-- Pos Bebas / Donasi / Sukarela -->
            <div class="card mb-4">
              <div class="section-header">
                <div>
                  <h3 class="section-title">✨ Tagihan Bebas / Cicilan / Donasi Sukarela</h3>
                  <p class="text-sm text-muted">Anda dapat membayar berapapun sesuai nominal yang Anda masukkan</p>
                </div>
              </div>

              <div class="custom-bill-box">
                <label class="custom-checkbox-wrapper" style="margin-bottom: var(--space-3);">
                  <input type="checkbox" id="check-custom-amount" class="custom-checkbox">
                  <span class="custom-checkbox-label" style="font-weight: 600;">Aktifkan Pembayaran Nominal Bebas</span>
                </label>

                <div id="custom-amount-inputs" style="display: none; padding-top: var(--space-2);">
                  <div class="grid-2" style="grid-template-columns: 1.5fr 1fr; gap: var(--space-3);">
                    <div class="form-group">
                      <label class="form-label">Keperluan Pembayaran</label>
                      <input type="text" class="form-input" id="custom-bill-name" placeholder="Misal: Cicilan DSP, Infaq, Donasi Fasilitas" value="Donasi / Cicilan Bebas">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nominal Bayar (Rp) *</label>
                      <input type="number" class="form-input" id="custom-bill-nominal" min="1000" step="5000" placeholder="50000" value="50000">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Summary & Checkout Sticky Box -->
          <div class="portal-summary-column">
            <div class="card sticky-summary-card">
              <div class="section-header">
                <h3 class="section-title">🧾 Rincian Pembayaran</h3>
                <span class="badge badge-primary" id="selected-count-badge">0 Item</span>
              </div>

              <div class="summary-items-list" id="summary-items-list">
                <div class="text-center text-muted" style="padding: var(--space-8);">
                  Belum ada tagihan yang dipilih.<br>
                  <small>Silakan centang item di sebelah kiri.</small>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-total-row">
                <span class="summary-total-label">Total Yang Harus Dibayar:</span>
                <span class="summary-total-value" id="summary-total-amount">Rp 0</span>
              </div>

              <!-- Payment Method Selection -->
              <div class="form-group mt-4">
                <label class="form-label">Metode Pembayaran Online</label>
                <div class="payment-method-selector">
                  <label class="method-option active">
                    <input type="radio" name="portal-payment-method" value="qris" checked>
                    <div class="method-content">
                      <span class="method-icon">📱</span>
                      <div>
                        <div class="method-title">QRIS Instan (Semua Bank & E-Wallet)</div>
                        <div class="method-desc">BCA, BRI, Mandiri, GoPay, Dana, OVO, ShopeePay</div>
                      </div>
                    </div>
                  </label>

                  <label class="method-option">
                    <input type="radio" name="portal-payment-method" value="va_bca">
                    <div class="method-content">
                      <span class="method-icon">🏦</span>
                      <div>
                        <div class="method-title">BCA Virtual Account</div>
                        <div class="method-desc">Transfer lewat m-BCA / ATM</div>
                      </div>
                    </div>
                  </label>

                  <label class="method-option">
                    <input type="radio" name="portal-payment-method" value="va_bri">
                    <div class="method-content">
                      <span class="method-icon">🏛️</span>
                      <div>
                        <div class="method-title">BRI Virtual Account (BRIVA)</div>
                        <div class="method-desc">Transfer lewat BRImo / ATM BRI</div>
                      </div>
                    </div>
                  </label>

                  <label class="method-option">
                    <input type="radio" name="portal-payment-method" value="dana">
                    <div class="method-content">
                      <span class="method-icon">👛</span>
                      <div>
                        <div class="method-title">DANA / E-Wallet</div>
                        <div class="method-desc">Pembayaran dompet digital</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button class="btn btn-success btn-lg mt-4" id="btn-process-online-pay" style="width: 100%;" disabled>
                🔒 Lanjutkan Pembayaran Online
              </button>
              <p class="text-xs text-muted text-center mt-2">
                🛡️ Siswa & Admin otomatis menerima notifikasi, kuitansi resmi langsung dicetak atas nama sekolah.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content 2: Sejumlah Yang Sudah Dibayar (Riwayat Siswa) -->
      <div id="tab-content-riwayat" style="display: none;">
        <div class="card">
          <div class="section-header">
            <div>
              <h3 class="section-title">📋 Catatan Sejumlah Yang Sudah Dibayar</h3>
              <p class="text-sm text-muted">Seluruh riwayat pembayaran yang telah dilunasi beserta bukti kuitansi resmi</p>
            </div>
            <div id="total-paid-summary" class="badge badge-success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
              Total Lunas: Rp 0
            </div>
          </div>

          <div class="table-container">
            <table class="data-table" id="student-history-table">
              <thead>
                <tr>
                  <th>No. Kuitansi</th>
                  <th>Tanggal Bayar</th>
                  <th>Rincian Pos Tagihan yang Dibayar</th>
                  <th>Total Nominal</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th style="text-align: center;">Cetak Kuitansi</th>
                </tr>
              </thead>
              <tbody id="student-history-tbody">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Gateway Simulator Modal -->
    <div id="payment-gateway-modal" class="modal-overlay" style="display: none;">
      <div class="modal-card animate-scale-up" style="max-width: 500px;">
        <div class="modal-header">
          <h3 class="modal-title" id="gateway-modal-title">Pembayaran Online</h3>
          <button class="modal-close" id="btn-close-gateway">&times;</button>
        </div>
        <div class="modal-body" id="gateway-modal-body"></div>
      </div>
    </div>
  `;

  // UI Elements
  const loginCard = container.querySelector('#portal-login-card') as HTMLElement;
  const loginForm = container.querySelector('#portal-login-form') as HTMLFormElement;
  const inputIdentity = container.querySelector('#portal-input-identity') as HTMLInputElement;
  const quickChips = container.querySelector('#quick-student-chips') as HTMLElement;
  const sessionArea = container.querySelector('#portal-session-area') as HTMLElement;
  const sessionName = container.querySelector('#session-student-name') as HTMLElement;
  const sessionMeta = container.querySelector('#session-student-meta') as HTMLElement;
  const btnSwitch = container.querySelector('#btn-switch-student') as HTMLButtonElement;
  const tabBtnTagihan = container.querySelector('#tab-btn-tagihan') as HTMLButtonElement;
  const tabBtnRiwayat = container.querySelector('#tab-btn-riwayat') as HTMLButtonElement;
  const tabTagihan = container.querySelector('#tab-content-tagihan') as HTMLElement;
  const tabRiwayat = container.querySelector('#tab-content-riwayat') as HTMLElement;
  const countHistoryBadge = container.querySelector('#count-history-badge') as HTMLElement;
  const historyTbody = container.querySelector('#student-history-tbody') as HTMLElement;
  const totalPaidBadge = container.querySelector('#total-paid-summary') as HTMLElement;
  const sppMonthsContainer = container.querySelector('#portal-spp-months-container') as HTMLElement;
  const otherItemsContainer = container.querySelector('#portal-other-items-container') as HTMLElement;
  const sppRateBadge = container.querySelector('#spp-rate-badge') as HTMLElement;
  const checkCustom = container.querySelector('#check-custom-amount') as HTMLInputElement;
  const customInputs = container.querySelector('#custom-amount-inputs') as HTMLElement;
  const customNominal = container.querySelector('#custom-bill-nominal') as HTMLInputElement;
  const customName = container.querySelector('#custom-bill-name') as HTMLInputElement;
  const summaryList = container.querySelector('#summary-items-list') as HTMLElement;
  const summaryTotal = container.querySelector('#summary-total-amount') as HTMLElement;
  const selectedCountBadge = container.querySelector('#selected-count-badge') as HTMLElement;
  const btnProcessPay = container.querySelector('#btn-process-online-pay') as HTMLButtonElement;
  const gatewayModal = container.querySelector('#payment-gateway-modal') as HTMLElement;
  const gatewayModalTitle = container.querySelector('#gateway-modal-title') as HTMLElement;
  const gatewayModalBody = container.querySelector('#gateway-modal-body') as HTMLElement;
  const btnCloseGateway = container.querySelector('#btn-close-gateway') as HTMLButtonElement;

  // Check if student already authenticated in authService
  const sessionStudent = authService.getCurrentStudent();
  if (sessionStudent) {
    activateStudentSession(sessionStudent);
  } else {
    // Load Quick Student Chips for demo/convenience
    loadQuickStudents();
  }

  // Handle Login via Form
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = inputIdentity.value.trim();
    if (!query) return;
    await loginStudent(query);
  });

  // Handle Switch Student / Logout
  btnSwitch.addEventListener('click', () => {
    logoutStudent();
  });

  // Handle Tab Switching
  tabBtnTagihan.addEventListener('click', () => {
    tabBtnTagihan.className = 'btn btn-primary';
    tabBtnRiwayat.className = 'btn btn-secondary';
    tabTagihan.style.display = 'block';
    tabRiwayat.style.display = 'none';
  });

  tabBtnRiwayat.addEventListener('click', () => {
    tabBtnTagihan.className = 'btn btn-secondary';
    tabBtnRiwayat.className = 'btn btn-primary';
    tabTagihan.style.display = 'none';
    tabRiwayat.style.display = 'block';
    loadStudentHistoryTable();
  });

  // Handle Payment Method Selection Styles
  container.querySelectorAll('input[name="portal-payment-method"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      container.querySelectorAll('.method-option').forEach((opt) => opt.classList.remove('active'));
      (radio as HTMLElement).closest('.method-option')?.classList.add('active');
    });
  });

  // Custom Amount Checkbox
  checkCustom.addEventListener('change', () => {
    if (checkCustom.checked) {
      customInputs.style.display = 'block';
      updateCustomItem();
    } else {
      customInputs.style.display = 'none';
      selectedItems.delete('item-custom');
      updateSummaryUI();
    }
  });

  customNominal.addEventListener('input', () => {
    if (checkCustom.checked) updateCustomItem();
  });
  customName.addEventListener('input', () => {
    if (checkCustom.checked) updateCustomItem();
  });

  function updateCustomItem() {
    const nom = Math.max(0, Number(customNominal.value) || 0);
    const label = customName.value.trim() || 'Tagihan Bebas / Donasi';
    selectedItems.set('item-custom', {
      id: 'item-custom',
      nama: label,
      kategori: 'bebas',
      nominal: nom,
      keterangan: 'Nominal bebas ditentukan siswa',
    });
    updateSummaryUI();
  }

  // Handle Process Pay Button
  btnProcessPay.addEventListener('click', () => {
    if (!currentStudent) return;
    if (selectedItems.size === 0) {
      showToast('Pilih minimal satu pos tagihan yang ingin dibayar', 'warning');
      return;
    }
    const selectedMethod = (
      container.querySelector('input[name="portal-payment-method"]:checked') as HTMLInputElement
    )?.value as PaymentMethod || 'qris';

    openPaymentGateway(selectedMethod);
  });

  // Close Gateway Modal
  btnCloseGateway.addEventListener('click', () => {
    gatewayModal.style.display = 'none';
  });

  /** Load registered students quick select chips */
  async function loadQuickStudents() {
    const students = await spreadsheetService.getStudents();
    if (students.length === 0) {
      quickChips.innerHTML = '<span class="text-muted text-xs">Belum ada data siswa terdaftar.</span>';
      return;
    }

    quickChips.innerHTML = '';
    students.forEach((s) => {
      const chip = createElement('button', {
        className: 'btn btn-ghost btn-sm',
        style: 'border: 1px solid var(--color-border); border-radius: var(--radius-full); padding: 4px 12px; font-size: 11px;',
        innerHTML: `👨‍🎓 ${s.nama} (${s.nis})`,
      });

      chip.addEventListener('click', () => {
        loginStudent(s.nis);
      });

      quickChips.appendChild(chip);
    });
  }

  /** Activate student session in UI */
  async function activateStudentSession(matched: Student) {
    currentStudent = matched;
    loginCard.style.display = 'none';
    sessionArea.style.display = 'block';

    sessionName.textContent = matched.nama;
    sessionMeta.innerHTML = `<strong>NIS:</strong> ${matched.nis} • <strong>Kelas:</strong> ${matched.kelas} • <strong>Wali:</strong> ${matched.namaOrangTua || '-'} • <strong>HP:</strong> ${matched.noHp || '-'}`;

    sppRateBadge.textContent = `${formatRupiah(matched.nominalSpp)} / bln`;

    // Fetch payments of this student
    await refreshStudentData();
  }

  /** Login student by NIS or Name */
  async function loginStudent(query: string) {
    const res = await authService.loginAsStudent(query);
    if (!res.success || !res.student) {
      showToast(res.error || 'Siswa tidak ditemukan', 'error');
      return;
    }

    await activateStudentSession(res.student);
    showToast(`Selamat datang, ${res.student.nama}!`, 'success');
  }

  function logoutStudent() {
    currentStudent = null;
    const role = authService.getRole();
    if (role === 'admin') {
      sessionArea.style.display = 'none';
      loginCard.style.display = 'block';
      inputIdentity.value = '';
      selectedItems.clear();
      updateSummaryUI();
      showToast('Selesai pratinjau akun siswa', 'info');
    } else {
      authService.logout();
      showToast('Anda telah keluar dari akun siswa', 'info');
      router.navigate('/login');
    }
  }

  /** Refresh data: check paid months and payment history */
  async function refreshStudentData() {
    if (!currentStudent) return;

    studentPaymentHistory = await spreadsheetService.getStudentPayments(currentStudent.nis);
    studentPaidMonths.clear();

    studentPaymentHistory.forEach((p) => {
      if (p.status === 'lunas') {
        studentPaidMonths.add(p.bulan);
        if (p.items) {
          p.items.forEach((it) => {
            if (it.kategori === 'spp' && it.bulan) {
              studentPaidMonths.add(it.bulan);
            }
          });
        }
      }
    });

    countHistoryBadge.textContent = String(studentPaymentHistory.length);

    // Reset items selection
    selectedItems.clear();
    checkCustom.checked = false;
    customInputs.style.display = 'none';

    // Render SPP months
    renderSppMonthsGrid();

    // Render other items (from dynamic schoolService)
    renderOtherItems();

    // Update Summary
    updateSummaryUI();
  }

  /** Render SPP Months Checklist */
  function renderSppMonthsGrid() {
    sppMonthsContainer.innerHTML = '';
    const rate = currentStudent?.nominalSpp || schoolService.getSchoolInfo().nominalSppDefault;

    MONTHS.forEach((bulan) => {
      const isPaid = studentPaidMonths.has(bulan);
      const itemId = `spp-${bulan}-${getCurrentYear()}`;
      const isSelected = selectedItems.has(itemId);

      const card = createElement('label', {
        className: `portal-month-card ${isPaid ? 'paid' : ''} ${isSelected ? 'selected' : ''}`,
      });

      card.innerHTML = `
        <div class="month-card-header">
          <span class="month-name">${bulan}</span>
          ${isPaid 
            ? '<span class="badge badge-success text-xs">✓ Lunas</span>' 
            : `<input type="checkbox" class="month-checkbox" data-month="${bulan}" ${isSelected ? 'checked' : ''}>`
          }
        </div>
        <div class="month-card-nominal">${formatRupiah(rate)}</div>
        <div class="month-card-status text-xs">${isPaid ? 'Sudah Dilunasi' : 'Belum Dibayar'}</div>
      `;

      if (!isPaid) {
        const checkbox = card.querySelector('.month-checkbox') as HTMLInputElement;
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            selectedItems.set(itemId, {
              id: itemId,
              nama: `SPP Bulan ${bulan} ${getCurrentYear()}`,
              kategori: 'spp',
              nominal: rate,
              bulan,
              tahun: getCurrentYear(),
            });
            card.classList.add('selected');
          } else {
            selectedItems.delete(itemId);
            card.classList.remove('selected');
          }
          updateSummaryUI();
        });
      }

      sppMonthsContainer.appendChild(card);
    });
  }

  /** Render Dynamic Billable Items from schoolService */
  function renderOtherItems() {
    otherItemsContainer.innerHTML = '';
    // Ambil pos tagihan aktif dari schoolService (yang dikelola admin)
    const templates = schoolService.getBillableItems().filter(
      (item) => item.kategori !== 'spp' && !item.isCustomNominal
    );

    if (templates.length === 0) {
      otherItemsContainer.innerHTML = `
        <div class="text-muted text-xs text-center" style="padding: var(--space-4);">
          Tidak ada pos tagihan khusus lainnya.
        </div>
      `;
      return;
    }

    templates.forEach((item) => {
      const itemId = `item-${item.id}`;
      const isSelected = selectedItems.has(itemId);

      const card = createElement('label', {
        className: `portal-item-row ${isSelected ? 'selected' : ''}`,
      });

      card.innerHTML = `
        <div class="portal-item-left">
          <input type="checkbox" class="portal-item-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
          <div class="portal-item-info">
            <div class="portal-item-title">${item.nama}</div>
            <div class="portal-item-desc">${item.deskripsi || '-'}</div>
          </div>
        </div>
        <div class="portal-item-price">${formatRupiah(item.nominalDefault)}</div>
      `;

      const checkbox = card.querySelector('.portal-item-checkbox') as HTMLInputElement;
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          selectedItems.set(itemId, {
            id: itemId,
            nama: item.nama,
            kategori: item.kategori,
            nominal: item.nominalDefault,
          });
          card.classList.add('selected');
        } else {
          selectedItems.delete(itemId);
          card.classList.remove('selected');
        }
        updateSummaryUI();
      });

      otherItemsContainer.appendChild(card);
    });
  }

  /** Update Summary & Live Total */
  function updateSummaryUI() {
    const items = Array.from(selectedItems.values());
    const count = items.length;
    const total = items.reduce((sum, it) => sum + it.nominal, 0);

    selectedCountBadge.textContent = `${count} Item`;
    summaryTotal.textContent = formatRupiah(total);

    if (count === 0) {
      summaryList.innerHTML = `
        <div class="text-center text-muted" style="padding: var(--space-8);">
          Belum ada tagihan yang dipilih.<br>
          <small>Silakan centang item di sebelah kiri.</small>
        </div>
      `;
      btnProcessPay.disabled = true;
      btnProcessPay.innerHTML = '🔒 Pilih Tagihan Terlebih Dahulu';
      return;
    }

    btnProcessPay.disabled = false;
    btnProcessPay.innerHTML = `🔒 Bayar Sekarang • ${formatRupiah(total)}`;

    summaryList.innerHTML = items.map((it) => `
      <div class="summary-item-entry animate-fade-in">
        <div class="summary-item-entry-left">
          <span class="summary-bullet">✓</span>
          <div>
            <div class="summary-item-title">${it.nama}</div>
            <div class="summary-item-category badge badge-secondary">${it.kategori.toUpperCase()}</div>
          </div>
        </div>
        <div class="summary-item-price">${formatRupiah(it.nominal)}</div>
      </div>
    `).join('');
  }

  /** Load Student History Table (Sejumlah Yang Sudah Dibayar) */
  function loadStudentHistoryTable() {
    if (!currentStudent) return;

    const totalPaid = studentPaymentHistory.reduce((sum, p) => sum + p.nominal, 0);
    totalPaidBadge.textContent = `Total Lunas: ${formatRupiah(totalPaid)}`;

    if (studentPaymentHistory.length === 0) {
      historyTbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Belum Ada Riwayat Pembayaran</div>
              <div class="empty-state-text">Anda belum memiliki catatan pembayaran yang lunas di sistem sekolah.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    // Sort descending by date
    const sorted = [...studentPaymentHistory].sort(
      (a, b) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime()
    );

    historyTbody.innerHTML = sorted.map((p) => {
      const itemsCount = p.items ? p.items.length : 1;
      const rincian = p.rincianItemText || `SPP ${p.bulan} ${p.tahun}`;

      return `
        <tr>
          <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${p.idTransaksi}</code></td>
          <td>${formatDateShort(p.tanggalBayar)}</td>
          <td>
            <div style="font-weight: 500; font-size: var(--font-size-sm);">${rincian}</div>
            ${itemsCount > 1 ? `<span class="badge badge-secondary text-xs mt-1" style="font-size: 9px;">${itemsCount} Rincian Pos</span>` : ''}
          </td>
          <td style="font-weight: bold; color: var(--color-success);">${formatRupiah(p.nominal)}</td>
          <td><span class="badge badge-info text-xs">${p.metodeBayar.toUpperCase()}</span></td>
          <td><span class="badge badge-success text-xs"><span class="badge-dot"></span> LUNAS</span></td>
          <td style="text-align: center;">
            <button class="btn btn-primary btn-sm btn-print-receipt-student" data-id="${p.idTransaksi}">
              🖨️ Cetak Kuitansi
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Bind Print Buttons
    historyTbody.querySelectorAll('.btn-print-receipt-student').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        const p = studentPaymentHistory.find((item) => item.idTransaksi === id);
        if (p) renderReceipt(p);
      });
    });
  }

  /** Open Online Payment Gateway */
  function openPaymentGateway(method: PaymentMethod) {
    if (!currentStudent) return;

    const items = Array.from(selectedItems.values());
    const totalNominal = items.reduce((sum, it) => sum + it.nominal, 0);
    const trxId = generateTransactionId();

    gatewayModalTitle.textContent = `Pembayaran Online — ${schoolService.getSchoolInfo().namaSekolah}`;
    gatewayModal.style.display = 'flex';

    if (method === 'qris') {
      renderQrisGateway(trxId, totalNominal, items);
    } else if (method.startsWith('va_')) {
      renderVaGateway(method, trxId, totalNominal, items);
    } else {
      renderEwalletGateway(method, trxId, totalNominal, items);
    }
  }

  /** Render QRIS Gateway Simulator */
  function renderQrisGateway(trxId: string, total: number, items: SelectedItem[]) {
    const school = schoolService.getSchoolInfo();

    gatewayModalBody.innerHTML = `
      <div class="gateway-qris-container text-center">
        <div class="gateway-tagline">NMID: ID1020304050607 • ${school.namaSekolah}</div>
        
        <div class="gateway-qr-wrapper">
          <svg class="gateway-qr-svg" viewBox="0 0 200 200" width="180" height="180">
            <rect x="10" y="10" width="45" height="45" fill="none" stroke="currentColor" stroke-width="8" rx="4"/>
            <rect x="22" y="22" width="21" height="21" fill="currentColor"/>
            <rect x="145" y="10" width="45" height="45" fill="none" stroke="currentColor" stroke-width="8" rx="4"/>
            <rect x="157" y="22" width="21" height="21" fill="currentColor"/>
            <rect x="10" y="145" width="45" height="45" fill="none" stroke="currentColor" stroke-width="8" rx="4"/>
            <rect x="22" y="157" width="21" height="21" fill="currentColor"/>
            <rect x="75" y="75" width="50" height="50" rx="8" fill="var(--color-primary)"/>
            <text x="100" y="105" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">QRIS</text>
            <circle cx="70" cy="20" r="4" fill="currentColor"/><circle cx="90" cy="20" r="4" fill="currentColor"/><circle cx="110" cy="20" r="4" fill="currentColor"/><circle cx="130" cy="20" r="4" fill="currentColor"/>
            <circle cx="70" cy="40" r="4" fill="currentColor"/><circle cx="100" cy="40" r="4" fill="currentColor"/><circle cx="120" cy="40" r="4" fill="currentColor"/>
            <circle cx="20" cy="70" r="4" fill="currentColor"/><circle cx="40" cy="70" r="4" fill="currentColor"/><circle cx="60" cy="70" r="4" fill="currentColor"/><circle cx="140" cy="70" r="4" fill="currentColor"/>
            <circle cx="20" cy="90" r="4" fill="currentColor"/><circle cx="50" cy="90" r="4" fill="currentColor"/><circle cx="150" cy="90" r="4" fill="currentColor"/><circle cx="180" cy="90" r="4" fill="currentColor"/>
            <circle cx="20" cy="110" r="4" fill="currentColor"/><circle cx="50" cy="110" r="4" fill="currentColor"/><circle cx="140" cy="110" r="4" fill="currentColor"/><circle cx="170" cy="110" r="4" fill="currentColor"/>
            <circle cx="70" cy="150" r="4" fill="currentColor"/><circle cx="90" cy="150" r="4" fill="currentColor"/><circle cx="120" cy="150" r="4" fill="currentColor"/><circle cx="140" cy="150" r="4" fill="currentColor"/>
            <circle cx="80" cy="170" r="4" fill="currentColor"/><circle cx="100" cy="170" r="4" fill="currentColor"/><circle cx="130" cy="170" r="4" fill="currentColor"/><circle cx="160" cy="170" r="4" fill="currentColor"/>
          </svg>
        </div>

        <div class="gateway-amount-tag">
          <div class="text-xs text-muted">Total Pembayaran Pas</div>
          <div class="amount-large">${formatRupiah(total)}</div>
        </div>

        <div class="gateway-instructions">
          <p>1. Buka aplikasi m-Banking atau E-Wallet pilihan Anda.</p>
          <p>2. Scan QRIS di atas dan pastikan nama penerima adalah <strong>${school.namaSekolah}</strong>.</p>
          <p>3. Konfirmasi pembayaran Anda.</p>
        </div>

        <div class="gateway-simulator-actions mt-4">
          <button class="btn btn-success btn-lg" id="btn-simulate-success" style="width: 100%;">
            ⚡ Simulasikan Pembayaran QRIS Sukses
          </button>
        </div>
      </div>
    `;

    gatewayModalBody.querySelector('#btn-simulate-success')?.addEventListener('click', () => {
      completePayment('qris', trxId, total, items);
    });
  }

  /** Render Virtual Account Simulator */
  function renderVaGateway(method: PaymentMethod, trxId: string, total: number, items: SelectedItem[]) {
    const school = schoolService.getSchoolInfo();
    const bankPrefix = method === 'va_bca' ? '8808' : method === 'va_bri' ? '1288' : '8901';
    const vaNumber = `${bankPrefix}${currentStudent?.nis || '2026001'}`;

    gatewayModalBody.innerHTML = `
      <div class="gateway-va-container">
        <div class="va-card">
          <div class="va-label">Nomor Virtual Account</div>
          <div class="va-number-row">
            <span class="va-number-code" id="va-code-text">${vaNumber}</span>
            <button class="btn btn-sm btn-secondary" id="btn-copy-va">📋 Salin</button>
          </div>
          <div class="va-meta">
            <span>Atas Nama: <strong>${school.namaSekolah} - ${currentStudent?.nama}</strong></span>
          </div>
        </div>

        <div class="gateway-amount-tag text-center mt-3">
          <div class="text-xs text-muted">Nominal Transfer</div>
          <div class="amount-large">${formatRupiah(total)}</div>
        </div>

        <div class="gateway-instructions mt-3">
          <p>1. Salin nomor Virtual Account di atas.</p>
          <p>2. Masuk ke m-Banking / ATM pilihan Anda lalu pilih menu Virtual Account.</p>
          <p>3. Tagihan akan otomatis muncul pas tanpa biaya admin tambahan.</p>
        </div>

        <div class="gateway-simulator-actions mt-4">
          <button class="btn btn-success btn-lg" id="btn-simulate-success" style="width: 100%;">
            ⚡ Simulasikan Transfer VA Sukses
          </button>
        </div>
      </div>
    `;

    gatewayModalBody.querySelector('#btn-copy-va')?.addEventListener('click', () => {
      navigator.clipboard.writeText(vaNumber);
      showToast('Nomor VA disalin!', 'info');
    });

    gatewayModalBody.querySelector('#btn-simulate-success')?.addEventListener('click', () => {
      completePayment(method, trxId, total, items);
    });
  }

  /** Render E-Wallet Simulator */
  function renderEwalletGateway(method: PaymentMethod, trxId: string, total: number, items: SelectedItem[]) {
    const walletName = method === 'dana' ? 'DANA' : method === 'gopay' ? 'GoPay' : 'OVO';

    gatewayModalBody.innerHTML = `
      <div class="gateway-ewallet-container text-center">
        <div class="amount-large">${formatRupiah(total)}</div>
        <div class="text-sm text-muted mb-4">Pembayaran via ${walletName}</div>

        <div class="form-group text-left" style="max-width: 320px; margin: 0 auto;">
          <label class="form-label">Nomor HP Terdaftar ${walletName}</label>
          <input type="text" class="form-input" id="ewallet-phone" value="${currentStudent?.noHp || '081234567890'}">
        </div>

        <div class="gateway-simulator-actions mt-4">
          <button class="btn btn-success btn-lg" id="btn-simulate-success" style="width: 100%;">
            ⚡ Konfirmasi Pembayaran ${walletName}
          </button>
        </div>
      </div>
    `;

    gatewayModalBody.querySelector('#btn-simulate-success')?.addEventListener('click', () => {
      completePayment(method, trxId, total, items);
    });
  }

  /** Complete Payment & Trigger Dual Notifications */
  async function completePayment(
    method: PaymentMethod,
    trxId: string,
    total: number,
    items: SelectedItem[]
  ) {
    if (!currentStudent) return;

    const sppItem = items.find((it) => it.kategori === 'spp');
    const primaryMonth: MonthName = sppItem?.bulan || MONTHS[new Date().getMonth()];
    const primaryYear = sppItem?.tahun || getCurrentYear();

    const paymentItems: PaymentItemDetail[] = items.map((it) => ({
      id: it.id,
      nama: it.nama,
      kategori: it.kategori,
      nominal: it.nominal,
      bulan: it.bulan,
      tahun: it.tahun,
      keterangan: it.keterangan,
    }));

    const rincianText = items
      .map((it) => `${it.nama} (${formatRupiah(it.nominal)})`)
      .join(' + ');

    const newPayment: Payment = {
      idTransaksi: trxId,
      nis: currentStudent.nis,
      nama: currentStudent.nama,
      kelas: currentStudent.kelas,
      bulan: primaryMonth,
      tahun: primaryYear,
      nominal: total,
      tanggalBayar: toISODate(),
      metodeBayar: method,
      status: 'lunas',
      keterangan: `Pembayaran Online (${items.length} pos tagihan)`,
      channel: 'online',
      items: paymentItems,
      rincianItemText: rincianText,
    };

    // 1. Simpan ke database spreadsheet / localStorage
    const success = await spreadsheetService.addPayment(newPayment);
    if (!success) {
      showToast('Gagal mencatat transaksi pembayaran', 'error');
      return;
    }

    // Tutup gateway modal
    gatewayModal.style.display = 'none';

    // 2. Notifikasi Ganda:
    // a. Untuk Admin: Notifikasi push, audio chime, badge lonceng bertambah, dan toast
    notificationService.notifyNewOnlinePayment(newPayment);

    // b. Untuk Siswa: Tampilkan dialog perayaan berhasil dengan cetak kuitansi resmi langsung
    renderStudentSuccessModal(newPayment, items);

    // Refresh state data siswa
    await refreshStudentData();
  }

  /** Render Student Success Modal with official Receipt button */
  function renderStudentSuccessModal(payment: Payment, items: SelectedItem[]) {
    const school = schoolService.getSchoolInfo();
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success-dialog animate-scale-up';
    successDiv.innerHTML = `
      <div class="success-icon-wrapper">🎉</div>
      <h2 class="success-title">Pembayaran Sukses Dilunasi!</h2>
      <p class="success-subtitle">
        Selamat, pembayaran Anda telah sah diterima dan tercatat di sistem administrasi <strong>${school.namaSekolah}</strong>.
      </p>

      <div class="success-receipt-summary">
        <div class="receipt-summary-header">
          <span>No. Kuitansi: <code>${payment.idTransaksi}</code></span>
          <span class="badge badge-success">✓ LUNAS (ONLINE)</span>
        </div>
        <div class="receipt-items-table">
          ${items.map((it) => `
            <div class="receipt-item-row">
              <span>${it.nama}</span>
              <strong>${formatRupiah(it.nominal)}</strong>
            </div>
          `).join('')}
          <div class="receipt-total-row">
            <span>TOTAL DIBAYAR</span>
            <span class="text-success" style="font-size: var(--font-size-lg); font-weight: bold;">
              ${formatRupiah(payment.nominal)}
            </span>
          </div>
        </div>
      </div>

      <div class="success-actions mt-4" style="display: flex; gap: var(--space-3); justify-content: center;">
        <button class="btn btn-primary btn-lg" id="btn-print-from-success">
          🖨️ Cetak Kuitansi Resmi
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-done-success">
          ✓ Selesai & Lihat Riwayat
        </button>
      </div>
    `;

    gatewayModalTitle.textContent = `Bukti Pembayaran — ${school.namaSekolah}`;
    gatewayModalBody.innerHTML = '';
    gatewayModalBody.appendChild(successDiv);
    gatewayModal.style.display = 'flex';

    successDiv.querySelector('#btn-print-from-success')?.addEventListener('click', () => {
      renderReceipt(payment);
    });

    successDiv.querySelector('#btn-done-success')?.addEventListener('click', () => {
      gatewayModal.style.display = 'none';
      // Switch ke tab riwayat agar siswa langsung melihat kuitansi tersimpan
      tabBtnRiwayat.click();
    });
  }

  return container;
}
