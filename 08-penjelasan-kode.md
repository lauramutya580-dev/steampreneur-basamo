# 📖 08 - Penjelasan Kode

**Nama Proyek:** BSS - Bank Syariah Sekolah (BASAMO)
**Tanggal:** 15 Oktober 2026

> **Catatan:** Tidak ada sesi presentasi, jadi dokumen ini adalah bukti utama bahwa tim memahami kode yang dihasilkan AI. Setiap anggota menjelaskan bagian kode dengan bahasa sendiri setelah berdiskusi dan membedah kode bersama.

---

##  Bagian A: Penjelasan per Anggota

### 👤 Penjelasan 1 & 2: Mutya Laura (Ketua Tim / Backend)

#### Penjelasan 1
- **Ditulis oleh:** Mutya Laura
- **File dan fungsi:** `kode.gs` - fungsi `handleAtomicTransfer`
- **Apa yang dilakukan:** Fungsi ini memproses transfer saldo antar nasabah secara atomik. Artinya, jika proses update saldo penerima gagal di tengah jalan, saldo pengirim akan otomatis dikembalikan (rollback) ke nilai semula agar data tidak korup.
- **Kenapa dibuat seperti ini:** Karena ini adalah sistem keuangan, kita tidak boleh membiarkan saldo pengirim berkurang jika uangnya tidak sampai ke penerima. Kami menggunakan *Optimistic Locking* dengan field `__version` untuk mencegah *race condition* saat dua orang mentransfer uang dari rekening yang sama secara bersamaan.
- **Contoh:** Jika inputnya `fromAccount: 081234567890`, `toAccount: 081234567899`, `amount: 50000`, dan saldo pengirim Rp100.000. Hasilnya saldo pengirim jadi Rp50.000 dan penerima bertambah Rp50.000.
- **Jika input salah atau kosong:** Jika `amount <= 0` atau saldo pengirim kurang dari `amount`, fungsi akan langsung `return { status: false, error: '...' }` di awal tanpa memproses apa pun. Jika terjadi *version conflict* saat update penerima, sistem akan melakukan rollback saldo pengirim dengan meng-increment `__version` menjadi `+2` (bukan +1) karena versi sudah bertambah 1 saat update awal.

#### Penjelasan 2
- **Ditulis oleh:** Mutya Laura
- **File dan fungsi:** `kode.gs` - fungsi `acquireLock_` dan `releaseLock_`
- **Apa yang dilakukan:** Fungsi ini mengelola antrian eksekusi skrip menggunakan `LockService.getScriptLock()`. `acquireLock_` akan mencoba "mengunci" database selama 15 detik. Jika gagal karena ada skrip lain yang sedang berjalan, ia akan menunggu dan mencoba ulang (retry) maksimal 3 kali dengan jeda waktu yang makin lama (*exponential backoff*).
- **Kenapa dibuat seperti ini:** Google Apps Script membatasi eksekusi konkuren. Tanpa *lock*, jika 2 Teller menginput setor tunai di detik yang sama, salah satu data bisa tertimpa (lost update). *Exponential backoff* (`Math.pow(2, attempts) * 100`) mencegah server dibebani oleh *retry* yang terjadi secara bersamaan.
- **Contoh:** Jika Teller A dan Teller B klik "Proses" bersamaan, Teller A dapat *lock*. Teller B akan masuk ke `catch (e)`, tidur selama 200ms, lalu coba lagi.
- **Jika input salah atau kosong:** Jika parameter `lockName` kosong, fungsi tetap berjalan karena `lockName` hanya digunakan untuk log `console.error`. Jika *timeout* 15 detik tercapai 3x berturut-turut, fungsi akan melempar *error* `'Sistem sedang sibuk...'`.

---

### 👤 Penjelasan 3 & 4: Cantika Amelian (Anggota / Frontend & UI)

#### Penjelasan 3
- **Ditulis oleh:** Cantika Amelian
- **File dan fungsi:** `index.html` - fungsi `renderNasabahManagement` dan `filterNasabah`
- **Apa yang dilakukan:** Fungsi ini merender tabel daftar nasabah dan menyediakan fitur *filtering* serta *sorting* secara *real-time*. `filterNasabah` mengambil nilai dari dropdown (Kategori, Kelas, Status, Sort Saldo) dan input pencarian, lalu memfilter array `nasabahList` dan merender ulang `<tbody>` tanpa me-reload halaman.
- **Kenapa dibuat seperti ini:** Untuk UX yang lebih baik. Admin tidak perlu menunggu loading server setiap kali mengetik 1 huruf di kolom pencarian. Kami menggunakan fungsi `debounce(..., 300)` agar fungsi filter baru dipanggil 300ms setelah user berhenti mengetik, menghemat pemrosesan DOM.
- **Contoh:** Jika user memilih Kategori "Pelajar" dan Sort "Saldo Tertinggi", fungsi akan memfilter array hanya untuk `category === 'pelajar'`, lalu mengurutkannya dengan `(b.balance || 0) - (a.balance || 0)`.
- **Jika input salah atau kosong:** Jika kolom pencarian kosong, fungsi tidak memfilter nama. Jika tidak ada data yang cocok dengan filter, tabel akan menampilkan baris `<td colspan="...">Tidak ada data nasabah</td>`.

#### Penjelasan 4
- **Ditulis oleh:** Cantika Amelian
- **File dan fungsi:** `index.html` - blok CSS `@media print`
- **Apa yang dilakukan:** Blok CSS ini mengatur tampilan khusus saat user menekan tombol Cetak (Print). Ia menyembunyikan semua elemen UI (sidebar, tombol, header) menggunakan `visibility: hidden`, dan hanya menampilkan area `#print-area`. Ia juga memaksa tabel untuk bisa melintasi banyak halaman A4.
- **Kenapa dibuat seperti ini:** Awalnya AI memberikan CSS dengan `overflow: hidden` yang memotong data di halaman pertama. Kami memperbaikinya secara manual. Kami menggunakan `display: table-header-group !important` pada `thead` agar judul kolom (Nama, Saldo, dll) otomatis muncul di atas setiap halaman baru saat dicetak. Kami juga mengecilkan font ke `10px` dan padding ke `4px` agar tabel muat lebih banyak.
- **Contoh:** Jika user mencetak 100 data nasabah, browser akan menghasilkan 4 halaman A4. Halaman 2, 3, dan 4 tetap memiliki header tabel yang rapi.
- **Jika input salah atau kosong:** Jika data kosong, tabel tetap tercetak namun hanya menampilkan baris "Tidak ada data" di tengah halaman.

---

### 👤 Penjelasan 5 & 6: Isra Julian Sari (Anggota / QA & Docs)

#### Penjelasan 5
- **Ditulis oleh:** Isra Julian Sari
- **File dan fungsi:** `index.html` - objek `window.dataSdk` (fungsi `_queueRequest` dan `_processQueue`)
- **Apa yang dilakukan:** Ini adalah pola *Request Queue* di frontend. Setiap kali aplikasi memanggil `dataSdk.create`, `update`, atau `delete`, request tidak langsung dikirim ke backend, melainkan dimasukkan ke dalam array `_requestQueue`. Fungsi `_processQueue` akan memproses antrian ini satu per satu secara berurutan (*sequential*) dengan jeda 50ms.
- **Kenapa dibuat seperti ini:** Untuk mencegah *race condition* di sisi frontend dan menghindari membebani Google Apps Script yang memiliki limitasi eksekusi paralel. Jika user mengklik tombol "Simpan" 3x dengan cepat, request ke-2 dan ke-3 akan menunggu request ke-1 selesai.
- **Contoh:** Jika user mengklik "Setor Tunai" 2x dalam 100ms, request pertama masuk queue dan langsung diproses. Request kedua masuk queue dan menunggu 50ms setelah request pertama selesai.
- **Jika input salah atau kosong:** Jika array `_requestQueue` kosong, fungsi `_processQueue` akan langsung `return` dan menghentikan loop. Jika request gagal (reject), error akan ditangkap dan diteruskan ke `resolve({ isOk: false })` tanpa menghentikan antrian berikutnya.

#### Penjelasan 6
- **Ditulis oleh:** Isra Julian Sari
- **File dan fungsi:** `index.html` - fungsi `handleTransaction` (Logika Anti-Duplikasi)
- **Apa yang dilakukan:** Fungsi ini memproses transaksi setor/tarik tunai. Di dalam fungsi ini, ada logika khusus menggunakan `sessionStorage` untuk mencegah *double submission*. Sebelum memproses, sistem membuat `transactionKey` unik dan menyimpannya di `sessionStorage`.
- **Kenapa dibuat seperti ini:** Karena validasi di backend saja tidak cukup untuk mencegah UX yang buruk. Jika user mengklik tombol 2x, tanpa ini, user akan melihat loading 2x dan mungkin mendapat error transaksi ganda. `sessionStorage` dipilih karena key ini hanya perlu berlaku selama 1 sesi tab browser aktif.
- **Contoh:** Saat tombol "Proses Transaksi" diklik, `sessionStorage.setItem('currentTransaction', 'trx_0812...')` dijalankan. Jika user klik lagi sebelum selesai, sistem akan cek `sessionStorage.getItem('currentTransaction')`, menemukan nilainya ada, dan langsung memunculkan toast "Transaksi sebelumnya masih diproses...".
- **Jika input salah atau kosong:** Key di `sessionStorage` akan selalu dihapus di blok `finally` (atau setelah transaksi sukses/gagal) menggunakan `sessionStorage.removeItem('currentTransaction')`, sehingga user bisa melakukan transaksi baru setelahnya.

---

## 🤝 Bagian B: Pertanyaan yang Dijawab Bersama

### 1. Jika aturan bisnis utama di spesifikasi berubah, file dan fungsi mana yang harus diubah?
**Contoh Perubahan:** "Nasabah tidak boleh melakukan transfer pada hari Minggu dan tanggal merah."
**File & Fungsi yang diubah:**
- **`index.html` - fungsi `showPinModal` dan `handleTransfer`:** Kami harus menambahkan logika pengecekan tanggal di awal fungsi. Misalnya, `const today = new Date(); if (today.getDay() === 0) { showToast('Transfer tidak bisa dilakukan hari Minggu'); return; }`.
- **`kode.gs` - fungsi `handleAtomicTransfer`:** Untuk keamanan berlapis (defense in depth), pengecekan tanggal juga harus ditambahkan di backend sebelum proses transfer dimulai, agar user tidak bisa membypass validasi frontend menggunakan API call langsung.

### 2. Bagaimana data mengalir dari saat pengguna mengisi form sampai hasilnya tampil di layar?
**Alur Data (Contoh: Setor Tunai):**
1. **User Input:** Teller mengisi form dan klik "Proses Transaksi" di `index.html`.
2. **Frontend Validation:** Fungsi `handleTransaction` memvalidasi input (cek saldo, cek PIN Teller, cek anti-duplikasi `sessionStorage`).
3. **Frontend Request:** Memanggil `window.dataSdk.create(transactionData)`. Request masuk ke `_queueRequest`.
4. **Bridge ke Backend:** `dataSdk` memanggil `google.script.run.withSuccessHandler(...).handleCreate(data)`.
5. **Backend Processing (`kode.gs`):** Fungsi `handleCreate` dipanggil. Ia mendapatkan *Lock* (`acquireLock_`), membuat UUID, menyimpan JSON ke Google Sheets via `writeSheetRowsBatch_`, dan meng-invalidate cache (`invalidateCache_`).
6. **Backend Response:** Backend mengembalikan objek `{ status: true, allData: [...] }`.
7. **Frontend Update:** `dataSdk` menerima data, mengupdate `_lastDataHash`, dan memanggil `window._dataHandler.onDataChanged(res.allData)`.
8. **UI Rendering:** `dataHandler` mengupdate variabel global `allData`, mencari data user yang terupdate, dan memanggil `softUpdateUI()` untuk merender ulang saldo di layar tanpa reload halaman.

### 3. Pilih satu unit test. Apa yang diuji, dan dalam kondisi apa test itu akan gagal?
**Test yang dipilih:** TC-10 (Input Jumlah Negatif/Huruf) pada fungsi `parseRupiah` dan `handleTransaction`.
- **Apa yang diuji:** Menguji apakah sistem mampu menolak atau membersihkan input jumlah transaksi yang berisi huruf atau tanda negatif.
- **Kondisi gagal:** Test akan **GAGAL** jika user berhasil memasukkan "Rp -50.000" atau "Rp abc" dan sistem memprosesnya sebagai transaksi valid (saldo bertambah/berkurang).
- **Cara kerja di kode:** Fungsi `parseRupiah` menggunakan regex `.replace(/[^\d]/g, '')` yang otomatis menghapus semua karakter kecuali angka. Jika input "abc", hasilnya `0`. Di `handleTransaction`, ada validasi `if (!amount || amount <= 0) { showToast('Masukkan jumlah yang valid'); return; }`. Karena hasilnya 0, validasi ini akan menangkapnya dan membatalkan transaksi.

### 4. Pilih satu saran AI yang kalian tolak. Apa sarannya dan kenapa kalian menolaknya?
**Saran AI yang ditolak:** "Ganti `LockService.getScriptLock()` dengan `LockService.getUserLock()` di `kode.gs` untuk memungkinkan *concurrent access* dari user berbeda."
**Alasan Penolakan:** 
Kami menolak saran ini karena kami sudah mempelajari dokumentasi Google Apps Script. `UserLock` hanya mengunci eksekusi berdasarkan *email user yang sedang login*. Karena aplikasi BSS kami diakses oleh banyak role (Teller, Admin, Nasabah) yang mungkin tidak selalu login dengan Google Account pribadi (atau menggunakan mode *Anyone can access*), `UserLock` tidak akan efektif mencegah *race condition* saat dua Teller mengedit nasabah yang sama di Google Sheets. `ScriptLock` (yang mengunci di level skrip/database) jauh lebih aman untuk kasus *shared database* seperti Google Sheets kami.

### 5. Bagian kode mana yang paling sulit dipahami, dan bagaimana kalian akhirnya memahaminya?
**Bagian tersulit:** Logika *rollback* pada `handleAtomicTransfer` di `kode.gs`, khususnya baris:
`__version: (sender.__version || 1) + 2` saat melakukan rollback saldo pengirim.
**Bagaimana kami memahaminya:**
Awalnya, kami (terutama Mutya) bingung kenapa harus `+2` dan bukan `+1`. AI tidak menjelaskan alasannya dengan jelas. Kami akhirnya memahami dengan cara **menggambar alur state di papan tulis (whiteboard)**:
1. Saldo awal: `version = 1`.
2. Update saldo pengirim (tahap 1): `version` menjadi `1 + 1 = 2`. (Data di sheet sekarang versi 2).
3. Update saldo penerima GAGAL (tahap 2).
4. Rollback saldo pengirim: Kita harus mengupdate data yang *sekarang* berada di versi 2. Agar *optimistic locking* di fungsi `updateSheetRowOptimistic_` menerima update ini, `expectedVersion` harus `currentVersion + 1` (yaitu 2 + 1 = 3).
5. Maka, saat membuat objek rollback, kita harus langsung set `__version` menjadi `1 + 2 = 3`. 
Setelah menggambar alur ini, kami langsung paham dan memperbaiki kode AI yang awalnya hanya menulis `+1`.

---
> **Dokumen ini ditandatangani secara digital melalui commit GitHub oleh masing-masing anggota tim pada tanggal 15 Oktober 2026.**
