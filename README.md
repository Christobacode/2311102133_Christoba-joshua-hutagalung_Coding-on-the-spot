<h1 align="center">LAPORAN PRAKTIKUM</h1>
<h1 align="center">APLIKASI BERBASIS PLATFORM</h1>

<br>

<h2 align="center">TUGAS COTS </h2>
<h2 align="center">Data - Mahasiswa</h2>

<br><br>

<p align="center">
<img src="2311102133_CRUD-MAHASISWA/assets/LogoTelkom.png" width="350">
</p>
<br><br><br>

<h2 align="center">Disusun Oleh :</h2>

<p align="center" style="font-size:28px;">
  <b>Christoba joshua hutagalung</b><br>
  <b>2311102133</b><br>
  <b>S1 IF-11-REG 04</b>
</p>
<br>
<h2 align="center">Dosen Pengampu :</h2>

<p align="center" style="font-size:28px;">
  <b>Cahyo Prihantoro, S.Kom., M.Eng </b>
</p>
<br>

<br>
<h1 align="center">LABORATORIUM HIGH PERFORMANCE</h1>
<h1 align="center">FAKULTAS INFORMATIKA</h1>
<h1 align="center">UNIVERSITAS TELKOM PURWOKERTO</h1>
<h1 align="center">TAHUN 2026</h1>

<hr>

## 1. Dasar Teori
**HTML** atau HyperText Markup Language merupakan bahasa dasar yang digunakan untuk membangun sebuah web dimana HTML menangani elemen-elemen dasar pada pembangunan sebuah website.<br>

**CSS & Bootstrap** merupakan framework yang membantu memperindah tampilan dari laman web yang telah dibangun dengan HTML. Aplikasi ini menggunakan Bootstrap 5 melalui CDN untuk mempercepat pengembangan antarmuka web, mencakup pembuatan tabel, tombol, dan form input.<br>

**Pure Node.js** Aplikasi ini dibangun menggunakan Node.js murni tanpa framework tambahan (seperti Express.js). Node JS merupakan runtime environment yang memungkinkan JavaScript dijalankan di sisi server. Pada aplikasi ini, NodeJS menangani routing dan proses CRUD langsung menggunakan modul bawaan http dan fs.<br>

**JAVASCRIPT & JQUERY** Javascript merupakan bahasa pemrograman scripting. jQuery adalah sebuah library Javascript yang memungkinkan manipulasi dokumen HTML dilakukan hanya dalam beberapa baris code. Dalam tugas ini, jQuery digunakan bersama plugin DataTables untuk menampilkan data mahasiswa secara dinamis yang bersumber dari API JSON lokal.<br>

**JSON (JavaScript Object Notation)** merupakan format pertukaran data yang ringan dan mudah dibaca oleh manusia maupun mesin. JSON digunakan sebagai format data yang dikirim dari server ke client untuk dirender ke dalam tabel secara dinamis.<br>
## 2. Stuktur Folder
```
daftar-kontak/
│
├── node_modules/          # Folder dependency NodeJS
│
|── assets/                # untuk menyimpan gambar
├── public/                # Folder frontend 
│   ├── index.html         # Halaman utama (tabel)
│   ├── form.html          # Halaman tambah data mahasiswa
│   ├── edit.html          # Halaman edit data mahasiswa
│   └── tambah.html        # Halaman tambah data mahasiswa
│
├── data.json              # Database sederhana (format JSON)
│
├── server.js              # Backend (NodeJS dan API CRUD)
│
├── package.json           # Konfigurasi project & dependency
│
└── README.md              # Dokumentasi aplikasi
```
## 3. Struktur  Halaman
Website daftar-kontak ini memiliki struktur halaman sebagai berikut :
### Halaman Home
Halaman ini menampilkan data mahasiswa dalam bentuk tabel interaktif menggunakan jQuery DataTables. Data ditarik dari API server dalam format JSON. Terdapat juga tombol aksi untuk Edit dan Hapus.
<img src="2311102133_CRUD-MAHASISWA/assets/home.jpeg">

Terdapat fitur notifikasi konfirmasi bawaan browser saat tombol hapus ditekan untuk memastikan keamanan penghapusan data.
<img src="2311102133_CRUD-MAHASISWA/assets/hapusdata.jpeg">

### Halaman Form (Tambah Data)
Digunakan untuk menambahkan data mahasiswa baru. User mengisi form berupa NIM, Nama Lengkap, dan Gender yang akan dikirim ke server menggunakan method POST.
<img src="2311102133_CRUD-MAHASISWA/assets/tambahdata.jpeg">

### Halaman Edit (Edit data mahasiswa)
Digunakan untuk mengubah data yang sudah ada. Backend akan mengganti tag placeholder dengan data asli mahasiswa sebelum halaman ditampilkan kepada user.
<img src="2311102133_CRUD-MAHASISWA/assets/editdata.jpeg">

## 4. Kode Program
### A. `server.js`
```js
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// Data array ini akan dikonversi otomatis jadi JSON untuk tabel
let mahasiswa = [
    { id: 1, nim: "1202230001", nama: "Joshua", gender: "Laki-laki" },
    { id: 2, nim: "1202230002", nama: "Siti", gender: "Perempuan" }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    // ROUTE 1: Halaman Tabel
    if (path === '/' && req.method === 'GET') {
        fs.readFile('./views/index.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // ROUTE API: JSON untuk Jquery Datatable
    else if (path === '/api/mahasiswa' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mahasiswa));
    }
    // ROUTE 2: Halaman Tambah
    else if (path === '/tambah' && req.method === 'GET') {
        fs.readFile('./views/tambah.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // PROSES: Tambah Data
    else if (path === '/tambah' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const postData = querystring.parse(body);
            const newId = mahasiswa.length > 0 ? mahasiswa[mahasiswa.length - 1].id + 1 : 1;
            mahasiswa.push({ id: newId, nim: postData.nim, nama: postData.nama, gender: postData.gender });
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    // ROUTE 3: Halaman Edit
    else if (path.startsWith('/edit/') && req.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const dataMhs = mahasiswa.find(m => m.id === id);
        if (dataMhs) {
            fs.readFile('./views/edit.html', 'utf8', (err, data) => {
                let html = data
                    .replace('{{id}}', dataMhs.id).replace('{{nim}}', dataMhs.nim).replace('{{nama}}', dataMhs.nama)
                    .replace('{{sel_l}}', dataMhs.gender === 'Laki-laki' ? 'selected' : '')
                    .replace('{{sel_p}}', dataMhs.gender === 'Perempuan' ? 'selected' : '');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } else {
            res.writeHead(302, { 'Location': '/' }); res.end();
        }
    }
    // PROSES: Edit Data
    else if (path.startsWith('/edit/') && req.method === 'POST') {
        const id = parseInt(path.split('/')[2]);
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const postData = querystring.parse(body);
            const index = mahasiswa.findIndex(m => m.id === id);
            if (index !== -1) {
                mahasiswa[index].nim = postData.nim; mahasiswa[index].nama = postData.nama; mahasiswa[index].gender = postData.gender;
            }
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    // PROSES: Hapus Data
    else if (path.startsWith('/hapus/') && req.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        mahasiswa = mahasiswa.filter(m => m.id !== id);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    }
    // 404 Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Halaman Tidak Ditemukan</h1>');
    }
});

server.listen(3000, () => { console.log('Server berjalan di http://localhost:3000'); });
```
**penjelasan `server.js`**
File server.js adalah program backend yang dibangun murni menggunakan Pure Node.js tanpa framework tambahan seperti Express. Saya menggunakan modul bawaan seperti http, fs, url, dan querystring untuk menjalankan server di port 3000 dan mengatur routing URL secara manual menggunakan logika if-else. Karena belum menggunakan database eksternal, data disimpan sementara di memori dalam bentuk Array. File ini memproses semua operasi CRUD: menyediakan API JSON untuk tabel, menyimpan input dari form, menghapus elemen array, dan memanipulasi string HTML untuk menampilkan halaman Edit.
### B. `/2311102133_CRUD-MAHASISWA/views/index.html`###
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Data Mahasiswa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css">
</head>
<body>
    <div class="container mt-5">
        <h2 class="mb-4">Data Mahasiswa</h2>
        <a href="/tambah" class="btn btn-primary mb-3">+ Tambah Mahasiswa</a>
        <table id="tabelMahasiswa" class="table table-striped table-bordered">
            <thead class="table-dark">
                <tr><th>NIM</th><th>Nama</th><th>Gender</th><th>Aksi</th></tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#tabelMahasiswa').DataTable({
                ajax: { url: '/api/mahasiswa', dataSrc: '' },
                columns: [
                    { data: 'nim' }, { data: 'nama' }, { data: 'gender' },
                    { data: null, render: function(data, type, row) {
                            return `<a href="/edit/${row.id}" class="btn btn-warning btn-sm">Edit</a>
                                    <a href="/hapus/${row.id}" class="btn btn-danger btn-sm" onclick="return confirm('Yakin hapus?')">Hapus</a>`;
                        }
                    }
                ]
            });
        });
    </script>
</body>
</html>
```
**penjelasan `/2311102133_CRUD-MAHASISWA/views/index.html`**
File index.html adalah halaman utama untuk menampilkan daftar mahasiswa. Saya menggunakan Bootstrap 5 agar tampilannya rapi dan responsif secara instan. Untuk tabelnya, saya memanfaatkan jQuery DataTables yang mengambil data JSON dari server (/api/mahasiswa) menggunakan metode AJAX. Dengan plugin ini, tabel otomatis memiliki fitur pencarian (search) dan pagination tanpa perlu coding manual. Di setiap baris juga terdapat tombol Edit dan Hapus, di mana tombol Hapus dilengkapi pop-up konfirmasi keamanan bawaan JavaScript untuk mencegah salah klik.
### C. `/2311102133_CRUD-MAHASISWA/views/tambah.html`###
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Data</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="card shadow" style="max-width: 500px; margin: auto;">
            <div class="card-header bg-primary text-white"><h4>Tambah Data</h4></div>
            <div class="card-body">
                <form action="/tambah" method="POST">
                    <div class="mb-3"><label>NIM</label><input type="text" name="nim" class="form-control" required></div>
                    <div class="mb-3"><label>Nama Lengkap</label><input type="text" name="nama" class="form-control" required></div>
                    <div class="mb-3"><label>Gender</label>
                        <select name="gender" class="form-select" required>
                            <option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-success w-100">Simpan</button>
                    <a href="/" class="btn btn-secondary w-100 mt-2">Batal</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
```
**penjelasan `/2311102133_CRUD-MAHASISWA/views/tambah.html`**
File tambah.html berfungsi sebagai antarmuka (frontend) khusus untuk menambahkan data mahasiswa baru ke dalam sistem. Agar tampilan formulir terlihat rapi, terpusat, dan profesional, saya menggunakan komponen Card dan Form Control dari Bootstrap 5.<br>
Komponen utama pada halaman ini adalah elemen <form> yang dikonfigurasi menggunakan metode pengiriman POST dengan tujuan (action) ke endpoint /tambah. Form ini memiliki tiga isian data, yaitu input teks untuk NIM, input teks untuk Nama Lengkap, dan opsi dropdown (select) untuk Gender. Sebagai bentuk validasi dasar di sisi client, saya menambahkan atribut required pada setiap inputan sehingga sistem akan menolak form yang dikirim jika masih ada kolom yang dibiarkan kosong. Ketika tombol "Simpan" ditekan, data akan langsung dikirim ke backend (server.js) untuk diproses dan disimpan ke dalam array data.

### D. `/2311102133_CRUD-MAHASISWA/views/edit.html`###
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Data</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="card shadow" style="max-width: 500px; margin: auto;">
            <div class="card-header bg-warning"><h4>Edit Data</h4></div>
            <div class="card-body">
                <form action="/edit/{{id}}" method="POST">
                    <div class="mb-3"><label>NIM</label><input type="text" name="nim" class="form-control" value="{{nim}}" required></div>
                    <div class="mb-3"><label>Nama Lengkap</label><input type="text" name="nama" class="form-control" value="{{nama}}" required></div>
                    <div class="mb-3"><label>Gender</label>
                        <select name="gender" class="form-select" required>
                            <option value="Laki-laki" {{sel_l}}>Laki-laki</option><option value="Perempuan" {{sel_p}}>Perempuan</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-success w-100">Update Data</button>
                    <a href="/" class="btn btn-secondary w-100 mt-2">Batal</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
```
**penjelasan `/2311102133_CRUD-MAHASISWA/views/edit.html`**
Program di atas merupakan halaman yang digunakan untuk mengubah data kontak yang sudah ada (Update). Saat halaman dibuka, aplikasi akan mengambil data kontak berdasarkan ID melalui endpoint GET /kontak/:id dan menampilkannya pada form input.
Pengguna dapat mengubah data yang ada dengan validasi yang sama seperti pada halaman tambah. Setelah form disubmit, data akan dikirim ke server menggunakan Fetch API dengan metode PUT dalam format JSON. Proses ini dilakukan secara asynchronous tanpa reload halaman. Setelah data berhasil diperbarui, sistem akan menampilkan notifikasi dan mengarahkan pengguna kembali ke halaman utama.

### E. `/2311102133_CRUD-MAHASISWA/package.json`###
```json
{
  "name": "2311102133_crud-mahasiswa",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```
**penjelasan `/2311102133_CRUD-MAHASISWA/views/edit.html`**
Program di atas merupakan halaman yang digunakan untuk mengubah data kontak yang sudah ada (Update). Saat halaman dibuka, aplikasi akan mengambil data kontak berdasarkan ID melalui endpoint GET /kontak/:id dan menampilkannya pada form input.
Pengguna dapat mengubah data yang ada dengan validasi yang sama seperti pada halaman tambah. Setelah form disubmit, data akan dikirim ke server menggunakan Fetch API dengan metode PUT dalam format JSON. Proses ini dilakukan secara asynchronous tanpa reload halaman. Setelah data berhasil diperbarui, sistem akan menampilkan notifikasi dan mengarahkan pengguna kembali ke halaman utama.

## 5. Link Video Presentasi
https://drive.google.com/drive/folders/1t4o5d0Yb6jzZZ7FV-OmwJccXR4d-BwnK?usp=drive_link
