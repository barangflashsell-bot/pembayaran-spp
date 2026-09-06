// ==========================================
// School Settings Component — Edit Identitas Sekolah & Database Live
// ==========================================

import { createElement, showToast } from '../utils/dom';
import { schoolService } from '../services/schoolService';
import { spreadsheetService } from '../services/spreadsheet';
import { authService } from '../services/authService';
import { formatRupiah } from '../utils/formatter';

/** Render School Settings / Identity Edit Page */
export function renderSchoolSettings(): HTMLElement {
  const container = createElement('div', { className: 'page-enter' });
  const current = schoolService.getSchoolInfo();

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">⚙️ Identitas Sekolah & Database Real</h1>
      <p class="page-description">
        Ubah nama sekolah, alamat, kontak, nama pejabat kuitansi, serta hubungkan ke Google Spreadsheet asli secara real-time.
      </p>
    </div>

    <div class="grid-2" style="grid-template-columns: 1.4fr 1fr; gap: var(--space-6); align-items: start;">
      <!-- Left: Edit Form -->
      <div class="card">
        <div class="section-header">
          <h3 class="section-title">🏫 Data Profil Lembaga Sekolah</h3>
        </div>

        <form id="form-school-settings">
          <div class="form-group">
            <label class="form-label">Nama Sekolah Resmi *</label>
            <input type="text" class="form-input" id="set-nama-sekolah" required value="${current.namaSekolah}" placeholder="Contoh: SMP Negeri 1 Nusantara">
            <span class="text-xs text-muted">Nama ini akan tampil di header, portal siswa, dan kop kuitansi.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Lengkap Sekolah *</label>
            <textarea class="form-textarea" id="set-alamat-sekolah" rows="2" required placeholder="Jl. Pendidikan No. 1, Kota Nusantara">${current.alamatSekolah}</textarea>
          </div>

          <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div class="form-group">
              <label class="form-label">Nomor Telepon / Kontak</label>
              <input type="text" class="form-input" id="set-no-telepon" value="${current.noTelepon || ''}" placeholder="(021) 789-0123">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Email Sekolah</label>
              <input type="email" class="form-input" id="set-email" value="${current.email || ''}" placeholder="info@sekolah.sch.id">
            </div>
          </div>

          <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div class="form-group">
              <label class="form-label">Tahun Ajaran Aktif *</label>
              <input type="text" class="form-input" id="set-tahun-ajaran" required value="${current.tahunAjaran}" placeholder="2026/2027">
            </div>
            <div class="form-group">
              <label class="form-label">Nominal SPP Standar (Rp) *</label>
              <input type="number" class="form-input" id="set-nominal-spp" required min="0" step="5000" value="${current.nominalSppDefault}">
            </div>
          </div>

          <!-- Pejabat Penandatangan Kuitansi -->
          <div style="border-top: 1px solid var(--color-border); margin: var(--space-4) 0; padding-top: var(--space-4);">
            <h4 style="font-size: var(--font-size-sm); font-weight: 600; margin-bottom: var(--space-3); color: var(--color-primary-light);">
              ✍️ Pejabat Penandatangan Kuitansi Resmi
            </h4>

            <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
              <div class="form-group">
                <label class="form-label">Nama Kepala Sekolah *</label>
                <input type="text" class="form-input" id="set-kepala-sekolah" required value="${current.namaKepalaSekolah}" placeholder="Nama & Gelar Kepala Sekolah">
              </div>
              <div class="form-group">
                <label class="form-label">NIP Kepala Sekolah</label>
                <input type="text" class="form-input" id="set-nip-kepala" value="${current.nipKepalaSekolah || ''}" placeholder="19750812 200003 1 002">
              </div>
            </div>

            <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
              <div class="form-group">
                <label class="form-label">Nama Bendahara / Kasir TU *</label>
                <input type="text" class="form-input" id="set-bendahara" required value="${current.namaBendahara}" placeholder="Nama Petugas Bendahara">
              </div>
              <div class="form-group">
                <label class="form-label">NIP / Jabatan Bendahara</label>
                <input type="text" class="form-input" id="set-nip-bendahara" value="${current.nipBendahara || ''}" placeholder="19820415 200801 2 007">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Kaki Kuitansi</label>
              <textarea class="form-textarea" id="set-catatan-kuitansi" rows="2" placeholder="Catatan legalitas bukti bayar">${current.catatanKuitansi || ''}</textarea>
            </div>
          </div>

          <!-- Integrasi Google Spreadsheet Asli -->
          <div style="border-top: 1px solid var(--color-border); margin: var(--space-4) 0; padding-top: var(--space-4); background: rgba(16, 185, 129, 0.05); padding: var(--space-4); border-radius: var(--radius-xl); border: 1px dashed rgba(16, 185, 129, 0.3);">
            <h4 style="font-size: var(--font-size-sm); font-weight: 700; margin-bottom: var(--space-1); color: var(--color-success);">
              📊 Database Google Spreadsheet Asli (Real / Live)
            </h4>
            <p class="text-xs text-muted mb-3">
              Masukkan URL Web App Google Apps Script Anda (berakhiran <code>/exec</code>) agar data siswa, pos tagihan, dan setoran pembayaran online tersimpan langsung ke Google Spreadsheet Anda secara nyata.
            </p>

            <div class="form-group">
              <label class="form-label">URL Web App Google Apps Script</label>
              <input type="url" class="form-input" id="set-apps-script-url" value="${current.appsScriptUrl || ''}" placeholder="https://script.google.com/macros/s/.../exec">
            </div>

            <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-test-sheet">
                🔌 Tes Koneksi Database
              </button>
              <span id="test-sheet-status" class="text-xs"></span>
            </div>
          </div>

          <div style="padding-top: var(--space-4);">
            <button type="submit" class="btn btn-success btn-lg" style="width: 100%;">
              💾 Simpan Perubahan Identitas & Database
            </button>
          </div>
        </form>
      </div>

      <!-- Right: Live Receipt Preview Box & Security -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <div class="card" style="border: 1px solid var(--color-primary-light);">
          <div class="section-header">
            <h3 class="section-title">👁️ Preview Kop & Tanda Tangan Kuitansi</h3>
          </div>

          <div class="receipt-live-preview" id="live-receipt-preview">
            <!-- Rendered live -->
          </div>

          <div class="text-xs text-muted mt-3 text-center">
            💡 Tampilan di atas adalah contoh kop kuitansi resmi yang akan dicetak saat siswa atau admin mencetak bukti bayar.
          </div>
        </div>

        <!-- Security & Password Card -->
        <div class="card" style="border: 1px solid var(--color-border);">
          <div class="section-header">
            <h3 class="section-title">🔐 Keamanan Akun Administrator</h3>
          </div>
          <p class="text-xs text-muted mb-4">
            Ubah kata sandi login Admin untuk menjaga keamanan akses dashboard dan pembukuan kasir.
          </p>
          <form id="form-admin-password">
            <div class="form-group">
              <label class="form-label">Password Lama *</label>
              <input type="password" class="form-input" id="input-old-pass" placeholder="Password saat ini" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password Baru *</label>
              <input type="password" class="form-input" id="input-new-pass" placeholder="Minimal 4 karakter" required>
            </div>
            <button type="submit" class="btn btn-secondary" style="width: 100%;">
              🔑 Perbarui Password Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Inputs
  const form = container.querySelector('#form-school-settings') as HTMLFormElement;
  const inputNama = container.querySelector('#set-nama-sekolah') as HTMLInputElement;
  const inputAlamat = container.querySelector('#set-alamat-sekolah') as HTMLTextAreaElement;
  const inputTelp = container.querySelector('#set-no-telepon') as HTMLInputElement;
  const inputEmail = container.querySelector('#set-email') as HTMLInputElement;
  const inputTahun = container.querySelector('#set-tahun-ajaran') as HTMLInputElement;
  const inputSpp = container.querySelector('#set-nominal-spp') as HTMLInputElement;
  const inputKepala = container.querySelector('#set-kepala-sekolah') as HTMLInputElement;
  const inputNipKepala = container.querySelector('#set-nip-kepala') as HTMLInputElement;
  const inputBendahara = container.querySelector('#set-bendahara') as HTMLInputElement;
  const inputCatatan = container.querySelector('#set-catatan-kuitansi') as HTMLTextAreaElement;
  const inputAppsScript = container.querySelector('#set-apps-script-url') as HTMLInputElement;
  const btnTestSheet = container.querySelector('#btn-test-sheet') as HTMLButtonElement;
  const statusTest = container.querySelector('#test-sheet-status') as HTMLElement;
  const previewBox = container.querySelector('#live-receipt-preview') as HTMLElement;

  function updateLivePreview() {
    const nama = inputNama.value.trim() || 'Nama Sekolah';
    const alamat = inputAlamat.value.trim() || 'Alamat Sekolah';
    const telp = inputTelp.value.trim() || '-';
    const email = inputEmail.value.trim() || '-';
    const tahun = inputTahun.value.trim() || '2026/2027';
    const kepala = inputKepala.value.trim() || 'Nama Kepala Sekolah';
    const nipK = inputNipKepala.value.trim() || '-';
    const bendahara = inputBendahara.value.trim() || 'Nama Bendahara';
    const catatan = inputCatatan.value.trim() || 'Bukti bayar sah.';

    previewBox.innerHTML = `
      <div style="background: white; color: #1a1a1a; padding: var(--space-5); border-radius: var(--radius-lg); font-size: 11px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
        <div style="text-align: center; border-bottom: 2px double #333; padding-bottom: 8px; margin-bottom: 10px;">
          <div style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #111;">${nama}</div>
          <div style="font-size: 10px; color: #555;">${alamat}</div>
          <div style="font-size: 9px; color: #777;">Telp: ${telp} • Email: ${email}</div>
          <div style="font-size: 10px; font-weight: 600; color: #333; margin-top: 2px;">Tahun Ajaran ${tahun}</div>
          <div style="font-size: 11px; font-weight: bold; margin-top: 6px; letter-spacing: 1px;">KUITANSI PEMBAYARAN RESMI</div>
        </div>

        <div style="padding: 4px 0; border-bottom: 1px dotted #ccc;">
          <div style="display: flex; justify-content: space-between;">
            <span>Contoh Siswa:</span>
            <strong>Ahmad Rizky (VII-A)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 2px;">
            <span>Item: SPP & Seragam:</span>
            <strong>${formatRupiah(600000)}</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 18px; text-align: center; font-size: 10px;">
          <div style="width: 100px;">
            <div>Kepala Sekolah,</div>
            <div style="margin-top: 26px; font-weight: bold; text-decoration: underline;">${kepala}</div>
            <div style="font-size: 8px; color: #777;">NIP: ${nipK}</div>
          </div>
          <div style="width: 100px;">
            <div>Bendahara Sekolah,</div>
            <div style="margin-top: 26px; font-weight: bold; text-decoration: underline;">${bendahara}</div>
            <div style="font-size: 8px; color: #777;">Petugas Keuangan</div>
          </div>
        </div>

        <div style="margin-top: 12px; border-top: 1px dashed #ccc; padding-top: 6px; font-size: 8px; color: #888; text-align: center;">
          ${catatan}
        </div>
      </div>
    `;
  }

  // Bind live preview listeners
  [inputNama, inputAlamat, inputTelp, inputEmail, inputTahun, inputKepala, inputNipKepala, inputBendahara, inputCatatan].forEach((el) => {
    el.addEventListener('input', updateLivePreview);
  });

  updateLivePreview();

  // Test Database Connection
  btnTestSheet.addEventListener('click', async () => {
    const url = inputAppsScript.value.trim();
    if (!url) {
      statusTest.textContent = '⚠️ Masukkan URL Apps Script terlebih dahulu.';
      statusTest.className = 'text-xs text-warning';
      return;
    }

    statusTest.textContent = '🔄 Sedang menguji koneksi...';
    statusTest.className = 'text-xs text-muted';
    btnTestSheet.disabled = true;

    const result = await spreadsheetService.testConnection(url);
    btnTestSheet.disabled = false;

    if (result.success) {
      statusTest.textContent = `✅ ${result.message}`;
      statusTest.className = 'text-xs text-success';
      showToast('Koneksi Google Spreadsheet Berhasil!', 'success');
    } else {
      statusTest.textContent = `❌ ${result.message}`;
      statusTest.className = 'text-xs text-danger';
      showToast(result.message, 'error', 6000);
    }
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updated = schoolService.updateSchoolInfo({
      namaSekolah: inputNama.value.trim(),
      alamatSekolah: inputAlamat.value.trim(),
      noTelepon: inputTelp.value.trim(),
      email: inputEmail.value.trim(),
      tahunAjaran: inputTahun.value.trim(),
      nominalSppDefault: Number(inputSpp.value) || 250000,
      namaKepalaSekolah: inputKepala.value.trim(),
      nipKepalaSekolah: inputNipKepala.value.trim(),
      namaBendahara: inputBendahara.value.trim(),
      catatanKuitansi: inputCatatan.value.trim(),
      appsScriptUrl: inputAppsScript.value.trim(),
    });

    // Update document title
    document.title = `Identitas Sekolah — ${updated.namaSekolah}`;

    showToast(`Data Identitas & Database "${updated.namaSekolah}" berhasil disimpan!`, 'success');
  });

  // Handle Admin Password Change
  const formPassword = container.querySelector('#form-admin-password') as HTMLFormElement;
  const inputOldPass = container.querySelector('#input-old-pass') as HTMLInputElement;
  const inputNewPass = container.querySelector('#input-new-pass') as HTMLInputElement;

  formPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldP = inputOldPass.value;
    const newP = inputNewPass.value;

    const result = authService.updateAdminPassword(oldP, newP);
    if (!result.success) {
      showToast(result.error || 'Gagal mengubah password', 'error');
      return;
    }

    showToast('Password Admin berhasil diperbarui!', 'success');
    formPassword.reset();
  });

  return container;
}
