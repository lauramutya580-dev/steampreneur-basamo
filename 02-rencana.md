#  02 - Rencana Kerja

## 📋 Tabel Rencana Kerja

| No | Langkah | Penanggung Jawab | Cara memeriksa bahwa langkah ini selesai | Estimasi Waktu | Waktu Sebenarnya | Status |
|:--:|---------|------------------|------------------------------------------|:--------------:|:----------------:|:------:|
| 1 | **Scaffolding:** Buat struktur proyek (Setup Google Apps Script, HTML dasar, Tailwind CSS CDN) | Mutya Laura | Proyek bisa dibuka di browser dan menampilkan halaman loading | 30 menit | 30 menit | ✅ Selesai |
| 2 | **Setup Database:** Buat sheet `users`, `transactions`, `settings`, `notifications` & fungsi CRUD dasar | Mutya Laura | Sheet terbuat otomatis, data dummy bisa dibaca dan ditulis via console | 45 menit | 45 menit | ✅ Selesai |
| 3 | **UI Login & Register:** Buat form login dan register nasabah dengan validasi input | Cantika Amelian | Form muncul rapi, validasi No. HP (08xxx) dan PIN (6 digit) berjalan | 60 menit | 60 menit | ✅ Selesai |
| 4 | **Autentikasi & Role:** Hubungkan login ke database, bedakan akses role (Direktur, Teller, Nasabah) | Mutya Laura & Cantika | Login berhasil, redirect ke dashboard yang sesuai dengan role user | 60 menit | 75 menit | ✅ Selesai |
| 5 | **Dashboard Nasabah:** Tampilkan saldo, no. rekening, dan menu navigasi dasar nasabah | Cantika Amelian | Saldo tampil real-time, tombol transfer & riwayat bisa diklik | 45 menit | 45 menit | ✅ Selesai |
| 6 | **Transaksi Setor/Tarik (Teller):** Buat UI dan fungsi CRUD transaksi tunai dengan verifikasi PIN | Mutya Laura | Saldo nasabah bertambah/berkurang, riwayat tercatat di database | 60 menit | 60 menit | ✅ Selesai |
| 7 | **Transfer Saldo (Nasabah):** Buat fungsi transfer antar rekening dengan validasi saldo & PIN | Mutya Laura | Saldo pengirim & penerima update, validasi batas harian berjalan | 60 menit | 75 menit | ✅ Selesai |
| 8 | **Manajemen Nasabah (Admin/CS):** Buat tabel list nasabah, fitur edit, reset password, dan nonaktifkan akun | Cantika Amelian | Tabel nasabah muncul, tombol edit/reset berfungsi tanpa error | 60 menit | 60 menit | ✅ Selesai |
| 9 | **Fitur Cetak & Laporan:** Buat CSS print A4 dan fungsi generate Rekening Koran & Laporan Transaksi | Cantika Amelian | Print preview A4 rapi, header tabel repeat di halaman berikutnya | 60 menit | 60 menit | ✅ Selesai |
| 10 | **Optimasi & Locking:** Tambahkan `LockService`, `CacheService`, dan Anti-duplikasi transaksi | Mutya Laura | Concurrent test (2 user akses bersamaan) tidak menyebabkan error data | 60 menit | 90 menit | ✅ Selesai |
| 11 | **Bug Hunt:** Uji coba alur inti, cari bug, catat di `catatan-bug.md` dan perbaiki | Isra Julian Sari | Catatan bug dan test selesai, tidak ada bug kritis yang tersisa | 60 menit | 60 menit | ✅ Selesai |
| 12 | **Change Request:** Implementasi fitur tambahan (filter kelas, sort saldo, cetak data filtered) | Tim (Semua) | Semua kasus uji lama dan baru lulus, filter & sort berjalan akurat | 60 menit | 60 menit | ✅ Selesai |
| 13 | **Dokumentasi dan Refleksi:** Tulis README, spesifikasi produk, dan refleksi tim | Isra Julian Sari | README bisa diikuti orang lain, semua file dokumentasi lengkap | 60 menit | 60 menit | ✅ Selesai |
