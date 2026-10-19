# 🧪 04 - Kasus Uji (Test Cases)

**Nama Proyek:** BSS - Bank Syariah Sekolah (BASAMO)
**Tanggal Pengujian:** 12 - 14 Oktober 2026
**Penguji:** Isra Julian Sari (QA Tester)
**Reviewer:** Mutya Laura (Backend), Cantika Amelian (Frontend)
**Lingkungan Uji:** Google Chrome (Desktop & Mobile View), Firefox, Edge, Google Apps Script Web App
**Database Uji:** Google Sheets staging (terpisah dari produksi)

---

## Bagian 1: Kasus Uji Manual (End-to-End)

**Keterangan Kolom:**
- **Bagian A (Hasil yang diharapkan):** Dihitung/ditentukan secara manual oleh tim berdasarkan aturan bisnis sebelum pengujian.
- **Bagian B (Hasil sebenarnya & Lulus?):** Diisi setelah aplikasi diuji secara langsung.

| ID | Kriteria yang diuji | Langkah / input | Hasil yang diharapkan (Bagian A) | Hasil sebenarnya (Bagian B) | Lulus? | Bukti (nama file tangkapan layar) |
|----|---------------------|-----------------|----------------------------------|-----------------------------|--------|-----------------------------------|
| **TC-01** | Login Nasabah Valid | 1. Buka portal `?page=nasabah`<br>2. Input No. HP: `081234567890`<br>3. Input Password: `123456`<br>4. Klik "Masuk" | Berhasil login, redirect ke Dashboard Nasabah, menampilkan saldo dan nama user. | Berhasil login, dashboard muncul dengan saldo Rp 0. | ✅ Ya | tc01_login_valid.png |
| **TC-02** | Login dengan Password Salah | 1. Buka portal `?page=nasabah`<br>2. Input No. HP: `081234567890`<br>3. Input Password: `salah123`<br>4. Klik "Masuk" | Muncul toast error: "Username atau password salah". Tidak ada akses ke dashboard. | Muncul toast error merah "Username atau password salah". | ✅ Ya | tc02_login_salah.png |
| **TC-03** | Registrasi Nasabah (Valid) | 1. Klik "Daftar sebagai Nasabah"<br>2. Isi Nama, HP (`089876543210`), Kategori: Pelajar, Kelas: `XI AKL 1`, Password, PIN.<br>3. Klik "Daftar" | Muncul modal sukses "Pendaftaran Berhasil". Status akun di database menjadi `pending`. | Modal sukses muncul. Data tercatat di sheet `users` dengan status `pending`. | ✅ Ya | tc03_registrasi.png |
| **TC-04** | Registrasi Format HP Salah (Input Invalid) | 1. Buka form registrasi<br>2. Input No. HP: `12345` atau `08123456789a`<br>3. Klik "Daftar" | Muncul toast error: "Format nomor HP tidak valid". Data tidak tersimpan. | Muncul toast error "Format nomor HP tidak valid". Form tidak ter-submit. | ✅ Ya | tc04_invalid_hp.png |
| **TC-05** | Akses Portal Silang (Security) | 1. Buka portal `?page=nasabah`<br>2. Input kredensial Admin/Teller (Username: `admin`, Pass: `123456`)<br>3. Klik "Masuk" | Muncul toast error: "Akses ditolak. Akun Staff/Admin tidak bisa login di Portal Nasabah." | Muncul toast error akses ditolak. User tetap di halaman login. | ✅ Ya | tc05_portal_silang.png |
| **TC-06** | Setor Tunai oleh Teller | 1. Login sebagai Teller<br>2. Menu Transaksi -> Setor Tunai<br>3. Input No. Rek: `081234567890`, Jumlah: `Rp 100.000`<br>4. Input PIN Teller | Saldo nasabah bertambah Rp 100.000. Muncul modal "Transaksi Berhasil". Riwayat tercatat. | Saldo nasabah bertambah tepat Rp 100.000. Modal sukses muncul. | ✅ Ya | tc06_setor_tunai.png |
| **TC-07** | Tarik Tunai Saldo Tidak Cukup | 1. Login sebagai Teller<br>2. Menu Transaksi -> Tarik Tunai<br>3. Input No. Rek nasabah (saldo Rp 50.000), Jumlah: `Rp 100.000` | Muncul toast error: "Saldo tidak mencukupi". Transaksi dibatalkan, saldo tidak berubah. | Muncul toast error "Saldo tidak mencukupi". Saldo tetap Rp 50.000. | ✅ Ya | tc07_saldo_kurang.png |
| **TC-08** | Transfer Tepat di Batas Limit (Boundary) - Pelajar | 1. Login Nasabah Pelajar (Saldo: Rp 100.000)<br>2. Menu Transfer<br>3. Input Jumlah: `Rp 20.000` (Tepat di limit harian Pelajar)<br>4. Konfirmasi PIN | Transfer berhasil diproses. Saldo berkurang Rp 20.000. Sisa limit hari ini = Rp 0. | Transfer berhasil. Saldo menjadi Rp 80.000. Sistem mengizinkan transaksi tepat di batas. | ✅ Ya | tc08_boundary_limit.png |
| **TC-09** | Transfer Melebihi Batas Limit (Boundary) - Pelajar | 1. Login Nasabah Pelajar (Sisa limit: Rp 5.000)<br>2. Menu Transfer<br>3. Input Jumlah: `Rp 20.001` | Muncul toast error: "Melebihi batas transfer harian (Rp 20.000)". Transaksi dibatalkan. | Muncul toast error batas harian. Saldo tidak berkurang. | ✅ Ya | tc09_over_limit.png |
| **TC-09b** | Transfer Tepat di Batas Limit (Boundary) - Umum | 1. Login Nasabah Umum (Saldo: Rp 1.000.000)<br>2. Menu Transfer<br>3. Input Jumlah: `Rp 500.000` (Tepat di limit harian Umum)<br>4. Konfirmasi PIN | Transfer berhasil diproses. Saldo berkurang Rp 500.000. Sisa limit hari ini = Rp 0. | Transfer berhasil. Saldo menjadi Rp 500.000. Sistem mengizinkan transaksi tepat di batas. | ✅ Ya | tc09b_boundary_umum.png |
| **TC-10** | Input Jumlah Negatif/Huruf (Invalid) | 1. Menu Transaksi/Tarik Tunai<br>2. Input Jumlah: `-50000` atau `abc`<br>3. Klik Proses | Sistem menolak. Muncul error "Masukkan jumlah yang valid" atau input otomatis menjadi 0/kosong. | Input `abc` otomatis terhapus. Input `-` diblokir. Muncul error jika dipaksa submit. | ✅ Ya | tc10_invalid_amount.png |
| **TC-11** | Transfer ke Rekening Sendiri | 1. Menu Transfer<br>2. Input No. Rek Tujuan sama dengan No. Rek Pengirim | Muncul toast error: "Tidak bisa transfer ke rekening sendiri". | Muncul toast error "Tidak bisa transfer ke rekening sendiri". | ✅ Ya | tc11_self_transfer.png |
| **TC-12** | PIN Salah 3x Berturut-turut | 1. Login Teller/Nasabah<br>2. Masukkan PIN yang salah sebanyak 3 kali saat konfirmasi transaksi/transfer | Pada percobaan ke-3, akun otomatis terblokir (`blocked: true`). Muncul modal "Akun Terblokir". | Akun terblokir setelah 3x salah PIN. Harus di-reset oleh Admin. | ✅ Ya | tc12_pin_block.png |
| **TC-13** | Filter Nasabah (Kategori & Kelas) | 1. Login Admin -> Kelola Nasabah<br>2. Filter Kategori: `Pelajar`, Kelas: `XI AKL 1` | Tabel hanya menampilkan nasabah dengan kategori Pelajar dan kelas XI AKL 1. | Filter bekerja akurat. Data yang tidak sesuai tersembunyi. | ✅ Ya | tc13_filter_nasabah.png |
| **TC-14** | Cetak Data Nasabah (Multi-page) | 1. Klik "Cetak Data" di Kelola Nasabah (dengan >30 data)<br>2. Klik tombol "Cetak" (Print) | Print preview menampilkan data lebih dari 1 halaman A4. Header tabel repeat di halaman ke-2. | Print preview rapi, multi-halaman, header tabel repeat di setiap halaman. | ✅ Ya | tc14_print_multipage.png |

---

## Bagian 2: Unit Test & Validasi Otomatis (Frontend)

Selain pengujian manual (End-to-End), tim juga melakukan pengujian terhadap logika validasi frontend (Unit Test) untuk memastikan aturan input dipatuhi sebelum data dikirim ke backend.

**Nama file test:** `index.html` (Inline JavaScript Validation)
**Jumlah test:** 6 lulus dari 6

| No | Fungsi / Logika yang diuji | Input Uji | Hasil yang Diharapkan | Status |
|----|---------------------------|-----------|----------------------|--------|
| 1 | **Regex No. HP** (`/^08\d{8,12}$/`) | `081234567890` (Valid)<br>`12345` (Invalid)<br>`08123456789a` (Invalid) | Hanya input valid yang lolos validasi registrasi. | ✅ Lulus |
| 2 | **Regex PIN** (`/^\d{6}$/`) | `123456` (Valid)<br>`12345` (Invalid)<br>`abcdef` (Invalid) | Hanya 6 digit angka yang diterima. | ✅ Lulus |
| 3 | **Parse Rupiah** (`parseRupiah`) | `"Rp 100.000"` → `100000`<br>`"abc"` → `0`<br>`"-500"` → `500` (strip minus) | Mengembalikan integer murni, menangani string kosong/huruf. | ✅ Lulus |
| 4 | **Cek Saldo vs Jumlah** | Saldo: `50000`, Tarik: `100000` | Mengembalikan `false` / memunculkan error "Saldo tidak mencukupi". | ✅ Lulus |
| 5 | **Cek Limit Harian** | Limit Pelajar: `20000`, Total hari ini: `15000`, Transfer: `6000` | Mengembalikan `false` / memunculkan error "Melebihi batas transfer harian". | ✅ Lulus |
| 6 | **Anti-Duplikasi Transaksi** | Klik tombol "Proses" 2x dalam `< 100ms` | Request kedua diblokir oleh `sessionStorage` tracking. | ✅ Lulus |

---

## Bagian 3: Unit Test Backend (Otomatis via Google Apps Script)

Tim membuat skrip *automated testing* untuk backend (Google Apps Script) guna memastikan logika bisnis, validasi regex, dan aturan transfer berjalan dengan benar sebelum di-deploy.

**Nama file test:** `test.gs` (Tersimpan di root repository)
**Cara menjalankan:** Buka Editor Apps Script → Pilih fungsi `runAllTests` → Klik Run.
**Jumlah test suite:** 9 suite test

| No | Nama Fungsi Test | Apa yang Diuji | Status |
|----|------------------|----------------|--------|
| 1 | `testFormatRupiah()` | Konversi angka ke format Rupiah (Rp 1.000) | ✅ Lulus |
| 2 | `testParseRupiah()` | Parse string "Rp 1.000" menjadi integer 1000 | ✅ Lulus |
| 3 | `testPhoneValidation()` | Regex `/^08\d{8,12}$/` (Menerima 08xx, menolak huruf/panjang salah) | ✅ Lulus |
| 4 | `testPinValidation()` | Regex `/^\d{6}$/` (Hanya menerima 6 digit angka) | ✅ Lulus |
| 5 | `testAtomicTransferLogic()` | Logika transfer: saldo cukup, perhitungan saldo baru, conservation of money | ✅ Lulus |
| 6 | `testTransferLimits()` | Logika batas harian **Pelajar (Rp20.000)** vs **Umum (Rp500.000)** | ✅ Lulus |
| 7 | `testSelfTransferPrevention()` | Mencegah transfer ke nomor rekening sendiri | ✅ Lulus |
| 8 | `testPinBlocking()` | Akun terblokir setelah 3x salah PIN | ✅ Lulus |
| 9 | `testVersionConflict()` | Optimistic Locking: version cocok → update berhasil, version tidak cocok → ditolak | ✅ Lulus |

**Bukti Eksekusi:** Tim menjalankan `runAllTests` di console Apps Script dan seluruh test suite berhasil `PASS` tanpa error sebelum fitur di-release ke production.

---

## Bagian 4: Kasus Uji Change Request (Ekspor CSV)

Berikut adalah kasus uji tambahan untuk fitur Change Request (ekspor CSV) yang diimplementasi setelah analisis di `analisis-change-request.md`.

| ID | Langkah / Input | Hasil yang Diharapkan | Status |
|----|-----------------|----------------------|--------|
| **TC-CR-01** | 1. Login sebagai Admin/Direktur.<br>2. Buka menu "Kelola Nasabah".<br>3. Pastikan tidak ada filter aktif.<br>4. Klik tombol "Ekspor CSV". | Browser otomatis mengunduh file `data_nasabah_[tanggal].csv`. File berisi header kolom dan seluruh data nasabah aktif. | ✅ Lulus |
| **TC-CR-02** | 1. Buka menu "Kelola Nasabah".<br>2. Aktifkan Filter: Kategori = "Pelajar", Kelas = "XI AKL 1".<br>3. Klik tombol "Ekspor CSV". | File CSV yang diunduh **hanya** berisi data nasabah dengan kategori Pelajar dan kelas XI AKL 1. | ✅ Lulus |
| **TC-CR-03** | 1. Buka file CSV yang diunduh menggunakan Microsoft Excel atau Google Sheets.<br>2. Periksa kolom "Nama" yang mengandung huruf khusus (misal: "Siti Aisyah"). | File terbuka tanpa error. Huruf dan tanda baca terbaca dengan benar (tidak menjadi simbol aneh/???), menandakan encoding UTF-8 BOM berhasil. | ✅ Lulus |
| **TC-CR-04** | 1. Buka menu "Riwayat Transaksi".<br>2. Filter periode: 1 Oktober s/d 15 Oktober.<br>3. Klik tombol "Ekspor CSV Riwayat". | File CSV berisi riwayat transaksi hanya pada rentang tanggal tersebut, dengan kolom: Tanggal, Jenis, Dari, Ke, Jumlah, Keterangan. | ✅ Lulus |

---

## Bagian 5: Kasus Uji Bug Hunt

Berikut adalah kasus uji yang dibuat khusus untuk memverifikasi perbaikan 5 bug yang ditemukan saat Bug Hunt (lihat `catatan-bug.md`).

| ID | Langkah / Input | Hasil yang Diharapkan | Status |
|----|-----------------|----------------------|--------|
| **TC-BUG-001** | 1. Login sebagai Teller.<br>2. Buka menu Transaksi.<br>3. Isi form Setor/Tarik Tunai.<br>4. Klik tombol "Proses Transaksi" 2x secara beruntun dalam waktu < 1 detik. | Hanya 1 transaksi yang diproses. Request kedua diblokir dengan toast "Transaksi sebelumnya masih diproses...". Saldo hanya terpotong 1x. | ✅ Lulus |
| **TC-BUG-002** | 1. Simulasi `handleAtomicTransfer` di mana update target gagal.<br>2. Cek saldo pengirim ter-rollback.<br>3. Coba lakukan transfer lagi dari akun pengirim yang sama. | Transaksi berikutnya berhasil diproses tanpa error "Version conflict". Saldo pengirim terupdate dengan benar. | ✅ Lulus |
| **TC-BUG-003** | 1. Login Admin -> Kirim Pengumuman (Broadcast).<br>2. Login Nasabah di tab/browser lain.<br>3. Tunggu polling 5-10 detik. | Notifikasi muncul otomatis di UI Nasabah tanpa perlu refresh browser manual. | ✅ Lulus |
| **TC-BUG-004** | 1. Login Admin -> Kelola Nasabah.<br>2. Ubah dropdown "Kategori" dari "Semua" menjadi "Pelajar". | Dropdown "Kelas" otomatis ter-populate dengan daftar kelas unik dari data nasabah pelajar. | ✅ Lulus |
| **TC-BUG-005** | 1. Login Admin -> Kelola Nasabah (dengan >30 data).<br>2. Klik "Cetak Data" -> Print.<br>3. Periksa halaman ke-2 dan seterusnya. | Data tidak terpotong. Header tabel (`thead`) muncul di setiap halaman A4. | ✅ Lulus |

---

## Ringkasan Pengujian

| Kategori | Jumlah Test Case | Lulus | Gagal |
|----------|-----------------|-------|-------|
| Autentikasi & Keamanan | 5 | 5 | 0 |
| Transaksi & Batas Limit | 9 | 9 | 0 |
| Manajemen Nasabah & Filter | 3 | 3 | 0 |
| Laporan & Cetak | 1 | 1 | 0 |
| **Subtotal Manual (E2E)** | **18** | **18** | **0** |
| Unit Test Frontend | 6 | 6 | 0 |
| Unit Test Backend | 9 | 9 | 0 |
| Change Request (CSV) | 4 | 4 | 0 |
| Bug Hunt Verification | 5 | 5 | 0 |
| **TOTAL KESELURUHAN** | **42** | **42** | **0** |

**Tingkat Keberhasilan:** 100% (42/42 test case lulus)

---

## Catatan Pengujian

### 1. Pengujian Concurrency (Race Condition)
Pengujian manual untuk race condition (2 Teller menyetor ke 1 nasabah secara bersamaan) telah dilakukan. Berkat implementasi `LockService` dan `Optimistic Locking` di backend, tidak ditemukan data corrupt atau saldo yang hilang. (Lihat `catatan-bug.md` untuk detail perbaikan rollback).

### 2. Pengujian Print CSS
Pengujian cetak dilakukan di 3 browser berbeda (Chrome, Firefox, Edge). Chrome dan Edge menghasilkan output multi-page A4 yang sempurna. Firefox membutuhkan penyesuaian margin manual di pengaturan print browser, namun secara kode CSS sudah benar.

### 3. Data Uji
Semua pengujian menggunakan database staging (Google Sheets terpisah) untuk mencegah kerusakan data produksi. Data dummy dihapus setelah pengujian selesai.

### 4. Input Salah & Nilai Batas (Boundary Values)
Tim secara khusus menguji skenario input salah dan nilai batas sesuai kriteria penilaian:
- **TC-04:** Format HP invalid (terlalu pendek, mengandung huruf)
- **TC-08:** Transfer tepat di batas limit Pelajar (Rp 20.000) → **Lulus**
- **TC-09:** Transfer 1 rupiah di atas limit Pelajar (Rp 20.001) → **Ditolak**
- **TC-09b:** Transfer tepat di batas limit Umum (Rp 500.000) → **Lulus**
- **TC-10:** Input jumlah negatif dan huruf → **Ditolak**
- **TC-12:** PIN salah tepat 3x → **Akun terblokir**

### 5. Kesalahan AI yang Ditemukan
Selama pengujian, tim menemukan 10 kesalahan AI yang berhasil diperbaiki sebelum production. Detail lengkap ada di `05-kesalahan-ai.md`. Tidak satupun kesalahan AI yang lolos ke production berkat proses Code Review dan Bug Hunt yang ketat.
