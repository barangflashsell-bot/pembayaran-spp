# 🏫 Aplikasi Pembayaran SPP & Tagihan Sekolah

Aplikasi web modern, gratis, dan modular berbasis **TypeScript** & **Vite** untuk pencatatan dan pembayaran SPP serta pos tagihan sekolah. Dilengkapi dengan **Portal Mandiri Siswa**, manajemen pos tagihan (CRUD), pengaturan identitas sekolah, notifikasi audio & push instan, serta integrasi **Google Spreadsheet**.

---

## ✨ Fitur Utama

### 1. 🎓 Portal Siswa (Bayar Online Mandiri)
- **Masuk via Nama atau NIS**: Siswa atau wali murid dapat masuk tanpa ribet cukup dengan mengetik Nama Lengkap atau Nomor Induk Siswa (NIS).
- **Tab Tagihan Yang Harus Dibayar**:
  - Checklist SPP 12 bulan (bulan yang sudah lunas terkunci otomatis).
  - Pos tagihan seragam, buku modul, uang gedung, kegiatan, dan ujian.
  - Tagihan fleksibel / donasi / cicilan sukarela (bebas bayar nominal berapa pun).
- **Kalkulator *Live Total***: Otomatis menghitung akumulasi total biaya dan rincian item yang dicentang secara *real-time*.
- **Simulator Pembayaran Online (100% Gratis)**:
  - QRIS Dinamis (semua bank & e-wallet).
  - Virtual Account (BCA, BRI / BRIVA, Mandiri).
  - E-Wallet (DANA, GoPay, OVO).
- **Tab Sejumlah Yang Sudah Dibayar**: Menampilkan riwayat transaksi lengkap siswa dan tombol cetak kuitansi masing-masing.

### 2. 🏷️ Kelola Pos Pembayaran (Admin CRUD)
- Admin dapat menambahkan pos pembayaran baru (nama pembayaran & nominal).
- Mengedit nama pembayaran dan nominal pembayaran yang sudah ada.
- Menghapus pos tagihan yang sudah tidak berlaku.
- Perubahan otomatis langsung tampil di Portal Siswa dan formulir kasir.

### 3. ⚙️ Pengaturan Identitas Sekolah
- Mengubah Nama Sekolah Resmi, Alamat, Kontak Telepon, Email, dan Tahun Ajaran secara dinamis.
- Mengatur Nama Kepala Sekolah dan Bendahara / Kasir Sekolah untuk penandatanganan kuitansi resmi.
- Perubahan langsung memperbarui seluruh tampilan aplikasi dan kop kuitansi tanpa perlu edit kode.

### 4. 🖨️ Cetak Kuitansi Resmi Atas Nama Sekolah
- Kop resmi dinamis sesuai profil sekolah.
- Nomor transaksi resmi, tanggal, data siswa (Nama, NIS, Kelas).
- Tabel rincian pos tagihan yang dibayar dan nominal per item.
- Total rupiah dengan status **LUNAS / SAH**.
- Kolom tanda tangan resmi Kepala Sekolah dan Bendahara Sekolah.

### 5. 🔔 Notifikasi Ganda (Siswa & Admin)
- **Untuk Siswa**: Nada konfirmasi, dialog sukses rincian bayar, dan kuitansi instan.
- **Untuk Admin**: *Audio chime* merdu (*Web Audio API*), notifikasi push browser & toast, serta counter lonceng notifikasi di panel admin.

### 6. 📊 Google Spreadsheet Database (100% Gratis)
- Menggunakan Google Apps Script (`apps-script/Code.gs`) sebagai backend API RESTful gratis.
- Mendukung mode offline / demo otomatis (disimpan di browser `localStorage` jika URL API belum diisi).

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/barangflashsell-bot/pembayaran-spp.git
   cd pembayaran-spp
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan dev server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173/`.

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 📑 Struktur Proyek

```
├── apps-script/          # Script backend Google Apps Script & panduan setup
│   ├── Code.gs           # REST API doGet & doPost
│   └── SETUP.md          # Panduan langkah demi langkah integrasi Google Spreadsheet
├── public/               # Asset statis publik
├── src/
│   ├── components/       # Komponen UI modular
│   │   ├── billableManager.ts   # Kelola Pos Pembayaran (CRUD)
│   │   ├── dashboard.ts         # Dashboard Admin & Statistik
│   │   ├── history.ts           # Riwayat Pembayaran & Filter
│   │   ├── payment.ts           # Formulir Pembayaran Kasir
│   │   ├── receipt.ts           # Preview & Cetak Kuitansi Resmi
│   │   ├── schoolSettings.ts    # Edit Identitas Sekolah
│   │   ├── sidebar.ts           # Navigasi & Lonceng Notifikasi
│   │   ├── studentPortal.ts     # Portal Siswa (Nama/NIS, Tagihan & Riwayat)
│   │   └── students.ts          # Kelola Data Siswa
│   ├── config/           # Konfigurasi & konstanta aplikasi
│   ├── services/         # Layanan data (Spreadsheet, School, Notifikasi)
│   ├── styles/           # Desain CSS (Dark Theme, Glassmorphism, Animasi)
│   ├── types/            # TypeScript interfaces & types
│   ├── utils/            # Helper DOM, Formatter, Router SPA
│   ├── app.ts            # Registrasi router & App Shell
│   └── main.ts           # Entry point aplikasi
├── index.html            # HTML template utama
├── package.json          # Manifest dependensi & scripts
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 📄 Lisensi

Proyek ini dibuat untuk kebutuhan pengelolaan pembayaran sekolah dan dapat digunakan serta dikembangkan secara bebas (Open Source).
