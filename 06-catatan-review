#  06 - Catatan Code Review

**Nama Proyek:** BSS - Bank Syariah Sekolah (BASAMO)
**Tanggal Review:** 10 - 14 Oktober 2026
**Reviewer:** Tim BSS (Mutya Laura, Cantika Amelian, Isra Julian Sari)
**Tools AI Review:** Qwen (Code Review Mode), Gemini Pro

---

## 🎯 Tujuan Code Review

1. Memastikan kualitas kode sebelum production
2. Mengidentifikasi potensi bug dan celah keamanan
3. Mengoptimasi performa dan readability
4. Memverifikasi kesesuaian dengan spesifikasi produk

---

## 💬 Prompt Review yang Dipakai

### Prompt 1: Review Backend (kode.gs)
> "Review kode Google Apps Script berikut untuk sistem perbankan sekolah. Fokus pada: (1) keamanan transaksi keuangan, (2) penanganan concurrent access, (3) optimasi performa dengan cache dan locking, (4) error handling. Berikan saran konkret dengan contoh kode perbaikan."

### Prompt 2: Review Frontend (index.html)
> "Review kode frontend vanilla JS + Tailwind CSS untuk aplikasi bank sekolah. Fokus pada: (1) validasi input user, (2) keamanan autentikasi, (3) performa rendering, (4) UX mobile-first, (5) anti-duplikasi transaksi. Berikan saran konkret."

### Prompt 3: Review Keamanan
> "Analisis celah keamanan pada sistem login, autentikasi role, dan validasi transaksi. Identifikasi potensi SQL injection (jika ada), XSS, CSRF, dan akses tidak sah. Berikan rekomendasi perbaikan."

---

## 📋 Tabel Hasil Review

| No | Saran dari AI | Diterima / Ditolak | Alasan | Bagian Kode yang Berubah |
|:--:|---------------|:------------------:|--------|--------------------------|
| 1 | **Tambahkan validasi server-side untuk format No. HP** di fungsi `handleCreate` dan `handleUpdate` untuk mencegah data invalid masuk ke database. | ✅ **Diterima** | Validasi frontend saja tidak cukup. User bisa bypass via API call langsung. Perlu defense in depth. | `kode.gs` - Fungsi `handleCreate` dan `handleUpdate`: Tambah regex check `/^08\d{8,12}$/.test(obj.phone)` sebelum write. |
| 2 | **Ganti `LockService.getScriptLock()` dengan `LockService.getUserLock()`** untuk memungkinkan concurrent access dari user berbeda. |  **Ditolak** | Sistem kami menggunakan shared database (Google Sheets) yang sama untuk semua user. `UserLock` hanya mengunci per user, tidak mencegah race condition saat 2 teller mengedit nasabah yang sama bersamaan. `ScriptLock` lebih aman untuk kasus ini. | Tidak ada perubahan. Tetap menggunakan `getScriptLock()`. |
| 3 | **Tambahkan rate limiting** pada fungsi `handleLogin` untuk mencegah brute force attack (maks 5 percobaan per menit per IP). |  **Ditolak** | Google Apps Script tidak menyediakan akses ke IP address client secara native. Implementasi rate limiting per IP tidak feasible tanpa infrastruktur tambahan. Sebagai gantinya, kami sudah implementasi **PIN blocking setelah 3x salah** yang lebih efektif untuk kasus ini. | Tidak ada perubahan. Mengandalkan PIN blocking mechanism yang sudah ada. |
| 4 | **Tambahkan `try-catch` di dalam loop `for` pada fungsi `confirmDeleteHistory`** agar jika 1 delete gagal, transaksi lain tetap terproses. | ✅ **Diterima** | Saat ini jika 1 delete gagal di tengah batch, seluruh proses berhenti. Dengan try-catch, kita bisa log error dan lanjutkan delete transaksi lainnya. | `index.html` - Fungsi `confirmDeleteHistory`: Bungkus `await window.dataSdk.delete(transaction)` dalam try-catch, tambahkan counter `failedCount`. |
| 5 | **Hash password dengan SHA-256** sebelum disimpan di database untuk meningkatkan keamanan. | ❌ **Ditolak** | Google Apps Script tidak memiliki library crypto native untuk SHA-256. Implementasi custom akan menambah kompleksitas dan overhead. Untuk proyek skala sekolah dengan data sensitivitas rendah, password plaintext (dengan akses terbatas ke sheet) masih acceptable. **Dicatat sebagai improvement untuk v3.0**. | Tidak ada perubahan. Password tetap plaintext. Ditambahkan catatan di `05-kesalahan-ai.md` sebagai known limitation. |
| 6 | **Tambahkan indeks pada kolom `__backendId`** di Google Sheets untuk mempercepat pencarian di fungsi `findRowByIndex_`. | ❌ **Ditolak** | Google Sheets tidak support indexing seperti database relational. Fungsi `findRowByIndex_` sudah dioptimasi dengan hanya membaca 1 kolom (kolom A) menggunakan `getRange(2, 1, lastRow - 1, 1).getValues()`, bukan seluruh baris. Ini sudah cukup efisien untuk data < 1000 rows. | Tidak ada perubahan. Optimasi sudah cukup. |
| 7 | **Tambahkan debounce pada fungsi `filterHistory`** untuk mencegah query berlebihan saat user mengetik di filter. | ✅ **Diterima** | Tanpa debounce, setiap keystroke di input filter memicu render ulang tabel. Dengan data 100+ transaksi, ini bisa menyebabkan lag. | `index.html` - Fungsi `filterHistory`: Bungkus dengan `debounce(() => {...}, 300)`. |
| 8 | **Pisahkan fungsi `renderNasabahManagement` menjadi beberapa fungsi kecil** (render header, render filter, render table, render pagination) untuk meningkatkan maintainability. | ✅ **Diterima** | Fungsi `renderNasabahManagement` saat ini > 150 baris, sulit di-maintain. Pemisahan akan memudahkan debugging dan penambahan fitur baru. | `index.html` - Pecah menjadi: `renderNasabahHeader()`, `renderNasabahFilters()`, `renderNasabahTable()`, `renderNasabahPagination()`. |
| 9 | **Tambahkan CSRF token** pada setiap request ke backend untuk mencegah Cross-Site Request Forgery. | ❌ **Ditolak** | Google Apps Script Web App sudah memiliki mekanisme keamanan bawaan (CORS policy, same-origin policy). Selain itu, aplikasi kami tidak menggunakan cookie-based session yang rentan CSRF. Request dilakukan via `google.script.run` yang sudah aman. | Tidak ada perubahan. Mengandalkan keamanan bawaan GAS. |
| 10 | **Tambahkan logging ke Google Sheets** untuk setiap operasi sensitif (login, transfer, reset password) sebagai audit trail. | ✅ **Diterima** | Saat ini tidak ada audit log. Jika terjadi masalah, sulit melacak siapa yang melakukan apa. Audit log penting untuk akuntabilitas. | `kode.gs` - Tambah fungsi `logAudit_(action, userId, details)` yang menulis ke sheet `audit_log`. Dipanggil di `handleLogin`, `handleAtomicTransfer`, `resetUserPassword`. |
| 11 | **Ganti `sessionStorage` dengan `localStorage`** untuk tracking anti-duplikasi transaksi agar persisten meski user refresh halaman. | ❌ **Ditolak** | Justru `sessionStorage` lebih tepat karena anti-duplikasi hanya perlu berlaku dalam 1 sesi. Jika user refresh halaman, transaksi sebelumnya sudah selesai diproses, jadi tidak perlu tracking lagi. `localStorage` akan menyebabkan false positive jika user benar-benar ingin transaksi baru setelah refresh. | Tidak ada perubahan. Tetap menggunakan `sessionStorage`. |
| 12 | **Tambahkan lazy loading untuk gambar/logo** di dashboard untuk mempercepat initial load. |  **Ditolak** | Aplikasi kami tidak menggunakan gambar eksternal. Logo BSS di-render sebagai inline SVG, yang sudah sangat ringan (< 1KB). Lazy loading tidak relevan untuk inline SVG. | Tidak ada perubahan. |
| 13 | **Tambahkan validasi `amount > 0` di backend** fungsi `handleAtomicTransfer` untuk mencegah transfer dengan jumlah 0 atau negatif. | ✅ **Diterima** | Validasi di frontend bisa di-bypass. Perlu validasi di backend sebagai lapisan keamanan kedua. | `kode.gs` - Fungsi `handleAtomicTransfer`: Tambah check `if (amount <= 0) return { status: false, error: 'Jumlah transfer tidak valid' };` di awal fungsi. |
| 14 | **Gunakan `Promise.all` untuk parallel processing** saat batch create notifikasi di `handleBroadcastMessage` untuk mempercepat eksekusi. | ❌ **Ditolak** | Google Apps Script memiliki limitasi concurrent execution. `Promise.all` tidak akan benar-benar paralel di GAS, malah bisa menyebabkan timeout jika batch terlalu besar. Pendekatan batch write yang sudah ada (50 rows per call) sudah optimal. | Tidak ada perubahan. Tetap menggunakan batch write sequential. |
| 15 | **Tambahkan konfirmasi modal sebelum reset password** untuk mencegah accidental reset oleh admin. | ✅ **Diterima** | Saat ini reset password langsung terjadi tanpa konfirmasi eksplisit. Ini berisiko jika admin salah klik. | `index.html` - Fungsi `resetUserPassword`: Tambah modal konfirmasi dengan pesan "Yakin ingin mereset password [nama user]?". |

---

## 📊 Ringkasan Hasil Review

### Statistik Saran

| Kategori | Jumlah | Diterima | Ditolak |
|----------|--------|----------|---------|
| **Keamanan** | 5 | 2 | 3 |
| **Performa** | 4 | 2 | 2 |
| **Maintainability** | 3 | 2 | 1 |
| **UX** | 3 | 2 | 1 |
| **Total** | **15** | **8** | **7** |

### Tingkat Penerimaan: 53% (8 dari 15 saran)

---

## 🔍 Analisis Saran yang Ditolak

### Pola Penolakan:

1. **Tidak Relevan dengan Stack Teknologi** (3 saran)
   - Contoh: Rate limiting per IP, CSRF token, Promise.all parallel
   - Alasan: Google Apps Script memiliki karakteristik unik yang berbeda dengan web framework tradisional. Saran AI sering mengasumsikan stack umum (Node.js, Express, dll) yang tidak applicable ke GAS.

2. **Sudah Ditangani dengan Cara Lain** (2 saran)
   - Contoh: UserLock vs ScriptLock, localStorage vs sessionStorage
   - Alasan: Tim sudah mempertimbangkan alternatif dan memilih pendekatan yang lebih sesuai dengan use case spesifik.

3. **Over-Engineering untuk Skala Proyek** (2 saran)
   - Contoh: Password hashing SHA-256, indexing Google Sheets
   - Alasan: Proyek skala sekolah dengan < 1000 users tidak memerlukan kompleksitas enterprise. Ditambahkan sebagai future improvement.

---

## ✅ Saran yang Diterima & Implementasi

### 1. Validasi Server-Side No. HP
**Status:** ✅ Implemented
**Commit:** `feat: add server-side phone validation`
**Impact:** Mencegah data invalid masuk ke database meski frontend di-bypass.

### 2. Try-Catch di Batch Delete
**Status:** ✅ Implemented
**Commit:** `fix: add error handling in batch delete history`
**Impact:** Meningkatkan reliabilitas penghapusan riwayat transaksi.

### 3. Debounce Filter History
**Status:** ✅ Implemented
**Commit:** `perf: add debounce to history filter`
**Impact:** Mengurangi render unnecessary, meningkatkan performa UI.

### 4. Refactor renderNasabahManagement
**Status:** ✅ Implemented
**Commit:** `refactor: split nasabah management into smaller functions`
**Impact:** Kode lebih maintainable, mudah di-debug.

### 5. Audit Log
**Status:** ✅ Implemented
**Commit:** `feat: add audit logging for sensitive operations`
**Impact:** Meningkatkan akuntabilitas dan traceability.

### 6. Validasi Amount di Backend
**Status:** ✅ Implemented
**Commit:** `security: add backend validation for transfer amount`
**Impact:** Mencegah transfer dengan jumlah invalid.

### 7. Konfirmasi Reset Password
**Status:** ✅ Implemented
**Commit:** `ux: add confirmation modal before password reset`
**Impact:** Mencegah accidental reset oleh admin.

---

## 📝 Catatan Penting dari Review

### Temuan Kritis:
1. **Tidak ada audit log** → Sudah diperbaiki dengan implementasi `logAudit_()`
2. **Validasi hanya di frontend** → Sudah diperbaiki dengan validasi server-side
3. **Error handling tidak konsisten** → Sudah diperbaiki dengan try-catch di batch operations

### Temuan Minor:
1. Beberapa fungsi terlalu panjang (> 100 baris) → Sudah di-refactor
2. Nama variabel tidak konsisten di beberapa tempat → Sudah distandarisasi
3. Komentar kode kurang untuk logic kompleks → Sudah ditambahkan JSDoc

### Rekomendasi untuk v3.0:
1. Implementasi password hashing (bcrypt/SHA-256)
2. Integrasi dengan Google Cloud Logging untuk audit trail yang lebih robust
3. Implementasi 2FA untuk akun direktur dan admin
4. Migrasi dari Google Sheets ke Cloud SQL jika data > 10,000 rows

---

## 🎯 Kesimpulan Code Review

> **Code review adalah proses kritis yang memastikan kualitas kode, bukan formalitas.**

Dari 15 saran yang diberikan AI, tim **hanya menerima 8 saran (53%)** dan **menolak 7 saran (47%)** dengan alasan yang jelas dan terdokumentasi. Ini menunjukkan bahwa tim:

1. **Tidak blindly accept** semua saran AI
2. **Memahami konteks teknologi** (Google Apps Script) dan batasan-batasannya
3. **Mempertimbangkan trade-off** antara keamanan, performa, dan kompleksitas
4. **Berani menolak** saran yang tidak relevan atau over-engineering

**Rekomendasi untuk Proyek Selanjutnya:**
- Lakukan code review **minimal 2x** sebelum production
- Dokumentasikan **setiap keputusan** (terima/tolak) dengan alasan jelas
- Gunakan AI sebagai **reviewer**, bukan **decision maker**
- Fokus pada **security dan data integrity** untuk aplikasi finansial

---

> **Catatan:** Penjelasan detail kode ditulis terpisah di `08-penjelasan-kode.md`. File ini khusus untuk dokumentasi proses review dan keputusan tim.
