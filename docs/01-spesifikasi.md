# 📋 01 - Spesifikasi Produk

## Informasi Proyek

| Item | Keterangan |
|------|-----------|
| Nama Tim | Tim BASAMO (Mutya Laura, Cantika Amelian, Isra Julian Sari) |
| Nama Produk | BSS - Bank Syariah Sekolah (BASAMO) |
| Versi | 2.0.0 - Production Ready |
| Tanggal | 15 Oktober 2026 |
| Lokasi | SMKN 2 Kerinci |
| Lisensi Kode | MIT License |
| Lisensi Dokumentasi | CC BY-SA 4.0 |
| Sumber Data | Wawancara langsung, observasi lapangan, studi literatur sistem perbankan syariah |

## Alur Inti yang Dibangun

Siswa menabung, transfer, dan bertransaksi setor/tarik tunai secara digital melalui sistem bank sekolah terintegrasi yang dapat dipantau oleh orang tua dan guru secara real-time.

## 🧭 Point of View (POV)

**User:** Siswa, Guru, Orang Tua, dan Merchant di ekosistem SMKN 2 Kerinci.

**Need:** Sebuah sistem bank sekolah digital yang terintegrasi, otomatis, dan mudah dipantau.

**Insight:** Sistem keuangan berbasis tunai dan buku fisik saat ini menyebabkan inefisiensi waktu (antrean panjang), rawan human error, sulitnya kontrol finansial bagi siswa (impulsive spending), serta minimnya transparansi dan pemantauan real-time bagi orang tua dan guru.

**Pernyataan POV:**
Siswa dan seluruh ekosistem SMKN 2 Kerinci membutuhkan sistem bank sekolah digital yang terintegrasi (cashless) karena ketergantungan pada uang tunai dan buku fisik saat ini menyebabkan antrean panjang, rawan human error, hilangnya kontrol pengeluaran impulsif, serta menyulitkan rekonsiliasi data dan pemantauan oleh orang tua maupun guru.

---

## 1. Masalah

### Masalah Apa yang Diselesaikan?

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Antrean panjang di bank mini saat jam istirahat (hanya 15 menit) | Menyita waktu belajar siswa |
| 2 | Buku tabungan fisik sering hilang, rusak, atau tertinggal | Siswa ditolak teller, data tidak tercatat |
| 3 | Rekonsiliasi data manual di akhir bulan | Rawan human error dan double-entry |
| 4 | Impulsive spending siswa (habis di awal minggu) | Tidak ada sistem yang membantu "mengunci" saldo |
| 5 | Kesulitan transaksi kelompok (kas/tugas) | Harus bertemu fisik dan menghitung uang tunai |
| 6 | Kecemasan orang tua memberikan uang tunai | Takut hilang/jatuh, tidak bisa memantau penggunaan |
| 7 | Minim transparansi pola penggunaan uang | Guru dan orang tua "buta" terhadap perilaku finansial siswa |
| 8 | Antrean kantin panjang, susah uang receh | Rekap omzet sulit dilakukan manual |

### Siapa yang Mengalaminya?

- **Siswa (Nasabah):** Melsa Aulia (XI AKL), Gresia Ezinda Putri, dan seluruh siswa SMKN 2 Kerinci
- **Guru/Staff:** Bu Usdekawati (Ketua Jurusan AKL), Teller bank mini, Bu Yuni (pengelola kantin)
- **Orang Tua/Wali:** Ibu Isil (Wali Murid) dan seluruh wali siswa
- **Ekosistem Sekolah:** SMKN 2 Kerinci secara keseluruhan

---

## 2. Pengguna

| Pengguna | Kebutuhan Utama |
|----------|----------------|
| **Nasabah (Siswa)** | Cek saldo real-time via HP, transfer ke teman (kas kelompok), setor/tarik tanpa antre panjang, melihat riwayat transaksi untuk self-monitoring pengeluaran |
| **Teller (Staff)** | Memproses setor/tarik tunai cepat dengan verifikasi PIN, minim human error, rekap otomatis |
| **Admin/Customer Service** | Menyetujui pendaftaran nasabah baru, mereset PIN/password, mengirim notifikasi/pengumuman, mengelola data nasabah dengan filter |
| **Direktur** | Memantau dashboard statistik (total saldo, transaksi hari ini), mengatur limit transfer, mencetak laporan, menghapus riwayat (tanpa mengubah saldo) |
| **Orang Tua/Wali** | Mentransfer uang saku langsung ke rekening anak, memantau apakah anak menabung atau langsung menarik semua |
| **Guru (Ketua Jurusan)** | Rekonsiliasi data otomatis, melihat pola finansial siswa, mencetak laporan per kelas/kategori |

---

## 3. Hasil Wawancara Calon Pengguna

**Cara Wawancara:** Langsung (tatap muka) di lingkungan SMKN 2 Kerinci dan sekitarnya
**Tanggal:** Oktober 2026 (Hari ke-3 dan ke-4 logbook tim)
**Bukti Wawancara:** [Google Drive Folder](https://drive.google.com/drive/folders/1wm9TFBDKQd7MI4JvPiD5DpzFWFnouVkd?usp=sharing)

### Tabel Wawancara

| Narasumber | Peran | Pertanyaan Kami | Jawaban Narasumber |
|------------|-------|----------------|-------------------|
| Melsa Aulia | Siswa Kelas XI AKL | "Apa kendala yang sering kamu alami saat menabung di bank mini sekolah?" | "Sering mengalami antrean panjang di bank mini saat jam istirahat sehingga waktunya tersita. Pernah suatu kali ingin menabung tapi lupa membawa buku tabungan fisik, sehingga ditolak oleh teller. Juga kesulitan saat harus mengumpulkan uang tugas kelompok ke teman karena harus bertemu fisik dan menghitung uang tunai." |
| Gresia Ezinda Putri | Siswa | "Bagaimana kebiasaanmu dalam mengelola uang saku mingguan?" | "Cenderung impulsif dalam menghabiskan uang saku di awal minggu untuk jajan di kantin. Ia tidak pernah mencatat pengeluaran, sehingga di pertengahan minggu sering kehabisan uang dan terpaksa berutang atau tidak makan. Ia merasa ingin menabung, tetapi tidak ada sistem yang membantunya 'mengunci' saldo atau mengingatkan target tabungan, sehingga uang selalu habis untuk hal konsumtif." |
| Bu Usdekawati, S.Pd | Ketua Jurusan AKL | "Apa tantangan terbesar dalam mengelola data tabungan siswa?" | "Mengeluhkan proses rekonsiliasi data di akhir bulan yang sangat rawan human error. Buku tabungan fisik sering hilang atau rusak oleh siswa. Ia merasa 'buta' terhadap pola penggunaan uang siswa; apakah uang yang ditarik digunakan untuk hal produktif atau konsumitif, karena tidak ada jejak digital yang bisa dipantau secara real-time." |
| Ibu Isil | Orang Tua (Wali Murid) | "Apa kekhawatiran Anda dalam memberikan uang saku ke anak?" | "Merasa cemas memberikan uang saku dalam bentuk tunai dalam jumlah cukup besar untuk satu minggu karena takut hilang, jatuh. Ibu Isil sangat menginginkan adanya fitur di mana ia bisa langsung mentransfer uang langsung ke rekening bank sekolah atas nama anaknya, tanpa harus menitipkan uang tunai fisik. Dengan begitu, ia bisa memantau apakah uang tersebut digunakan untuk menabung atau langsung ditarik semua, sehingga ia merasa lebih tenang dan terlibat dalam literasi finansial anak." |
| Bu Yuni (observasi) | Pengelola Kantin/Merchant | "Apa kendala di kantin terkait pembayaran?" | "Antrean kantin panjang, susah uang receh, rekap omzet sulit dilakukan secara manual di akhir hari." |

### Observasi Lapangan (Shadowing - Hari ke-2)

- Jam istirahat hanya 15 menit → antrean bank mini sangat panjang
- Tim dibagi dua untuk observasi bank mini dan kantin secara bersamaan
- Siswa sering malu-malu saat diwawancara → perlu ice breaking

### Ringkasan Wawancara

| Narasumber | Pain Point Utama |
|------------|-----------------|
| Siswa (Melsa & Gresia) | Antrean fisik, risiko kehilangan buku tabungan, kesulitan manajemen uang kas kelompok, dan perilaku impulsive spending |
| Ketua Jurusan AKL (Bu Usdekawati) | Proses rekonsiliasi akhir bulan sangat melelahkan dan rawan human error. Tidak ada data analitik mengenai perilaku finansial siswa |
| Orang Tua (Ibu Isil) | Merasa anxious memberikan uang tunai mingguan. Sangat membutuhkan parental control |

---

## 4. Fitur Wajib (Hanya untuk Alur Inti)

### A. Fitur Keamanan & Autentikasi

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | Multi-Role Access Control | 5 role berbeda: Direktur, Admin, Teller, CS, Nasabah — dengan hak akses menu yang berbeda-beda |
| 2 | Dual Portal Login | URL terpisah untuk Portal Nasabah (`?page=nasabah`) dan Portal Admin/Staff (`?page=admin`) — mencegah login silang |
| 3 | PIN 6 Digit + Blokir Otomatis | Validasi PIN untuk transfer & transaksi tunai. Akun otomatis terblokir setelah 3x salah PIN |
| 4 | Reset Password & PIN | Admin dapat mereset password/PIN nasabah atau Teller ke default `123456` sekaligus membuka blokir |
| 5 | Optimistic Locking | Mencegah konflik data saat 2 user mengedit data bersamaan (berbasis `__version`) |

### B. Fitur Manajemen Nasabah

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 6 | Registrasi Mandiri Nasabah | Siswa bisa daftar sendiri via portal → status `pending` → menunggu persetujuan Admin/CS |
| 7 | Kategori Nasabah (Pelajar/Umum) | Pemisahan kategori dengan field khusus "Kelas" untuk pelajar (misal: XI AKL 1) |
| 8 | Filter & Pencarian Lanjutan | Filter berdasarkan: Status, Kategori, Kelas, Pencarian nama/rekening, Sort saldo (tertinggi/terendah/A-Z) |
| 9 | Pagination Otomatis | Daftar nasabah dibagi per 10 data per halaman untuk performa |
| 10 | Aktifkan/Nonaktifkan Nasabah | Admin dapat menonaktifkan akun nasabah yang bermasalah tanpa menghapus data |

### C. Fitur Transaksi Keuangan

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 11 | Transfer Antar Nasabah (Atomic) | Transfer dengan validasi PIN, batas harian berbeda (**Pelajar: Rp20.000 / Umum: Rp500.000**) |
| 12 | Setor & Tarik Tunai via Teller | Teller wajib input PIN sebelum memproses transaksi tunai |
| 13 | Anti-Duplikasi Transaksi | Sistem mencegah double submission saat user klik tombol 2x |
| 14 | Auto-Rollback | Jika update saldo gagal, transaksi otomatis dihapus (mencegah data tidak konsisten) |
| 15 | Batas Transfer Harian Configurable | Admin/Direktur dapat mengatur limit transfer harian untuk Pelajar & Umum via menu Pengaturan |

### D. Fitur Laporan & Pencetakan

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 16 | Cetak Data Nasabah (Filtered) | Cetak daftar nasabah sesuai filter aktif + ringkasan saldo (total, rata-rata, tertinggi) |
| 17 | Cetak Rekening Koran | Cetak mutasi per periode dengan kolom Debit/Kredit + saldo akhir |
| 18 | Cetak Riwayat Transaksi | Cetak laporan transaksi dengan filter periode & nama nasabah + ringkasan setor/tarik/transfer |
| 19 | Print Multi-Page Support | CSS khusus cetak A4 dengan header berulang, font kecil, dan page-break otomatis |
| 20 | Hapus Riwayat (Tanpa Ubah Saldo) | Fitur khusus Direktur untuk menghapus riwayat transaksi pada periode tertentu tanpa memengaruhi saldo |

### E. Fitur Notifikasi & Komunikasi

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 21 | Notifikasi Individual | Admin/CS dapat mengirim pesan personal ke nasabah tertentu |
| 22 | Broadcast Pengumuman | Kirim pengumuman massal ke: Semua Nasabah / Umum Saja / Pelajar Saja |
| 23 | Badge Notifikasi Real-time | Indikator jumlah pesan belum dibaca di header aplikasi (Nasabah & Staff) |

### F. Fitur Performa & UX

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 24 | Real-time Sync (Polling 5 detik) | Data otomatis ter-update tanpa refresh halaman |
| 25 | Cache Management | Data di-cache 30 detik untuk mempercepat loading |
| 26 | Mobile-First UI (Nasabah) | Tampilan khusus mobile dengan bottom navigation untuk nasabah |
| 27 | Dashboard Statistik Real-time | Kartu statistik: Total Admin/Teller/CS/Nasabah, Total Saldo, Transaksi Hari Ini |

---

## 5. Di Luar Cakupan (Tidak Dikerjakan dalam Challenge Ini)

- [ ] Integrasi dengan Payment Gateway eksternal (QRIS, Virtual Account Bank Nasional, Dana, OVO)
- [ ] Aplikasi Native (Android/iOS) — saat ini berbasis Web (Mobile-first PWA-ready)
- [ ] Perhitungan bagi hasil otomatis (Akad Mudharabah) — saat ini masih berbasis titipan murni (Akad Wadiah)
- [ ] Fitur Chat langsung antara nasabah dan Customer Service (hanya notifikasi satu arah)
- [ ] Integrasi dengan sistem akademik sekolah (Dapodik/SIM Sekolah)
- [ ] Fitur top-up oleh orang tua secara langsung (masih manual via transfer ke rekening anak)
- [ ] Laporan pajak atau audit eksternal berstandar OJK
- [ ] Multi-bahasa (saat ini hanya Bahasa Indonesia)

---

## 6. Aturan Bisnis dan Perhitungan

### A. Aturan Akun & Autentikasi

- **Format No. HP/Rekening:** Wajib diawali `08` dengan panjang 10-12 digit (regex: `/^08\d{8,12}$/`)
- **Password:** Minimal 6 karakter
- **PIN:** Wajib 6 digit angka (regex: `/^\d{6}$/`)
- **Blokir Otomatis:** Akun (Teller/Nasabah) terblokir setelah 3x salah PIN berturut-turut. Hanya Admin/Direktur yang bisa membuka blokir via reset
- **Status Pendaftaran:** Nasabah yang mendaftar mandiri berstatus `pending` dan harus disetujui (`approve`) oleh Admin/CS sebelum bisa login

### B. Aturan Transaksi

- **Limit Transfer Harian Nasabah Pelajar:** Maksimal **Rp20.000/hari** (configurable via menu Pengaturan)
- **Limit Transfer Harian Nasabah Umum:** Maksimal **Rp500.000/hari** (configurable via menu Pengaturan)
- **Validasi Transfer:** Tidak dapat transfer ke rekening sendiri. Saldo pengirim harus ≥ jumlah transfer
- **Atomic Transfer:** Jika update saldo penerima gagal, saldo pengirim otomatis di-rollback (dengan increment `__version` yang benar)
- **Anti-Duplikasi:** Sistem menolak request transaksi ganda dalam sesi yang sama via `sessionStorage` tracking

### C. Aturan Peran (Role-Based Access)

- **Direktur:** Akses penuh + manajemen admin + hapus riwayat + pengaturan limit
- **Admin:** Kelola Teller, CS, Nasabah + broadcast + cetak laporan. Tidak bisa kelola Direktur
- **Teller:** Hanya transaksi setor/tarik tunai + lihat riwayat sendiri. Wajib verifikasi PIN per transaksi
- **CS:** Kelola Nasabah (approve/reject/edit) + kirim notifikasi individual
- **Nasabah:** Transfer, lihat saldo, riwayat sendiri, ubah password/PIN

### D. Aturan Teknis

- **Cache TTL:** 30 detik untuk data read
- **Lock Timeout:** 15 detik dengan retry 3x (exponential backoff)
- **Polling Interval:** 5 detik (pause saat tab hidden via Visibility API)
- **Batch Size:** 50 rows per operasi batch write

---

## 7. Data yang Disimpan

| Data | Contoh Isi | Disimpan di Mana |
|------|-----------|-----------------|
| **Users** (Nasabah, Teller, Admin, CS, Direktur) | `{type: 'user', username: '081234567890', password: '***', pin: '123456', name: 'Melsa Aulia', phone: '081234567890', role: 'nasabah', category: 'pelajar', kelas: 'XI AKL 1', balance: 150000, status: 'active', pin_attempts: 0, blocked: false, created_at: '2026-10-15T...'}` | Google Sheets (Sheet: `users`) — kolom: `__backendId`, `Data_JSON`, `__version`, `__timestamp` |
| **Transactions** (Setor, Tarik, Transfer) | `{type: 'transaction', transaction_type: 'transfer', amount: 50000, from_account: '081234567890', to_account: '081234567899', from_name: 'Melsa', to_name: 'Gresia', description: 'Uang kas kelompok', teller_name: '-', created_at: '2026-10-15T...'}` | Google Sheets (Sheet: `transactions`) |
| **Settings** (Konfigurasi Sistem) | `{type: 'settings', max_transfer_pelajar: 20000, max_transfer_umum: 500000}` | Google Sheets (Sheet: `settings`) |
| **Notifications** (Pengumuman & Pesan) | `{type: 'notification', to_account: '081234567890', message: 'Libur nasional besok', read: false, sender: 'Admin BSS', created_at: '2026-10-15T...'}` | Google Sheets (Sheet: `notifications`) |

**Struktur Tabel Google Sheets:** Setiap sheet memiliki 4 kolom standar:
- Kolom A: `__backendId` (UUID)
- Kolom B: `Data_JSON` (objek JSON lengkap)
- Kolom C: `__version` (integer untuk optimistic locking)
- Kolom D: `__timestamp` (ISO 8601)

---

## 8. Kriteria "Selesai"

Setiap kriteria harus bisa diuji (bisa dijawab ya atau tidak).

### Autentikasi & Registrasi
- [x] Siswa dapat mendaftar mandiri melalui portal nasabah dan akun berstatus `pending` hingga disetujui admin
- [x] Nasabah dapat login menggunakan No. HP dan password, serta melihat saldo di dashboard
- [x] Teller/Admin/Direktur dapat login melalui portal staff dengan kredensial yang sesuai
- [x] Akun otomatis terblokir setelah 3x salah PIN, dan hanya bisa dibuka oleh Admin/Direktur via reset
- [x] Dual portal (`?page=nasabah` vs `?page=admin`) mencegah login silang antar role

### Transaksi
- [x] Teller dapat memproses setor tunai dan saldo nasabah bertambah secara otomatis
- [x] Teller dapat memproses tarik tunai dan sistem menolak jika saldo tidak mencukupi
- [x] Teller wajib memasukkan PIN 6 digit sebelum memproses transaksi tunai
- [x] Nasabah dapat transfer ke nasabah lain, saldo kedua pihak terupdate, dan tercatat di riwayat
- [x] Sistem menolak transfer ke rekening sendiri
- [x] Sistem menolak transfer jika total harian nasabah pelajar melebihi **Rp20.000** (atau limit yang dikonfigurasi)
- [x] Atomic rollback berjalan: jika update saldo penerima gagal, saldo pengirim kembali ke nilai semula
- [x] Anti-duplikasi berjalan: klik tombol transaksi 2x cepat hanya memproses 1 transaksi

### Manajemen Nasabah
- [x] Admin/CS dapat menyetujui (`approve`) atau menolak (`reject`) pendaftaran nasabah pending
- [x] Admin dapat mengaktifkan/menonaktifkan akun nasabah tanpa menghapus data
- [x] Filter nasabah berdasarkan kategori (pelajar/umum), kelas, status, dan pencarian nama/no. rekening berfungsi
- [x] Sort nasabah berdasarkan saldo tertinggi/terendah dan nama A-Z berfungsi
- [x] Pagination otomatis (10 data/halaman) berjalan dengan benar

### Laporan & Pencetakan
- [x] Admin/Direktur dapat mencetak daftar nasabah sesuai filter aktif dengan ringkasan saldo (total, rata-rata, tertinggi)
- [x] Admin/Direktur dapat mencetak rekening koran per nasabah dengan filter periode
- [x] Admin/Direktur dapat mencetak riwayat transaksi dengan filter periode dan nama nasabah
- [x] Print CSS mendukung multi-page A4 dengan header tabel berulang dan font kecil (10px)
- [x] Direktur dapat menghapus riwayat transaksi pada periode tertentu tanpa mengubah saldo nasabah

### Notifikasi & Komunikasi
- [x] Admin/CS dapat mengirim notifikasi individual ke nasabah tertentu
- [x] Admin dapat melakukan broadcast pengumuman ke Semua Nasabah / Umum Saja / Pelajar Saja
- [x] Badge notifikasi real-time muncul di header saat ada pesan belum dibaca

### Performa & UX
- [x] Data ter-update otomatis setiap 5 detik tanpa refresh halaman (polling)
- [x] Dashboard menampilkan statistik real-time: Total Admin/Teller/CS/Nasabah, Total Saldo, Transaksi Hari Ini
- [x] UI nasabah bersifat mobile-first dengan bottom navigation
- [x] UI staff bersifat desktop-first dengan sidebar navigation
- [x] Cache 30 detik berjalan untuk mempercepat loading data
- [x] Optimistic locking mencegah konflik data saat 2 user mengedit data bersamaan

---

## 📎 Lampiran

### A. Tabel Audit Fitur (Mapping Pain Point → Solusi)

| No | Pain Point (Masalah) | Narasumber | Solusi Fitur BSS |
|----|---------------------|-----------|-----------------|
| 1 | Antrean panjang & buku tabungan fisik hilang/rusak | Melsa, Bu Usdekawati | Registrasi Mandiri + Virtual Account (No. HP = No. Rekening) — Eliminasi buku fisik |
| 2 | Uang saku cepat habis / Impulsive spending | Gresia | Batas Transfer Harian (Pelajar: Rp20rb) + Riwayat Transaksi Real-time untuk self-monitoring |
| 3 | Kesulitan rekap uang kas kelompok | Melsa | Transfer Antar Nasabah (Atomic) — bisa kirim uang ke teman sekelas secara digital |
| 4 | Rekonsiliasi data rawan human error & buta data | Bu Usdekawati | Dashboard Real-time + Cetak Riwayat Transaksi + Cetak Rekening Koran per periode |
| 5 | Cemas uang tunai hilang & ingin memantau anak | Ibu Isil | Notifikasi Real-time + Broadcast + Top-up via Transfer (tanpa tunai fisik) |
| 6 | Antrean kantin, susah uang receh, rekap omzet sulit | Bu Yuni | Transfer Non-Tunai + Auto-rekap via Cetak Riwayat Transaksi |
| 7 | Rawan double-entry / salah input | Teller | Anti-Duplikasi Transaksi + Auto-Rollback + Validasi PIN Teller |
| 8 | Sulit filter data per kelas/kategori | Bu Usdekawati | Filter Nasabah (Kategori, Kelas, Status, Saldo) + Cetak Data Filtered |
| 9 | Akses tidak terkontrol (siswa vs admin) | Admin | Dual Portal Login + Multi-Role Access (5 role berbeda) |
| 10 | Data tidak sinkron antar petugas | Semua | Real-time Sync (Polling 5 detik) + Optimistic Locking |

### B. Logbook Tim (Catatan Harian Lapangan)

| Hari / Tanggal | Lokasi | Kegiatan | Output / Hasil yang Dicapai | Kendala & Solusi |
|---------------|--------|---------|---------------------------|-----------------|
| Hari 1 | SMKN 2 Kerinci (Ruang Guru) | Perizinan riset dan observasi awal | Surat izin disetujui. Denah bank mini & pertokoan AKL | - |
| Hari 2 | Bank Mini & Kantin | Shadowing saat jam istirahat | Observasi antrean & kesulitan uang receh | Jam istirahat hanya 15 menit → Tim dibagi dua |
| Hari 3 | Ruang Kelas XI AKL & Jurusan | Wawancara Siswa & Ketua Jurusan | Pain point buku fisik, antrean, rekonsiliasi | Siswa malu-malu → Ice breaking |
| Hari 4 | Rumah Wali Murid | Wawancara Orang Tua | Insight: parental control | - |
| Hari 5 | Basecamp Tim | Sintesis data & pembuatan laporan | Dokumen Empathize & Define selesai | - |
| Hari 6 | Basecamp Tim | Implementasi kode BSS (27 fitur) | Sistem BSS v2.0 Production Ready | - |

### C. Jurnal Penggunaan AI

| Tools AI | Tujuan | Prompt | Output | Validasi Tim |
|----------|--------|--------|--------|-------------|
| Gemini / Qwen | Implementasi kode BSS | "Buatkan sistem bank sekolah dengan 27 fitur" | Kode `kode.gs` & `Index.html` lengkap | Testing fitur atomic transfer & locking |

### D. Spesifikasi Teknis Sistem BSS

| Aspek | Detail |
|-------|--------|
| Nama Sistem | BSS - Bank Syariah Sekolah |
| Versi | 2.0.0 - Production Ready |
| Backend | Google Apps Script (GAS) + Google Spreadsheet |
| Frontend | HTML5 + TailwindCSS + Vanilla JS |
| Database | 4 Sheet: `users`, `transactions`, `settings`, `notifications` |
| Keamanan | Optimistic Locking, PIN Blocking, Anti-Duplikasi, Auto-Rollback |
| Performa | Cache 30 detik, Batch Operations, Lock Timeout 15 detik |
| Real-time | Polling setiap 5 detik + Visibility API (pause saat tab hidden) |
| Mobile Support | Responsive UI khusus nasabah (bottom navigation) |
| Cetak | Multi-page A4 support dengan CSS khusus |

### E. Keterkaitan dengan STEAM

| Unsur STEAM | Implementasi dalam BSS |
|-------------|----------------------|
| **Science (Sains)** | Analisis perilaku finansial siswa berdasarkan data transaksi; studi literasi keuangan syariah; pemahaman akad Wadiah (titipan murni) |
| **Technology (Teknologi)** | Google Apps Script, Google Sheets API, Tailwind CSS, Vanilla JS, Optimistic Locking, Cache Management, Real-time Polling |
| **Engineering (Rekayasa)** | Arsitektur sistem client-server, atomic transaction dengan rollback, request queue pattern, batch operations untuk optimasi API calls |
| **Art (Seni/Desain)** | UI/UX mobile-first untuk nasabah, desktop-first untuk staff; desain responsif dengan Tailwind CSS; CSS print multi-page A4 yang rapi |
| **Mathematics (Matematika)** | Perhitungan saldo, limit transfer harian (Rp20.000 / Rp500.000), statistik dashboard (total, rata-rata, tertinggi), pagination, sorting algorithm |

### F. Nilai Bisnis dan Manfaat

**Manfaat bagi Pengguna:**
1. **Siswa:** Hemat waktu antre (dari 15 menit → <1 menit), bisa transfer uang kas kelompok digital, self-monitoring pengeluaran via riwayat transaksi.
2. **Orang Tua:** Tenang memberikan uang saku digital, bisa memantau pola penggunaan uang anak.
3. **Guru/Staff:** Eliminasi human error rekonsiliasi, rekap data otomatis dalam hitungan detik.
4. **Sekolah:** Meningkatkan citra sebagai institusi modern yang melek teknologi dan literasi finansial syariah.

**Analisis Nilai Bisnis:**
- **Efisiensi Operasional:** Mengurangi waktu transaksi dari ~3 menit (manual) menjadi <10 detik (digital).
- **Akurasi Data:** Menurunkan risiko double-entry dan kehilangan buku fisik hingga 0%.
- **Skalabilitas:** Sistem berbasis cloud (Google Sheets) dapat menampung ribuan data siswa tanpa biaya server tambahan (Zero Infrastructure Cost).

**Catatan:** Semua kriteria di atas telah diverifikasi melalui 41 test case formal (lihat `docs/04-kasus-uji.md`), 10 kesalahan AI yang didokumentasi (lihat `docs/05-kesalahan-ai.md`), dan 5 bug fix yang didokumentasikan di `docs/catatan-bug.md`.
