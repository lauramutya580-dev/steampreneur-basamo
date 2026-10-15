# 🤖 05 - Kesalahan AI yang Kami Temukan

**Alat AI yang Digunakan:** Qwen, Gemini Pro
**Periode Pencatatan:** 1 - 15 Oktober 2026

---

## 📋 Tabel Kesalahan AI

| No | Apa yang Diminta | Kesalahan AI | Bagaimana Kami Mengetahuinya | Perbaikan yang Kami Lakukan |
|:--:|------------------|--------------|------------------------------|------------------------------|
| 1 | **CSS Print Multi-Page A4** untuk tabel data nasabah yang panjang (>30 baris) | AI menghasilkan CSS dengan `overflow: hidden` dan `max-height: 100vh` pada container `#print-area`, sehingga data setelah halaman pertama terpotong/hilang saat dicetak. | Saat uji coba cetak 100 data nasabah, hanya 1 halaman A4 yang muncul. Data baris ke-31 dst. tidak terlihat di print preview. | Mengubah CSS menjadi `overflow: visible !important`, `max-height: none !important`, dan `position: absolute !important` pada `#print-area`. Menambahkan `display: table-header-group !important` pada `thead` agar header tabel repeat di setiap halaman. Mengecilkan font ke `10px` dan padding ke `4px` agar muat 1 baris per cell. |
| 2 | **Atomic Transfer dengan Rollback** yang benar saat update saldo penerima gagal | AI membuat logika rollback, tetapi increment `__version` saat rollback salah. Saat rollback, version hanya di-increment +1, padahal seharusnya +2 karena sudah di-increment +1 saat update awal sender. | Saat testing concurrent transfer (2 user transfer dari rekening yang sama), terjadi *version conflict* di transaksi berikutnya. Log console menunjukkan "Version conflict detected". | Memperbaiki manual: `senderRollback.__version = (sender.__version \|\| 1) + 2` agar version number konsisten. Menambahkan re-read data penerima (`targetFresh`) sebelum update untuk memastikan version terbaru. |
| 3 | **Dropdown Filter Kelas Dinamis** yang mengambil data unik dari database | AI membuat dropdown kelas dengan opsi *hardcoded* (contoh: "X AKL 1", "XI AKL 2") dan tidak otomatis ter-*update* saat user mengubah dropdown Kategori dari "Umum" ke "Pelajar". | Saat testing filter nasabah, dropdown kelas kosong atau menampilkan kelas yang tidak relevan dengan data aktual di database. | Membuat fungsi `populateKelasDropdown()` yang mengambil `uniqueKelas` dari data nasabah pelajar aktif menggunakan `[...new Set(pelajarList.map(n => n.kelas))]`. Menambahkan `addEventListener` pada `filter-category` untuk memanggil `populateKelasDropdown()` setiap kali kategori berubah. |
| 4 | **Cache Invalidation** setelah `handleCreateBatch` (broadcast notifikasi) | AI tidak menambahkan pemanggilan `invalidateCache_()` di akhir fungsi `handleCreateBatch`, sehingga data notifikasi lama masih tersimpan di cache dan tidak muncul di UI nasabah. | Setelah admin mengirim broadcast, nasabah tidak menerima notifikasi sampai me-refresh browser manual. Polling 5 detik tidak membantu karena cache masih menyimpan data lama. | Menambahkan `invalidateCache_()` (tanpa parameter, untuk invalidate semua cache) di blok `finally` fungsi `handleCreateBatch`. Memastikan `invalidateCache_('notifications')` juga dipanggil di fungsi `handleCreate` untuk notifikasi individual. |
| 5 | **Anti-Duplikasi Transaksi** saat user mengklik tombol "Proses" 2x cepat | AI tidak menambahkan mekanisme anti-*double-click* di frontend. Kedua request terkirim ke backend sebelum response pertama diterima, menyebabkan transaksi ganda. | Saat *stress test* dengan mengklik tombol "Proses Transaksi" 5x dalam 1 detik, tercatat 2-3 transaksi dengan saldo terpotong ganda. | Menambahkan tracking via `sessionStorage` dengan key `currentTransaction`. Sebelum proses, cek apakah key sudah ada. Jika ada, tampilkan toast "Transaksi sebelumnya masih diproses...". Hapus key di blok `finally` setelah transaksi selesai. |
| 6 | **Sort Nasabah A-Z (Nama)** di fitur filter | AI hanya mengimplementasikan sort berdasarkan saldo (tertinggi/terendah) dan lupa menambahkan opsi sort berdasarkan nama A-Z, padahal ini ada di spesifikasi. | Saat review fitur filter, opsi "A-Z (Nama)" tidak ada di dropdown `sort-saldo`. | Menambahkan opsi `<option value="az">A - Z (Nama)</option>` di dropdown. Menambahkan logika sort: `nasabahList.sort((a, b) => (a.name \|\| '').localeCompare(b.name \|\| ''))` di fungsi `renderNasabahRows` dan `filterNasabah`. |
| 7 | **Kolom Tanggal Bergabung** di tabel dan detail nasabah | AI tidak menampilkan field `created_at` di tabel manajemen nasabah dan modal detail, padahal ini penting untuk audit dan laporan. | Saat review UI, tidak ada informasi kapan nasabah bergabung. Admin kesulitan melacak usia akun. | Menambahkan kolom `<th>Tanggal Bergabung</th>` di tabel dengan value `formatDate(n.created_at)`. Menambahkan field "Tanggal Bergabung" di modal `showNasabahDetail`. Menambahkan field yang sama di print laporan nasabah. |
| 8 | **Dual Portal Login** dengan validasi role berdasarkan URL parameter | AI hanya membuat satu halaman login universal tanpa memblokir login silang. Nasabah bisa login di portal admin, dan admin bisa login di portal nasabah. | Saat testing keamanan, login dengan kredensial nasabah di URL `?page=admin` berhasil masuk ke dashboard admin. Ini celah keamanan serius. | Menambahkan parsing `URLSearchParams` untuk membaca parameter `?page=nasabah` atau `?page=admin`. Di fungsi `handleLogin`, tambahkan validasi: jika mode `nasabah` dan role bukan `nasabah`, tolak dengan error "Akses ditolak". Sebaliknya untuk mode `admin`. |
| 9 | **Lookup Nasabah** saat input No. Rekening di form transaksi | AI membuat fungsi lookup yang dipanggil setiap keystroke tanpa *debounce*, menyebabkan ratusan request ke backend saat user mengetik nomor rekening. | Saat mengetik nomor rekening "081234567890" (12 karakter), console log menunjukkan 12 panggilan fungsi lookup dalam 1 detik. Performa turun drastis. | Membungkus fungsi `lookupNasabah` dan `lookupTransferTarget` dengan `debounce(..., 300)` agar hanya dipanggil setelah user berhenti mengetik selama 300ms. |
| 10 | **Default PIN untuk Teller** yang dibuat via `handleCreate` | AI tidak menambahkan default PIN `123456` dan field keamanan (`pin_attempts`, `blocked`) saat admin membuat Teller baru, menyebabkan Teller tidak bisa login. | Saat testing alur "Tambah Teller", Teller baru tidak bisa login karena field `pin` kosong di database. | Menambahkan blok kode di `handleCreate` dan `handleCreateBatch`: `if (obj.role === 'teller' && !storeObj.pin) { storeObj.pin = '123456'; }` serta inisialisasi `pin_attempts: 0` dan `blocked: false`. |

---

## 📊 Ringkasan Analisis Kesalahan AI

### Kategori Kesalahan

| Kategori | Jumlah | Persentase |
|----------|--------|------------|
| **Logika Bisnis / State Management** (rollback, versioning, cache) | 4 | 40% |
| **UI/UX & CSS** (print, layout, responsive) | 2 | 20% |
| **Keamanan** (validasi role, anti-duplikasi) | 2 | 20% |
| **Performa** (debounce, cache invalidation) | 1 | 10% |
| **Kelengkapan Fitur** (sort A-Z, tanggal bergabung) | 1 | 10% |

### Pola Kesalahan yang Sering Terjadi

1. **AI Lupa Melacak State yang Berubah**
   - Contoh: Increment `__version` saat rollback tidak memperhitungkan bahwa version sudah di-increment sebelumnya.
   - **Pelajaran:** AI tidak memiliki "memori" stateful antar baris kode. Tim harus manual trace alur data.

2. **AI Memberikan Solusi "Standar" yang Tidak Cocok untuk Edge Case**
   - Contoh: CSS print standar dengan `overflow: hidden` cocok untuk modal, tapi gagal untuk tabel multi-halaman.
   - **Pelajaran:** Selalu test hasil AI di skenario ekstrem (data banyak, concurrent user, dll).

3. **AI Mengabaikan Spesifikasi yang Tidak Eksplisit di Prompt**
   - Contoh: Sort A-Z dan kolom tanggal bergabung tidak diimplementasi karena tidak disebut eksplisit di prompt.
   - **Pelajaran:** Prompt harus sangat detail, atau tim harus review checklist spesifikasi setelah AI selesai.

4. **AI Tidak Mempertimbangkan Side Effect**
   - Contoh: `handleCreateBatch` tidak invalidate cache karena AI hanya fokus pada "batch write", lupa bahwa cache harus di-refresh.
   - **Pelajaran:** Setiap operasi write harus selalu diikuti dengan cache invalidation. Ini harus jadi checklist tim.

---

## ✅ Kesimpulan Tim

> **AI adalah Co-pilot, bukan Auto-pilot.**

Dari 10 kesalahan yang terdokumentasi, **tidak satupun** yang lolos ke production. Semua berhasil ditangkap melalui:
- **Code Review** oleh Mutya Laura (backend) dan Cantika Amelian (frontend)
- **Testing Manual** oleh Isra Julian Sari (QA)
- **Cross-check** dengan spesifikasi produk di `01-spesifikasi-produk.md`
