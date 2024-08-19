# Bank Sampah Desa

Bank Sampah adalah aplikasi manajemen transaksi yang memungkinkan pengguna untuk melakukan setoran dan penarikan saldo dari sampah yang dijual kepada pengepul. Aplikasi ini mendukung otentikasi pengguna dan otorisasi berbasis peran, di mana admin dapat mengelola semua transaksi dan pengguna biasa hanya dapat melihat transaksi mereka sendiri.

## Fitur

- **Otentikasi dan Otorisasi**: Pengguna dapat masuk dan mengakses fitur sesuai dengan peran mereka (admin atau pengguna biasa).
- **Manajemen Transaksi**: Pengguna dapat melakukan setoran dan penarikan sampah.
- **Laporan Transaksi**: Admin dapat melihat semua transaksi, sementara pengguna biasa hanya dapat melihat transaksi mereka sendiri.
- **Filter Transaksi**: Transaksi dapat difilter berdasarkan nama pengguna dan rentang tanggal.
- **Artikel** : tersedia menu untuk membuat artikel bagi admin agar bisa memberikan info terbaru dan pengumuman penting lainnya.

- **Import Pengguna dari Excel** : Admin dapat import data nasabah menggunakan file excel dengan mudah.

## Documentation

[Documentation API](https://documenter.getpostman.com/view/34321986/2sA3s9CnsS)

## Run Locally

Clone the project

```bash
  git clone git@github.com:bozid95/bank-sampah.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Setting .env

```bash
DB_NAME             = "dbname"
DB_USER             = "root"
DB_PASSWORD         = ""
DB_URL              = "localhost"
DB_DIALECT          = "mysql"
JWT_SECRET          = "screet"
PORT                = 3000
```

Start the server

```bash
  npm run dev or start
```

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan fork repositori ini dan buat pull request dengan perubahan Anda. Pastikan untuk mengikuti pedoman kontribusi yang ada.

Lisensi
Proyek ini dilisensikan di bawah MIT License.

Kontak
Jika Anda memiliki pertanyaan atau masalah, silakan buka isu di repositori ini atau hubungi kami di widodo.web.id.

Jika Anda memiliki pertanyaan lebih lanjut atau butuh bantuan tambahan, jangan ragu untuk bertanya!
