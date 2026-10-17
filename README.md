# BSS -Bank Syariah Sekolah (BASAMO)
Sistem perbankan syariah digital berbasis web yang terintegrasi dan cashless, dirancang khusus untuk ekosistem SMKN 2 Kerinci. Aplikasi ini memungkinkan siswa (nasabah) untuk menabung, transfer, dan bertransaksi secara digital, sementara guru, orang tua, dan petugas sekolah dapat memantau serta mengelola keuangan secara real-time tanpa bergantung pada buku tabungan fisik.

---

## Alur Inti

Berikut adalah langkah yang dilakukan pengguna dari awal sampai akhir untuk alur transaksi utama:

1. **Registrasi & Persetujuan**: Siswa membuka portal nasabah, mengisi formulir pendaftaran, dan menunggu persetujuan (status *active*) dari Admin/CS.
2. **Transaksi Digital (Nasabah)**: Nasabah login, melihat saldo real-time, dan melakukan transfer ke rekening teman (misal: untuk uang kas kelompok) dengan verifikasi PIN 6 digit.
3. **Transaksi Tunai (Teller)**: Teller login di portal staff, memilih menu Setor/Tarik Tunai, memverifikasi data nasabah, dan menginput PIN Teller untuk memproses transaksi. Saldo nasabah otomatis terupdate.


## Cara Menjalankan (How to Run)

> **Catatan Penting:** Proyek ini dibangun menggunakan **Google Apps Script (GAS)**, bukan Node.js atau framework frontend tradisional. Oleh karena itu, tidak ada perintah `npm install` atau `npm run dev`. Ikuti langkah berikut:

### Prasyarat

- Akun Google (Gmail) dengan akses ke Google Drive.
- Browser modern (Google Chrome, Microsoft Edge, atau Firefox).
- Akses internet untuk menghubungkan ke Google Sheets database.

### Langkah

1. Buka alamat berikut di browser :
   https://docs.google.com/spreadsheets/d/1-N1rKBcoqM-0qBXTkVV2uZGVY5xNOy2DkxOxv32zVKM/edit?usp=sharing

2. 

### Akun atau data contoh

link. data base spreadsheets:

login untuk data awal, berikut data contoh :

| Peran     | Username      | Password  |
|-----------|---------------|-----------|
| direktur  | direktur      | direktur123 |
| admin     | admin01       | 123456    |
| nasabah   | 082177903994  | 123456    |


## Tangkapan Layar Alur Inti

Minimal satu tangkapan layar untuk setiap langkah alur inti, termasuk hasil change request. Simpan gambar di `docs/bukti/`.

1. Halaman Login Nasabah : https://drive.google.com/file/d/1V_2cNWlY2wDsz8WCUVj4sc-s3FiYnIxw/view?usp=drive_link   
2. Dasboard Nasabah      : https://drive.google.com/file/d/1V0IsnXC8TVpc1QnYbISqCXU_6OphvKpX/view?usp=sharing 

## Fitur

### Keamanan & Autentikasi

- **Locking Mechanism (LockService)**: Menggunakan `LockService.getScriptLock()` dengan timeout dan retry logic (exponential backoff) pada operasi kritis (create, update, delete, transfer) untuk mencegah *race condition* yang dapat menyebabkan korupsi data atau saldo ganda.
- **Optimistic Locking (Version Control)**: Setiap baris data memiliki field `_version`. Sistem memvalidasi `expectedVersion !== currentVersion + 1` saat update; jika tidak cocok, update ditolak dengan pesan "Data mungkin telah diubah" untuk mencegah *overwrite* tidak sengaja.
- **Multi-Role Access Control (RBAC)**: 5 peran berbeda (Direktur, Admin, Teller, CS, Nasabah) dengan hak akses menu yang terpisah dan terkontrol. Setiap fitur (sidebar, tombol cetak, tombol hapus) dirender berdasarkan `currentUser.role`.
- **Dual Portal Login**: URL terpisah untuk Portal Nasabah (`?page=nasabah`) dan Portal Admin/Staff (`?page=admin`) guna mencegah login silang. Sistem memblokir login jika status akun adalah *pending*, *inactive*, atau *blocked*.
- **Validasi PIN 6 Digit & Blokir Otomatis**: Nasabah wajib memasukkan PIN 6 digit yang benar untuk transfer. Akun Teller otomatis diblokir (`blocked: true`) setelah 3x salah memasukkan PIN. Admin dapat mereset PIN ke default `123456` sekaligus membuka blokir akun secara instan.
- **Batas Transfer Harian**: Sistem membatasi jumlah transfer per hari berdasarkan kategori nasabah (Pelajar vs Umum) sesuai pengaturan di menu Settings.
- **Atomic Transaction (Transfer Atomik)**: Proses transfer dirancang secara atomik (`handleAtomicTransfer`) — validasi saldo, kurangi saldo pengirim, tambah saldo penerima. Jika gagal di tengah jalan, sistem melakukan *rollback* agar saldo tidak hilang atau muncul tiba-tiba. Mencegah duplikasi transaksi via `sessionStorage` (*double-click prevention*).
- **Validasi & Sanitasi Input**: Validasi ketat menggunakan Regex untuk Nomor HP (`/^08\d{8,12}$/`) dan PIN 6 digit (`/^\d{6}$/`). Memblokir transfer ke diri sendiri. Pengecekan `sender.balance < amount` dilakukan di sisi backend sebelum transaksi diproses.
- **Manajemen Cache yang Aman (Cache Invalidation)**: Data dibaca dari `CacheService` untuk kecepatan, namun setiap operasi tulis (Create/Update/Delete) memanggil `invalidateCache_()` untuk mencegah *stale data* disajikan ke pengguna.
- **Penyimpanan Kredensial Direktur**: Kredensial login Direktur (`DIRECTOR_USERNAME`, `DIRECTOR_LOGIN_PASSWORD`, `DIRECTOR_DB_PASSWORD`) disimpan di sisi backend (`kode.gs`), bukan di-*hardcode* dalam frontend HTML, sehingga tidak mudah dibaca melalui *Inspect Element* browser.

### Manajemen Nasabah
- **Registrasi Mandiri Nasabah**: Siswa dapat mendaftar sendiri via portal dengan status `pending` hingga disetujui oleh Admin/CS.
- **Kategori Nasabah**: Pemisahan kategori menjadi "Pelajar" (dengan field khusus "Kelas", misal: XI AKL 1) dan "Umum".
- **Filter & Pencarian Lanjutan**: Filter data berdasarkan Status, Kategori, Kelas, pencarian nama/no. rekening, serta pengurutan (*sort*) saldo (tertinggi/terendah) dan nama (A-Z).
- **Pagination Otomatis**: Daftar nasabah dibagi menjadi 10 data per halaman untuk menjaga performa rendering aplikasi.
- **Aktifkan/Nonaktifkan Nasabah**: Admin dapat menonaktifkan akun nasabah bermasalah tanpa harus menghapus data historis transaksinya.

### Transaksi Keuangan
- **Transfer Antar Nasabah (Atomic)**: Transfer dengan validasi PIN dan batas harian berbeda (Pelajar: Rp20.000 / Umum: Rp500.000).
- **Setor & Tarik Tunai via Teller**: Teller wajib menginput PIN sebelum memproses transaksi tunai untuk menjamin keamanan.
- **Anti-Duplikasi Transaksi**: Sistem mencegah *double submission* saat pengguna mengklik tombol proses lebih dari satu kali secara cepat.
- **Auto-Rollback**: Jika proses update saldo gagal di tengah jalan, transaksi otomatis dibatalkan/dihapus untuk mencegah inkonsistensi data (saldo tidak hilang).
- **Batas Transfer Harian Configurable**: Admin/Direktur dapat mengatur dan mengubah limit transfer harian untuk kategori Pelajar dan Umum melalui menu Pengaturan.

### Laporan & Pencetakan
- **Cetak Data Nasabah (Filtered)**: Mencetak daftar nasabah sesuai filter yang aktif, dilengkapi ringkasan saldo (total, rata-rata, tertinggi).
- **Cetak Rekening Koran**: Mencetak mutasi transaksi per periode dengan kolom Debit, Kredit, dan saldo akhir.
- **Cetak Riwayat Transaksi**: Mencetak laporan transaksi dengan filter periode dan nama nasabah, dilengkapi ringkasan total setor/tarik/transfer.
- **Print Multi-Page Support**: CSS khusus cetak A4 yang mendukung tabel panjang dengan header berulang, font kecil (10px), dan *page-break* otomatis.
- **Hapus Riwayat (Tanpa Ubah Saldo)**: Fitur khusus Direktur untuk menghapus riwayat transaksi pada periode tertentu tanpa memengaruhi saldo akhir nasabah.

### Notifikasi & Komunikasi
- **Notifikasi Individual**: Admin/CS dapat mengirim pesan personal/notifikasi langsung ke nasabah tertentu.
- **Broadcast Pengumuman**: Kirim pengumuman massal ke target spesifik: Semua Nasabah, Umum Saja, atau Pelajar Saja.
- **Badge Notifikasi Real-time**: Indikator jumlah pesan yang belum dibaca di header aplikasi (untuk Nasabah & Staff).

### Performa & UX
- **Real-time Sync (Polling 5 detik)**: Data otomatis ter-update di latar belakang tanpa perlu me-refresh halaman secara manual.
- **Cache Management**: Data di-cache selama 30 detik untuk mempercepat waktu muat (*loading*) aplikasi dan mengurangi beban server.
- **Mobile-First UI (Nasabah)**: Tampilan antarmuka khusus mobile dengan *bottom navigation* yang ramah pengguna untuk nasabah.
- **Dashboard Statistik Real-time**: Kartu statistik ringkas yang menampilkan Total Admin/Teller/CS/Nasabah, Total Saldo, dan Transaksi Hari Ini.

## Batasan yang Diketahui

Berikut adalah beberapa hal yang belum bisa dilakukan, masih memiliki keterbatasan, atau menjadi area perbaikan untuk pengembangan di masa depan:

- **Penyimpanan Password**: Password saat ini disimpan dalam bentuk *plaintext* (teks biasa) di Google Sheets. Untuk skala proyek sekolah hal ini masih dapat diterima, namun untuk produksi massal sangat disarankan menambahkan enkripsi atau *hashing* (misalnya SHA-256).
- **Ketergantungan pada Google Apps Script**: Sistem sepenuhnya bergantung pada kuota eksekusi harian, batas waktu eksekusi (6 menit per request), dan ketersediaan layanan Google. Jika kuota terlampaui, sistem mungkin akan mengalami penundaan atau kegagalan sementara.
- **Tidak Ada Integrasi Payment Gateway**: Sistem tidak terhubung dengan pihak ketiga seperti QRIS, Virtual Account, atau E-Wallet. Pengisian saldo dari luar ekosistem sekolah (misalnya dari orang tua) masih harus dilakukan secara manual melalui fitur "Setor Tunai" oleh Teller.
- **Platform Berbasis Web**: Aplikasi belum tersedia sebagai aplikasi *Native* (Android/iOS) yang dapat diunduh di Play Store/App Store. Saat ini hanya berbasis Web (Mobile-first responsive) yang diakses melalui browser.
- **Akad Syariah Sederhana**: Fitur perhitungan bagi hasil otomatis (Akad Mudharabah) belum diimplementasikan. Sistem tabungan saat ini masih berbasis titipan murni (Akad Wadiah) tanpa mekanisme perhitungan bunga atau bagi hasil.
- **Audit Log Terbatas**: Pencatatan aktivitas sensitif (seperti login atau reset password) masih bersifat dasar (hanya menyimpan `timestamp` di dalam JSON). Belum ada modul *audit log* terpusat yang mendetail (misalnya pelacakan IP address atau riwayat perubahan spesifik per kolom).
- **Kapasitas Data**: Meskipun sudah dioptimasi dengan *batch operation* dan *cache*, performa pembacaan data mungkin akan mulai menurun jika jumlah baris data di Google Sheets melebihi 10.000 - 20.000 baris. Migrasi ke database relasional (seperti Cloud SQL) disarankan jika skala pengguna membesar.

## Link Demo 

1. LOGIN untuk staff   : https://script.google.com/macros/s/AKfycbxedUBWRmN7ares8g512yFmtRU-_20VSd0DpQBwprhBcHMmZBRHC22HcoDTlgNQ1PCFRg/exec?page=admin

2. LOGIN untuk nasabah : https://script.google.com/macros/s/AKfycbxedUBWRmN7ares8g512yFmtRU-_20VSd0DpQBwprhBcHMmZBRHC22HcoDTlgNQ1PCFRg/exec?page=nasabah


## Sumber dan Lisensi

| Nama | Sumber (link) | Lisensi |
|------|---------------|---------|
| **Tailwind CSS** | [tailwindcss.com](https://tailwindcss.com) | MIT License |
| **Plus Jakarta Sans** (Font) | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Open Font License (OFL) |
| **Heroicons** (Ikon SVG) | [heroicons.com](https://heroicons.com) | MIT License |
| **Google Apps Script** (Backend) | [developers.google.com/apps-script](https://developers.google.com/apps-script) | Google Terms of Service |

## Tim

| Nama | Jabatan |
|------|---------|
| MUTYA LAURA | Ketua Tim |
| CANTIKA AMELIAN | Anggota |
| ISRA JULIAN SARI | Anggota |
