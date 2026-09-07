// ==========================================
// WhatsApp Messaging Utilities
// ==========================================

import type { Payment, Student } from '../types';
import { formatDate, formatRupiah, getMethodLabel } from './formatter';
import { schoolService } from '../services/schoolService';

/** Format Indonesian phone numbers to international WhatsApp format (62...) */
export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return '';
  // Remove non-numeric characters
  let clean = phone.replace(/\D/g, '');
  
  // Replace leading 0 with 62
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }
  return clean;
}

/** Open WhatsApp Chat with prefilled message */
export function openWhatsAppChat(phone: string, message: string): void {
  const formattedPhone = formatWhatsAppPhone(phone);
  const encodedMsg = encodeURIComponent(message);
  
  const url = formattedPhone 
    ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMsg}`
    : `https://api.whatsapp.com/send?text=${encodedMsg}`;

  window.open(url, '_blank');
}

/** Generate official payment receipt WhatsApp message */
export function buildReceiptWhatsAppMessage(payment: Payment, student?: Student): string {
  const school = schoolService.getSchoolInfo();
  const parentName = student?.namaOrangTua ? `Bpk/Ibu ${student.namaOrangTua}` : `Wali dari ${payment.nama}`;
  const rincian = payment.rincianItemText || `SPP Bulan ${payment.bulan} ${payment.tahun}`;

  let itemsList = '';
  if (payment.items && payment.items.length > 0) {
    itemsList = payment.items
      .map((it, i) => `  ${i + 1}. ${it.nama}: *${formatRupiah(it.nominal)}*`)
      .join('\n');
  } else {
    itemsList = `  • ${rincian}: *${formatRupiah(payment.nominal)}*`;
  }

  return `*KUITANSI PEMBAYARAN RESMI*
*${school.namaSekolah.toUpperCase()}*
${school.alamatSekolah}
----------------------------------------

Kepada Yth.
*${parentName}*

Terima kasih, pembayaran administrasi sekolah telah berhasil diterima dan diverifikasi dengan rincian:

📋 *No. Kuitansi:* \`${payment.idTransaksi}\`
📅 *Tanggal Bayar:* ${formatDate(payment.tanggalBayar)}
👨‍🎓 *Nama Siswa:* *${payment.nama}*
🏷️ *NIS / Kelas:* ${payment.nis} / ${payment.kelas}
💳 *Metode:* ${getMethodLabel(payment.metodeBayar)}
🏢 *Channel:* ${payment.channel === 'online' ? 'Online (Portal Siswa)' : 'Kasir Administrasi Sekolah'}
👤 *Diterima Oleh:* ${payment.diterimaOleh || school.namaBendahara}

*Rincian Pos Tagihan:*
${itemsList}

💰 *TOTAL DIBAYAR:* *${formatRupiah(payment.nominal)}*
✅ *STATUS:* *LUNAS / SAH*

_${school.catatanKuitansi || 'Kuitansi elektronik ini merupakan bukti pembayaran yang sah.'}_

Hormat kami,
*Bendahara & Tata Usaha Keuangan*
*${school.namaSekolah}*`;
}

/** Generate SPP / Fee Reminder WhatsApp message */
export function buildSppReminderWhatsAppMessage(
  student: Student,
  unpaidMonths: string[],
  totalTagihan: number,
  additionalNotes = ''
): string {
  const school = schoolService.getSchoolInfo();
  const parentName = student.namaOrangTua ? `Bpk/Ibu ${student.namaOrangTua}` : `Bpk/Ibu Wali`;
  const monthsStr = unpaidMonths.length > 0 ? unpaidMonths.join(', ') : 'SPP Berjalan';

  return `*PEMBERITAHUAN ADMINISTRASI SPP*
*${school.namaSekolah.toUpperCase()}*
Tahun Ajaran ${school.tahunAjaran}
----------------------------------------

Yth. *${parentName}*
(Orang Tua / Wali dari ananda *${student.nama}*, Kelas *${student.kelas}*, NIS: \`${student.nis}\`)

Dengan hormat, kami menginformasikan catatan administrasi SPP ananda saat ini:

📌 *Tunggakan Bulan:* *${monthsStr}*
💰 *Total Tagihan:* *${formatRupiah(totalTagihan)}*

Pembayaran dapat dilakukan melalui:
1. 💳 *Portal Mandiri Siswa (Online QRIS & Virtual Account)*:
   Kunjungi portal sekolah dan masukkan NIS: *${student.nis}*
2. 🏢 *Kasir Pembayaran Sekolah (Tunai)* pada jam kerja operasional sekolah.

${additionalNotes ? `_Catatan: ${additionalNotes}_\n\n` : ''}Apabila Bapak/Ibu telah melakukan pembayaran sebelumnya, mohon konfirmasikan bukti transfer kepada kami.

Terima kasih atas perhatian dan kerjasamanya.

Salam hangat,
*Administrasi Keuangan Sekolah*
*${school.namaSekolah}*
📞 ${school.noTelepon || '-'}`;
}
