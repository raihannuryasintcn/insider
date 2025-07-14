
# Laporan Analisis Proyek: Insider Commercial Dashboard

## 1. Pendahuluan

Dokumen ini berisi analisis teknis dan fungsional dari proyek **Insider**, sebuah aplikasi web yang berfungsi sebagai dasbor komersial untuk memetakan dan mengelola data Internet Service Provider (ISP) di seluruh Indonesia. Analisis ini mencakup arsitektur perangkat lunak, fungsionalitas utama, alur data, skema database, serta rekomendasi untuk pengembangan lebih lanjut.

**Tujuan Proyek:**
Insider dirancang untuk memberikan visibilitas terhadap profil ISP, termasuk risiko, kelayakan penagihan (`collection rate`), cakupan wilayah (TR), dan status operasional lainnya. Aplikasi ini membantu pengguna (kemungkinan tim sales, analis, dan manajemen) dalam mengambil keputusan strategis berbasis data.

**Tumpukan Teknologi (Tech Stack):**
*   **Frontend:** React (dengan Vite), Tailwind CSS, shadcn/ui, React Router, Axios.
*   **Backend:** Node.js dengan framework Express.js.
*   **Database:** PostgreSQL.
*   **Lainnya:** JWT untuk autentikasi, Multer untuk upload file, Winston untuk logging, Jest & Supertest untuk testing.

---

## 2. Arsitektur Proyek

Aplikasi ini mengadopsi arsitektur monolitik dengan backend dan frontend yang berada dalam satu repositori, namun dengan pemisahan yang jelas (clear separation of concerns).

### 2.1. Frontend (`/src`)

Frontend dibangun menggunakan React dan Vite, yang memberikan pengalaman pengembangan yang modern dan cepat.

*   **Struktur Direktori:** Kode diorganisir dengan baik ke dalam direktori `pages`, `components`, `services`, dan `lib`, yang merupakan praktik umum di ekosistem React.
*   **Styling:** Menggunakan Tailwind CSS yang dibantu oleh `clsx` dan `tailwind-merge`, serta komponen UI dari `shadcn/ui`. Ini memungkinkan pembuatan antarmuka yang konsisten dan modern dengan cepat.
*   **Routing:** `react-router-dom` digunakan untuk menangani navigasi sisi klien antara berbagai halaman seperti `Home`, `ListIsp`, `Funnel`, dan halaman laporan (`TR1` - `TR4`).
*   **Komunikasi API:** `axios` digunakan dalam direktori `services` untuk berkomunikasi secara terstruktur dengan API backend.
*   **Integrasi Eksternal:** Terdapat komponen `PowerBiReportViewer.jsx`, yang mengindikasikan bahwa aplikasi ini meng-embed laporan dari Microsoft Power BI untuk visualisasi data yang kompleks.

### 2.2. Backend (`/server`)

Backend dibangun dengan Node.js dan Express.js, menyediakan API RESTful untuk frontend.

*   **Struktur Direktori:** Backend memiliki struktur yang logis, memisahkan `routes`, `controllers`, `services`, `middleware`, dan `config`.
*   **API Endpoints:** Rute-rute didefinisikan secara jelas berdasarkan fungsionalitas:
    *   `authRoutes`: Login dan manajemen sesi.
    *   `userRoutes`: Operasi CRUD untuk pengguna (khusus admin).
    *   `adminRoutes`: Endpoint khusus admin.
    *   `ispRoutes`: Mengambil data ISP.
    *   `uploadRoutes`: Menangani upload file Excel.
    *   `statusRoutes`: Menyediakan data agregat untuk dasbor.
*   **Middleware:** Penggunaan middleware sangat baik untuk menangani tugas-tugas lintas-fungsi:
    *   `auth.js`: Memverifikasi token JWT dan peran pengguna (admin/user).
    *   `errorHandler.js`: Penanganan error terpusat.
    *   `validators.js`: Validasi input untuk request body.
    *   `logger.js`: Logging request dan error menggunakan Winston.
*   **Konfigurasi:** Pengaturan koneksi database dan variabel lingkungan dikelola melalui file `.env`, yang merupakan praktik terbaik untuk keamanan dan fleksibilitas.

### 2.3. Database

Proyek ini menggunakan **PostgreSQL** sebagai sistem manajemen database. Koneksi dikelola oleh library `pg`. Skema database tampaknya dinormalisasi dengan baik, terutama untuk data yang berasal dari proses ETL.

---

## 3. Fungsionalitas Utama

1.  **Autentikasi dan Manajemen Pengguna:**
    *   Sistem login aman menggunakan JWT dan password yang di-hash dengan `bcryptjs`.
    *   Peran pengguna dibedakan antara `administrator` dan `user`.
    *   Admin memiliki hak untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada data pengguna.

2.  **Proses ETL (Extract, Transform, Load) via Upload Excel:**
    *   Ini adalah fitur inti dari aplikasi. Admin dapat mengunggah file Excel yang berisi data operasional.
    *   Backend mem-parsing file ini, memvalidasi, dan memproses setiap baris untuk memperbarui database.
    *   Sistem ini cukup canggih, dengan kemampuan untuk mendeteksi perubahan data menggunakan hash MD5 per baris (`generateHashFromRow`) untuk menghindari pembaruan yang tidak perlu.
    *   Data dari Excel dinormalisasi ke dalam beberapa tabel master (`locations`, `companies`, `services`) dan tabel transaksional (`contracts`, `funnel_statuses`, `revenues`).

3.  **Visualisasi Data dan Pelaporan:**
    *   Menampilkan data ISP dalam bentuk tabel (`ListIsp.jsx`) dan kemungkinan dalam bentuk peta (menggunakan `geodata.geojson`).
    *   Menyediakan dasbor ringkasan (`status.js`).
    *   Integrasi dengan **Power BI** (`PowerBiReportViewer.jsx`) memungkinkan penyajian laporan interaktif yang kompleks, yang sulit dibangun dari awal. Halaman `TR1` hingga `TR4` kemungkinan besar adalah implementasi dari viewer ini.

4.  **Logging Aktivitas:**
    *   Setiap tindakan penting seperti login, pembuatan pengguna, atau penghapusan pengguna dicatat dalam tabel `activity_logs`, lengkap dengan alamat IP. Ini sangat penting untuk audit dan keamanan.

---

## 4. Alur Proses Data (ETL)

Alur kerja pemrosesan data dari file Excel adalah sebagai berikut:

1.  **Upload:** Admin mengunggah file melalui antarmuka frontend.
2.  **Penerimaan File:** Endpoint `POST /upload-excel` menerima file menggunakan `multer` dan menyimpannya sementara di server.
3.  **Parsing:** `parser.js` menggunakan library `xlsx` untuk membaca file Excel dan mengubahnya menjadi format JSON.
4.  **Pemrosesan Baris:** Setiap baris data dari JSON diproses oleh `rowProcessor.js`.
5.  **Hashing:** Hash MD5 dibuat dari konten baris untuk perbandingan.
6.  **Normalisasi (Get or Create):** `masterHelpers.js` memeriksa apakah entitas seperti lokasi, perusahaan, atau layanan sudah ada di database. Jika tidak, entitas baru akan dibuat. Jika sudah ada, ID yang ada akan digunakan. Ini mencegah duplikasi data master.
7.  **Pembaruan Data Inti:**
    *   Sistem memeriksa apakah ada kontrak yang cocok berdasarkan `company_id`, `service_id`, dan `start_month`.
    *   **Jika tidak ada:** Kontrak baru dan statusnya (`funnel_statuses`, `revenues`, dll.) akan dibuat (`INSERT`).
    *   **Jika ada:** Sistem membandingkan hash MD5 dari baris baru dengan `data_hash` yang tersimpan. Jika berbeda, data kontrak dan tabel terkait akan diperbarui (`UPDATE`). Jika sama, proses dilewati.
8.  **Logging Perubahan:** Setiap operasi `INSERT` atau `UPDATE` dicatat untuk keperluan audit.
9.  **Pembersihan:** File Excel yang diunggah akan dihapus dari server setelah selesai diproses.

---

## 5. Skema Database (Berdasarkan Analisis Kode)

*   `users`: Menyimpan informasi kredensial dan peran pengguna.
*   `activity_logs`: Mencatat semua aktivitas penting pengguna dan admin.
*   `data_isp`: Kemungkinan tabel awal yang berisi data mentah atau data master ISP.
*   `locations`: Tabel master untuk data lokasi (TR, distrik).
*   `companies`: Tabel master untuk data perusahaan/pelanggan.
*   `services`: Tabel master untuk jenis layanan yang ditawarkan.
*   `account_managers`: Tabel master untuk data Account Manager.
*   `contracts`: Tabel inti yang merepresentasikan kontrak dengan pelanggan, menghubungkan `companies`, `services`, dan `account_managers`.
*   `funnel_statuses`: Mencatat status dari setiap kontrak (misalnya, "LEADS", "PROSPECT", "DEAL").
*   `contract_distributions`: Menyimpan data distribusi kuantitas per kuartal/bulan untuk sebuah kontrak.
*   `revenues`: Menyimpan data pendapatan per kuartal/bulan untuk sebuah kontrak.

---

## 6. Analisis & Rekomendasi

Proyek ini memiliki fondasi yang kuat dan mengikuti banyak praktik terbaik dalam pengembangan perangkat lunak. Berikut adalah beberapa area untuk perbaikan dan pengembangan lebih lanjut.

### 6.1. Kekuatan

*   **Struktur Kode yang Baik:** Pemisahan yang jelas antara frontend, backend, dan antara `routes`, `controllers`, `services` di backend.
*   **Proses ETL yang Kuat:** Alur kerja upload Excel sangat solid, dengan deteksi perubahan dan normalisasi data.
*   **Keamanan:** Menggunakan praktik standar seperti hashing password, JWT, dan validasi input. Adanya logging aktivitas adalah nilai tambah yang besar.
*   **Manajemen Konfigurasi:** Penggunaan file `.env` untuk mengelola variabel lingkungan.

### 6.2. Rekomendasi Perbaikan

1.  **Database Transaction pada Proses ETL:**
    *   **Masalah:** Proses di `rowProcessor.js` melakukan beberapa operasi tulis ke database (misalnya, `UPDATE contracts`, `UPDATE funnel_statuses`). Jika salah satu operasi gagal di tengah jalan, database bisa berada dalam keadaan tidak konsisten.
    *   **Rekomendasi:** Bungkus seluruh logika pemrosesan untuk satu baris data dalam sebuah **transaksi database** (`BEGIN`, `COMMIT`, `ROLLBACK`). Jika ada error di salah satu query, semua perubahan untuk baris tersebut akan dibatalkan, menjaga integritas data.

2.  **Manajemen Secret & Konfigurasi:**
    *   **Masalah:** Di beberapa file (misalnya `middleware/auth.js`), terdapat nilai fallback hardcoded untuk `JWT_SECRET` (`'your-secret-key'`). Ini berisiko jika variabel lingkungan tidak ter-set dengan benar di production.
    *   **Rekomendasi:** Hapus nilai fallback dan buat aplikasi gagal启动 (fail fast) jika variabel lingkungan penting seperti `JWT_SECRET` atau konfigurasi database tidak ada. Ini memastikan aplikasi tidak pernah berjalan dalam mode tidak aman.

3.  **Peningkatan Testing:**
    *   **Masalah:** Meskipun `jest` dan `supertest` sudah ada, belum jelas sejauh mana cakupan tes (test coverage) yang ada.
    *   **Rekomendasi:** Prioritaskan penulisan unit test untuk logika bisnis yang krusial, terutama di `userService.js` dan `rowProcessor.js`. Tambahkan juga integration test untuk memverifikasi alur API dari request hingga respons, termasuk middleware.

4.  **Dokumentasi API:**
    *   **Masalah:** Tidak ada dokumentasi API terpusat.
    *   **Rekomendasi:** Pertimbangkan untuk mengimplementasikan **Swagger** atau **OpenAPI** di backend Express. Ini akan secara otomatis menghasilkan dokumentasi API yang interaktif, yang sangat membantu kolaborasi antara tim frontend dan backend.

5.  **Penanganan Error di Frontend:**
    *   **Rekomendasi:** Pastikan frontend memiliki mekanisme untuk menangani error dari API secara elegan dan memberikan umpan balik yang jelas kepada pengguna (misalnya, menggunakan notifikasi "toast").

---

## 7. Kesimpulan

**Insider** adalah aplikasi dasbor komersial yang dirancang dan dibangun dengan baik. Arsitekturnya solid, fungsionalitasnya sesuai dengan tujuan bisnis, dan telah menerapkan banyak praktik terbaik dalam keamanan dan struktur kode. Proses ETL untuk data Excel adalah fitur yang paling menonjol dan kuat.

Dengan menerapkan beberapa perbaikan yang direkomendasikan—terutama transaksi database pada ETL dan peningkatan cakupan testing—proyek ini dapat menjadi lebih andal, aman, dan mudah untuk dikelola di masa depan.
