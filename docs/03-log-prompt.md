# 💬 03 - Log Prompt

**Alat AI yang dipakai:** Qwen, Gemini Pro
**Catatan:** Hanya mencatat prompt penting (menghasilkan kode utama, ditolak/diperbaiki, dan debugging).
**Catatan Keamanan:** Semua prompt telah disanitasi untuk menghapus data sensitif (password, nomor HP asli, nama lengkap narasumber).

---

##  Tabel Log Prompt

| No | Waktu | Langkah ke- | Prompt (ringkas & sanitized) | Hasil dari AI | Keputusan tim (diterima / diubah / ditolak) dan alasannya | Commit Fix |
|----|-------|-----------|------------------------------|--------------|----------------------------------------------------------|------------|
| 1 | 1 Okt 2026 | 1 (Scaffolding) | "Buatkan struktur backend Google Apps Script untuk sistem bank sekolah dengan 4 sheet (users, transactions, settings, notifications). Tambahkan LockService dan CacheService untuk optimasi read/write." | Menghasilkan kode GAS dasar dengan fungsi `setupDatabase`, `readSheetDataBatch_`, dan `writeSheetRowsBatch_` menggunakan JSON per row. | **Diterima.** Struktur batch operation sangat membantu mengurangi quota API calls Google Sheets. | `d4e5f6g` |
| 2 | 5 Okt 2026 | 4 (Autentikasi) | "Buatkan sistem login dual portal. URL `?page=nasabah` hanya untuk nasabah, `?page=admin` untuk staff. Login direktur dicek di backend, password direktur tidak boleh ada di kode frontend." | Menghasilkan fungsi `checkDirectorLogin` di GAS dan parsing `URLSearchParams` di frontend untuk memblokir login silang. | **Diterima.** Keamanan password direktur terjaga karena validasi penuh dilakukan di server (GAS). | `l0m1n2o` |
| 3 | 8 Okt 2026 | 7 (Transfer Saldo) | "Implementasikan `handleAtomicTransfer` di GAS. Gunakan optimistic locking dengan field `__version`. Jika update saldo penerima gagal, saldo pengirim harus di-rollback dengan increment version yang benar." | AI membuat logic rollback, tetapi increment `__version` saat rollback salah (hanya +1, padahal seharusnya +2 karena sudah di-increment saat update awal). | **Diubah.** Tim memperbaiki manual: `senderRollback.__version = (sender.__version \|\| 1) + 2` untuk mencegah version conflict di request berikutnya. | `x9y0z1a` → `a1a2a3a` (fix) |
| 4 | 12 Okt 2026 | 9 (Laporan & Cetak) | "Buatkan CSS `@media print` untuk tabel data nasabah yang panjang. Harus support multi-page A4, header tabel (thead) repeat di setiap halaman, font kecil (10px), dan data tidak boleh terpotong." | AI memberikan CSS dengan `overflow: hidden` dan `max-height: 100vh` pada container `#print-area`. | **Ditolak/Diubah.** Tim mengubah menjadi `overflow: visible !important` dan `max-height: none !important` agar browser bisa me-render halaman ke-2, ke-3, dst. | `f5g6h7i` → `b4b5b6b` (fix) |
| 5 | 15 Okt 2026 | 10 (Optimasi) | "Buatkan Request Queue pattern di frontend Vanilla JS (dataSdk) untuk mencegah race condition saat user mengklik tombol transaksi 2x. Tambahkan tracking sessionStorage untuk anti-duplikasi." | Menghasilkan fungsi `_queueRequest` yang memproses promise secara sequential dan logic `sessionStorage.getItem('currentTransaction')` di `handleTransaction`. | **Diterima.** Berhasil mencegah double submission dan menstabilkan antrian request ke backend GAS yang memiliki limitasi concurrency. | `j8k9l0m` |
| 6 | 18 Okt 2026 | 12 (Change Request) | "Tambahkan fitur filter nasabah berdasarkan Kategori (Pelajar/Umum) dan Kelas. Dropdown Kelas harus dinamis mengambil data unik dari database. Tambahkan juga sort saldo dan nama A-Z." | AI membuat filter, tetapi opsi dropdown kelas di-hardcode dan tidak otomatis ter-update saat user mengubah dropdown Kategori. | **Diubah.** Tim menambahkan fungsi `populateKelasDropdown()` yang mengambil `uniqueKelas` dari data, dan dipanggil ulang via `addEventListener` pada `filter-category`. | `r4s5t6u` → `c7c8c9c` (fix) |
| 7 | 20 Okt 2026 | 11 (Bug Hunt) | "Setelah broadcast notifikasi via `handleCreateBatch`, data tidak muncul di UI nasabah sampai di-refresh manual. Mengapa cache tidak ter-invalidate?" | AI menganalisis kode dan menemukan bahwa fungsi `handleCreateBatch` di versi awal tidak memanggil `invalidateCache_()` di akhir proses. | **Diterima (Insight).** Tim menambahkan `invalidateCache_()` di blok `finally` fungsi `handleCreateBatch` untuk memaksa real-time sync tanpa refresh. | `n1o2p3q` |
| 8 | 22 Okt 2026 | 13 (Dokumentasi) | "Buatkan template README.md dan Spesifikasi Produk untuk proyek BSS. Sertakan tabel audit fitur yang memetakan pain point wawancara user ke solusi fitur aplikasi." | Menghasilkan struktur README dengan badge, tabel fitur, dan tabel Pain Point → Solusi yang sangat rapi. | **Diterima.** Menghemat waktu penulisan dokumentasi dan memastikan semua pain point dari hasil wawancara terakomodasi di fitur. | `v7w8x9y` |

---

## 📝 Evaluasi Penggunaan AI

### Kelebihan AI dalam Proyek Ini:

1. **Boilerplate Code:** Sangat cepat dalam membuat struktur dasar CRUD, setup database, dan konfigurasi Tailwind CSS.
2. **Pattern Recognition:** Mampu memberikan design pattern yang tepat seperti Request Queue, Debounce, dan Optimistic Locking ketika diminta menangani concurrency.
3. **Dokumentasi:** Sangat baik dalam merapikan catatan teknis menjadi tabel dan format Markdown yang mudah dibaca.
4. **Analisis Bug:** Mampu menganalisis kode dan menemukan root cause masalah (seperti kasus cache invalidation).

### Kekurangan AI dalam Proyek Ini:

1. **Konteks Stateful (Rollback):** AI sering lupa melacak perubahan state yang terjadi beberapa baris sebelumnya (seperti kasus increment `__version` saat rollback transaksi).
2. **CSS Print & Browser Quirks:** AI cenderung memberikan CSS print standar yang sering gagal di kasus edge-case seperti tabel multi-halaman dengan sticky header. Perlu intervensi manual `!important` dan `display: table-header-group`.
3. **Dynamic DOM Event:** AI terkadang membuat elemen HTML statis tanpa memikirkan bagaimana event listener harus di-re-bind jika elemen tersebut di-render ulang secara dinamis (seperti kasus dropdown filter kelas).
4. **Cache Invalidation:** AI fokus pada operasi write tetapi lupa bahwa cache harus di-invalidate setelah write operation.

### Kesimpulan Tim:

AI digunakan sebagai **Co-pilot, bukan Auto-pilot**. Setiap kode yang dihasilkan AI, terutama yang berkaitan dengan transaksi keuangan (saldo, locking, rollback) dan CSS print, wajib melalui code review dan testing manual oleh tim sebelum di-deploy.

---

## 🔒 Catatan Keamanan Prompt

- Tidak ada password, PIN, atau kredensial asli yang dimasukkan ke dalam prompt
- Nomor HP yang digunakan dalam prompt adalah nomor dummy (contoh: `081234567890`)
- Nama narasumber wawancara tidak disebutkan dalam prompt
- Data finansial yang digunakan dalam prompt adalah angka hipotetis
- Semua prompt disimpan dalam format sanitized untuk dokumentasi
