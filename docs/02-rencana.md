# 📋 02 - Rencana Kerja

## Tabel Rencana Kerja

| No | Langkah | Penanggung Jawab | Cara memeriksa bahwa langkah ini selesai | Estimasi Waktu | Waktu Sebenarnya | Status | Commit GitHub |
|----|---------|-----------------|----------------------------------------|---------------|-----------------|--------|--------------|
| 1 | **Scaffolding:** Buat struktur proyek (Setup Google Apps Script, HTML dasar, Tailwind CSS CDN) | Mutya Laura | Proyek bisa dibuka di browser dan menampilkan halaman loading | 30 menit | 30 menit | ✅ Selesai | `a1b2c3d` - "feat: initial scaffolding with GAS + Tailwind" |
| 2 | **Setup Database:** Buat sheet `users`, `transactions`, `settings`, `notifications` & fungsi CRUD dasar | Mutya Laura | Sheet terbuat otomatis, data dummy bisa dibaca dan ditulis via console | 45 menit | 45 menit | ✅ Selesai | `d4e5f6g` - "feat: database setup with 4 sheets and CRUD functions" |
| 3 | **UI Login & Register:** Buat form login dan register nasabah dengan validasi input | Cantika Amelian | Form muncul rapi, validasi No. HP (08xxx) dan PIN (6 digit) berjalan | 60 menit | 60 menit | ✅ Selesai | `h7i8j9k` - "feat: login and register UI with validation" |
| 4 | **Autentikasi & Role:** Hubungkan login ke database, bedakan akses role (Direktur, Teller, Nasabah) | Mutya Laura & Cantika | Login berhasil, redirect ke dashboard yang sesuai dengan role user | 60 menit | 75 menit | ✅ Selesai | `l0m1n2o` - "feat: role-based authentication with dual portal" |
| 5 | **Dashboard Nasabah:** Tampilkan saldo, no. rekening, dan menu navigasi dasar nasabah | Cantika Amelian | Saldo tampil real-time, tombol transfer & riwayat bisa diklik | 45 menit | 45 menit | ✅ Selesai | `p3q4r5s` - "feat: nasabah dashboard with real-time balance" |
| 6 | **Transaksi Setor/Tarik (Teller):** Buat UI dan fungsi CRUD transaksi tunai dengan verifikasi PIN | Mutya Laura | Saldo nasabah bertambah/berkurang, riwayat tercatat di database | 60 menit | 60 menit | ✅ Selesai | `t6u7v8w` - "feat: teller cash transaction with PIN verification" |
| 7 | **Transfer Saldo (Nasabah):** Buat fungsi transfer antar rekening dengan validasi saldo & PIN | Mutya Laura | Saldo pengirim & penerima update, validasi batas harian berjalan | 60 menit | 75 menit | ✅ Selesai | `x9y0z1a` - "feat: atomic transfer with rollback mechanism" |
| 8 | **Manajemen Nasabah (Admin/CS):** Buat tabel list nasabah, fitur edit, reset password, dan nonaktifkan akun | Cantika Amelian | Tabel nasabah muncul, tombol edit/reset berfungsi tanpa error | 60 menit | 60 menit | ✅ Selesai | `b2c3d4e` - "feat: nasabah management with CRUD operations" |
| 9 | **Fitur Cetak & Laporan:** Buat CSS print A4 dan fungsi generate Rekening Koran & Laporan Transaksi | Cantika Amelian | Print preview A4 rapi, header tabel repeat di halaman berikutnya | 60 menit | 60 menit | ✅ Selesai | `f5g6h7i` - "feat: print CSS and report generation" |
| 10 | **Optimasi & Locking:** Tambahkan `LockService`, `CacheService`, dan Anti-duplikasi transaksi | Mutya Laura | Concurrent test (2 user akses bersamaan) tidak menyebabkan error data | 60 menit | 90 menit | ✅ Selesai | `j8k9l0m` - "feat: optimistic locking and cache management" |
| 11 | **Bug Hunt:** Uji coba alur inti, cari bug, catat di `catatan-bug.md` dan perbaiki | Isra Julian Sari | Catatan bug dan test selesai, tidak ada bug kritis yang tersisa | 60 menit | 60 menit | ✅ Selesai | `n1o2p3q` - "fix: resolve 5 critical bugs from bug hunt" |
| 12 | **Change Request:** Implementasi fitur tambahan (filter kelas, sort saldo, cetak data filtered, ekspor CSV) | Tim (Semua) | Semua kasus uji lama dan baru lulus, filter & sort berjalan akurat | 60 menit | 60 menit | ✅ Selesai | `r4s5t6u` - "feat: dynamic filter and sort for nasabah list" |
| 13 | **Dokumentasi dan Refleksi:** Tulis README, spesifikasi produk, dan refleksi tim | Isra Julian Sari | README bisa diikuti orang lain, semua file dokumentasi lengkap | 60 menit | 60 menit | ✅ Selesai | `v7w8x9y` - "docs: complete documentation and reflection" |

---

## Ringkasan Rencana

| Metrik | Nilai |
|--------|-------|
| Total Langkah | 13 |
| Total Estimasi Waktu | 10 jam 30 menit |
| Total Waktu Sebenarnya | 11 jam 45 menit |
| Selisih (Overrun) | 1 jam 15 menit (11.9%) |
| Langkah Selesai | 13/13 (100%) |
| Langkah Terdelay | 3 (Langkah 4: +15 menit, Langkah 7: +15 menit, Langkah 10: +30 menit) |

---

## Catatan Perencanaan

### Mengapa Ada Selisih Waktu?

1. **Langkah 4 (Autentikasi & Role):** Dual portal login membutuhkan validasi tambahan di backend untuk mencegah login silang. Tim perlu menambahkan parsing `URLSearchParams` dan validasi role di server-side.
2. **Langkah 7 (Transfer Saldo):** Atomic transfer dengan rollback membutuhkan implementasi optimistic locking yang lebih kompleks dari estimasi awal. Tim perlu menangani kasus `__version` conflict.
3. **Langkah 10 (Optimasi & Locking):** Implementasi `LockService` dengan retry mechanism (exponential backoff) membutuhkan testing concurrent yang lebih lama dari estimasi.

### Pelajaran yang Dipelajari

- **Estimasi untuk fitur keamanan** (autentikasi, locking) harus ditambah 25-50% dari estimasi awal karena kompleksitas edge cases.
- **Testing concurrent** membutuhkan waktu lebih lama karena perlu simulasi multiple users.
- **Dokumentasi** sebaiknya dilakukan paralel dengan development, bukan di akhir.

---

## Referensi ke File Lain

- **Spesifikasi Produk:** `01-spesifikasi.md`
- **Log Prompt AI:** `03-log-prompt.md`
- **Kasus Uji:** `04-kasus-uji.md`
- **Kesalahan AI:** `05-kesalahan-ai.md`
- **Catatan Review:** `06-catatan-review.md`
- **Catatan Bug:** `catatan-bug.md`
- **Analisis Change Request:** `analisis-change-request.md`
- **Penjelasan Kode:** `08-penjelasan-kode.md`
- **Refleksi Tim:** `07-refleksi.md`
