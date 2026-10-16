# 🧠 07 - Refleksi Tim

**Nama Proyek:** BSS - Bank Syariah Sekolah (BASAMO)
**Tim:** Mutya Laura (Backend/Lead), Cantika Amelian (Frontend/UI), Isra Julian Sari (QA/Docs)
**Tanggal Refleksi:** 15 Oktober 2026

---

## 1. Apa yang berjalan baik dalam cara kami bekerja dengan AI?

Hal terbaik yang kami lakukan adalah **menetapkan AI sebagai "Co-pilot", bukan "Auto-pilot"**. Kami tidak pernah langsung melakukan *copy-paste* kode dari AI ke produksi tanpa pemeriksaan. 

Kami juga membagi peran secara jelas saat membuat *prompt*:
*   **Mutya** fokus membuat *prompt* untuk logika backend (Google Apps Script, *locking*, *database*).
*   **Cantika** fokus membuat *prompt* untuk UI/UX, Tailwind CSS, dan *responsive design*.
*   **Isra** fokus membuat *prompt* untuk *test cases*, skenario *edge-case*, dan dokumentasi.

Pembagian ini membuat *prompt* yang dihasilkan sangat spesifik dan kontekstual, sehingga AI tidak bingung dan menghasilkan kode yang lebih terstruktur. Selain itu, kami selalu meminta AI untuk menjelaskan *mengapa* ia menulis kode tertentu, yang sangat membantu proses *code review*.

---

## 2. Kapan AI paling membantu? Kapan AI justru menyulitkan?

### 🟢 Kapan AI Paling Membantu:
*   **Boilerplate & Struktur Awal:** Membuat fungsi CRUD dasar, setup database Google Sheets, dan struktur HTML/Tailwind sangat cepat.
*   **Generasi Data Dummy & Test Cases:** AI sangat hebat dalam membuat skenario pengujian yang beragam, termasuk *edge cases* yang mungkin kami lewatkan.
*   **Dokumentasi & Formatting:** Mengubah catatan teknis yang berantakan menjadi tabel Markdown, README, dan spesifikasi produk yang rapi.
*   **Regex & Validasi:** Membuat pola validasi untuk No. HP, PIN, dan format Rupiah.

### 🔴 Kapan AI Justru Menyulitkan:
*   **State Management & Logika Berantai:** AI sering "lupa" perubahan *state* yang terjadi beberapa baris sebelumnya. Contoh: saat membuat logika *rollback* transaksi, AI tidak memperhitungkan bahwa `__version` sudah di-increment di langkah sebelumnya.
*   **CSS Print & Browser Quirks:** AI memberikan CSS print standar yang sering gagal untuk kasus kompleks seperti tabel multi-halaman dengan *sticky header*. Kami harus banyak melakukan *trial and error* manual.
*   **Dynamic DOM Event Binding:** Saat merender ulang elemen HTML secara dinamis (seperti dropdown filter), AI sering lupa bahwa *event listener* harus di-*re-bind*, menyebabkan fitur tidak berjalan setelah render pertama.

---

## 3. Kesalahan terbesar yang hampir lolos, dan bagaimana kami menemukannya?

**Kesalahan Terbesar: Logika Rollback pada Atomic Transfer yang Salah**

*   **Masalah:** Saat mengimplementasikan `handleAtomicTransfer`, AI membuat logika *rollback* jika update saldo penerima gagal. Namun, AI hanya meng-increment `__version` pengirim sebesar `+1` saat *rollback*. Padahal, karena pengirim sudah di-update di langkah sebelumnya (version +1), *rollback* seharusnya meng-increment version menjadi `+2` dari versi awal.
*   **Dampak jika lolos:** Jika terjadi *race condition* (2 teller menyetor ke 1 nasabah bersamaan), transaksi berikutnya akan gagal dengan error *"Version conflict"* karena nomor versi di database tidak sinkron dengan ekspektasi sistem. Ini bisa menyebabkan saldo nasabah "nyangkut" dan tidak bisa bertransaksi.
*   **Bagaimana kami menemukannya:** Isra (QA) melakukan **pengujian konkurensi manual** (simulasi 2 user melakukan transfer dari rekening yang sama secara bersamaan). Saat melihat error *version conflict* di console log setelah transaksi berhasil di-rollback, Mutya (Backend) melakukan *trace* manual baris demi baris dan menemukan kesalahan increment versi AI.

**Kesalahan Kedua: CSS Print `overflow: hidden`**
*   **Masalah:** AI memberikan CSS `overflow: hidden` dan `max-height: 100vh` pada container print.
*   **Penemuan:** Saat Isra menguji cetak data 100 nasabah, data setelah halaman pertama hilang total. Cantika memperbaikinya secara manual dengan `overflow: visible !important`.

---

## 4. Apa yang akan kami lakukan berbeda jika mengulang challenge ini?

1.  **Menerapkan Test-Driven Development (TDD):** Kami akan membuat *test cases* dan *acceptance criteria* **sebelum** meminta AI menulis kode. Ini akan memaksa AI untuk menulis kode yang memenuhi syarat pengujian sejak awal, bukan sekadar "berjalan".
2.  **Membuat "Prompt Engineering Guideline" untuk Tim:** Kami akan membuat dokumen standar tentang cara menulis *prompt* yang baik (misal: selalu sertakan batasan, minta AI handle *edge cases*, dan minta penjelasan logika).
3.  **Melakukan Code Review Lebih Awal:** Kami menunggu semua fitur inti selesai baru melakukan review besar-besaran. Jika mengulang, kami akan melakukan review per modul (misal: selesai fitur login, langsung review dan test).
4.  **Membuat Mockup UI di Kertas Sebelum Coding:** Cantika akan membuat sketsa UI di kertas/Figma sebelum meminta AI membuat kode HTML, agar AI tidak "berimprovisasi" dengan layout yang tidak sesuai keinginan.

---

## 5. Bagaimana kami mengatur waktu? Langkah mana yang jauh lebih lama dari estimasi, dan kenapa?

Kami menggunakan pendekatan *timeboxing* (maksimal 60 menit per langkah kecil). Secara umum, estimasi waktu kami cukup akurat untuk fitur UI standar. Namun, ada beberapa langkah yang **jauh lebih lama dari estimasi**:

*   **Langkah 7: Transfer Saldo (Atomic Transfer)**
    *   *Estimasi:* 60 menit.
    *   *Waktu Sebenarnya:* 75 menit.
    *   *Alasan:* Debugging logika *optimistic locking* dan *rollback* di Google Apps Script sangat memakan waktu. AI memberikan kode yang terlihat benar secara sintaks, tetapi salah secara logika *state*. Kami harus berhenti mengandalkan AI dan menggambar alur logika di papan tulis secara manual.
*   **Langkah 10: Optimasi & Locking**
    *   *Estimasi:* 60 menit.
    *   *Waktu Sebenarnya:* 90 menit.
    *   *Alasan:* Memahami batasan `LockService` dan `CacheService` di GAS. AI menyarankan `Promise.all` untuk paralelisasi, yang ternyata tidak bekerja optimal di environment GAS. Kami harus membuang saran AI dan kembali ke pendekatan *batch write* sequential.
*   **Langkah 9: Fitur Cetak & Laporan (Print CSS)**
    *   *Estimasi:* 60 menit.
    *   *Waktu Sebenarnya:* 75 menit (dan masih ada *tweaking* minor).
    *   *Alasan:* Perbedaan cara rendering print di Chrome, Firefox, dan Edge. AI tidak bisa memberikan solusi "satu ukuran untuk semua", sehingga kami harus melakukan *hardcoding* CSS `!important` dan menguji print di 3 browser berbeda.

---

## 6. Bagian mana dari kode yang masih belum kami pahami sepenuhnya? (Jawab dengan jujur)

Sebagai tim pelajar/mahasiswa yang baru mendalami sistem *backend-as-a-service*, ada beberapa bagian kode yang kami gunakan namun belum 100% memahami mekanisme internalnya:

1.  **Mekanisme Internal `LockService` Google:** 
    Kami memahami cara *menggunakan* `LockService.getScriptLock()` dan `waitLock()`, tetapi kami tidak sepenuhnya memahami bagaimana Google mengantrikan *request* di level server ketika antrean sangat panjang (misal > 50 user bersamaan). Apakah ada batas maksimal antrean? Apa yang terjadi di balik layar jika *timeout* 15 detik tercapai?
2.  **Batas Pasti `CacheService`:** 
    Kami menggunakan *try-catch* dan `removeAll()` jika cache penuh, tetapi kami tidak tahu persis berapa batas ukuran memori cache di GAS (apakah 100KB? 1MB per key?). Kami belum pernah benar-benar menjebol batas ini, jadi kami tidak tahu persis dampaknya.
3.  **Garbage Collection pada `setInterval` (Polling):** 
    Kami menggunakan `setInterval` 5 detik untuk *polling* data, dan menghentikannya dengan `clearInterval` saat tab *hidden* menggunakan *Visibility API*. Kami belum sepenuhnya yakin bagaimana *browser garbage collection* menangani *closure* dan variabel di dalam interval tersebut jika tab dibiarkan *background* selama berjam-jam. Apakah ada risiko *memory leak*?
4.  **Regex Edge-Case untuk Nomor HP Internasional:** 
    Regex kami (`/^08\d{8,12}$/`) sangat spesifik untuk nomor Indonesia. Kami belum memahami cara membuat regex yang fleksibel untuk format nomor internasional (E.164 format) tanpa membuat sistem menjadi terlalu kompleks.

---

> **Catatan Penutup Tim:**
> Proyek BSS ini mengajarkan kami bahwa **AI adalah alat yang sangat kuat, tetapi bukan pengganti pemahaman fundamental**. AI bisa menulis kode 10x lebih cepat, tetapi hanya pemahaman logika manusia yang bisa memastikan kode tersebut benar, aman, dan sesuai dengan kebutuhan bisnis. Kami bangga dengan sistem ini, dan kami siap untuk terus belajar dan memperbaikinya di versi 3.0.
