(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new class{routes=new Map;listeners=[];currentPath=``;register(e){this.routes.set(e.path,e)}registerAll(e){e.forEach(e=>this.register(e))}navigate(e){window.location.hash=`#${e}`}getCurrentPath(){return window.location.hash.slice(1)||`/`}getCurrentRoute(){return this.routes.get(this.getCurrentPath())}getRoutes(){return Array.from(this.routes.values())}onRouteChange(e){this.listeners.push(e)}start(){let e=()=>{let e=this.getCurrentPath();e!==this.currentPath&&(this.currentPath=e,this.listeners.forEach(t=>t(e)))};window.addEventListener(`hashchange`,e),window.location.hash?e():this.navigate(`/`)}};function t(e,t=document){return t.querySelector(e)}function n(e,t,...n){let r=document.createElement(e);if(t)for(let[e,n]of Object.entries(t))e===`className`?r.className=n:e===`innerHTML`?r.innerHTML=n:e===`textContent`?r.textContent=n:r.setAttribute(e,n);for(let e of n)typeof e==`string`?r.appendChild(document.createTextNode(e)):r.appendChild(e);return r}var r={success:`✅`,error:`❌`,warning:`⚠️`,info:`ℹ️`};function i(e,i=`info`,o=4e3){let s=t(`.toast-container`);s||(s=n(`div`,{className:`toast-container`}),document.body.appendChild(s));let c=n(`div`,{className:`toast toast-${i} toast-enter`,innerHTML:`
      <span class="toast-icon">${r[i]}</span>
      <span class="toast-message">${e}</span>
      <button class="toast-close" aria-label="Tutup">×</button>
    `});s.appendChild(c),c.querySelector(`.toast-close`)?.addEventListener(`click`,()=>a(c)),setTimeout(()=>a(c),o)}function a(e){e.classList.remove(`toast-enter`),e.classList.add(`toast-exit`),setTimeout(()=>e.remove(),300)}function o(e,r){t(`.modal-backdrop`)?.remove();let i=n(`div`,{className:`modal-backdrop`}),a=n(`div`,{className:`modal`,innerHTML:`
      <div class="modal-header">
        <h3 class="modal-title">${e}</h3>
        <button class="modal-close" aria-label="Tutup">×</button>
      </div>
      <div class="modal-body">${typeof r==`string`?r:``}</div>
    `});typeof r!=`string`&&a.querySelector(`.modal-body`).appendChild(r),i.appendChild(a),document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add(`visible`));let o=()=>{i.classList.remove(`visible`),setTimeout(()=>i.remove(),300)};i.querySelector(`.modal-close`)?.addEventListener(`click`,o),i.addEventListener(`click`,e=>{e.target===i&&o()});let s=e=>{e.key===`Escape`&&(o(),document.removeEventListener(`keydown`,s))};return document.addEventListener(`keydown`,s),a}function s(){let e=t(`.modal-backdrop`);e&&(e.classList.remove(`visible`),setTimeout(()=>e.remove(),300))}function c(e){return new Promise(t=>{let r=o(`Konfirmasi`,n(`div`,{innerHTML:`
        <p style="margin-bottom: var(--space-6); color: var(--color-text-secondary); font-size: var(--font-size-sm);">${e}</p>
        <div class="form-actions" style="border-top: none; margin-top: 0; padding-top: 0;">
          <button class="btn btn-secondary" id="confirm-cancel">Batal</button>
          <button class="btn btn-danger" id="confirm-ok">Ya, Lanjutkan</button>
        </div>
      `}));r.querySelector(`#confirm-ok`)?.addEventListener(`click`,()=>{s(),t(!0)}),r.querySelector(`#confirm-cancel`)?.addEventListener(`click`,()=>{s(),t(!1)})})}var l={namaSekolah:`SMP Negeri 1 Nusantara`,alamatSekolah:`Jl. Pendidikan No. 1, Kota Nusantara`,tahunAjaran:`2026/2027`,nominalSppDefault:25e4,appsScriptUrl:``},u=[`Januari`,`Februari`,`Maret`,`April`,`Mei`,`Juni`,`Juli`,`Agustus`,`September`,`Oktober`,`November`,`Desember`],d=[`VII-A`,`VII-B`,`VII-C`,`VIII-A`,`VIII-B`,`VIII-C`,`IX-A`,`IX-B`,`IX-C`],f=[{value:`tunai`,label:`Tunai (Kasir)`},{value:`transfer`,label:`Transfer Bank Manual`},{value:`qris`,label:`QRIS (Semua Pembayaran)`},{value:`va_bca`,label:`Virtual Account BCA`},{value:`va_bri`,label:`Virtual Account BRI`},{value:`va_mandiri`,label:`Virtual Account Mandiri`},{value:`gopay`,label:`GoPay`},{value:`dana`,label:`DANA`},{value:`ovo`,label:`OVO`}],p=[{id:`pos-spp`,nama:`SPP Bulanan`,kategori:`spp`,nominalDefault:25e4,deskripsi:`Iuran Pembinaan Pendidikan bulanan (dapat memilih bulan yang ingin dibayar)`,isMonthly:!0},{id:`pos-gedung`,nama:`Uang Gedung / DSP (Uang Pangkal)`,kategori:`gedung`,nominalDefault:5e5,deskripsi:`Dana Sumbangan Pendidikan / fasilitas sarana sekolah`},{id:`pos-seragam`,nama:`Paket Seragam & Atribut Sekolah`,kategori:`seragam`,nominalDefault:35e4,deskripsi:`3 stel seragam (OSIS, Pramuka, Batik) + bet & dasi`},{id:`pos-buku`,nama:`Paket Buku Pelajaran & Modul LKS`,kategori:`buku`,nominalDefault:15e4,deskripsi:`Paket modul semester ganjil/genap lengkap`},{id:`pos-ujian`,nama:`Biaya Ujian & Asesmen Semester (PTS/PAS)`,kategori:`ujian`,nominalDefault:1e5,deskripsi:`Operasional ujian berbasis komputer (CBT) & administrasi`},{id:`pos-kegiatan`,nama:`Kegiatan Outing & Ekstrakurikuler`,kategori:`kegiatan`,nominalDefault:75e3,deskripsi:`Kegiatan luar kelas, kepramukaan, dan pengembangan minat`},{id:`pos-bebas`,nama:`Tagihan Lainnya / Donasi Sukarela / Cicilan`,kategori:`bebas`,nominalDefault:5e4,isCustomNominal:!0,deskripsi:`Nominal bebas! Anda dapat membayar berapapun sesuai kemampuan atau jenis keperluan khusus.`}],m={STUDENTS:`spp_students`,PAYMENTS:`spp_payments`,CONFIG:`spp_config`,THEME:`spp_theme`,NOTIFICATIONS:`spp_notifications`,SCHOOL_INFO:`spp_school_info`,BILLABLE_ITEMS:`spp_billable_items`,AUTH_SESSION:`spp_auth_session`,ADMIN_PASSWORD:`spp_admin_password`};function h(e){return new Intl.NumberFormat(`id-ID`,{style:`currency`,currency:`IDR`,minimumFractionDigits:0,maximumFractionDigits:0}).format(e)}function g(e){let t=new Date(e);return new Intl.DateTimeFormat(`id-ID`,{day:`numeric`,month:`long`,year:`numeric`}).format(t)}function _(e){let t=new Date(e);return new Intl.DateTimeFormat(`id-ID`,{day:`2-digit`,month:`2-digit`,year:`numeric`}).format(t)}function v(e=new Date){return e.toISOString().split(`T`)[0]}function y(){let e=new Date;return`SPP-${e.getFullYear().toString().slice(-2)}${String(e.getMonth()+1).padStart(2,`0`)}${String(e.getDate()).padStart(2,`0`)}-${Math.random().toString(36).substring(2,6).toUpperCase()}`}function b(e){return{lunas:`Lunas`,belum:`Belum Bayar`,sebagian:`Sebagian`}[e]??e}function x(e){return{lunas:`badge-success`,belum:`badge-danger`,sebagian:`badge-warning`}[e]??`badge-info`}function S(e){return{tunai:`Tunai`,transfer:`Transfer Bank`,qris:`QRIS`,va_bca:`VA BCA`,va_bri:`BRIVA (BRI)`,va_mandiri:`VA Mandiri`,gopay:`GoPay`,dana:`DANA`,ovo:`OVO`}[e]??e}function C(){return new Date().getMonth()}function w(){return new Date().getFullYear()}var T={namaSekolah:l.namaSekolah,alamatSekolah:l.alamatSekolah,noTelepon:`(021) 789-0123`,email:`info@smpn1nusantara.sch.id`,tahunAjaran:l.tahunAjaran,nominalSppDefault:l.nominalSppDefault,namaKepalaSekolah:`Dr. H. Bambang Sudiro, M.Pd.`,nipKepalaSekolah:`19750812 200003 1 002`,namaBendahara:`Siti Rahmawati, S.E.`,nipBendahara:`19820415 200801 2 007`,catatanKuitansi:`Kuitansi ini adalah bukti pembayaran yang sah dan tersimpan secara elektronik di database sekolah.`,appsScriptUrl:l.appsScriptUrl||``},E=new class{getSchoolInfo(){try{let e=localStorage.getItem(m.SCHOOL_INFO);if(e)return{...T,...JSON.parse(e)}}catch{}return{...T}}updateSchoolInfo(e){let t={...this.getSchoolInfo(),...e};try{localStorage.setItem(m.SCHOOL_INFO,JSON.stringify(t)),l.namaSekolah=t.namaSekolah,l.alamatSekolah=t.alamatSekolah,l.tahunAjaran=t.tahunAjaran,l.nominalSppDefault=t.nominalSppDefault,t.appsScriptUrl!==void 0&&(l.appsScriptUrl=t.appsScriptUrl)}catch(e){console.warn(`Gagal menyimpan identitas sekolah ke storage:`,e)}return window.dispatchEvent(new CustomEvent(`app:school-info-updated`,{detail:t})),t}getBillableItems(){try{let e=localStorage.getItem(m.BILLABLE_ITEMS);if(e){let t=JSON.parse(e);if(Array.isArray(t)&&t.length>0)return t}}catch{}return this.saveBillableItems([...p]),[...p]}saveBillableItems(e){try{localStorage.setItem(m.BILLABLE_ITEMS,JSON.stringify(e))}catch(e){console.warn(`Gagal menyimpan pos pembayaran:`,e)}window.dispatchEvent(new CustomEvent(`app:billable-items-updated`,{detail:e}))}addBillableItem(e){let t=this.getBillableItems(),n={id:`pos-`+Date.now()+`-`+Math.random().toString(36).substring(2,6),...e};return t.push(n),this.saveBillableItems(t),n}updateBillableItem(e,t){let n=this.getBillableItems(),r=n.findIndex(t=>t.id===e);return r!==-1&&(n[r]={...n[r],...t},this.saveBillableItems(n),!0)}deleteBillableItem(e){let t=this.getBillableItems(),n=t.filter(t=>t.id!==e);return n.length!==t.length&&(this.saveBillableItems(n),!0)}resetBillableItems(){this.saveBillableItems([...p])}},D=new class{get apiUrl(){return E.getSchoolInfo().appsScriptUrl||l.appsScriptUrl||``}get useApi(){return!!this.apiUrl}async testConnection(e){let t=e||this.apiUrl;if(!t)return{success:!1,message:`URL Google Apps Script belum diisi.`};try{let e=new URL(t);e.searchParams.set(`action`,`getStudents`);let n=await(await fetch(e.toString())).json();return n&&n.success!==void 0?{success:!0,message:`Koneksi ke Google Spreadsheet BERHASIL & AKTIF!`}:{success:!1,message:`Respons API tidak valid. Pastikan Who has access diatur Anyone.`}}catch(e){return{success:!1,message:`Gagal menghubungi URL: `+String(e)}}}async apiGet(e,t){if(!this.useApi)throw Error(`API URL not configured`);let n=new URL(this.apiUrl);n.searchParams.set(`action`,e),t&&Object.entries(t).forEach(([e,t])=>n.searchParams.set(e,t));try{return await(await fetch(n.toString())).json()}catch(t){return console.error(`API GET error (${e}):`,t),{success:!1,error:String(t)}}}async apiPost(e,t){if(!this.useApi)throw Error(`API URL not configured`);try{return await(await fetch(this.apiUrl,{method:`POST`,headers:{"Content-Type":`text/plain`},body:JSON.stringify({action:e,...t})})).json()}catch(t){return console.error(`API POST error (${e}):`,t),{success:!1,error:String(t)}}}getLocal(e){try{let t=localStorage.getItem(e);return t?JSON.parse(t):[]}catch{return[]}}setLocal(e,t){localStorage.setItem(e,JSON.stringify(t))}async getStudents(){return this.useApi?(await this.apiGet(`getStudents`)).data??[]:this.getLocal(m.STUDENTS)}async addStudent(e){if(this.useApi)return(await this.apiPost(`addStudent`,{student:e})).success;let t=this.getLocal(m.STUDENTS);return!t.some(t=>t.nis===e.nis)&&(t.push(e),this.setLocal(m.STUDENTS,t),!0)}async importStudents(e,t=!0){let n=await this.getStudents(),r=new Map;n.forEach(e=>r.set(e.nis.trim(),e));let i=0,a=0,o=0;for(let n of e){let e=n.nis.trim();e&&(r.has(e)?t?(r.set(e,{...r.get(e),...n}),a++):o++:(r.set(e,n),i++))}let s=Array.from(r.values());if(this.setLocal(m.STUDENTS,s),this.useApi)try{await this.apiPost(`bulkImportStudents`,{students:s})}catch(e){console.warn(`API sync bulkImportStudents failed, saved locally:`,e)}return{added:i,updated:a,skipped:o}}async updateStudent(e,t){if(this.useApi)return(await this.apiPost(`updateStudent`,{nis:e,student:t})).success;let n=this.getLocal(m.STUDENTS),r=n.findIndex(t=>t.nis===e);return r!==-1&&(n[r]={...n[r],...t},this.setLocal(m.STUDENTS,n),!0)}async deleteStudent(e){if(this.useApi)return(await this.apiPost(`deleteStudent`,{nis:e})).success;let t=this.getLocal(m.STUDENTS),n=t.filter(t=>t.nis!==e);return n.length!==t.length&&(this.setLocal(m.STUDENTS,n),!0)}async getStudentByNis(e){return(await this.getStudents()).find(t=>t.nis.trim().toLowerCase()===e.trim().toLowerCase())}async getPayments(){return this.useApi?(await this.apiGet(`getPayments`)).data??[]:this.getLocal(m.PAYMENTS)}async addPayment(e){if(!e.rincianItemText&&e.items&&e.items.length>0?e.rincianItemText=e.items.map(e=>`${e.nama} (${h(e.nominal)})`).join(`, `):e.rincianItemText||=`SPP ${e.bulan} ${e.tahun}`,e.channel||=`admin`,this.useApi)return(await this.apiPost(`addPayment`,{payment:e})).success;let t=this.getLocal(m.PAYMENTS);return(!e.items||e.items.length<=1)&&t.some(t=>t.nis===e.nis&&t.bulan===e.bulan&&t.tahun===e.tahun&&t.status===`lunas`&&(!t.items||t.items.some(e=>e.kategori===`spp`)))?!1:(t.push(e),this.setLocal(m.PAYMENTS,t),!0)}async getStudentPayments(e,t){return(await this.getPayments()).filter(n=>n.nis===e&&(!t||n.tahun===t))}async deletePayment(e){if(this.useApi)return(await this.apiPost(`deletePayment`,{idTransaksi:e})).success;let t=this.getLocal(m.PAYMENTS),n=t.filter(t=>t.idTransaksi!==e);return n.length!==t.length&&(this.setLocal(m.PAYMENTS,n),!0)}async getPaymentById(e){return(await this.getPayments()).find(t=>t.idTransaksi===e)}async getDashboardStats(e,t){let n=await this.getStudents(),r=await this.getPayments(),i=r.filter(n=>n.bulan===e&&n.tahun===t&&n.status===`lunas`||n.items&&n.items.some(n=>n.bulan===e&&n.tahun===t)),a=new Set(i.map(e=>e.nis)),o=n.filter(e=>a.has(e.nis)).length,s=Math.max(0,n.length-o),c=r.filter(e=>e.status===`lunas`).reduce((e,t)=>e+t.nominal,0),u=r.filter(e=>e.channel===`online`&&e.status===`lunas`).reduce((e,t)=>e+t.nominal,0),d=s*l.nominalSppDefault;return{totalSiswa:n.length,sudahBayar:o,belumBayar:s,totalPemasukan:c,totalTunggakan:d,totalOnline:u}}async getUnpaidStudents(e,t){let n=await this.getStudents(),r=await this.getPayments(),i=new Set(r.filter(n=>n.bulan===e&&n.tahun===t&&n.status===`lunas`||n.items&&n.items.some(n=>n.bulan===e&&n.tahun===t)).map(e=>e.nis));return n.filter(e=>!i.has(e.nis))}},O=new class{permission=`default`;audioCtx=null;async requestPermission(){if(!(`Notification`in window))return console.warn(`Browser does not support notifications`),!1;if(Notification.permission===`granted`)return this.permission=`granted`,!0;if(Notification.permission!==`denied`){let e=await Notification.requestPermission();return this.permission=e,e===`granted`}return!1}get isEnabled(){return this.permission===`granted`||Notification?.permission===`granted`}playNotificationSound(){try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.audioCtx||=new e,this.audioCtx.state===`suspended`&&this.audioCtx.resume();let t=this.audioCtx.currentTime,n=this.audioCtx.createOscillator(),r=this.audioCtx.createGain();n.type=`sine`,n.frequency.setValueAtTime(880,t),r.gain.setValueAtTime(.15,t),r.gain.exponentialRampToValueAtTime(.001,t+.4),n.connect(r),r.connect(this.audioCtx.destination),n.start(t),n.stop(t+.4);let i=this.audioCtx.createOscillator(),a=this.audioCtx.createGain();i.type=`sine`,i.frequency.setValueAtTime(1174.66,t+.12),a.gain.setValueAtTime(.2,t+.12),a.gain.exponentialRampToValueAtTime(.001,t+.6),i.connect(a),a.connect(this.audioCtx.destination),i.start(t+.12),i.stop(t+.6)}catch(e){console.warn(`Audio playback not permitted or not supported:`,e)}}send(e,t,n=`🏫`){if(!this.isEnabled){i(t,`info`);return}try{let r=new Notification(e,{body:t,icon:`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${n}</text></svg>`,badge:`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>`,tag:`spp-notification`});r.onclick=()=>{window.focus(),r.close()},setTimeout(()=>r.close(),8e3)}catch{i(t,`info`)}}sendReminder(e){let t=u[C()];this.send(`⚠️ Pengingat SPP - ${l.namaSekolah}`,`${e.nama} (${e.kelas}) belum membayar SPP bulan ${t}. Nominal: ${h(e.nominalSpp)}`,`💰`)}async checkAndNotify(){let e=u[C()],t=new Date().getFullYear();try{let n=await D.getUnpaidStudents(e,t);n.length>0&&(this.send(`📋 Tunggakan SPP - ${e} ${t}`,`${n.length} siswa belum membayar SPP bulan ${e} ${t}.`,`⚠️`),i(`${n.length} siswa belum membayar SPP bulan ${e}`,`warning`,6e3))}catch(e){console.error(`Error checking notifications:`,e)}}sendPaymentSuccess(e,t,n){this.playNotificationSound(),this.send(`✅ Pembayaran Berhasil`,`${e} telah membayar SPP bulan ${t} sebesar ${h(n)}.`,`✅`)}notifyNewOnlinePayment(e){this.playNotificationSound();let t=`🔔 Pembayaran Online Diterima!`,n=e.rincianItemText||`Pembayaran ${e.bulan} ${e.tahun}`,r=`${e.nama} (${e.kelas}) membayar ${h(e.nominal)} untuk [${n}].`;this.send(t,r,`💳`),i(`🎉 ${r}`,`success`,7e3);let a=this.getNotifications(),o={id:`notif-`+Date.now()+`-`+Math.random().toString(36).substring(2,6),timestamp:Date.now(),title:t,message:r,idTransaksi:e.idTransaksi,nominal:e.nominal,namaSiswa:e.nama,read:!1};a.unshift(o),a.length>50&&(a.length=50);try{localStorage.setItem(m.NOTIFICATIONS,JSON.stringify(a))}catch(e){console.warn(`Failed saving notifications to storage:`,e)}window.dispatchEvent(new CustomEvent(`app:new-notification`,{detail:o}))}getNotifications(){try{let e=localStorage.getItem(m.NOTIFICATIONS);return e?JSON.parse(e):[]}catch{return[]}}getUnreadCount(){return this.getNotifications().filter(e=>!e.read).length}markAllAsRead(){let e=this.getNotifications();e.forEach(e=>e.read=!0);try{localStorage.setItem(m.NOTIFICATIONS,JSON.stringify(e))}catch{}window.dispatchEvent(new CustomEvent(`app:notifications-read`))}clearNotifications(){localStorage.removeItem(m.NOTIFICATIONS),window.dispatchEvent(new CustomEvent(`app:notifications-read`))}},k=`admin123`,A=new class{getSession(){try{let e=localStorage.getItem(m.AUTH_SESSION);if(e)return JSON.parse(e)}catch{}return null}getRole(){let e=this.getSession();return e?e.role:null}isAdmin(){return this.getRole()===`admin`}isStudent(){return this.getRole()===`siswa`}getCurrentStudent(){return this.getSession()?.student}getAdminPassword(){return localStorage.getItem(m.ADMIN_PASSWORD)||k}loginAsAdmin(e,t){let n=e.trim().toLowerCase()===`admin`,r=t===this.getAdminPassword();if(!n||!r)return{success:!1,error:`Username atau Password Admin salah! (Default: admin / admin123)`};let i={role:`admin`,username:`admin`,loginTime:Date.now()};return localStorage.setItem(m.AUTH_SESSION,JSON.stringify(i)),window.dispatchEvent(new CustomEvent(`app:auth-changed`,{detail:i})),{success:!0}}async loginAsStudent(e){let t=e.trim().toLowerCase();if(!t)return{success:!1,error:`Masukkan Nama atau NIS siswa!`};let n=(await D.getStudents()).find(e=>e.nis.toLowerCase()===t||e.nama.toLowerCase().includes(t));if(!n)return{success:!1,error:`Siswa dengan Nama atau NIS "${e}" tidak ditemukan di database sekolah.`};let r={role:`siswa`,student:n,loginTime:Date.now()};return localStorage.setItem(m.AUTH_SESSION,JSON.stringify(r)),window.dispatchEvent(new CustomEvent(`app:auth-changed`,{detail:r})),{success:!0,student:n}}logout(){localStorage.removeItem(m.AUTH_SESSION),window.dispatchEvent(new CustomEvent(`app:auth-changed`,{detail:null}))}updateAdminPassword(e,t){return e===this.getAdminPassword()?t.length<4?{success:!1,error:`Password baru minimal 4 karakter!`}:(localStorage.setItem(m.ADMIN_PASSWORD,t),{success:!0}):{success:!1,error:`Password lama salah!`}}};function ee(){let t=n(`aside`,{className:`sidebar`,id:`sidebar`});function r(){let r=A.getRole(),a=E.getSchoolInfo(),o=A.getCurrentStudent();if((window.location.hash.slice(1)||`/`)===`/login`||!r){t.style.display=`none`;return}if(t.style.display=`flex`,r===`siswa`&&o){t.innerHTML=`
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <div class="sidebar-logo">👨‍🎓</div>
            <div>
              <div class="sidebar-title" style="font-size: var(--font-size-sm);">${o.nama}</div>
              <div class="sidebar-subtitle">Kelas ${o.kelas} • ${o.nis}</div>
            </div>
          </div>
        </div>

        <div style="padding: var(--space-3) var(--space-4); background: rgba(99, 102, 241, 0.1); border-radius: var(--radius-lg); margin: var(--space-2) var(--space-3); border: 1px solid rgba(99, 102, 241, 0.2);">
          <div style="font-size: 11px; color: var(--color-primary-light); font-weight: 600;">PORTAL SISWA</div>
          <div style="font-size: 10px; color: var(--color-text-muted); margin-top: 2px;">
            Akses mandiri tagihan & riwayat kuitansi sah
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
          <button class="btn btn-secondary btn-sm" id="btn-sidebar-logout" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-2);">
            <span>🚪</span>
            <span>Keluar Akun Siswa</span>
          </button>
          <div class="sidebar-footer-info mt-3" style="text-align: center; font-size: 10px;">
            ${a.namaSekolah}
          </div>
        </div>
      `,t.querySelector(`#btn-sidebar-logout`)?.addEventListener(`click`,()=>{A.logout(),i(`Anda telah keluar dari akun siswa`,`info`),e.navigate(`/login`)});return}t.innerHTML=`
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-logo">🏫</div>
          <div>
            <div class="sidebar-title">SPP & Kasir</div>
            <div class="sidebar-subtitle" id="sidebar-school-name">${a.namaSekolah}</div>
          </div>
        </div>
        <button class="notification-bell-btn" id="sidebar-bell-btn" title="Notifikasi Pembayaran">
          🔔
          <span class="bell-badge" id="bell-badge-count" style="display: none;">0</span>
        </button>
      </div>

      <div style="padding: 2px var(--space-4); margin-bottom: var(--space-2);">
        <span class="badge badge-success text-xs" style="font-size: 10px; width: fit-content;">
          🛡️ Sesi Administrator Aktif
        </span>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        <span class="nav-label">Menu Administrasi</span>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-secondary btn-sm mb-3" id="btn-sidebar-logout" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-2);">
          <span>🚪</span>
          <span>Logout Admin</span>
        </button>
        <div class="sidebar-footer-info" id="sidebar-footer-info">
          Tahun Ajaran ${a.tahunAjaran}<br>
          <span style="opacity: 0.6">v1.4.0 • Secured Admin</span>
        </div>
      </div>
    `;let s=t.querySelector(`#sidebar-nav`);[{path:`/`,title:`Dashboard`,icon:`🏠`},{path:`/siswa`,title:`Data Siswa`,icon:`👨‍🎓`},{path:`/pembayaran`,title:`Kasir Pembayaran`,icon:`💰`},{path:`/riwayat`,title:`Riwayat Pembayaran`,icon:`📋`},{path:`/pos-pembayaran`,title:`Pos Pembayaran`,icon:`🏷️`},{path:`/identitas-sekolah`,title:`Identitas Sekolah`,icon:`⚙️`},{path:`/portal-siswa`,title:`Pratinjau Portal Siswa`,icon:`💳`}].forEach(t=>{let r=t.path===`/portal-siswa`,i=n(`a`,{className:`nav-link ${r?`nav-link-portal`:``}`,"data-path":t.path,innerHTML:`
          <span class="nav-icon">${t.icon}</span>
          <span>${t.title}</span>
          ${r?`<span class="badge badge-primary text-xs ml-auto">SISWA</span>`:``}
        `});i.addEventListener(`click`,n=>{n.preventDefault(),e.navigate(t.path),P()}),s.appendChild(i)});let c=t.querySelector(`#sidebar-bell-btn`),l=t.querySelector(`#bell-badge-count`),u=()=>{let e=O.getUnreadCount();e>0?(l.textContent=e>99?`99+`:String(e),l.style.display=`flex`,c.classList.add(`has-unread`)):(l.style.display=`none`,c.classList.remove(`has-unread`))};u(),c.addEventListener(`click`,()=>{j(u)}),t.querySelector(`#btn-sidebar-logout`)?.addEventListener(`click`,()=>{A.logout(),i(`Anda telah logout dari Panel Admin`,`info`),e.navigate(`/login`)})}return r(),window.addEventListener(`app:auth-changed`,()=>{r(),te(window.location.hash.slice(1)||`/`)}),window.addEventListener(`app:school-info-updated`,()=>{r()}),window.addEventListener(`app:new-notification`,()=>{let e=t.querySelector(`#bell-badge-count`),n=t.querySelector(`#sidebar-bell-btn`);if(e&&n){let t=O.getUnreadCount();t>0&&(e.textContent=t>99?`99+`:String(t),e.style.display=`flex`,n.classList.add(`has-unread`))}}),t}function j(e){let t=O.getNotifications(),n=document.createElement(`div`);n.innerHTML=`
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
      ${t.length===0?`
        <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
          <div class="empty-state-icon">🔕</div>
          <div class="empty-state-title">Belum Ada Notifikasi</div>
          <div class="empty-state-text">Notifikasi akan muncul secara instan begitu ada siswa yang membayar online.</div>
        </div>
      `:t.map(e=>`
        <div class="notification-item ${e.read?`read`:`unread`}">
          <div class="notif-icon">💳</div>
          <div class="notif-content">
            <div class="notif-title">
              ${e.title}
              ${e.read?``:`<span class="badge badge-primary text-xs" style="font-size: 9px;">BARU</span>`}
            </div>
            <div class="notif-message">${e.message}</div>
            <div class="notif-time">${_(new Date(e.timestamp).toISOString())} • ${new Date(e.timestamp).toLocaleTimeString(`id-ID`,{hour:`2-digit`,minute:`2-digit`})}</div>
          </div>
        </div>
      `).join(``)}
    </div>
  `,n.querySelector(`#btn-mark-all-read`)?.addEventListener(`click`,()=>{O.markAllAsRead(),e(),j(e)}),n.querySelector(`#btn-clear-all-notifs`)?.addEventListener(`click`,()=>{O.clearNotifications(),e(),j(e)}),o(`🔔 Pusat Notifikasi Admin`,n)}function te(e){document.querySelectorAll(`.nav-link`).forEach(t=>{let n=t.getAttribute(`data-path`);t.classList.toggle(`active`,n===e)})}function M(){let e=n(`button`,{className:`mobile-menu-btn`,id:`mobile-menu-btn`,innerHTML:`☰`});return e.addEventListener(`click`,ne),e}function N(){let e=n(`div`,{className:`sidebar-overlay`,id:`sidebar-overlay`});return e.addEventListener(`click`,P),e}function ne(){let e=t(`#sidebar`),n=t(`#sidebar-overlay`);e?.classList.toggle(`open`),n?.classList.toggle(`visible`)}function P(){let e=t(`#sidebar`),n=t(`#sidebar-overlay`);e?.classList.remove(`open`),n?.classList.remove(`visible`)}function F(){let e=n(`div`,{className:`page-enter`});return e.innerHTML=`
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-description">Ringkasan pembayaran SPP & tagihan sekolah bulan ${u[C()]} ${w()}</p>
    </div>

    <div class="grid-stats stagger-children" id="stats-container" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      ${I()}
      ${I()}
      ${I()}
      ${I()}
      ${I()}
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
  `,L(e),e}function I(){return`
    <div class="stat-card">
      <div class="skeleton skeleton-text" style="width: 60%; height: 14px;"></div>
      <div class="skeleton skeleton-text" style="width: 40%; height: 32px; margin-top: 12px;"></div>
    </div>
  `}async function L(e){let t=u[C()],n=w();try{let[r,i,a]=await Promise.all([D.getDashboardStats(t,n),D.getUnpaidStudents(t,n),D.getPayments()]),o=a.filter(e=>e.channel===`online`),s=o.reduce((e,t)=>e+t.nominal,0),c=e.querySelector(`#stats-container`);c&&(c.innerHTML=``,c.classList.add(`stagger-children`),c.appendChild(R(`👨‍🎓`,`Total Siswa`,r.totalSiswa.toString(),`Terdaftar aktif`,`primary`)),c.appendChild(R(`✅`,`Sudah Bayar SPP`,r.sudahBayar.toString(),`Bulan ${t}`,`success`)),c.appendChild(R(`⚠️`,`Belum Bayar SPP`,r.belumBayar.toString(),`Bulan ${t}`,`warning`)),c.appendChild(R(`💳`,`Setoran Online`,h(s),`${o.length} transaksi online`,`primary`)),c.appendChild(R(`💰`,`Total Pemasukan`,h(r.totalPemasukan),`Semua pos tagihan`,`info`)));let l=e.querySelector(`#unpaid-list`);l&&(l.classList.remove(`animate-pulse`),i.length===0?l.innerHTML=`
          <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
            <div class="empty-state-icon">🎉</div>
            <div class="empty-state-title">Semua Lunas!</div>
            <div class="empty-state-text">Semua siswa sudah membayar SPP bulan ini.</div>
          </div>
        `:(l.innerHTML=i.slice(0,8).map(e=>`
          <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border);">
            <div>
              <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-primary);">${e.nama}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${e.kelas} • NIS: ${e.nis}</div>
            </div>
            <span class="badge badge-danger"><span class="badge-dot"></span> Belum</span>
          </div>
        `).join(``),i.length>8&&(l.innerHTML+=`
            <p class="text-muted mt-4" style="font-size: var(--font-size-xs); text-align: center;">
              +${i.length-8} siswa lainnya
            </p>
          `)));let u=e.querySelector(`#recent-list`);if(u){u.classList.remove(`animate-pulse`);let e=a.sort((e,t)=>new Date(t.tanggalBayar).getTime()-new Date(e.tanggalBayar).getTime()).slice(0,8);u.innerHTML=e.length===0?`
          <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-title">Belum Ada Data</div>
            <div class="empty-state-text">Belum ada pembayaran yang tercatat.</div>
          </div>
        `:e.map(e=>{let t=e.channel===`online`,n=e.rincianItemText||`SPP ${e.bulan} ${e.tahun}`,r=n.length>30?n.substring(0,30)+`...`:n;return`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border);">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  <span style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-primary);">${e.nama}</span>
                  ${t?`<span class="badge badge-primary text-xs">ONLINE</span>`:`<span class="badge badge-secondary text-xs">KASIR</span>`}
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  ${r}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-success);">${h(e.nominal)}</div>
                <span class="badge badge-success" style="font-size: 10px;"><span class="badge-dot"></span> Lunas</span>
              </div>
            </div>
          `}).join(``)}}catch(e){console.error(`Dashboard data error:`,e)}}function R(e,t,r,i,a){return n(`div`,{className:`stat-card ${a}`,innerHTML:`
      <div class="stat-header">
        <span class="stat-label">${t}</span>
        <div class="stat-icon ${a}">${e}</div>
      </div>
      <div class="stat-value count-up">${r}</div>
      <div class="stat-footer">${i}</div>
    `})}function z(e,t){let n=new Blob([`﻿`+t],{type:`text/csv;charset=utf-8;`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.setAttribute(`href`,r),i.setAttribute(`download`,e.endsWith(`.csv`)?e:`${e}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r)}function B(e){return e==null?`""`:`"${String(e).replace(/"/g,`""`)}"`}function V(e,t=`SMP Nusantara Unggul`){let n=[`No`,`NIS`,`Nama Siswa`,`Kelas`,`Nama Orang Tua / Wali`,`No. WhatsApp / HP`,`Nominal SPP (Rp)`],r=e.map((e,t)=>[t+1,e.nis,e.nama,e.kelas,e.namaOrangTua||`-`,e.noHp||`-`,e.nominalSpp]),i=[[`Data Siswa - ${t}`],[`Diunduh pada: ${new Date().toLocaleString(`id-ID`)}`],[],n.map(B).join(`,`),...r.map(e=>e.map(B).join(`,`))].map(e=>Array.isArray(e)?e.join(`,`):e).join(`\r
`);z(`Data_Siswa_${new Date().toISOString().slice(0,10)}.csv`,i)}function H(e,t=`SMP Nusantara Unggul`){let n=[`No`,`ID Transaksi`,`Tanggal Bayar`,`NIS`,`Nama Siswa`,`Kelas`,`Rincian Pos / Item Dibayar`,`Nominal (Rp)`,`Channel`,`Metode Bayar`,`Status`,`Catatan / Keterangan`],r=e.map((e,t)=>[t+1,e.idTransaksi,g(e.tanggalBayar),e.nis,e.nama,e.kelas,e.rincianItemText||`SPP ${e.bulan} ${e.tahun}`,e.nominal,e.channel===`online`?`Online (Siswa)`:`Kasir Admin`,e.metodeBayar.toUpperCase(),e.status.toUpperCase(),e.keterangan||`-`]),i=e.reduce((e,t)=>e+(t.nominal||0),0),a=[[`Laporan Rekap Transaksi Pembayaran - ${t}`],[`Tanggal Cetak: ${new Date().toLocaleString(`id-ID`)}`],[`Total Transaksi: ${e.length} | Total Pemasukan: ${h(i)}`],[],n.map(B).join(`,`),...r.map(e=>e.map(B).join(`,`)),[],[``,``,``,``,``,`TOTAL DITERIMA`,``,i,``,``,``,``].map(B).join(`,`)].map(e=>Array.isArray(e)?e.join(`,`):e).join(`\r
`);z(`Laporan_Pembayaran_${new Date().toISOString().slice(0,10)}.csv`,a)}function re(e=25e4,t=`SMP Nusantara Unggul`){let n=`
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Template Data Siswa</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; }
        .text { mso-number-format: "\\@"; }
        .num { mso-number-format: "#,##0"; text-align: right; }
        .center { text-align: center; }
        .title { font-size: 14pt; font-weight: bold; color: #1e1b4b; padding: 10px 0; }
        .subtitle { font-size: 9.5pt; color: #475569; padding-bottom: 6px; }
        .petunjuk { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 8px; font-size: 9pt; }
        .th-primary { background-color: #4338ca; color: #ffffff; font-weight: bold; border: 1px solid #312e81; padding: 10px; text-align: center; font-size: 11pt; }
        .th-info { background-color: #0284c7; color: #ffffff; font-weight: bold; border: 1px solid #0369a1; padding: 10px; text-align: center; font-size: 11pt; }
        .td-data { border: 1px solid #cbd5e1; padding: 8px 10px; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="6" class="title">TEMPLATE RESMI DATA SISWA - ${t.toUpperCase()}</td>
        </tr>
        <tr>
          <td colspan="6" class="subtitle">Isi data siswa di bawah baris judul kolom. Jangan mengubah nama atau urutan kolom header (Baris 6).</td>
        </tr>
        <tr>
          <td colspan="6" class="petunjuk">
            <strong>PETUNJUK PENGISIAN:</strong><br/>
            1. Kolom <strong>NIS</strong>, <strong>Nama Siswa</strong>, dan <strong>Kelas</strong> WAJIB diisi.<br/>
            2. Kolom <strong>No WhatsApp / HP</strong> isi dengan awalan 08 (misal: 081234567890) untuk pengiriman kuitansi otomatis.<br/>
            3. Kolom <strong>Nominal SPP</strong> isi angka saja tanpa titik atau koma (misal: ${e}).
          </td>
        </tr>
        <tr><td colspan="6"></td></tr>
        <tr><td colspan="6"></td></tr>
        <tr>
          <th class="th-primary" style="width: 140px;">NIS (Wajib)</th>
          <th class="th-primary" style="width: 260px;">Nama Lengkap Siswa (Wajib)</th>
          <th class="th-primary" style="width: 110px;">Kelas (Wajib)</th>
          <th class="th-info" style="width: 210px;">Nama Orang Tua / Wali</th>
          <th class="th-info" style="width: 170px;">No WhatsApp / HP</th>
          <th class="th-info" style="width: 160px;">Nominal SPP (Rp)</th>
        </tr>
        <tr>
          <td class="td-data text center">2026011</td>
          <td class="td-data">Muhammad Rizky Pratama</td>
          <td class="td-data center">VII-A</td>
          <td class="td-data">Bambang Pratama</td>
          <td class="td-data text">081234567890</td>
          <td class="td-data num">${e}</td>
        </tr>
        <tr>
          <td class="td-data text center">2026012</td>
          <td class="td-data">Anisa Rahmawati</td>
          <td class="td-data center">VII-B</td>
          <td class="td-data">Hendra Gunawan</td>
          <td class="td-data text">085712345678</td>
          <td class="td-data num">${e}</td>
        </tr>
        <tr>
          <td class="td-data text center">2026013</td>
          <td class="td-data">Dimas Arya Saputra</td>
          <td class="td-data center">VIII-A</td>
          <td class="td-data">Suryanto</td>
          <td class="td-data text">087812345678</td>
          <td class="td-data num">${e}</td>
        </tr>
        <tr>
          <td class="td-data text center">2026014</td>
          <td class="td-data">Zahra Putri Kirana</td>
          <td class="td-data center">IX-B</td>
          <td class="td-data">Wahyudi</td>
          <td class="td-data text">089612345678</td>
          <td class="td-data num">${e}</td>
        </tr>
      </table>
    </body>
    </html>
  `,r=new Blob([`﻿`+n],{type:`application/vnd.ms-excel;charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.setAttribute(`href`,i),a.setAttribute(`download`,`Template_Data_Siswa.xls`),document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(i)}function U(e=25e4){let t=[`NIS`,`Nama Siswa`,`Kelas`,`Nama Orang Tua / Wali`,`No WhatsApp / HP`,`Nominal SPP (Rp)`],n=[[`2026011`,`Muhammad Rizky Pratama`,`VII-A`,`Bambang Pratama`,`081234567890`,String(e)],[`2026012`,`Anisa Rahmawati`,`VII-B`,`Hendra Gunawan`,`085712345678`,String(e)],[`2026013`,`Dimas Arya Saputra`,`VIII-A`,`Suryanto`,`087812345678`,String(e)],[`2026014`,`Zahra Putri Kirana`,`IX-B`,`Wahyudi`,`089612345678`,String(e)]];z(`Template_Data_Siswa.csv`,[`sep=;`,t.map(B).join(`;`),...n.map(e=>e.map(B).join(`;`))].join(`\r
`))}function ie(e,t){let n=[],r=``,i=!1;for(let a=0;a<e.length;a++){let o=e[a];o===`"`?i&&e[a+1]===`"`?(r+=`"`,a++):i=!i:o===t&&!i?(n.push(r.trim()),r=``):r+=o}return n.push(r.trim()),n}function ae(e){let t=e.split(/\r\n|\r|\n/).map(e=>e.trim()).filter(e=>e.length>0),n=t[0]||``;if(n.toLowerCase().startsWith(`sep=`))return n.substring(4).trim()||`;`;let r=t[1]||n,i=(r.match(/,/g)||[]).length,a=(r.match(/;/g)||[]).length,o=(r.match(/\t/g)||[]).length;return a>=i&&a>=o?`;`:o>i&&o>a?`	`:`,`}function W(e,t=25e4){let n=new DOMParser().parseFromString(e,`text/html`),r=Array.from(n.querySelectorAll(`tr`));if(r.length===0)return{valid:[],errors:[`Tabel Excel kosong atau tidak terbaca.`],totalRows:0};let i=-1,a=[];for(let e=0;e<r.length;e++){let t=Array.from(r[e].querySelectorAll(`th, td`)).map(e=>e.textContent?.trim().toLowerCase().replace(/[^a-z0-9]/g,``)||``);if(t.some(e=>e===`nis`||e.includes(`induk`))&&t.some(e=>e.includes(`nama`)||e.includes(`kelas`))){i=e,a=t;break}}if(i===-1)return{valid:[],errors:[`Kolom header (NIS, Nama Siswa, Kelas) tidak ditemukan pada tabel Excel.`],totalRows:0};let o=a.findIndex(e=>e===`nis`||e.includes(`induk`)||e.includes(`id`)),s=a.findIndex(e=>e.includes(`nama`)&&!e.includes(`orang`)&&!e.includes(`wali`));s===-1&&(s=a.findIndex(e=>e===`nama`||e===`name`||e.includes(`siswa`)));let c=a.findIndex(e=>e.includes(`kelas`)||e.includes(`tingkat`)||e.includes(`rombel`)),l=a.findIndex(e=>e.includes(`orang`)||e.includes(`wali`)||e.includes(`ortu`)||e.includes(`parent`)),u=a.findIndex(e=>e.includes(`hp`)||e.includes(`wa`)||e.includes(`telepon`)||e.includes(`phone`)),d=a.findIndex(e=>e.includes(`spp`)||e.includes(`nominal`)||e.includes(`biaya`)||e.includes(`tarif`));o===-1&&(o=0),s===-1&&(s=1),c===-1&&(c=2),l===-1&&(l=3),u===-1&&(u=4),d===-1&&(d=5);let f=[],p=[];for(let e=i+1;e<r.length;e++){let n=Array.from(r[e].querySelectorAll(`td, th`)).map(e=>e.textContent?.trim()||``);if(n.length===0||n.every(e=>!e))continue;let i=n[o]?.replace(/['"]/g,``).trim(),a=n[s]?.replace(/['"]/g,``).trim(),m=n[c]?.replace(/['"]/g,``).trim()||`VII-A`,h=n[l]?.replace(/['"]/g,``).trim()||`-`,g=n[u]?.replace(/['"]/g,``).trim()||``;g=g.replace(/[^\d+]/g,``),g.startsWith(`+62`)?g=`0`+g.slice(3):g.startsWith(`62`)&&(g=`0`+g.slice(2));let _=n[d]?.replace(/[^0-9]/g,``),v=_?parseInt(_,10):t;if(!i){p.push(`Baris ${e+1}: NIS tidak boleh kosong.`);continue}if(!a){p.push(`Baris ${e+1} (NIS ${i}): Nama siswa tidak boleh kosong.`);continue}f.push({nis:i,nama:a,kelas:m,namaOrangTua:h,noHp:g,nominalSpp:isNaN(v)||v<=0?t:v})}return{valid:f,errors:p,totalRows:r.length-(i+1)}}function oe(e,t=25e4){let n=e.replace(/^\uFEFF/,``).trim();if(n.includes(`<table`)||n.includes(`<tr`))return W(n,t);let r=n.split(/\r\n|\r|\n/).filter(e=>e.trim().length>0);if(r.length===0)return{valid:[],errors:[`File kosong.`],totalRows:0};if(r[0].toLowerCase().startsWith(`sep=`)&&(r=r.slice(1)),r.length===0)return{valid:[],errors:[`File hanya berisi konfigurasi separator tanpa baris data.`],totalRows:0};let i=0;for(let e=0;e<Math.min(r.length,10);e++){let t=r[e].toLowerCase();if(t.includes(`nis`)&&(t.includes(`nama`)||t.includes(`kelas`))){i=e;break}}let a=ae(n),o=ie(r[i],a).map(e=>e.toLowerCase().replace(/[^a-z0-9]/g,``)),s=o.findIndex(e=>e===`nis`||e.includes(`induk`)||e.includes(`id`)),c=o.findIndex(e=>e.includes(`nama`)&&!e.includes(`orang`)&&!e.includes(`wali`));c===-1&&(c=o.findIndex(e=>e===`nama`||e===`name`||e.includes(`siswa`)));let l=o.findIndex(e=>e.includes(`kelas`)||e.includes(`tingkat`)||e.includes(`rombel`)),u=o.findIndex(e=>e.includes(`orang`)||e.includes(`wali`)||e.includes(`ortu`)||e.includes(`parent`)),d=o.findIndex(e=>e.includes(`hp`)||e.includes(`wa`)||e.includes(`telepon`)||e.includes(`phone`)),f=o.findIndex(e=>e.includes(`spp`)||e.includes(`nominal`)||e.includes(`biaya`)||e.includes(`tarif`));s===-1&&(s=0),c===-1&&(c=1),l===-1&&(l=2),u===-1&&(u=3),d===-1&&(d=4),f===-1&&(f=5);let p=[],m=[];for(let e=i+1;e<r.length;e++){let n=r[e].trim();if(!n)continue;let i=ie(n,a);if(i.length===0||i.every(e=>!e))continue;let o=i[s]?.replace(/['"]/g,``).trim(),h=i[c]?.replace(/['"]/g,``).trim(),g=i[l]?.replace(/['"]/g,``).trim()||`VII-A`,_=i[u]?.replace(/['"]/g,``).trim()||`-`,v=i[d]?.replace(/['"]/g,``).trim()||``;v=v.replace(/[^\d+]/g,``),v.startsWith(`+62`)?v=`0`+v.slice(3):v.startsWith(`62`)&&(v=`0`+v.slice(2));let y=i[f]?.replace(/[^0-9]/g,``),b=y?parseInt(y,10):t;if(!o){m.push(`Baris ${e+1}: NIS tidak boleh kosong.`);continue}if(!h){m.push(`Baris ${e+1} (NIS ${o}): Nama siswa tidak boleh kosong.`);continue}p.push({nis:o,nama:h,kelas:g,namaOrangTua:_,noHp:v,nominalSpp:isNaN(b)||b<=0?t:b})}return{valid:p,errors:m,totalRows:r.length-(i+1)}}function G(e){if(!e)return``;let t=e.replace(/\D/g,``);return t.startsWith(`0`)?t=`62`+t.slice(1):t.startsWith(`8`)&&(t=`62`+t),t}function K(e,t){let n=G(e),r=encodeURIComponent(t),i=n?`https://api.whatsapp.com/send?phone=${n}&text=${r}`:`https://api.whatsapp.com/send?text=${r}`;window.open(i,`_blank`)}function q(e,t){let n=E.getSchoolInfo(),r=t?.namaOrangTua?`Bpk/Ibu ${t.namaOrangTua}`:`Wali dari ${e.nama}`,i=e.rincianItemText||`SPP Bulan ${e.bulan} ${e.tahun}`,a=``;return a=e.items&&e.items.length>0?e.items.map((e,t)=>`  ${t+1}. ${e.nama}: *${h(e.nominal)}*`).join(`
`):`  • ${i}: *${h(e.nominal)}*`,`*KUITANSI PEMBAYARAN RESMI*
*${n.namaSekolah.toUpperCase()}*
${n.alamatSekolah}
----------------------------------------

Kepada Yth.
*${r}*

Terima kasih, pembayaran administrasi sekolah telah berhasil diterima dan diverifikasi dengan rincian:

📋 *No. Kuitansi:* \`${e.idTransaksi}\`
📅 *Tanggal Bayar:* ${g(e.tanggalBayar)}
👨‍🎓 *Nama Siswa:* *${e.nama}*
🏷️ *NIS / Kelas:* ${e.nis} / ${e.kelas}
💳 *Metode:* ${S(e.metodeBayar)}
🏢 *Channel:* ${e.channel===`online`?`Online (Portal Siswa)`:`Kasir Administrasi Sekolah`}

*Rincian Pos Tagihan:*
${a}

💰 *TOTAL DIBAYAR:* *${h(e.nominal)}*
✅ *STATUS:* *LUNAS / SAH*

_${n.catatanKuitansi||`Kuitansi elektronik ini merupakan bukti pembayaran yang sah.`}_

Hormat kami,
*Bendahara & Tata Usaha Keuangan*
*${n.namaSekolah}*`}function J(e,t,n,r=``){let i=E.getSchoolInfo(),a=e.namaOrangTua?`Bpk/Ibu ${e.namaOrangTua}`:`Bpk/Ibu Wali`,o=t.length>0?t.join(`, `):`SPP Berjalan`;return`*PEMBERITAHUAN ADMINISTRASI SPP*
*${i.namaSekolah.toUpperCase()}*
Tahun Ajaran ${i.tahunAjaran}
----------------------------------------

Yth. *${a}*
(Orang Tua / Wali dari ananda *${e.nama}*, Kelas *${e.kelas}*, NIS: \`${e.nis}\`)

Dengan hormat, kami menginformasikan catatan administrasi SPP ananda saat ini:

📌 *Tunggakan Bulan:* *${o}*
💰 *Total Tagihan:* *${h(n)}*

Pembayaran dapat dilakukan melalui:
1. 💳 *Portal Mandiri Siswa (Online QRIS & Virtual Account)*:
   Kunjungi portal sekolah dan masukkan NIS: *${e.nis}*
2. 🏢 *Kasir Pembayaran Sekolah (Tunai)* pada jam kerja operasional sekolah.

${r?`_Catatan: ${r}_\n\n`:``}Apabila Bapak/Ibu telah melakukan pembayaran sebelumnya, mohon konfirmasikan bukti transfer kepada kami.

Terima kasih atas perhatian dan kerjasamanya.

Salam hangat,
*Administrasi Keuangan Sekolah*
*${i.namaSekolah}*
📞 ${i.noTelepon||`-`}`}var Y=[];function se(){let e=n(`div`,{className:`page-enter`});e.innerHTML=`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
      <div>
        <h1 class="page-title">Data Siswa</h1>
        <p class="page-description">Kelola data siswa yang terdaftar & status kontak wali murid</p>
      </div>
      <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
        <button class="btn btn-secondary" id="btn-import-students" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
          <span>📥</span> Import Excel / CSV
        </button>
        <button class="btn btn-secondary" id="btn-export-students" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
          <span>📊</span> Export Excel / CSV
        </button>
      </div>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="form-input" id="student-search" placeholder="Cari nama atau NIS...">
      </div>
      <div class="filter-group">
        <select class="form-select" id="student-filter-kelas">
          <option value="">Semua Kelas</option>
          ${d.map(e=>`<option value="${e}">${e}</option>`).join(``)}
        </select>
      </div>
      <button class="btn btn-primary" id="btn-add-student">
        <span>＋</span> Tambah Siswa
      </button>
    </div>

    <div class="table-container">
      <table class="data-table" id="students-table">
        <thead>
          <tr>
            <th>NIS</th>
            <th>Nama Siswa</th>
            <th>Kelas</th>
            <th>Orang Tua</th>
            <th>No. HP</th>
            <th>Nominal SPP</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="students-tbody">
          <tr><td colspan="7" class="text-center text-muted" style="padding: var(--space-8);">Memuat data...</td></tr>
        </tbody>
      </table>
    </div>
  `;let t=e.querySelector(`#student-search`),r=e.querySelector(`#student-filter-kelas`),a=e.querySelector(`#btn-add-student`);return e.querySelector(`#btn-export-students`)?.addEventListener(`click`,()=>{if(Y.length===0){i(`Tidak ada data siswa untuk diexport`,`warning`);return}let e=E.getSchoolInfo();V(Y,e.namaSekolah),i(`Berhasil mengekspor ${Y.length} siswa ke file Excel/CSV!`,`success`)}),e.querySelector(`#btn-import-students`)?.addEventListener(`click`,()=>ue(e)),t.addEventListener(`input`,()=>X(e,t.value,r.value)),r.addEventListener(`change`,()=>X(e,t.value,r.value)),a.addEventListener(`click`,()=>le(e)),X(e),e}async function X(e,t=``,n=``){let r=e.querySelector(`#students-tbody`);if(r)try{let a=await D.getStudents();if(t){let e=t.toLowerCase();a=a.filter(t=>t.nama.toLowerCase().includes(e)||t.nis.includes(e))}if(n&&(a=a.filter(e=>e.kelas===n)),Y=a,a.length===0){r.innerHTML=`
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-state-icon">👨‍🎓</div>
              <div class="empty-state-title">Belum Ada Siswa</div>
              <div class="empty-state-text">Klik "Tambah Siswa" untuk menambahkan data siswa baru.</div>
            </div>
          </td>
        </tr>
      `;return}r.innerHTML=a.map(e=>`
      <tr>
        <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${e.nis}</code></td>
        <td style="font-weight: var(--font-weight-semibold);">${e.nama}</td>
        <td><span class="badge badge-info">${e.kelas}</span></td>
        <td>${e.namaOrangTua}</td>
        <td>${e.noHp}</td>
        <td style="font-weight: var(--font-weight-semibold);">${h(e.nominalSpp)}</td>
        <td>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-ghost btn-sm btn-remind-wa" data-nis="${e.nis}" title="Kirim Pengingat Tagihan SPP via WhatsApp" style="color: #25d366;">📲</button>
            <button class="btn btn-ghost btn-sm btn-edit-student" data-nis="${e.nis}" title="Edit">✏️</button>
            <button class="btn btn-ghost btn-sm btn-delete-student" data-nis="${e.nis}" title="Hapus">🗑️</button>
          </div>
        </td>
      </tr>
    `).join(``),r.querySelectorAll(`.btn-remind-wa`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-nis`),n=a.find(e=>e.nis===t);n&&ce(n)})}),r.querySelectorAll(`.btn-edit-student`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.getAttribute(`data-nis`),r=a.find(e=>e.nis===n);r&&le(e,r)})}),r.querySelectorAll(`.btn-delete-student`).forEach(t=>{t.addEventListener(`click`,async()=>{let n=t.getAttribute(`data-nis`),r=a.find(e=>e.nis===n);r&&await c(`Yakin ingin menghapus data siswa "${r.nama}" (${r.nis})?`)&&(await D.deleteStudent(n)?(i(`Data siswa ${r.nama} berhasil dihapus`,`success`),X(e)):i(`Gagal menghapus data siswa`,`error`))})})}catch(e){console.error(`Error loading students:`,e),r.innerHTML=`
      <tr><td colspan="7" class="text-center text-danger" style="padding: var(--space-8);">Error memuat data siswa</td></tr>
    `}}async function ce(e){let t=await D.getStudentPayments(e.nis),r=new Date().getFullYear(),i=new Date().getMonth(),a=u.slice(0,i+1),c=t.filter(e=>e.tahun===r&&e.status===`lunas`).map(e=>e.bulan),l=a.filter(e=>!c.includes(e)),d=l.length*(e.nominalSpp||15e4),f=n(`div`,{innerHTML:`
      <div style="margin-bottom: var(--space-4);">
        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-3);">
          Kirim pesan pemberitahuan tagihan SPP langsung ke WhatsApp orang tua/wali siswa secara resmi dan otomatis.
        </p>

        <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-4); font-size: var(--font-size-sm);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">Nama Siswa:</span>
            <strong>${e.nama} (${e.nis} - ${e.kelas})</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">Nama Wali:</span>
            <strong>${e.namaOrangTua||`-`}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">No. WhatsApp:</span>
            <strong>${e.noHp||`(Belum ada nomor)`}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-text-muted);">Status Tagihan:</span>
            <span style="color: ${l.length>0?`var(--color-danger)`:`var(--color-success)`}; font-weight: 700;">
              ${l.length>0?`${l.join(`, `)} (${h(d)})`:`Semua Lunas`}
            </span>
          </div>
        </div>

        <div class="form-group mb-4">
          <label class="form-label">Catatan Tambahan (Opsional)</label>
          <input type="text" class="form-input" id="wa-reminder-note" placeholder="Contoh: Pembayaran ditunggu sebelum tanggal 10">
        </div>

        <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
          <button class="btn btn-secondary" id="btn-cancel-wa-reminder">Batal</button>
          <button class="btn btn-primary" id="btn-send-wa-reminder" style="background: #25d366; border-color: #25d366; color: white; font-weight: 600;">
            📲 Buka WhatsApp
          </button>
        </div>
      </div>
    `});o(`Pengingat SPP - ${e.nama}`,f),f.querySelector(`#btn-cancel-wa-reminder`)?.addEventListener(`click`,s),f.querySelector(`#btn-send-wa-reminder`)?.addEventListener(`click`,()=>{let t=f.querySelector(`#wa-reminder-note`).value,n=J(e,l.length>0?l:[`Bulan Berjalan`],l.length>0?d:e.nominalSpp,t);K(e.noHp,n),s()})}function le(e,t){let r=!!t,a=r?`Edit Data Siswa`:`Tambah Siswa Baru`,c=n(`div`,{innerHTML:`
      <form id="student-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">NIS *</label>
            <input type="text" class="form-input" id="form-nis" value="${t?.nis??``}" 
              placeholder="Nomor Induk Siswa" ${r?`readonly style="opacity: 0.6;"`:``} required>
          </div>
          <div class="form-group">
            <label class="form-label">Kelas *</label>
            <select class="form-select" id="form-kelas" required>
              <option value="">Pilih Kelas</option>
              ${d.map(e=>`<option value="${e}" ${t?.kelas===e?`selected`:``}>${e}</option>`).join(``)}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nama Lengkap *</label>
          <input type="text" class="form-input" id="form-nama" value="${t?.nama??``}" 
            placeholder="Nama lengkap siswa" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nama Orang Tua *</label>
            <input type="text" class="form-input" id="form-ortu" value="${t?.namaOrangTua??``}" 
              placeholder="Nama orang tua/wali" required>
          </div>
          <div class="form-group">
            <label class="form-label">No. HP</label>
            <input type="tel" class="form-input" id="form-hp" value="${t?.noHp??``}" 
              placeholder="08xxxxxxxxxx">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nominal SPP per Bulan</label>
          <input type="number" class="form-input" id="form-nominal" 
            value="${t?.nominalSpp??l.nominalSppDefault}" 
            placeholder="250000" min="0">
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="form-cancel">Batal</button>
          <button type="submit" class="btn btn-primary">${r?`💾 Simpan Perubahan`:`＋ Tambah Siswa`}</button>
        </div>
      </form>
    `});o(a,c),c.querySelector(`#form-cancel`)?.addEventListener(`click`,s),c.querySelector(`#student-form`).addEventListener(`submit`,async t=>{t.preventDefault();let n={nis:c.querySelector(`#form-nis`).value.trim(),nama:c.querySelector(`#form-nama`).value.trim(),kelas:c.querySelector(`#form-kelas`).value,namaOrangTua:c.querySelector(`#form-ortu`).value.trim(),noHp:c.querySelector(`#form-hp`).value.trim(),nominalSpp:Number(c.querySelector(`#form-nominal`).value)||l.nominalSppDefault};if(!n.nis||!n.nama||!n.kelas||!n.namaOrangTua){i(`Mohon lengkapi semua field yang wajib (*)`,`warning`);return}let a;a=r?await D.updateStudent(n.nis,n):await D.addStudent(n),a?(i(r?`Data ${n.nama} berhasil diperbarui`:`Siswa ${n.nama} berhasil ditambahkan`,`success`),s(),X(e)):i(r?`Gagal memperbarui data`:`NIS sudah terdaftar atau gagal menyimpan`,`error`)})}function ue(e){let t=E.getSchoolInfo(),r=[],a=n(`div`,{innerHTML:`
      <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: 680px;">
        <!-- Step 1: Download Template -->
        <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-3);">
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-primary); margin-bottom: 2px;">
                📋 1. Unduh Format Template Resmi
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                Pilih format yang paling nyaman dibuka di Microsoft Excel komputer Anda:
              </div>
            </div>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" id="btn-download-excel" style="font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; background: #16a34a; border-color: #16a34a;">
                <span>📊</span> Unduh Excel (.xls)
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-download-csv" style="font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;">
                <span>📄</span> Unduh CSV (.csv)
              </button>
            </div>
          </div>

          <!-- Petunjuk Judul Kolom -->
          <div style="background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-md); padding: var(--space-3); border: 1px solid var(--color-border-subtle); font-size: 11px;">
            <div style="font-weight: 700; color: var(--color-primary-light); margin-bottom: 4px;">Urutan Judul Kolom yang Benar:</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px; color: var(--color-text-secondary);">
              <div>• <strong>NIS</strong> (Wajib: misal <code>2026011</code>)</div>
              <div>• <strong>Nama Siswa</strong> (Wajib: Nama Lengkap)</div>
              <div>• <strong>Kelas</strong> (Wajib: misal <code>VII-A</code>)</div>
              <div>• <strong>Nama Orang Tua</strong> (Nama Wali)</div>
              <div>• <strong>No WhatsApp</strong> (misal <code>081234567890</code>)</div>
              <div>• <strong>Nominal SPP</strong> (Angka misal <code>250000</code>)</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Upload Area / Dropzone -->
        <div>
          <div style="font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); margin-bottom: 6px;">
            📂 2. Upload File yang Sudah Diisi
          </div>
          <div id="import-dropzone" style="border: 2px dashed var(--color-border); border-radius: var(--radius-lg); padding: var(--space-5); text-align: center; cursor: pointer; transition: all 0.2s ease; background: rgba(255, 255, 255, 0.02);">
            <input type="file" id="import-file-input" accept=".xls,.xlsx,.csv,.txt" style="display: none;">
            <div style="font-size: 32px; margin-bottom: var(--space-1);">📂</div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); margin-bottom: 2px;">
              Klik untuk pilih file atau seret file ke sini
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
              Mendukung file <strong>.xls (Excel)</strong>, <strong>.csv</strong>, atau <strong>.txt</strong>
            </div>
            <div id="import-file-name" style="margin-top: var(--space-2); font-weight: 700; color: var(--color-primary-light); font-size: var(--font-size-sm); display: none;"></div>
          </div>
        </div>

        <!-- Step 3: Options & Preview Area -->
        <div id="import-preview-section" style="display: none; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2);">
            <label style="display: flex; align-items: center; gap: 8px; font-size: var(--font-size-xs); cursor: pointer; user-select: none;">
              <input type="checkbox" id="import-update-existing" checked style="accent-color: var(--color-primary); cursor: pointer;">
              <span>Perbarui data jika NIS sudah terdaftar di sistem</span>
            </label>
            <div id="import-status-badge" class="badge badge-success text-xs"></div>
          </div>

          <!-- Error Alert Box -->
          <div id="import-errors-box" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: var(--space-3); font-size: var(--font-size-xs); color: #fca5a5; max-height: 90px; overflow-y: auto;"></div>

          <!-- Preview Table -->
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); max-height: 180px; overflow: auto; background: var(--color-bg-dark);">
            <table class="data-table" style="font-size: 11px; margin: 0; width: 100%;">
              <thead>
                <tr>
                  <th style="padding: 6px 8px;">NIS</th>
                  <th style="padding: 6px 8px;">Nama Siswa</th>
                  <th style="padding: 6px 8px;">Kelas</th>
                  <th style="padding: 6px 8px;">Nama Wali</th>
                  <th style="padding: 6px 8px;">No. WhatsApp</th>
                  <th style="padding: 6px 8px;">SPP (Rp)</th>
                </tr>
              </thead>
              <tbody id="import-preview-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- Modal Actions -->
        <div style="display: flex; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-3); border-top: 1px solid var(--color-border);">
          <button class="btn btn-secondary" id="btn-cancel-import">Batal</button>
          <button class="btn btn-primary" id="btn-confirm-import" disabled style="font-weight: 600;">
            🚀 Mulai Impor Data Siswa
          </button>
        </div>
      </div>
    `});o(`📥 Impor Data Siswa dari Excel / CSV`,a),a.querySelector(`#btn-download-excel`)?.addEventListener(`click`,()=>{re(t.nominalSppDefault,t.namaSekolah),i(`Template Excel (.xls) berhasil diunduh! Buka langsung di Microsoft Excel.`,`success`)}),a.querySelector(`#btn-download-csv`)?.addEventListener(`click`,()=>{U(t.nominalSppDefault),i(`Template CSV (.csv) berhasil diunduh!`,`success`)});let c=a.querySelector(`#import-file-input`),l=a.querySelector(`#import-dropzone`),u=a.querySelector(`#import-file-name`),d=a.querySelector(`#import-preview-section`),f=a.querySelector(`#import-preview-tbody`),p=a.querySelector(`#import-status-badge`),m=a.querySelector(`#import-errors-box`),g=a.querySelector(`#btn-confirm-import`),_=a.querySelector(`#btn-cancel-import`),v=a.querySelector(`#import-update-existing`);_.addEventListener(`click`,s),l.addEventListener(`click`,()=>c.click()),l.addEventListener(`dragover`,e=>{e.preventDefault(),l.style.borderColor=`var(--color-primary)`,l.style.background=`rgba(99, 102, 241, 0.08)`}),l.addEventListener(`dragleave`,()=>{l.style.borderColor=`var(--color-border)`,l.style.background=`rgba(255, 255, 255, 0.02)`}),l.addEventListener(`drop`,e=>{e.preventDefault(),l.style.borderColor=`var(--color-border)`,l.style.background=`rgba(255, 255, 255, 0.02)`,e.dataTransfer?.files&&e.dataTransfer.files[0]&&y(e.dataTransfer.files[0])}),c.addEventListener(`change`,()=>{c.files&&c.files[0]&&y(c.files[0])});function y(e){u.style.display=`block`,u.textContent=`📄 ${e.name} (${(e.size/1024).toFixed(1)} KB)`;let n=new FileReader;n.onload=e=>{let n=e.target?.result;if(!n){i(`File tidak memiliki konten`,`warning`);return}let a=oe(n,t.nominalSppDefault);if(r=a.valid,d.style.display=`flex`,a.errors.length>0?(m.style.display=`block`,m.innerHTML=`<strong>Peringatan / Catatan (${a.errors.length}):</strong><br>`+a.errors.map(e=>`• ${e}`).join(`<br>`)):m.style.display=`none`,r.length===0){p.className=`badge badge-danger text-xs`,p.textContent=`0 Data Valid Ditemukan`,g.disabled=!0,f.innerHTML=`<tr><td colspan="6" class="text-center text-muted" style="padding: 12px;">Format tidak dikenali. Silakan periksa atau gunakan template resmi.</td></tr>`;return}p.className=`badge badge-success text-xs`,p.textContent=`✅ ${r.length} Siswa Siap Diimpor`,g.disabled=!1,g.textContent=`🚀 Impor ${r.length} Data Siswa`;let o=r.slice(0,15);f.innerHTML=o.map(e=>`
          <tr>
            <td style="padding: 5px 8px;"><code>${e.nis}</code></td>
            <td style="padding: 5px 8px; font-weight: 600;">${e.nama}</td>
            <td style="padding: 5px 8px;"><span class="badge badge-info text-xs">${e.kelas}</span></td>
            <td style="padding: 5px 8px;">${e.namaOrangTua}</td>
            <td style="padding: 5px 8px;">${e.noHp||`-`}</td>
            <td style="padding: 5px 8px;">${h(e.nominalSpp)}</td>
          </tr>
        `).join(``),r.length>15&&(f.innerHTML+=`
          <tr>
            <td colspan="6" class="text-center text-muted" style="padding: 6px 8px; font-style: italic;">
              ...dan ${r.length-15} siswa lainnya
            </td>
          </tr>
        `)},n.readAsText(e,`UTF-8`)}g.addEventListener(`click`,async()=>{if(r.length===0)return;g.disabled=!0,g.textContent=`Menyimpan ke database...`;let t=v.checked,n=await D.importStudents(r,t);i(`Berhasil mengimpor data siswa: ${n.added} siswa baru ditambahkan, ${n.updated} diperbarui!`,`success`),s(),X(e)})}function Z(e){let t=de(e),n=document.createElement(`div`);n.innerHTML=`
    <div style="margin-bottom: var(--space-4);">
      ${t}
    </div>
    <div style="display: flex; gap: var(--space-3); justify-content: center; padding-top: var(--space-4); border-top: 1px solid var(--color-border); flex-wrap: wrap;">
      <button class="btn btn-primary btn-print-action btn-lg" id="btn-print-receipt">🖨️ Cetak Kuitansi Resmi</button>
      <button class="btn btn-secondary btn-lg" id="btn-wa-receipt" style="background: #25d366; color: white; border: none; font-weight: 600;">
        📲 Kirim via WhatsApp
      </button>
    </div>
  `,o(`Preview Kuitansi Pembayaran`,n),n.querySelector(`#btn-print-receipt`)?.addEventListener(`click`,()=>{fe(e)}),n.querySelector(`#btn-wa-receipt`)?.addEventListener(`click`,async()=>{try{let t=(await D.getStudents()).find(t=>t.nis===e.nis),n=q(e,t);K(t?.noHp||``,n)}catch(t){console.error(t),K(``,q(e))}})}function de(e){let t=E.getSchoolInfo(),n=e.items&&e.items.length>0,r=e.channel===`online`?`Online (Portal Siswa)`:`Kasir Administrasi Sekolah`;return`
    <div class="receipt" id="receipt-content">
      <!-- Kop Surat Sekolah Resmi -->
      <div class="receipt-header">
        <div class="receipt-school" style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
          ${t.namaSekolah}
        </div>
        <div class="receipt-address" style="font-size: 11px; color: #555; margin-top: 2px;">
          ${t.alamatSekolah}
        </div>
        <div style="font-size: 10px; color: #777; margin-top: 2px;">
          Telp: ${t.noTelepon||`-`} • Email: ${t.email||`-`}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #444; margin-top: 2px;">
          Tahun Ajaran ${t.tahunAjaran}
        </div>

        <div style="border-bottom: 2px double #333; margin: 8px 0;"></div>
        <div class="receipt-title" style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #111;">
          KUITANSI PEMBAYARAN RESMI
        </div>
        <div style="font-size: 10px; color: #666; margin-top: 2px;">
          Channel: <strong>${r}</strong>
        </div>
      </div>

      <!-- Data Transaksi & Siswa -->
      <div class="receipt-body">
        <div class="receipt-row">
          <span class="receipt-label">No. Kuitansi</span>
          <span class="receipt-value"><strong>${e.idTransaksi}</strong></span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Tanggal Pembayaran</span>
          <span class="receipt-value">${g(e.tanggalBayar)}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Nama Siswa</span>
          <span class="receipt-value" style="font-size: 14px;"><strong>${e.nama}</strong></span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Nomor Induk Siswa (NIS)</span>
          <span class="receipt-value">${e.nis}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Kelas</span>
          <span class="receipt-value">${e.kelas}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Metode Pembayaran</span>
          <span class="receipt-value">${S(e.metodeBayar)}</span>
        </div>

        <!-- Rincian Item yang Dibayar -->
        <div class="receipt-items-section" style="margin-top: 10px; border-top: 1px dashed #bbb; padding-top: 8px;">
          <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; margin-bottom: 6px; color: #222;">
            Rincian Pos Pembayaran:
          </div>
          ${n?`
            <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 8px;">
              <thead>
                <tr style="border-bottom: 1px solid #ccc; text-align: left; color: #555; font-size: 11px;">
                  <th style="padding: 4px 0;">Uraian Pos Tagihan</th>
                  <th style="padding: 4px 0; text-align: right;">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody>
                ${e.items.map(e=>`
                  <tr style="border-bottom: 1px dotted #eee;">
                    <td style="padding: 5px 0;">${e.nama}</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: 600;">${h(e.nominal)}</td>
                  </tr>
                `).join(``)}
              </tbody>
            </table>
            `:`
            <div class="receipt-row">
              <span class="receipt-label">Uraian</span>
              <span class="receipt-value">${e.rincianItemText||`SPP ${e.bulan} ${e.tahun}`}</span>
            </div>
            `}
        </div>

        ${e.keterangan?`
        <div class="receipt-row" style="margin-top: 4px;">
          <span class="receipt-label">Catatan Tambahan</span>
          <span class="receipt-value">${e.keterangan}</span>
        </div>
        `:``}

        <div class="receipt-row receipt-total" style="border-top: 2px solid #111; margin-top: 10px; padding-top: 8px;">
          <span style="font-weight: 800; font-size: 13px;">TOTAL DIBAYAR</span>
          <span style="font-weight: 800; font-size: 15px; color: #000;">${h(e.nominal)}</span>
        </div>
        <div style="text-align: right; font-size: 10px; color: #15803d; font-weight: bold; margin-top: 3px;">
          STATUS: LUNAS / SAH
        </div>

        <!-- Kolom Tanda Tangan Resmi Atas Nama Sekolah -->
        <div style="display: flex; justify-content: space-between; margin-top: 25px; padding-top: 10px; font-size: 11px; text-align: center;">
          <div style="width: 140px;">
            <div>Mengetahui,</div>
            <div style="font-weight: 600;">Kepala Sekolah</div>
            <div style="margin-top: 42px; font-weight: 700; text-decoration: underline;">
              ${t.namaKepalaSekolah}
            </div>
            <div style="font-size: 10px; color: #666;">NIP. ${t.nipKepalaSekolah}</div>
          </div>

          <div style="width: 150px;">
            <div>Dicetak Pada: ${g(e.tanggalBayar)}</div>
            <div style="font-weight: 600;">Bendahara / Kasir Sekolah</div>
            <div style="margin-top: 42px; font-weight: 700; text-decoration: underline;">
              ${t.namaBendahara}
            </div>
            <div style="font-size: 10px; color: #666;">Petugas Administrasi Keuangan</div>
          </div>
        </div>
      </div>

      <div class="receipt-footer" style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 8px; font-size: 10px; text-align: center; color: #777;">
        <p>${t.catatanKuitansi||`Kuitansi ini adalah bukti pembayaran yang sah dan tercatat di sistem sekolah.`}</p>
        <p style="margin-top: 4px; font-weight: 600;">~ ${t.namaSekolah} ~</p>
      </div>
    </div>
  `}function fe(e){let t=E.getSchoolInfo(),n=window.open(``,`_blank`,`width=500,height=750`);n&&(n.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kuitansi ${e.idTransaksi} - ${t.namaSekolah}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          padding: 24px;
          background: white;
          color: #1a1a1a;
        }

        .receipt {
          max-width: 440px;
          margin: 0 auto;
        }

        .receipt-header {
          text-align: center;
          padding-bottom: 8px;
        }

        .receipt-body { font-size: 12px; }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dotted #e5e5e5;
        }

        .receipt-row:last-child { border-bottom: none; }
        .receipt-label { color: #555; }
        .receipt-value { font-weight: 600; text-align: right; }

        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${de(e)}
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      <\/script>
    </body>
    </html>
  `),n.document.close())}function Q(){let e=n(`div`,{className:`page-enter`});e.innerHTML=`
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
            <label class="form-label">Pilih Siswa *</label>
            <select class="form-select" id="pay-student" required>
              <option value="">-- Pilih Siswa --</option>
            </select>
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
                ${u.map((e,t)=>`<option value="${e}" ${t===new Date().getMonth()?`selected`:``}>${e}</option>`).join(``)}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tahun *</label>
              <select class="form-select" id="pay-tahun" required>
                ${[w()-1,w(),w()+1].map(e=>`<option value="${e}" ${e===w()?`selected`:``}>${e}</option>`).join(``)}
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
              <input type="date" class="form-input" id="pay-tanggal" value="${v()}">
            </div>
            <div class="form-group">
              <label class="form-label">Metode Bayar</label>
              <select class="form-select" id="pay-metode">
                ${f.map(e=>`<option value="${e.value}">${e.label}</option>`).join(``)}
              </select>
            </div>
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
              ${d.map(e=>`<option value="${e}">${e}</option>`).join(``)}
            </select>
          </div>
        </div>
        <div id="payment-status-content">
          <p class="text-muted" style="font-size: var(--font-size-sm);">Pilih siswa pada form untuk melihat status pembayaran.</p>
        </div>
      </div>
    </div>
  `,pe(e);let t=e.querySelector(`#pay-student`);t.addEventListener(`change`,()=>me(e,t.value));let r=e.querySelector(`#grid-filter-kelas`);return r.addEventListener(`change`,()=>ge(e,r.value)),e.querySelector(`#payment-form`).addEventListener(`submit`,t=>_e(t,e)),e}async function pe(e){let t=e.querySelector(`#pay-student`);(await D.getStudents()).forEach(e=>{let r=n(`option`,{value:e.nis});r.textContent=`${e.nama} — ${e.kelas} (${e.nis})`,t.appendChild(r)})}async function me(e,t){let n=e.querySelector(`#student-info-box`),r=e.querySelector(`#student-info-content`),i=e.querySelector(`#pay-nominal`),a=e.querySelector(`#payment-status-content`);if(!t){n.style.display=`none`,a.innerHTML=`<p class="text-muted" style="font-size: var(--font-size-sm);">Pilih siswa pada form untuk melihat status pembayaran.</p>`;return}let o=await D.getStudentByNis(t);o&&(n.style.display=`block`,r.innerHTML=`
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: var(--color-text-secondary);">Nama:</span>
      <span style="font-weight: var(--font-weight-semibold);">${o.nama}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: var(--color-text-secondary);">Kelas:</span>
      <span>${o.kelas}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span style="color: var(--color-text-secondary);">SPP/Bulan:</span>
      <span style="font-weight: var(--font-weight-semibold); color: var(--color-primary-light);">${h(o.nominalSpp)}</span>
    </div>
  `,i.value=String(o.nominalSpp),await he(e,o))}async function he(e,t){let n=e.querySelector(`#payment-status-content`),r=w(),i=await D.getStudentPayments(t.nis,r),a=new Set(i.filter(e=>e.status===`lunas`).map(e=>e.bulan));n.innerHTML=`
    <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-4);">
      Status pembayaran ${t.nama} — Tahun ${r}
    </p>
    <div class="payment-grid stagger-children">
      ${u.map(e=>{let t=a.has(e);return`
          <div class="payment-month ${t?`paid`:``}">
            <span class="month-status-icon">${t?`✅`:`⬜`}</span>
            <span class="month-name">${e}</span>
          </div>
        `}).join(``)}
    </div>
    <div style="margin-top: var(--space-4); display: flex; gap: var(--space-4); font-size: var(--font-size-xs); color: var(--color-text-muted);">
      <span>✅ Lunas: ${a.size}</span>
      <span>⬜ Belum: ${12-a.size}</span>
    </div>
  `}async function ge(e,t){let n=e.querySelector(`#payment-status-content`);if(!t){n.innerHTML=`<p class="text-muted" style="font-size: var(--font-size-sm);">Pilih kelas untuk melihat status pembayaran per kelas.</p>`;return}let r=(await D.getStudents()).filter(e=>e.kelas===t),i=await D.getPayments(),a=w();if(r.length===0){n.innerHTML=`
      <div class="empty-state" style="padding: var(--space-6);">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">Tidak ada siswa di kelas ${t}</div>
      </div>
    `;return}let o=u[new Date().getMonth()],s=`<p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-4);">
    Status SPP kelas ${t} — Bulan ${o} ${a}
  </p>`;s+=`<div style="display: flex; flex-direction: column; gap: var(--space-2);">`,r.forEach(e=>{let t=i.some(t=>t.nis===e.nis&&t.bulan===o&&t.tahun===a&&t.status===`lunas`);s+=`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); background: var(--color-bg-glass); border: 1px solid var(--color-border);">
        <div>
          <span style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">${e.nama}</span>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: var(--space-2);">${e.nis}</span>
        </div>
        <span class="badge ${t?`badge-success`:`badge-danger`}">
          <span class="badge-dot"></span> ${t?`Lunas`:`Belum`}
        </span>
      </div>
    `}),s+=`</div>`,n.innerHTML=s}async function _e(e,t){e.preventDefault();let n=t.querySelector(`#pay-student`).value,r=t.querySelector(`#pay-bulan`).value,a=Number(t.querySelector(`#pay-tahun`).value),o=Number(t.querySelector(`#pay-nominal`).value),s=t.querySelector(`#pay-tanggal`).value||v(),c=t.querySelector(`#pay-metode`).value,l=t.querySelector(`#pay-keterangan`).value.trim();if(!n||!r||!a||!o){i(`Mohon lengkapi semua field yang wajib`,`warning`);return}let u=await D.getStudentByNis(n);if(!u){i(`Siswa tidak ditemukan`,`error`);return}let d={idTransaksi:y(),nis:n,nama:u.nama,kelas:u.kelas,bulan:r,tahun:a,nominal:o,tanggalBayar:s,metodeBayar:c,status:`lunas`,keterangan:l};await D.addPayment(d)?(i(`Pembayaran ${u.nama} bulan ${r} berhasil dicatat!`,`success`),O.sendPaymentSuccess(u.nama,r,o),t.querySelector(`#pay-keterangan`).value=``,await me(t,n),Z(d)):i(`${u.nama} sudah membayar SPP bulan ${r} ${a}`,`warning`)}var $=[];function ve(){let e=n(`div`,{className:`page-enter`}),t=new Date().getFullYear();e.innerHTML=`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
      <div>
        <h1 class="page-title">Riwayat Pembayaran</h1>
        <p class="page-description">Lihat dan kelola catatan pembayaran SPP & tagihan sekolah (Online & Kasir)</p>
      </div>
      <button class="btn btn-secondary" id="btn-export-history" style="font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
        <span>📊</span> Export Excel / CSV
      </button>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="form-input" id="history-search" placeholder="Cari nama, NIS, atau ID transaksi...">
      </div>
      <div class="filter-group">
        <select class="form-select" id="history-channel">
          <option value="">Semua Channel</option>
          <option value="online">💳 Online (Siswa)</option>
          <option value="admin">🏢 Kasir Admin</option>
        </select>
        <select class="form-select" id="history-kelas">
          <option value="">Semua Kelas</option>
          ${d.map(e=>`<option value="${e}">${e}</option>`).join(``)}
        </select>
        <select class="form-select" id="history-bulan">
          <option value="">Semua Bulan</option>
          ${u.map(e=>`<option value="${e}">${e}</option>`).join(``)}
        </select>
        <select class="form-select" id="history-tahun">
          ${[t-1,t,t+1].map(e=>`<option value="${e}" ${e===t?`selected`:``}>${e}</option>`).join(``)}
        </select>
      </div>
    </div>

    <div id="history-summary" class="mb-6" style="display: flex; gap: var(--space-4); flex-wrap: wrap;"></div>

    <div class="table-container">
      <table class="data-table" id="history-table">
        <thead>
          <tr>
            <th>ID Transaksi</th>
            <th>Tanggal</th>
            <th>Nama Siswa</th>
            <th>Kelas</th>
            <th>Rincian Item yang Dibayar</th>
            <th>Total Nominal</th>
            <th>Channel / Metode</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="history-tbody">
          <tr><td colspan="9" class="text-center text-muted" style="padding: var(--space-8);">Memuat data...</td></tr>
        </tbody>
      </table>
    </div>
  `;let r=e.querySelector(`#history-search`),a=e.querySelector(`#history-channel`),o=e.querySelector(`#history-kelas`),s=e.querySelector(`#history-bulan`),c=e.querySelector(`#history-tahun`),l=()=>{let t={search:r.value,channel:a.value,kelas:o.value,bulan:s.value,tahun:Number(c.value),status:``};ye(e,t)};return r.addEventListener(`input`,l),a.addEventListener(`change`,l),o.addEventListener(`change`,l),s.addEventListener(`change`,l),c.addEventListener(`change`,l),e.querySelector(`#btn-export-history`)?.addEventListener(`click`,()=>{if($.length===0){i(`Tidak ada data transaksi untuk diexport`,`warning`);return}let e=E.getSchoolInfo();H($,e.namaSekolah),i(`Berhasil mengekspor ${$.length} transaksi ke file Excel/CSV!`,`success`)}),l(),e}async function ye(e,t){let n=e.querySelector(`#history-tbody`),r=e.querySelector(`#history-summary`);try{let i=await D.getPayments();if(t.search){let e=t.search.toLowerCase();i=i.filter(t=>t.nama.toLowerCase().includes(e)||t.nis.includes(e)||t.idTransaksi.toLowerCase().includes(e)||t.rincianItemText&&t.rincianItemText.toLowerCase().includes(e))}t.channel&&(i=i.filter(e=>(e.channel||`admin`)===t.channel)),t.kelas&&(i=i.filter(e=>e.kelas===t.kelas)),t.bulan&&(i=i.filter(e=>e.bulan===t.bulan)),t.tahun&&(i=i.filter(e=>e.tahun===t.tahun)),t.status&&(i=i.filter(e=>e.status===t.status)),i.sort((e,t)=>new Date(t.tanggalBayar).getTime()-new Date(e.tanggalBayar).getTime()),$=i;let a=i.reduce((e,t)=>e+t.nominal,0),o=i.filter(e=>e.channel===`online`).length,s=i.filter(e=>e.channel===`online`).reduce((e,t)=>e+t.nominal,0);if(r.innerHTML=`
      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5); font-size: var(--font-size-sm);">
        <span style="color: var(--color-text-muted);">Total Transaksi:</span>
        <span style="font-weight: var(--font-weight-bold); margin-left: var(--space-2);">${i.length}</span>
      </div>
      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5); font-size: var(--font-size-sm);">
        <span style="color: var(--color-text-muted);">Total Pemasukan:</span>
        <span style="font-weight: var(--font-weight-bold); color: var(--color-success); margin-left: var(--space-2);">${h(a)}</span>
      </div>
      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-5); font-size: var(--font-size-sm);">
        <span style="color: var(--color-text-muted);">Transaksi Online:</span>
        <span style="font-weight: var(--font-weight-bold); color: var(--color-primary-light); margin-left: var(--space-2);">${o} (${h(s)})</span>
      </div>
    `,i.length===0){n.innerHTML=`
        <tr>
          <td colspan="9">
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Tidak Ada Data</div>
              <div class="empty-state-text">Belum ada riwayat pembayaran yang cocok dengan filter.</div>
            </div>
          </td>
        </tr>
      `;return}n.innerHTML=i.map(e=>{let t=e.channel===`online`,n=e.items?e.items.length:1,r=e.rincianItemText?e.rincianItemText.length>35?e.rincianItemText.substring(0,35)+`...`:e.rincianItemText:`SPP ${e.bulan} ${e.tahun}`;return`
        <tr>
          <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${e.idTransaksi}</code></td>
          <td>${_(e.tanggalBayar)}</td>
          <td style="font-weight: var(--font-weight-semibold);">${e.nama}</td>
          <td><span class="badge badge-info">${e.kelas}</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="font-size: var(--font-size-xs); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${e.rincianItemText||``}">
                ${r}
              </span>
              <button class="btn btn-ghost btn-sm btn-view-items" data-id="${e.idTransaksi}" title="Lihat Apa Saja yang Dibayar" style="padding: 2px 6px; font-size: 11px;">
                🔍 ${n>1?`${n} item`:`Detail`}
              </button>
            </div>
          </td>
          <td style="font-weight: var(--font-weight-semibold); color: var(--color-success);">${h(e.nominal)}</td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              ${t?`<span class="badge badge-primary text-xs" style="width: fit-content;">💳 ONLINE</span>`:`<span class="badge badge-secondary text-xs" style="width: fit-content;">🏢 KASIR</span>`}
              <span style="font-size: 11px; color: var(--color-text-muted);">${S(e.metodeBayar)}</span>
            </div>
          </td>
          <td><span class="badge ${x(e.status)}"><span class="badge-dot"></span> ${b(e.status)}</span></td>
          <td>
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn btn-ghost btn-sm btn-print" data-id="${e.idTransaksi}" title="Cetak Kwitansi">🖨️</button>
              <button class="btn btn-ghost btn-sm btn-wa-send" data-id="${e.idTransaksi}" title="Kirim Kuitansi WhatsApp" style="color: #25d366;">📲</button>
              <button class="btn btn-ghost btn-sm btn-delete-payment" data-id="${e.idTransaksi}" title="Hapus">🗑️</button>
            </div>
          </td>
        </tr>
      `}).join(``),be(e,i,t)}catch(e){console.error(`Error loading history:`,e),n.innerHTML=`
      <tr><td colspan="9" class="text-center text-danger" style="padding: var(--space-8);">Error memuat riwayat</td></tr>
    `}}function be(e,t,n){e.querySelectorAll(`.btn-view-items`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.getAttribute(`data-id`),r=t.find(e=>e.idTransaksi===n);r&&xe(r)})}),e.querySelectorAll(`.btn-print`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.getAttribute(`data-id`),r=t.find(e=>e.idTransaksi===n);r&&Z(r)})}),e.querySelectorAll(`.btn-wa-send`).forEach(e=>{e.addEventListener(`click`,async()=>{let n=e.getAttribute(`data-id`),r=t.find(e=>e.idTransaksi===n);if(r)try{let e=(await D.getStudents()).find(e=>e.nis===r.nis),t=q(r,e);K(e?.noHp||``,t)}catch(e){console.error(e),K(``,q(r))}})}),e.querySelectorAll(`.btn-delete-payment`).forEach(r=>{r.addEventListener(`click`,async()=>{let a=r.getAttribute(`data-id`),o=t.find(e=>e.idTransaksi===a);o&&await c(`Yakin ingin menghapus pembayaran ${o.nama}?\n\nID: ${o.idTransaksi}\nNominal: ${h(o.nominal)}`)&&(await D.deletePayment(a)?(i(`Pembayaran berhasil dihapus`,`success`),ye(e,n)):i(`Gagal menghapus pembayaran`,`error`))})})}function xe(e){let t=document.createElement(`div`),n=e.channel===`online`,r=e.items&&e.items.length>0;t.innerHTML=`
    <div style="margin-bottom: var(--space-4);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
        <div>
          <div style="font-size: var(--font-size-lg); font-weight: bold;">${e.nama}</div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
            NIS: ${e.nis} • Kelas: ${e.kelas}
          </div>
        </div>
        <div>
          ${n?`<span class="badge badge-primary">💳 PEMBAYARAN ONLINE</span>`:`<span class="badge badge-secondary">🏢 KASIR SEKOLAH</span>`}
        </div>
      </div>

      <div style="background: var(--color-bg-glass); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-4); font-size: var(--font-size-sm);">
        <div><strong>ID Transaksi:</strong> <code>${e.idTransaksi}</code></div>
        <div><strong>Tanggal Bayar:</strong> ${g(e.tanggalBayar)}</div>
        <div><strong>Metode:</strong> ${S(e.metodeBayar)}</div>
        ${e.keterangan?`<div><strong>Catatan:</strong> ${e.keterangan}</div>`:``}
      </div>

      <div style="font-weight: 600; margin-bottom: var(--space-2); font-size: var(--font-size-sm); color: var(--color-text-primary);">
        📋 Rincian Pos Tagihan yang Dibayar:
      </div>

      <div class="table-container" style="margin-bottom: var(--space-4);">
        <table class="data-table" style="font-size: var(--font-size-sm);">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Item Tagihan</th>
              <th>Kategori</th>
              <th style="text-align: right;">Nominal</th>
            </tr>
          </thead>
          <tbody>
            ${r?e.items.map((e,t)=>`
              <tr>
                <td>${t+1}</td>
                <td style="font-weight: 500;">${e.nama}</td>
                <td><span class="badge badge-secondary text-xs">${e.kategori.toUpperCase()}</span></td>
                <td style="text-align: right; font-weight: 600;">${h(e.nominal)}</td>
              </tr>
            `).join(``):`
              <tr>
                <td>1</td>
                <td style="font-weight: 500;">${e.rincianItemText||`SPP ${e.bulan} ${e.tahun}`}</td>
                <td><span class="badge badge-secondary text-xs">SPP</span></td>
                <td style="text-align: right; font-weight: 600;">${h(e.nominal)}</td>
              </tr>
            `}
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid var(--color-border); font-weight: bold; background: var(--color-bg-glass);">
              <td colspan="3">TOTAL KESELURUHAN DIBAYAR:</td>
              <td style="text-align: right; color: var(--color-success); font-size: var(--font-size-base);">${h(e.nominal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: var(--space-2);">
        <button class="btn btn-primary" id="modal-print-btn">🖨️ Cetak Kwitansi</button>
      </div>
    </div>
  `,o(`Rincian Pembayaran — ${e.idTransaksi}`,t),t.querySelector(`#modal-print-btn`)?.addEventListener(`click`,()=>{Z(e)})}function Se(){let t=n(`div`,{className:`page-enter`}),r=E.getSchoolInfo(),a=null,o=new Map,s=new Set,c=[];t.innerHTML=`
    <!-- Hero Banner -->
    <div class="portal-hero">
      <div class="portal-hero-badge">💳 Portal Mandiri Siswa & Wali Murid</div>
      <h1 class="portal-hero-title">Pembayaran Online ${r.namaSekolah}</h1>
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
                  <h3 class="section-title">📅 SPP Bulanan (${w()})</h3>
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
  `;let l=t.querySelector(`#portal-login-card`),d=t.querySelector(`#portal-login-form`),f=t.querySelector(`#portal-input-identity`),p=t.querySelector(`#quick-student-chips`),m=t.querySelector(`#portal-session-area`),g=t.querySelector(`#session-student-name`),b=t.querySelector(`#session-student-meta`),x=t.querySelector(`#btn-switch-student`),S=t.querySelector(`#tab-btn-tagihan`),C=t.querySelector(`#tab-btn-riwayat`),T=t.querySelector(`#tab-content-tagihan`),k=t.querySelector(`#tab-content-riwayat`),ee=t.querySelector(`#count-history-badge`),j=t.querySelector(`#student-history-tbody`),te=t.querySelector(`#total-paid-summary`),M=t.querySelector(`#portal-spp-months-container`),N=t.querySelector(`#portal-other-items-container`),ne=t.querySelector(`#spp-rate-badge`),P=t.querySelector(`#check-custom-amount`),F=t.querySelector(`#custom-amount-inputs`),I=t.querySelector(`#custom-bill-nominal`),L=t.querySelector(`#custom-bill-name`),R=t.querySelector(`#summary-items-list`),z=t.querySelector(`#summary-total-amount`),B=t.querySelector(`#selected-count-badge`),V=t.querySelector(`#btn-process-online-pay`),H=t.querySelector(`#payment-gateway-modal`),re=t.querySelector(`#gateway-modal-title`),U=t.querySelector(`#gateway-modal-body`),ie=t.querySelector(`#btn-close-gateway`),ae=A.getCurrentStudent();ae?G(ae):oe(),d.addEventListener(`submit`,async e=>{e.preventDefault();let t=f.value.trim();t&&await K(t)}),x.addEventListener(`click`,()=>{q()}),S.addEventListener(`click`,()=>{S.className=`btn btn-primary`,C.className=`btn btn-secondary`,T.style.display=`block`,k.style.display=`none`}),C.addEventListener(`click`,()=>{S.className=`btn btn-secondary`,C.className=`btn btn-primary`,T.style.display=`none`,k.style.display=`block`,ce()}),t.querySelectorAll(`input[name="portal-payment-method"]`).forEach(e=>{e.addEventListener(`change`,()=>{t.querySelectorAll(`.method-option`).forEach(e=>e.classList.remove(`active`)),e.closest(`.method-option`)?.classList.add(`active`)})}),P.addEventListener(`change`,()=>{P.checked?(F.style.display=`block`,W()):(F.style.display=`none`,o.delete(`item-custom`),X())}),I.addEventListener(`input`,()=>{P.checked&&W()}),L.addEventListener(`input`,()=>{P.checked&&W()});function W(){let e=Math.max(0,Number(I.value)||0),t=L.value.trim()||`Tagihan Bebas / Donasi`;o.set(`item-custom`,{id:`item-custom`,nama:t,kategori:`bebas`,nominal:e,keterangan:`Nominal bebas ditentukan siswa`}),X()}V.addEventListener(`click`,()=>{if(a){if(o.size===0){i(`Pilih minimal satu pos tagihan yang ingin dibayar`,`warning`);return}le(t.querySelector(`input[name="portal-payment-method"]:checked`)?.value||`qris`)}}),ie.addEventListener(`click`,()=>{H.style.display=`none`});async function oe(){let e=await D.getStudents();if(e.length===0){p.innerHTML=`<span class="text-muted text-xs">Belum ada data siswa terdaftar.</span>`;return}p.innerHTML=``,e.forEach(e=>{let t=n(`button`,{className:`btn btn-ghost btn-sm`,style:`border: 1px solid var(--color-border); border-radius: var(--radius-full); padding: 4px 12px; font-size: 11px;`,innerHTML:`👨‍🎓 ${e.nama} (${e.nis})`});t.addEventListener(`click`,()=>{K(e.nis)}),p.appendChild(t)})}async function G(e){a=e,l.style.display=`none`,m.style.display=`block`,g.textContent=e.nama,b.innerHTML=`<strong>NIS:</strong> ${e.nis} • <strong>Kelas:</strong> ${e.kelas} • <strong>Wali:</strong> ${e.namaOrangTua||`-`} • <strong>HP:</strong> ${e.noHp||`-`}`,ne.textContent=`${h(e.nominalSpp)} / bln`,await J()}async function K(e){let t=await A.loginAsStudent(e);if(!t.success||!t.student){i(t.error||`Siswa tidak ditemukan`,`error`);return}await G(t.student),i(`Selamat datang, ${t.student.nama}!`,`success`)}function q(){a=null,A.getRole()===`admin`?(m.style.display=`none`,l.style.display=`block`,f.value=``,o.clear(),X(),i(`Selesai pratinjau akun siswa`,`info`)):(A.logout(),i(`Anda telah keluar dari akun siswa`,`info`),e.navigate(`/login`))}async function J(){a&&(c=await D.getStudentPayments(a.nis),s.clear(),c.forEach(e=>{e.status===`lunas`&&(s.add(e.bulan),e.items&&e.items.forEach(e=>{e.kategori===`spp`&&e.bulan&&s.add(e.bulan)}))}),ee.textContent=String(c.length),o.clear(),P.checked=!1,F.style.display=`none`,Y(),se(),X())}function Y(){M.innerHTML=``;let e=a?.nominalSpp||E.getSchoolInfo().nominalSppDefault;u.forEach(t=>{let r=s.has(t),i=`spp-${t}-${w()}`,a=o.has(i),c=n(`label`,{className:`portal-month-card ${r?`paid`:``} ${a?`selected`:``}`});if(c.innerHTML=`
        <div class="month-card-header">
          <span class="month-name">${t}</span>
          ${r?`<span class="badge badge-success text-xs">✓ Lunas</span>`:`<input type="checkbox" class="month-checkbox" data-month="${t}" ${a?`checked`:``}>`}
        </div>
        <div class="month-card-nominal">${h(e)}</div>
        <div class="month-card-status text-xs">${r?`Sudah Dilunasi`:`Belum Dibayar`}</div>
      `,!r){let n=c.querySelector(`.month-checkbox`);n.addEventListener(`change`,()=>{n.checked?(o.set(i,{id:i,nama:`SPP Bulan ${t} ${w()}`,kategori:`spp`,nominal:e,bulan:t,tahun:w()}),c.classList.add(`selected`)):(o.delete(i),c.classList.remove(`selected`)),X()})}M.appendChild(c)})}function se(){N.innerHTML=``;let e=E.getBillableItems().filter(e=>e.kategori!==`spp`&&!e.isCustomNominal);if(e.length===0){N.innerHTML=`
        <div class="text-muted text-xs text-center" style="padding: var(--space-4);">
          Tidak ada pos tagihan khusus lainnya.
        </div>
      `;return}e.forEach(e=>{let t=`item-${e.id}`,r=o.has(t),i=n(`label`,{className:`portal-item-row ${r?`selected`:``}`});i.innerHTML=`
        <div class="portal-item-left">
          <input type="checkbox" class="portal-item-checkbox" data-id="${e.id}" ${r?`checked`:``}>
          <div class="portal-item-info">
            <div class="portal-item-title">${e.nama}</div>
            <div class="portal-item-desc">${e.deskripsi||`-`}</div>
          </div>
        </div>
        <div class="portal-item-price">${h(e.nominalDefault)}</div>
      `;let a=i.querySelector(`.portal-item-checkbox`);a.addEventListener(`change`,()=>{a.checked?(o.set(t,{id:t,nama:e.nama,kategori:e.kategori,nominal:e.nominalDefault}),i.classList.add(`selected`)):(o.delete(t),i.classList.remove(`selected`)),X()}),N.appendChild(i)})}function X(){let e=Array.from(o.values()),t=e.length,n=e.reduce((e,t)=>e+t.nominal,0);if(B.textContent=`${t} Item`,z.textContent=h(n),t===0){R.innerHTML=`
        <div class="text-center text-muted" style="padding: var(--space-8);">
          Belum ada tagihan yang dipilih.<br>
          <small>Silakan centang item di sebelah kiri.</small>
        </div>
      `,V.disabled=!0,V.innerHTML=`🔒 Pilih Tagihan Terlebih Dahulu`;return}V.disabled=!1,V.innerHTML=`🔒 Bayar Sekarang • ${h(n)}`,R.innerHTML=e.map(e=>`
      <div class="summary-item-entry animate-fade-in">
        <div class="summary-item-entry-left">
          <span class="summary-bullet">✓</span>
          <div>
            <div class="summary-item-title">${e.nama}</div>
            <div class="summary-item-category badge badge-secondary">${e.kategori.toUpperCase()}</div>
          </div>
        </div>
        <div class="summary-item-price">${h(e.nominal)}</div>
      </div>
    `).join(``)}function ce(){if(!a)return;let e=c.reduce((e,t)=>e+t.nominal,0);if(te.textContent=`Total Lunas: ${h(e)}`,c.length===0){j.innerHTML=`
        <tr>
          <td colspan="7">
            <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Belum Ada Riwayat Pembayaran</div>
              <div class="empty-state-text">Anda belum memiliki catatan pembayaran yang lunas di sistem sekolah.</div>
            </div>
          </td>
        </tr>
      `;return}let t=[...c].sort((e,t)=>new Date(t.tanggalBayar).getTime()-new Date(e.tanggalBayar).getTime());j.innerHTML=t.map(e=>{let t=e.items?e.items.length:1,n=e.rincianItemText||`SPP ${e.bulan} ${e.tahun}`;return`
        <tr>
          <td><code style="font-size: var(--font-size-xs); background: var(--color-bg-glass); padding: 2px 6px; border-radius: var(--radius-sm);">${e.idTransaksi}</code></td>
          <td>${_(e.tanggalBayar)}</td>
          <td>
            <div style="font-weight: 500; font-size: var(--font-size-sm);">${n}</div>
            ${t>1?`<span class="badge badge-secondary text-xs mt-1" style="font-size: 9px;">${t} Rincian Pos</span>`:``}
          </td>
          <td style="font-weight: bold; color: var(--color-success);">${h(e.nominal)}</td>
          <td><span class="badge badge-info text-xs">${e.metodeBayar.toUpperCase()}</span></td>
          <td><span class="badge badge-success text-xs"><span class="badge-dot"></span> LUNAS</span></td>
          <td style="text-align: center;">
            <button class="btn btn-primary btn-sm btn-print-receipt-student" data-id="${e.idTransaksi}">
              🖨️ Cetak Kuitansi
            </button>
          </td>
        </tr>
      `}).join(``),j.querySelectorAll(`.btn-print-receipt-student`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-id`),n=c.find(e=>e.idTransaksi===t);n&&Z(n)})})}function le(e){if(!a)return;let t=Array.from(o.values()),n=t.reduce((e,t)=>e+t.nominal,0),r=y();re.textContent=`Pembayaran Online — ${E.getSchoolInfo().namaSekolah}`,H.style.display=`flex`,e===`qris`?ue(r,n,t):e.startsWith(`va_`)?de(e,r,n,t):fe(e,r,n,t)}function ue(e,t,n){let r=E.getSchoolInfo();U.innerHTML=`
      <div class="gateway-qris-container text-center">
        <div class="gateway-tagline">NMID: ID1020304050607 • ${r.namaSekolah}</div>
        
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
          <div class="amount-large">${h(t)}</div>
        </div>

        <div class="gateway-instructions">
          <p>1. Buka aplikasi m-Banking atau E-Wallet pilihan Anda.</p>
          <p>2. Scan QRIS di atas dan pastikan nama penerima adalah <strong>${r.namaSekolah}</strong>.</p>
          <p>3. Konfirmasi pembayaran Anda.</p>
        </div>

        <div class="gateway-simulator-actions mt-4">
          <button class="btn btn-success btn-lg" id="btn-simulate-success" style="width: 100%;">
            ⚡ Simulasikan Pembayaran QRIS Sukses
          </button>
        </div>
      </div>
    `,U.querySelector(`#btn-simulate-success`)?.addEventListener(`click`,()=>{Q(`qris`,e,t,n)})}function de(e,t,n,r){let o=E.getSchoolInfo(),s=`${e===`va_bca`?`8808`:e===`va_bri`?`1288`:`8901`}${a?.nis||`2026001`}`;U.innerHTML=`
      <div class="gateway-va-container">
        <div class="va-card">
          <div class="va-label">Nomor Virtual Account</div>
          <div class="va-number-row">
            <span class="va-number-code" id="va-code-text">${s}</span>
            <button class="btn btn-sm btn-secondary" id="btn-copy-va">📋 Salin</button>
          </div>
          <div class="va-meta">
            <span>Atas Nama: <strong>${o.namaSekolah} - ${a?.nama}</strong></span>
          </div>
        </div>

        <div class="gateway-amount-tag text-center mt-3">
          <div class="text-xs text-muted">Nominal Transfer</div>
          <div class="amount-large">${h(n)}</div>
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
    `,U.querySelector(`#btn-copy-va`)?.addEventListener(`click`,()=>{navigator.clipboard.writeText(s),i(`Nomor VA disalin!`,`info`)}),U.querySelector(`#btn-simulate-success`)?.addEventListener(`click`,()=>{Q(e,t,n,r)})}function fe(e,t,n,r){let i=e===`dana`?`DANA`:e===`gopay`?`GoPay`:`OVO`;U.innerHTML=`
      <div class="gateway-ewallet-container text-center">
        <div class="amount-large">${h(n)}</div>
        <div class="text-sm text-muted mb-4">Pembayaran via ${i}</div>

        <div class="form-group text-left" style="max-width: 320px; margin: 0 auto;">
          <label class="form-label">Nomor HP Terdaftar ${i}</label>
          <input type="text" class="form-input" id="ewallet-phone" value="${a?.noHp||`081234567890`}">
        </div>

        <div class="gateway-simulator-actions mt-4">
          <button class="btn btn-success btn-lg" id="btn-simulate-success" style="width: 100%;">
            ⚡ Konfirmasi Pembayaran ${i}
          </button>
        </div>
      </div>
    `,U.querySelector(`#btn-simulate-success`)?.addEventListener(`click`,()=>{Q(e,t,n,r)})}async function Q(e,t,n,r){if(!a)return;let o=r.find(e=>e.kategori===`spp`),s=o?.bulan||u[new Date().getMonth()],c=o?.tahun||w(),l=r.map(e=>({id:e.id,nama:e.nama,kategori:e.kategori,nominal:e.nominal,bulan:e.bulan,tahun:e.tahun,keterangan:e.keterangan})),d=r.map(e=>`${e.nama} (${h(e.nominal)})`).join(` + `),f={idTransaksi:t,nis:a.nis,nama:a.nama,kelas:a.kelas,bulan:s,tahun:c,nominal:n,tanggalBayar:v(),metodeBayar:e,status:`lunas`,keterangan:`Pembayaran Online (${r.length} pos tagihan)`,channel:`online`,items:l,rincianItemText:d};if(!await D.addPayment(f)){i(`Gagal mencatat transaksi pembayaran`,`error`);return}H.style.display=`none`,O.notifyNewOnlinePayment(f),pe(f,r),await J()}function pe(e,t){let n=E.getSchoolInfo(),r=document.createElement(`div`);r.className=`payment-success-dialog animate-scale-up`,r.innerHTML=`
      <div class="success-icon-wrapper">🎉</div>
      <h2 class="success-title">Pembayaran Sukses Dilunasi!</h2>
      <p class="success-subtitle">
        Selamat, pembayaran Anda telah sah diterima dan tercatat di sistem administrasi <strong>${n.namaSekolah}</strong>.
      </p>

      <div class="success-receipt-summary">
        <div class="receipt-summary-header">
          <span>No. Kuitansi: <code>${e.idTransaksi}</code></span>
          <span class="badge badge-success">✓ LUNAS (ONLINE)</span>
        </div>
        <div class="receipt-items-table">
          ${t.map(e=>`
            <div class="receipt-item-row">
              <span>${e.nama}</span>
              <strong>${h(e.nominal)}</strong>
            </div>
          `).join(``)}
          <div class="receipt-total-row">
            <span>TOTAL DIBAYAR</span>
            <span class="text-success" style="font-size: var(--font-size-lg); font-weight: bold;">
              ${h(e.nominal)}
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
    `,re.textContent=`Bukti Pembayaran — ${n.namaSekolah}`,U.innerHTML=``,U.appendChild(r),H.style.display=`flex`,r.querySelector(`#btn-print-from-success`)?.addEventListener(`click`,()=>{Z(e)}),r.querySelector(`#btn-done-success`)?.addEventListener(`click`,()=>{H.style.display=`none`,C.click()})}return t}function Ce(){let e=n(`div`,{className:`page-enter`});e.innerHTML=`
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
      <div>
        <h1 class="page-title">🏷️ Kelola Pos Pembayaran Siswa</h1>
        <p class="page-description">
          Tambahkan, edit nama & nominal, atau hapus pos tagihan sekolah. Perubahan akan langsung tampil di Portal Siswa dan Kasir.
        </p>
      </div>
      <div style="display: flex; gap: var(--space-2);">
        <button class="btn btn-secondary" id="btn-reset-billable">
          🔄 Reset Default
        </button>
        <button class="btn btn-primary" id="btn-add-billable">
          ➕ Tambah Pos Pembayaran
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid-stats mb-6" id="billable-stats">
      <!-- Dynamic Stats -->
    </div>

    <!-- Table of Billable Items -->
    <div class="card">
      <div class="section-header">
        <h3 class="section-title">📋 Daftar Tagihan & Biaya Sekolah Aktif</h3>
        <span class="badge badge-primary" id="badge-total-pos">0 Pos Tagihan</span>
      </div>

      <div class="table-container">
        <table class="data-table" id="billable-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pembayaran</th>
              <th>Kategori</th>
              <th>Nominal Pembayaran</th>
              <th>Tipe Tagihan</th>
              <th>Deskripsi Keperluan</th>
              <th style="text-align: center;">Aksi</th>
            </tr>
          </thead>
          <tbody id="billable-tbody">
            <!-- Dynamic rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;let t=e.querySelector(`#billable-tbody`),r=e.querySelector(`#billable-stats`),a=e.querySelector(`#badge-total-pos`),l=e.querySelector(`#btn-add-billable`),u=e.querySelector(`#btn-reset-billable`);function d(){let e=E.getBillableItems();a.textContent=`${e.length} Pos Tagihan`;let n=e.reduce((e,t)=>e+(t.isCustomNominal?0:t.nominalDefault),0),o=e.filter(e=>e.isCustomNominal).length;if(r.innerHTML=`
      <div class="stat-card primary">
        <div class="stat-header">
          <span class="stat-label">Total Pos Tagihan</span>
          <div class="stat-icon primary">🏷️</div>
        </div>
        <div class="stat-value">${e.length}</div>
        <div class="stat-footer">Termasuk SPP & Pos Lainnya</div>
      </div>

      <div class="stat-card success">
        <div class="stat-header">
          <span class="stat-label">Total Nominal Standar</span>
          <div class="stat-icon success">💰</div>
        </div>
        <div class="stat-value" style="font-size: var(--font-size-xl);">${h(n)}</div>
        <div class="stat-footer">Akumulasi seluruh pos paket</div>
      </div>

      <div class="stat-card info">
        <div class="stat-header">
          <span class="stat-label">Nominal Fleksibel</span>
          <div class="stat-icon info">✨</div>
        </div>
        <div class="stat-value">${o} Pos</div>
        <div class="stat-footer">Bebas diisi berapapun oleh siswa</div>
      </div>
    `,e.length===0){t.innerHTML=`
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: var(--space-8);">
            Belum ada pos pembayaran. Klik "Tambah Pos Pembayaran" di atas.
          </td>
        </tr>
      `;return}t.innerHTML=e.map((e,t)=>`
      <tr>
        <td>${t+1}</td>
        <td>
          <div style="font-weight: 600; color: var(--color-text-primary);">${e.nama}</div>
          ${e.isMonthly?`<span class="badge badge-info text-xs mt-1" style="font-size: 9px;">Berulang Tiap Bulan</span>`:``}
        </td>
        <td>
          <span class="badge badge-secondary" style="font-size: 11px;">${e.kategori.toUpperCase()}</span>
        </td>
        <td style="font-weight: bold; color: var(--color-success); font-size: var(--font-size-sm);">
          ${e.isCustomNominal?`<span class="text-muted">Nominal Bebas (Custom)</span>`:h(e.nominalDefault)}
        </td>
        <td>
          ${e.isCustomNominal?`<span class="badge badge-warning text-xs">✨ Sukarela / Bebas</span>`:`<span class="badge badge-primary text-xs">🔒 Tetap / Paket</span>`}
        </td>
        <td style="font-size: var(--font-size-xs); color: var(--color-text-muted); max-width: 250px;">
          ${e.deskripsi||`-`}
        </td>
        <td>
          <div style="display: flex; gap: var(--space-2); justify-content: center;">
            <button class="btn btn-ghost btn-sm btn-edit-pos" data-id="${e.id}" title="Edit Nama & Nominal Pembayaran">
              ✏️ Edit
            </button>
            <button class="btn btn-ghost btn-sm btn-delete-pos text-danger" data-id="${e.id}" title="Hapus Pos Pembayaran">
              🗑️ Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join(``),t.querySelectorAll(`.btn-edit-pos`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.getAttribute(`data-id`),r=e.find(e=>e.id===n);r&&f(r)})}),t.querySelectorAll(`.btn-delete-pos`).forEach(t=>{t.addEventListener(`click`,async()=>{let n=t.getAttribute(`data-id`),r=e.find(e=>e.id===n);r&&await c(`Yakin ingin menghapus pos pembayaran "${r.nama}"?\n\nItem ini tidak akan lagi muncul di Portal Siswa.`)&&(E.deleteBillableItem(n),i(`Pos pembayaran "${r.nama}" berhasil dihapus`,`success`),d())})})}l.addEventListener(`click`,()=>{f()}),u.addEventListener(`click`,async()=>{await c(`Kembalikan seluruh daftar pos tagihan ke pengaturan bawaan sekolah?`)&&(E.resetBillableItems(),i(`Daftar pos pembayaran berhasil di-reset ke default`,`info`),d())});function f(e){let t=!!e,n=document.createElement(`div`);n.innerHTML=`
      <form id="form-billable-item">
        <div class="form-group">
          <label class="form-label">Nama Pembayaran *</label>
          <input type="text" class="form-input" id="item-nama" required placeholder="Contoh: Paket Seragam, Biaya Wisuda, Uang Kas" value="${e?.nama||``}">
        </div>

        <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <div class="form-group">
            <label class="form-label">Kategori Tagihan *</label>
            <select class="form-select" id="item-kategori" required>
              <option value="spp" ${e?.kategori===`spp`?`selected`:``}>SPP Bulanan</option>
              <option value="seragam" ${e?.kategori===`seragam`?`selected`:``}>Seragam & Atribut</option>
              <option value="buku" ${e?.kategori===`buku`?`selected`:``}>Buku & Modul</option>
              <option value="gedung" ${e?.kategori===`gedung`?`selected`:``}>Uang Gedung / DSP</option>
              <option value="ujian" ${e?.kategori===`ujian`?`selected`:``}>Ujian / Asesmen</option>
              <option value="kegiatan" ${e?.kategori===`kegiatan`?`selected`:``}>Kegiatan Siswa</option>
              <option value="bebas" ${e?.kategori===`bebas`?`selected`:``}>Donasi / Sukarela / Bebas</option>
              <option value="lainnya" ${e?.kategori===`lainnya`?`selected`:``}>Lain-Lain</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Nominal Pembayaran (Rp) *</label>
            <input type="number" class="form-input" id="item-nominal" min="0" step="5000" required placeholder="250000" value="${e?.nominalDefault??1e5}">
          </div>
        </div>

        <div class="form-group">
          <label class="custom-checkbox-wrapper" style="margin-top: var(--space-2); margin-bottom: var(--space-2);">
            <input type="checkbox" id="item-custom-check" ${e?.isCustomNominal?`checked`:``}>
            <span class="custom-checkbox-label text-sm">
              Izinkan siswa membayar <strong>nominal bebas / sukarela</strong> untuk pos ini
            </span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Keterangan / Deskripsi Keperluan</label>
          <textarea class="form-textarea" id="item-deskripsi" rows="2" placeholder="Jelaskan rincian peruntukan biaya ini (opsional)">${e?.deskripsi||``}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-4); border-top: 1px solid var(--color-border); padding-top: var(--space-4);">
          <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Batal</button>
          <button type="submit" class="btn btn-success">
            💾 ${t?`Simpan Perubahan`:`Tambah Pos Tagihan`}
          </button>
        </div>
      </form>
    `,n.querySelector(`#btn-cancel-modal`)?.addEventListener(`click`,()=>{s()}),n.querySelector(`#form-billable-item`)?.addEventListener(`submit`,r=>{r.preventDefault();let a=n.querySelector(`#item-nama`).value.trim(),o=n.querySelector(`#item-kategori`).value,c=Number(n.querySelector(`#item-nominal`).value)||0,l=n.querySelector(`#item-custom-check`).checked,u=n.querySelector(`#item-deskripsi`).value.trim();if(!a){i(`Nama pembayaran tidak boleh kosong`,`warning`);return}t&&e?(E.updateBillableItem(e.id,{nama:a,kategori:o,nominalDefault:c,isCustomNominal:l,deskripsi:u}),i(`Pos pembayaran "${a}" berhasil diperbarui!`,`success`)):(E.addBillableItem({nama:a,kategori:o,nominalDefault:c,isCustomNominal:l,deskripsi:u,isMonthly:o===`spp`}),i(`Pos pembayaran baru "${a}" berhasil ditambahkan!`,`success`)),s(),d()}),o(t?`Edit Pos Pembayaran`:`Tambah Pos Pembayaran Baru`,n)}return d(),e}function we(){let e=n(`div`,{className:`page-enter`}),t=E.getSchoolInfo();e.innerHTML=`
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
            <input type="text" class="form-input" id="set-nama-sekolah" required value="${t.namaSekolah}" placeholder="Contoh: SMP Negeri 1 Nusantara">
            <span class="text-xs text-muted">Nama ini akan tampil di header, portal siswa, dan kop kuitansi.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Lengkap Sekolah *</label>
            <textarea class="form-textarea" id="set-alamat-sekolah" rows="2" required placeholder="Jl. Pendidikan No. 1, Kota Nusantara">${t.alamatSekolah}</textarea>
          </div>

          <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div class="form-group">
              <label class="form-label">Nomor Telepon / Kontak</label>
              <input type="text" class="form-input" id="set-no-telepon" value="${t.noTelepon||``}" placeholder="(021) 789-0123">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Email Sekolah</label>
              <input type="email" class="form-input" id="set-email" value="${t.email||``}" placeholder="info@sekolah.sch.id">
            </div>
          </div>

          <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
            <div class="form-group">
              <label class="form-label">Tahun Ajaran Aktif *</label>
              <input type="text" class="form-input" id="set-tahun-ajaran" required value="${t.tahunAjaran}" placeholder="2026/2027">
            </div>
            <div class="form-group">
              <label class="form-label">Nominal SPP Standar (Rp) *</label>
              <input type="number" class="form-input" id="set-nominal-spp" required min="0" step="5000" value="${t.nominalSppDefault}">
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
                <input type="text" class="form-input" id="set-kepala-sekolah" required value="${t.namaKepalaSekolah}" placeholder="Nama & Gelar Kepala Sekolah">
              </div>
              <div class="form-group">
                <label class="form-label">NIP Kepala Sekolah</label>
                <input type="text" class="form-input" id="set-nip-kepala" value="${t.nipKepalaSekolah||``}" placeholder="19750812 200003 1 002">
              </div>
            </div>

            <div class="grid-2" style="grid-template-columns: 1fr 1fr; gap: var(--space-3);">
              <div class="form-group">
                <label class="form-label">Nama Bendahara / Kasir TU *</label>
                <input type="text" class="form-input" id="set-bendahara" required value="${t.namaBendahara}" placeholder="Nama Petugas Bendahara">
              </div>
              <div class="form-group">
                <label class="form-label">NIP / Jabatan Bendahara</label>
                <input type="text" class="form-input" id="set-nip-bendahara" value="${t.nipBendahara||``}" placeholder="19820415 200801 2 007">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Kaki Kuitansi</label>
              <textarea class="form-textarea" id="set-catatan-kuitansi" rows="2" placeholder="Catatan legalitas bukti bayar">${t.catatanKuitansi||``}</textarea>
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
              <input type="url" class="form-input" id="set-apps-script-url" value="${t.appsScriptUrl||``}" placeholder="https://script.google.com/macros/s/.../exec">
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
  `;let r=e.querySelector(`#form-school-settings`),a=e.querySelector(`#set-nama-sekolah`),o=e.querySelector(`#set-alamat-sekolah`),s=e.querySelector(`#set-no-telepon`),c=e.querySelector(`#set-email`),l=e.querySelector(`#set-tahun-ajaran`),u=e.querySelector(`#set-nominal-spp`),d=e.querySelector(`#set-kepala-sekolah`),f=e.querySelector(`#set-nip-kepala`),p=e.querySelector(`#set-bendahara`),m=e.querySelector(`#set-catatan-kuitansi`),g=e.querySelector(`#set-apps-script-url`),_=e.querySelector(`#btn-test-sheet`),v=e.querySelector(`#test-sheet-status`),y=e.querySelector(`#live-receipt-preview`);function b(){let e=a.value.trim()||`Nama Sekolah`,t=o.value.trim()||`Alamat Sekolah`,n=s.value.trim()||`-`,r=c.value.trim()||`-`,i=l.value.trim()||`2026/2027`,u=d.value.trim()||`Nama Kepala Sekolah`,g=f.value.trim()||`-`,_=p.value.trim()||`Nama Bendahara`,v=m.value.trim()||`Bukti bayar sah.`;y.innerHTML=`
      <div style="background: white; color: #1a1a1a; padding: var(--space-5); border-radius: var(--radius-lg); font-size: 11px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
        <div style="text-align: center; border-bottom: 2px double #333; padding-bottom: 8px; margin-bottom: 10px;">
          <div style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #111;">${e}</div>
          <div style="font-size: 10px; color: #555;">${t}</div>
          <div style="font-size: 9px; color: #777;">Telp: ${n} • Email: ${r}</div>
          <div style="font-size: 10px; font-weight: 600; color: #333; margin-top: 2px;">Tahun Ajaran ${i}</div>
          <div style="font-size: 11px; font-weight: bold; margin-top: 6px; letter-spacing: 1px;">KUITANSI PEMBAYARAN RESMI</div>
        </div>

        <div style="padding: 4px 0; border-bottom: 1px dotted #ccc;">
          <div style="display: flex; justify-content: space-between;">
            <span>Contoh Siswa:</span>
            <strong>Ahmad Rizky (VII-A)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 2px;">
            <span>Item: SPP & Seragam:</span>
            <strong>${h(6e5)}</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 18px; text-align: center; font-size: 10px;">
          <div style="width: 100px;">
            <div>Kepala Sekolah,</div>
            <div style="margin-top: 26px; font-weight: bold; text-decoration: underline;">${u}</div>
            <div style="font-size: 8px; color: #777;">NIP: ${g}</div>
          </div>
          <div style="width: 100px;">
            <div>Bendahara Sekolah,</div>
            <div style="margin-top: 26px; font-weight: bold; text-decoration: underline;">${_}</div>
            <div style="font-size: 8px; color: #777;">Petugas Keuangan</div>
          </div>
        </div>

        <div style="margin-top: 12px; border-top: 1px dashed #ccc; padding-top: 6px; font-size: 8px; color: #888; text-align: center;">
          ${v}
        </div>
      </div>
    `}[a,o,s,c,l,d,f,p,m].forEach(e=>{e.addEventListener(`input`,b)}),b(),_.addEventListener(`click`,async()=>{let e=g.value.trim();if(!e){v.textContent=`⚠️ Masukkan URL Apps Script terlebih dahulu.`,v.className=`text-xs text-warning`;return}v.textContent=`🔄 Sedang menguji koneksi...`,v.className=`text-xs text-muted`,_.disabled=!0;let t=await D.testConnection(e);_.disabled=!1,t.success?(v.textContent=`✅ ${t.message}`,v.className=`text-xs text-success`,i(`Koneksi Google Spreadsheet Berhasil!`,`success`)):(v.textContent=`❌ ${t.message}`,v.className=`text-xs text-danger`,i(t.message,`error`,6e3))}),r.addEventListener(`submit`,e=>{e.preventDefault();let t=E.updateSchoolInfo({namaSekolah:a.value.trim(),alamatSekolah:o.value.trim(),noTelepon:s.value.trim(),email:c.value.trim(),tahunAjaran:l.value.trim(),nominalSppDefault:Number(u.value)||25e4,namaKepalaSekolah:d.value.trim(),nipKepalaSekolah:f.value.trim(),namaBendahara:p.value.trim(),catatanKuitansi:m.value.trim(),appsScriptUrl:g.value.trim()});document.title=`Identitas Sekolah — ${t.namaSekolah}`,i(`Data Identitas & Database "${t.namaSekolah}" berhasil disimpan!`,`success`)});let x=e.querySelector(`#form-admin-password`),S=e.querySelector(`#input-old-pass`),C=e.querySelector(`#input-new-pass`);return x.addEventListener(`submit`,e=>{e.preventDefault();let t=S.value,n=C.value,r=A.updateAdminPassword(t,n);if(!r.success){i(r.error||`Gagal mengubah password`,`error`);return}i(`Password Admin berhasil diperbarui!`,`success`),x.reset()}),e}function Te(){let t=n(`div`,{className:`login-page-container animate-fade-in`}),r=E.getSchoolInfo();t.innerHTML=`
    <div class="login-card-wrapper">
      <!-- School Branding Header -->
      <div class="login-header text-center">
        <div class="login-logo">🏫</div>
        <h1 class="login-school-name">${r.namaSekolah}</h1>
        <p class="login-school-sub">${r.alamatSekolah} • Tahun Ajaran ${r.tahunAjaran}</p>
        <div class="login-tagline-badge">Sistem Pembayaran SPP & Tagihan Sekolah Resmi</div>
      </div>

      <!-- Role Selection Tabs -->
      <div class="login-role-tabs">
        <button class="role-tab-btn active" id="tab-login-siswa">
          👨‍🎓 Masuk Sebagai Siswa
        </button>
        <button class="role-tab-btn" id="tab-login-admin">
          🔐 Masuk Sebagai Admin
        </button>
      </div>

      <!-- Student Login Box -->
      <div class="login-form-box" id="box-login-siswa">
        <div class="login-box-header">
          <div class="box-title">Portal Mandiri Siswa & Wali Murid</div>
          <div class="box-desc">
            Masukkan Nama Lengkap atau NIS untuk melihat rincian tagihan yang harus dibayar, melakukan pembayaran online, serta mencetak kuitansi.
          </div>
        </div>

        <form id="form-login-siswa">
          <div class="form-group">
            <label class="form-label">Nama Siswa atau NIS *</label>
            <input type="text" class="form-input form-input-lg" id="input-siswa-identity" placeholder="Contoh: Budi Santoso atau 2026001" required autofocus>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-4);" id="btn-submit-siswa">
            🚀 Masuk Portal Siswa
          </button>
        </form>

        <!-- Quick Select Student Chips -->
        <div class="quick-students-section mt-6">
          <span class="text-xs text-muted" style="display: block; margin-bottom: var(--space-2);">
            Pilih cepat nama siswa terdaftar:
          </span>
          <div id="login-quick-chips" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <span class="text-xs text-muted">Memuat daftar siswa...</span>
          </div>
        </div>

        <div class="login-role-notice mt-4">
          ℹ️ <strong>Catatan Akses Siswa:</strong> Siswa hanya dapat melihat dan membayar tagihan secara online serta mengunduh kuitansi resmi. Siswa tidak memiliki izin untuk merubah data sekolah atau data siswa lainnya.
        </div>
      </div>

      <!-- Admin Login Box (Hidden by default) -->
      <div class="login-form-box" id="box-login-admin" style="display: none;">
        <div class="login-box-header">
          <div class="box-title">Panel Administrasi Sekolah</div>
          <div class="box-desc">
            Khusus petugas tata usaha, kasir, dan bendahara sekolah untuk mengelola data siswa, pos pembayaran, dan laporan keuangan.
          </div>
        </div>

        <form id="form-login-admin">
          <div class="form-group">
            <label class="form-label">Username Admin *</label>
            <input type="text" class="form-input" id="input-admin-user" value="admin" required placeholder="admin">
          </div>

          <div class="form-group">
            <label class="form-label">Password Admin *</label>
            <input type="password" class="form-input" id="input-admin-pass" required placeholder="Masukkan password admin">
            <span class="text-xs text-muted">Kredensial bawaan awal: <code>admin</code> / <code>admin123</code></span>
          </div>

          <button type="submit" class="btn btn-success btn-lg" style="width: 100%; margin-top: var(--space-4);" id="btn-submit-admin">
            🔐 Masuk Sebagai Admin
          </button>
        </form>

        <div class="login-role-notice mt-4" style="border-left-color: var(--color-success);">
          🛡️ <strong>Hak Akses Admin:</strong> Akses penuh Dashboard, Data Siswa (Tambah/Edit/Hapus), Kelola Pos Tagihan Sekolah, Kasir Pembayaran, dan Pengaturan Identitas Sekolah.
        </div>
      </div>
    </div>
  `;let a=t.querySelector(`#tab-login-siswa`),o=t.querySelector(`#tab-login-admin`),s=t.querySelector(`#box-login-siswa`),c=t.querySelector(`#box-login-admin`),l=t.querySelector(`#form-login-siswa`),u=t.querySelector(`#form-login-admin`),d=t.querySelector(`#input-siswa-identity`),f=t.querySelector(`#input-admin-user`),p=t.querySelector(`#input-admin-pass`),m=t.querySelector(`#login-quick-chips`);a.addEventListener(`click`,()=>{a.classList.add(`active`),o.classList.remove(`active`),s.style.display=`block`,c.style.display=`none`,d.focus()}),o.addEventListener(`click`,()=>{o.classList.add(`active`),a.classList.remove(`active`),c.style.display=`block`,s.style.display=`none`,p.focus()}),h();async function h(){let e=await D.getStudents();if(e.length===0){m.innerHTML=`<span class="text-xs text-muted">Belum ada data siswa terdaftar.</span>`;return}m.innerHTML=``,e.forEach(e=>{let t=n(`button`,{className:`btn btn-ghost btn-sm`,style:`border: 1px solid var(--color-border); border-radius: var(--radius-full); padding: 4px 12px; font-size: 11px;`,innerHTML:`👨‍🎓 ${e.nama} (${e.nis})`});t.addEventListener(`click`,()=>{g(e.nis)}),m.appendChild(t)})}l.addEventListener(`submit`,async e=>{e.preventDefault();let t=d.value.trim();t&&await g(t)});async function g(t){let n=await A.loginAsStudent(t);if(!n.success){i(n.error||`Gagal masuk sebagai siswa`,`error`);return}i(`Selamat datang, ${n.student?.nama}!`,`success`),e.navigate(`/portal-siswa`)}return u.addEventListener(`submit`,t=>{t.preventDefault();let n=f.value.trim(),r=p.value,a=A.loginAsAdmin(n,r);if(!a.success){i(a.error||`Login admin gagal`,`error`);return}i(`Login berhasil sebagai Administrator!`,`success`),e.navigate(`/`)}),t}function Ee(){e.registerAll([{path:`/login`,title:`Masuk Akun`,icon:`🔑`,render:Te},{path:`/`,title:`Dashboard`,icon:`🏠`,render:F},{path:`/portal-siswa`,title:`Portal Siswa`,icon:`💳`,render:Se},{path:`/pembayaran`,title:`Kasir Pembayaran`,icon:`💰`,render:Q},{path:`/riwayat`,title:`Riwayat Pembayaran`,icon:`📋`,render:ve},{path:`/siswa`,title:`Data Siswa`,icon:`👨‍🎓`,render:se},{path:`/pos-pembayaran`,title:`Pos Pembayaran`,icon:`🏷️`,render:Ce},{path:`/identitas-sekolah`,title:`Identitas Sekolah`,icon:`⚙️`,render:we}]);let n=t(`#app`);if(!n)return;n.innerHTML=``,n.classList.add(`app-shell`),n.appendChild(M()),n.appendChild(N()),n.appendChild(ee());let r=document.createElement(`main`);r.className=`main-content`,r.id=`main-content`,n.appendChild(r),e.onRouteChange(t=>{let a=A.getRole();if(!a){if(t!==`/login`){e.navigate(`/login`);return}}else if(a===`siswa`){if(t!==`/portal-siswa`){i(`Akses dibatasi. Siswa hanya dapat mengakses Portal Pembayaran mandiri.`,`warning`),e.navigate(`/portal-siswa`);return}}else if(a===`admin`&&t===`/login`){e.navigate(`/`);return}let o=t===`/login`;n.classList.toggle(`login-mode`,o),window.dispatchEvent(new CustomEvent(`app:auth-changed`));let s=e.getCurrentRoute();if(s){te(t);let e=E.getSchoolInfo();if(document.title=`${s.title} — ${e.namaSekolah}`,r.innerHTML=``,!o&&a===`admin`&&t===`/`&&!D.useApi){let e=document.createElement(`div`);e.className=`config-banner animate-fade-in-down`,e.innerHTML=`
          <span class="config-banner-icon">⚠️</span>
          <div class="config-banner-text">
            <div class="config-banner-title">Mode Offline / Demo</div>
            <div class="config-banner-desc">
              Data tersimpan di browser ini. Untuk menghubungkan ke <strong>Google Spreadsheet Asli (Real Live)</strong>, 
              masukkan URL Web App di menu <a href="#/identitas-sekolah" style="color: var(--color-primary-light); text-decoration: underline; font-weight: 600;">Identitas Sekolah & Database Real</a>.
            </div>
          </div>
        `,r.appendChild(e)}r.appendChild(s.render())}}),e.start(),O.requestPermission(),setTimeout(()=>{O.checkAndNotify()},3e3)}document.addEventListener(`DOMContentLoaded`,Ee);