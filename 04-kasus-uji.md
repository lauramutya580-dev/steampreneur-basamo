# 🧪 04 - Kasus Uji (Test Cases)

**Nama Proyek:** BSS - Bank Syariah Sekolah (BASAMO)
**Tanggal Pengujian:** 12 - 14 Oktober 2026
**Penguji:** Isra Julian Sari (QA Tester)
**Lingkungan Uji:** Google Chrome (Desktop & Mobile View), Google Apps Script Web App

---

## 📋 Tabel Kasus Uji

**Keterangan Kolom:**
* **Bagian A (Hasil yang diharapkan):** Dihitung/ditentukan secara manual oleh tim berdasarkan aturan bisnis sebelum pengujian.
* **Bagian B (Hasil sebenarnya & Lulus?):** Diisi setelah aplikasi diuji secara langsung.

| ID | Kriteria yang diuji | Langkah / input | Hasil yang diharapkan (Bagian A) | Hasil sebenarnya (Bagian B) | Lulus? | Bukti (nama file tangkapan layar) |
|:--:|---------------------|-----------------|----------------------------------|-----------------------------|:------:|-----------------------------------|
| **TC-01** | Login Nasabah Valid | 1. Buka portal `?page=nasabah`<br>2. Input No. HP: `081234567890`<br>3. Input Password: `123456`<br>4. Klik "Masuk" | Berhasil login, redirect ke Dashboard Nasabah, menampilkan saldo dan nama user. | Berhasil login, dashboard muncul dengan saldo Rp 0. | ✅ Ya | `tc01_login_valid.png` |
| **TC-02** | Login dengan Password Salah | 1. Buka portal `?page=nasabah`<br>2. Input No. HP: `081234567890`<br>3. Input Password: `salah123`<br>4. Klik "Masuk" | Muncul toast error: "Username atau password salah". Tidak ada akses ke dashboard. | Muncul toast error merah "Username atau password salah". | ✅ Ya | `tc02_login_salah.png` |
| **TC-03** | Registrasi Nasabah (Valid) | 1. Klik "Daftar sebagai Nasabah"<br>2. Isi Nama, HP (`089876543210`), Kategori: Pelajar, Kelas: `XI AKL 1`, Password, PIN.<br>3. Klik "Daftar" | Muncul modal sukses "Pendaftaran Berhasil". Status akun di database menjadi `pending`. | Modal sukses muncul. Data tercatat di sheet `users` dengan status `pending`. | ✅ Ya | `tc03_registrasi.png` |
| **TC-04** | **Registrasi Format HP Salah (Input Invalid)** | 1. Buka form registrasi<br>2. Input No. HP: `12345` atau `08123456789a`<br>3. Klik "Daftar" | Muncul toast error: "Format nomor HP tidak valid". Data tidak tersimpan. | Muncul toast error "Format nomor HP tidak valid". Form tidak ter-submit. | ✅ Ya | `tc04_invalid_hp.png` |
| **TC-05** | Akses Portal Silang (Security) | 1. Buka portal `?page=nasabah`<br>2. Input kredensial Admin/Teller (Username: `admin`, Pass: `123456`)<br>3. Klik "Masuk" | Muncul toast error: "Akses ditolak. Akun Staff/Admin tidak bisa login di Portal Nasabah." | Muncul toast error akses ditolak. User tetap di halaman login. | ✅ Ya | `tc05_portal_silang.png` |
| **TC-06** | Setor Tunai oleh Teller | 1. Login sebagai Teller<br>2. Menu Transaksi -> Setor Tunai<br>3. Input No. Rek: `081234567890`, Jumlah: `Rp 100.000`<br>4. Input PIN Teller | Saldo nasabah bertambah Rp 100.000. Muncul modal "Transaksi Berhasil". Riwayat tercatat. | Saldo nasabah bertambah tepat Rp 100.000. Modal sukses muncul. | ✅ Ya | `tc06_setor_tunai.png` |
| **TC-07** | Tarik Tunai Saldo Tidak Cukup | 1. Login sebagai Teller<br>2. Menu Transaksi -> Tarik Tunai<br>3. Input No. Rek nasabah (saldo Rp 50.000), Jumlah: `Rp 100.000` | Muncul toast error: "Saldo tidak mencukupi". Transaksi dibatalkan, saldo tidak berubah. | Muncul toast error "Saldo tidak mencukupi". Saldo tetap Rp 50.000. | ✅ Ya | `tc07_saldo_kurang.png` |
| **TC-08** | **Transfer Tepat di Batas Limit (Boundary)** | 1. Login Nasabah Pelajar (Saldo: Rp 1.000.000)<br>2. Menu Transfer<br>3. Input Jumlah: `Rp 500.000` (Tepat di limit harian)<br>4. Konfirmasi PIN | Transfer berhasil diproses. Saldo berkurang Rp 500.000. Sisa limit hari ini = Rp 0. | Transfer berhasil. Saldo menjadi Rp 500.000. Sistem mengizinkan transaksi tepat di batas. | ✅ Ya | `tc08_boundary_limit.png` |
| **TC-09** | Transfer Melebihi Batas Limit | 1. Login Nasabah Pelajar (Sisa limit: Rp 100.000)<br>2. Menu Transfer<br>3. Input Jumlah: `Rp 100.001` | Muncul toast error: "Melebihi batas transfer harian (Rp 500.000)". Transaksi dibatalkan. | Muncul toast error batas harian. Saldo tidak berkurang. | ✅ Ya | `tc09_over_limit.png` |
| **TC-10** | **Input Jumlah Negatif/Huruf (Invalid)** | 1. Menu Transaksi/Tarik Tunai<br>2. Input Jumlah: `-50000` atau `abc`<br>3. Klik Proses | Sistem menolak. Muncul error "Masukkan jumlah yang valid" atau input otomatis menjadi 0/kosong. | Input `abc` otomatis terhapus. Input `-` diblokir. Muncul error jika dipaksa submit. | ✅ Ya | `tc10_invalid_amount.png` |
| **TC-11** | Transfer ke Rekening Sendiri | 1. Menu Transfer<br>2. Input No. Rek Tujuan sama dengan No. Rek Pengirim | Muncul toast error: "Tidak bisa transfer ke rekening sendiri". | Muncul toast error "Tidak bisa transfer ke rekening sendiri". | ✅ Ya | `tc11_self_transfer.png` |
| **TC-12** | PIN Salah 3x Berturut-turut | 1. Login Teller/Nasabah<br>2. Masukkan PIN yang salah sebanyak 3 kali saat konfirmasi transaksi/transfer | Pada percobaan ke-3, akun otomatis terblokir (`blocked: true`). Muncul modal "Akun Terblokir". | Akun terblokir setelah 3x salah PIN. Harus di-reset oleh Admin. | ✅ Ya | `tc12_pin_block.png` |
| **TC-13** | Filter Nasabah (Kategori & Kelas) | 1. Login Admin -> Kelola Nasabah<br>2. Filter Kategori: `Pelajar`, Kelas: `XI AKL 1` | Tabel hanya menampilkan nasabah dengan kategori Pelajar dan kelas XI AKL 1. | Filter bekerja akurat. Data yang tidak sesuai tersembunyi. | ✅ Ya | `tc13_filter_nasabah.png` |
| **TC-14** | Cetak Data Nasabah (Multi-page) | 1. Klik "Cetak Data" di Kelola Nasabah (dengan >30 data)<br>2. Klik tombol "Cetak" (Print) | Print preview menampilkan data lebih dari 1 halaman A4. Header tabel repeat di halaman ke-2. | Print preview rapi, multi-halaman, header tabel repeat di setiap halaman. | ✅ Ya | `tc14_print_multipage.png` |

---

##  Unit Test & Validasi Otomatis (Frontend)

Selain pengujian manual (End-to-End), tim juga melakukan pengujian terhadap logika validasi *frontend* (Unit Test) untuk memastikan aturan input dipatuhi sebelum data dikirim ke *backend*.

**Nama file test:** `index.html` (Inline JavaScript Validation)
**Jumlah test:** 6 lulus dari 6

| No | Fungsi / Logika yang diuji | Input Uji | Hasil yang Diharapkan | Status |
|:--:|----------------------------|-----------|-----------------------|:------:|
| 1 | **Regex No. HP** (`/^08\d{8,12}$/`) | `081234567890` (Valid)<br>`12345` (Invalid)<br>`08123456789a` (Invalid) | Hanya input valid yang lolos validasi registrasi. | ✅ Lulus |
| 2 | **Regex PIN** (`/^\d{6}$/`) | `123456` (Valid)<br>`12345` (Invalid)<br>`abcdef` (Invalid) | Hanya 6 digit angka yang diterima. | ✅ Lulus |
| 3 | **Parse Rupiah** (`parseRupiah`) | `"Rp 100.000"` -> `100000`<br>`"abc"` -> `0`<br>`"-500"` -> `500` (strip minus) | Mengembalikan integer murni, menangani string kosong/huruf. | ✅ Lulus |
| 4 | **Cek Saldo vs Jumlah** | Saldo: `50000`, Tarik: `100000` | Mengembalikan `false` / memunculkan error "Saldo tidak mencukupi". | ✅ Lulus |
| 5 | **Cek Limit Harian** | Limit: `500000`, Total hari ini: `400000`, Transfer: `100001` | Mengembalikan `false` / memunculkan error "Melebihi batas transfer harian". | ✅ Lulus |
| 6 | **Anti-Duplikasi Transaksi** | Klik tombol "Proses" 2x dalam < 100ms | Request kedua diblokir oleh `sessionStorage` tracking. | ✅ Lulus |

---

## 📝 Catatan Pengujian

1. **Pengujian Concurrency (Race Condition):** 
   Pengujian manual untuk *race condition* (2 Teller menyetor ke 1 nasabah secara bersamaan) telah dilakukan. Berkat implementasi `LockService` dan `Optimistic Locking` di backend, tidak ditemukan data *corrupt* atau saldo yang hilang. (Lihat `catatan-bug.md` untuk detail perbaikan *rollback*).
2. **Pengujian Print CSS:** 
   Pengujian cetak dilakukan di 3 browser berbeda (Chrome, Firefox, Edge). Chrome dan Edge menghasilkan output multi-page A4 yang sempurna. Firefox membutuhkan penyesuaian margin manual di pengaturan print browser, namun secara kode CSS sudah benar.
3. **Data Uji:** 
   Semua pengujian menggunakan database *staging* (Google Sheets terpisah) untuk mencegah kerusakan data produksi. Data dummy dihapus setelah pengujian selesai.
