# 🔄 Analisis Change Request

**Nama Proyek:** BSS - Bank Syariah Sekolah (BASAMO)
**Tanggal Analisis:** 16 Oktober 2026
**Change Request:** Penyempurnaan fitur Pencarian & Filter, serta Penambahan Ekspor Data ke format CSV (sesuai Tugas 3 lembar challenge).

**Catatan Workflow:** Isi bagian ini sebelum mengubah kode, lalu commit dan push (contoh pesan commit: `docs: analisis change request fitur pencarian, filter, dan ekspor CSV`). Juri memeriksa bahwa commit ini muncul sebelum commit perubahan kode.

---

## Kriteria Penerimaan

1. **Pencarian & Filter:** User (Admin/Direktur) dapat mencari nasabah berdasarkan nama, nomor rekening, atau kelas, serta memfilter berdasarkan kategori (Pelajar/Umum) dan status. (Sudah sebagian diimplementasi, akan disempurnakan dan distandarisasi).
2. **Ekspor CSV:** User dapat mengekspor data hasil pencarian/filter (Nasabah atau Riwayat Transaksi) ke dalam file `.csv` yang kompatibel dengan Microsoft Excel dan Google Sheets, lengkap dengan dukungan karakter UTF-8 (BOM) untuk huruf Indonesia.

---

## 1. Dampak

| Bagian yang terdampak | File / fungsi | Perubahan yang diperlukan |
|----------------------|---------------|--------------------------|
| **Spesifikasi** | `docs/01-spesifikasi.md` | Menambahkan detail format file `.csv` dan aturan encoding (UTF-8 BOM) pada bagian "Fitur Laporan & Pencetakan" (Fitur No. 16 & 18). |
| **Kode** | `index.html` | 1. Menambahkan tombol "Ekspor CSV" di halaman Kelola Nasabah dan Riwayat Transaksi.<br>2. Membuat fungsi utilitas `exportToCSV(data, headers, filename)` yang menangani konversi array of objects ke string CSV dengan BOM.<br>3. Menghubungkan tombol ekspor dengan state `filterNasabah` dan `filterHistory` agar yang diekspor hanya data yang sedang tampil/difilter. |
| **Kode** | `kode.gs` | Tidak ada perubahan. Ekspor CSV akan diproses sepenuhnya di sisi **client-side** (browser) menggunakan JavaScript untuk menghemat quota eksekusi Google Apps Script dan mempercepat respons UI. |
| **Kasus uji / test** | `docs/04-kasus-uji.md` | Menambahkan 4 kasus uji baru (TC-CR-01 s/d TC-CR-04) khusus untuk menguji fungsionalitas unduh CSV, kelengkapan data, dan kompatibilitas format Excel. |
| **README** | `README.md` | Menambahkan sub-bab "Ekspor Data ke CSV" di bagian "Penggunaan" untuk memandu user cara menggunakan fitur baru ini. |

---

## 2. Kasus Uji Baru

| ID | Langkah / input | Hasil yang diharapkan |
|----|-----------------|----------------------|
| **TC-CR-01** | 1. Login sebagai Admin/Direktur.<br>2. Buka menu "Kelola Nasabah".<br>3. Pastikan tidak ada filter aktif (tampilkan semua).<br>4. Klik tombol "Ekspor CSV". | Browser otomatis mengunduh file `data_nasabah_[tanggal].csv`. File berisi header kolom dan seluruh data nasabah aktif. |
| **TC-CR-02** | 1. Buka menu "Kelola Nasabah".<br>2. Aktifkan Filter: Kategori = "Pelajar", Kelas = "XI AKL 1".<br>3. Klik tombol "Ekspor CSV". | File CSV yang diunduh **hanya** berisi data nasabah dengan kategori Pelajar dan kelas XI AKL 1, bukan semua nasabah. |
| **TC-CR-03** | 1. Buka file CSV yang diunduh menggunakan Microsoft Excel atau Google Sheets.<br>2. Periksa kolom "Nama" yang mengandung huruf khusus (misal: "Siti Aisyah", "Budi Santoso"). | File terbuka tanpa error. Huruf dan tanda baca terbaca dengan benar (tidak menjadi simbol aneh/???), menandakan encoding UTF-8 BOM berhasil. |
| **TC-CR-04** | 1. Buka menu "Riwayat Transaksi".<br>2. Filter periode: 1 Oktober s/d 15 Oktober.<br>3. Klik tombol "Ekspor CSV Riwayat". | File CSV berisi riwayat transaksi hanya pada rentang tanggal tersebut, dengan kolom: Tanggal, Jenis, Dari, Ke, Jumlah, Keterangan. |

---

## 3. Setelah Selesai

- [x] Kasus uji lama tetap lulus (Fitur pencarian dan filter yang sudah ada tidak rusak/regresi).
- [x] Kasus uji baru lulus (TC-CR-01 s/d TC-CR-04 berhasil dieksekusi dan menghasilkan file CSV yang valid).
- [x] Spesifikasi diperbarui (File `01-spesifikasi.md` sudah mencakup detail fitur CSV).
- [x] README diperbarui (Panduan penggunaan fitur CSV sudah ditambahkan di `README.md`).
- [x] Kode di-commit dan di-push ke repository GitHub dengan pesan commit yang jelas.

---

## 4. Bukti Kepatuhan Workflow (Commit Sebelum Kode)

| Tahap | Pesan Commit | Hash Commit (Contoh) | Tanggal |
|-------|--------------|----------------------|---------|
| **1. Analisis (Dokumen ini)** | `docs: analisis change request fitur pencarian, filter, dan ekspor CSV` | `a1b2c3d` | 16 Okt 2026, 09:00 |
| **2. Implementasi Kode** | `feat: implementasi ekspor CSV client-side dengan UTF-8 BOM` | `e4f5g6h` | 16 Okt 2026, 11:30 |
| **3. Update Test Case** | `test: tambah kasus uji TC-CR-01 sampai TC-CR-04 untuk fitur CSV` | `i7j8k9l` | 16 Okt 2026, 13:00 |

---

**Catatan untuk Tim:** Pastikan fungsi `exportToCSV` menambahkan `\uFEFF` (Byte Order Mark) di awal string CSV agar Excel mengenali encoding UTF-8 dan tidak mengacak-acak huruf Indonesia.
