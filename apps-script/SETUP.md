# 📋 Panduan Setup Google Spreadsheet & Apps Script

Panduan langkah-langkah menghubungkan aplikasi SPP ke Google Spreadsheet.

---

## Langkah 1: Buat Google Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"** untuk membuat spreadsheet baru
3. Beri nama: **"Data SPP Sekolah"** (atau nama yang Anda inginkan)

---

## Langkah 2: Setup Apps Script

1. Di spreadsheet, klik menu **Extensions** → **Apps Script**
2. Hapus semua kode yang ada di editor
3. **Copy-paste** seluruh isi file `Code.gs` dari folder `apps-script/` ke editor
4. Klik **💾 Save** (Ctrl+S)
5. Beri nama project: **"SPP Backend"**

---

## Langkah 3: Jalankan Setup Awal

1. Di Apps Script editor, pilih fungsi **`setupSheets`** dari dropdown di toolbar
2. Klik tombol **▶ Run**
3. Jika diminta, klik **"Review Permissions"** → pilih akun Google → **"Allow"**
4. Tunggu sampai muncul alert **"Setup selesai!"**
5. Kembali ke spreadsheet, pastikan ada 2 sheet: **Siswa** dan **Pembayaran** dengan header

---

## Langkah 4: Deploy sebagai Web App

1. Di Apps Script editor, klik **Deploy** → **New deployment**
2. Klik ikon ⚙️ di samping **"Select type"** → pilih **"Web app"**
3. Isi pengaturan:
   - **Description**: `SPP API v1`
   - **Execute as**: `Me (email Anda)`
   - **Who has access**: `Anyone`
4. Klik **Deploy**
5. **COPY URL** yang muncul (format: `https://script.google.com/macros/s/xxxxx/exec`)

---

## Langkah 5: Konfigurasi Aplikasi

1. Buka file `src/config/constants.ts`
2. Paste URL yang dicopy ke `appsScriptUrl`:

```typescript
export const APP_CONFIG: AppConfig = {
  // ... setting lain ...
  appsScriptUrl: 'https://script.google.com/macros/s/PASTE_URL_DISINI/exec',
};
```

3. Save file dan restart dev server (`npm run dev`)

---

## ✅ Selesai!

Sekarang semua data siswa dan pembayaran akan otomatis tersimpan di Google Spreadsheet Anda.

---

## 🔄 Update Deployment

Jika Anda mengubah kode Apps Script:

1. Di Apps Script, klik **Deploy** → **Manage deployments**
2. Klik ikon ✏️ (edit) pada deployment yang aktif
3. Ubah **Version** ke **"New version"**
4. Klik **Deploy**

---

## ❓ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Error CORS | Pastikan "Who has access" diset ke **Anyone** |
| Data tidak muncul | Pastikan nama sheet persis **Siswa** dan **Pembayaran** |
| Permission denied | Jalankan `setupSheets` untuk authorize ulang |
| URL tidak bekerja | Deploy ulang sebagai **New deployment** (bukan manage) |
