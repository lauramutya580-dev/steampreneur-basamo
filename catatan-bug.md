# Catatan Bug Hunt: BSS - Bank Syariah Sekolah

**Nama tim:** Tim BSS (Mutya Laura, Cantika Amelian, Isra Julian Sari)
**Lokasi file:** `docs/catatan-bug.md`

---

## Bug 1: Double Transaction (Saldo Terpotong 2x)
- **Gejala** (apa yang terlihat salah): Saldo nasabah terpotong 2x dan tercatat 2 transaksi identik saat tombol "Proses Transaksi" diklik 2x dengan cepat oleh Teller.
- **Langkah untuk memunculkan bug:** Login sebagai Teller -> Buka menu Transaksi -> Isi form Setor/Tarik Tunai -> Klik tombol "Proses Transaksi" 2x secara beruntun dalam waktu < 1 detik.
- **Aturan bisnis yang dilanggar** (nomor aturan di README): Aturan B.3 (Anti-Duplikasi Transaksi) & Aturan B.2 (Validasi Transaksi).
- **Penyebab** (file, fungsi, dan penjelasan): `index.html`, fungsi `handleTransaction`. Tidak ada mekanisme *flag* atau *lock* di sisi frontend untuk mencegah *double submission* saat request pertama (`await window.dataSdk.create`) belum selesai diproses dan mengembalikan response.
- **Perbaikan** (apa yang diubah): Menambahkan tracking menggunakan `sessionStorage` dengan key `currentTransaction`. Sistem mengecek apakah key sudah ada sebelum memproses. Jika ada, tampilkan toast warning. Key dihapus di blok `finally` setelah transaksi selesai.
- **Test yang membuktikan** (nama test): TC-BUG-001 (Rapid click test / Anti-duplikasi).
- **Commit perbaikan** (pesan commit): `fix: add transaction deduplication with sessionStorage`
- **Ditemukan oleh:** Tim sendiri (Isra saat melakukan stress test UI).

---

## Bug 2: Print CSS Terpotong (Data Hilang di Halaman 2)
- **Gejala** (apa yang terlihat salah): Saat mencetak daftar nasabah yang berjumlah > 30 baris, data setelah halaman pertama hilang/terpotong di print preview browser. Hanya 1 halaman A4 yang tercetak.
- **Langkah untuk memunculkan bug:** Login sebagai Admin/Direktur -> Buka menu Kelola Nasabah -> Klik tombol "Cetak Data" -> Klik tombol "Cetak" (Print) di modal.
- **Aturan bisnis yang dilanggar** (nomor aturan di README): Aturan D.4 (Print Multi-Page Support).
- **Penyebab** (file, fungsi, dan penjelasan): `index.html`, blok CSS `@media print`. AI menghasilkan CSS dengan `overflow: hidden` dan `max-height: 100vh` pada container `#print-area`, yang memaksa browser untuk memotong konten yang melebihi tinggi 1 layar.
- **Perbaikan** (apa yang diubah): Mengubah CSS menjadi `overflow: visible !important`, `max-height: none !important`, dan `position: absolute !important` pada `#print-area`. Menambahkan `display: table-header-group !important` pada `thead` agar header tabel repeat di setiap halaman.
- **Test yang membuktikan** (nama test): TC-14 (Cetak Data Nasabah Multi-page).
- **Commit perbaikan** (pesan commit): `fix: optimize print CSS for multi-page A4 support`
- **Ditemukan oleh:** Bersama (Cantika saat testing print, divalidasi oleh Isra).

---

## Bug 3: Cache Stale Setelah Broadcast Notifikasi
- **Gejala** (apa yang terlihat salah): Setelah Admin mengirim broadcast pengumuman ke "Semua Nasabah", notifikasi tidak muncul di UI Nasabah secara otomatis. Nasabah harus me-refresh browser secara manual untuk melihat notifikasi.
- **Langkah untuk memunculkan bug:** Login Admin -> Kirim Pengumuman (Broadcast) -> Login Nasabah di tab/browser lain -> Tunggu polling 5-10 detik. Notifikasi tidak muncul.
- **Aturan bisnis yang dilanggar** (nomor aturan di README): Aturan D.1 (Real-time Sync / Polling 5 detik).
- **Penyebab** (file, fungsi, dan penjelasan): `kode.gs`, fungsi `handleCreateBatch`. Fungsi ini melakukan batch write ke sheet `notifications`, tetapi lupa memanggil `invalidateCache_()` di akhir proses. Akibatnya, data notifikasi lama masih tersimpan di CacheService dan tidak ter-update saat polling.
- **Perbaikan** (apa yang diubah): Menambahkan pemanggilan `invalidateCache_()` (tanpa parameter, untuk invalidate semua cache) di dalam blok `finally` fungsi `handleCreateBatch`.
- **Test yang membuktikan** (nama test): TC-BUG-005 (Cache invalidation test).
- **Commit perbaikan** (pesan commit): `fix: invalidate all cache after batch operations`
- **Ditemukan oleh:** Tim sendiri (Mutya saat review logika backend).

---

## Bug 4: Dropdown Kelas Tidak Dinamis
- **Gejala** (apa yang terlihat salah): Saat filter kategori diubah dari "Umum" ke "Pelajar" di halaman Kelola Nasabah, dropdown "Kelas" tidak muncul atau opsinya kosong, padahal ada data kelas di database.
- **Langkah untuk memunculkan bug:** Login Admin -> Kelola Nasabah -> Ubah dropdown "Kategori" dari "Semua" menjadi "Pelajar".
- **Aturan bisnis yang dilanggar** (nomor aturan di README): Aturan C.2 (Filter & Pencarian Lanjutan).
- **Penyebab** (file, fungsi, dan penjelasan): `index.html`, event listener pada `filter-category`. AI membuat dropdown kelas secara statis dan lupa memanggil fungsi populate options saat kategori berubah.
- **Perbaikan** (apa yang diubah): Membuat fungsi baru `populateKelasDropdown()` yang mengambil `uniqueKelas` dari data nasabah pelajar. Memanggil fungsi ini di dalam event listener `change` pada `filter-category` dan saat inisialisasi halaman.
- **Test yang membuktikan** (nama test): TC-13 (Filter Nasabah Kategori & Kelas).
- **Commit perbaikan** (pesan commit): `fix: dynamic kelas dropdown population on category change`
- **Ditemukan oleh:** Bersama (Cantika & Isra saat User Acceptance Testing).

---

## Bug 5: Rollback Version Conflict pada Atomic Transfer
- **Gejala** (apa yang terlihat salah): Saat transfer gagal di tengah proses (misal target tidak ditemukan setelah update sender), saldo pengirim ter-rollback. Namun, transaksi *berikutnya* dari pengirim yang sama selalu gagal dengan error "Version conflict".
- **Langkah untuk memunculkan bug:** Simulasi `handleAtomicTransfer` di mana update target gagal. Cek console log, lalu coba lakukan transfer lagi dari akun pengirim yang sama.
- **Aturan bisnis yang dilanggar** (nomor aturan di README): Aturan B.2 (Atomic Transfer & Auto-Rollback) & Aturan D.3 (Optimistic Locking).
- **Penyebab** (file, fungsi, dan penjelasan): `kode.gs`, fungsi `handleAtomicTransfer`. Saat melakukan rollback, AI hanya meng-increment `__version` sebesar `+1`. Padahal, versi data sudah bertambah `+1` saat update awal sender. Sehingga untuk menimpa data yang sudah di-update, rollback harus meng-increment versi menjadi `+2` dari versi awal.
- **Perbaikan** (apa yang diubah): Mengubah logika pembuatan objek rollback menjadi `__version: (sender.__version || 1) + 2` agar sinkron dengan state terbaru di database.
- **Test yang membuktikan** (nama test): TC-BUG-002 (Balance update & rollback test).
- **Commit perbaikan** (pesan commit): `fix: correct version increment on atomic transfer rollback`
- **Ditemukan oleh:** AI (saat code review) & Tim (Mutya saat debugging race condition).
