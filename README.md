<h1 align="center">LAPORAN PRAKTIKUM</h1>
<h1 align="center">APLIKASI BERBASIS PLATFORM</h1>

<br>

<h2 align="center">TUGAS COTS MONEV 1</h2>
<h2 align="center">CRUD DATA MAHASISWA</h2>

<br>

<p align="center">
  <img src="2311102133_CRUD-MAHASISWA/assets/LogoTelkom.png" width="350" alt="Logo Telkom University">
</p>

<br>

<h2 align="center">Disusun Oleh :</h2>

<p align="center" style="font-size:24px;">
  <b>Christoba Joshua Hutagalung</b><br>
  <b>2311102133</b><br>
  <b>S1 Teknik Informatika 2023</b>
</p>

<br>

<h2 align="center">Dosen Pengampu :</h2>

<p align="center" style="font-size:24px;">
  <b>Cahyo Prihantoro, S.Kom., M.Eng</b>
</p>

<br><br>

<h2 align="center">LABORATORIUM HIGH PERFORMANCE<br>FAKULTAS INFORMATIKA<br>UNIVERSITAS TELKOM PURWOKERTO<br>TAHUN 2026</h2>

<hr>

## 1. Dasar Teori

* **HTML (HyperText Markup Language):** Merupakan bahasa dasar yang digunakan untuk membangun sebuah web dimana HTML menangani elemen-elemen dasar pada struktur sebuah website.
* **CSS & Bootstrap:** Merupakan framework yang membantu memperindah tampilan dari laman web. Aplikasi ini menggunakan Bootstrap 5 melalui CDN untuk mempercepat pengembangan antarmuka web, mencakup pembuatan tabel yang responsif, tombol, dan form input.
* **Pure Node.js:** Aplikasi ini dibangun menggunakan Node.js murni tanpa framework tambahan (seperti Express.js). Proses routing (pengaturan URL) dan penyajian data JSON ditangani langsung menggunakan modul bawaan `http` dan `fs`.
* **JQuery & DataTables:** jQuery adalah library Javascript yang mempermudah manipulasi DOM. Dalam tugas ini, jQuery digunakan bersama plugin **DataTables** untuk menampilkan, memfilter, mencari, dan memanipulasi data mahasiswa dalam bentuk tabel secara dinamis yang bersumber dari API JSON lokal.
* **JSON (JavaScript Object Notation):** Merupakan format pertukaran data yang ringan dan mudah dibaca. JSON digunakan sebagai format representasi data yang dikirim dari server (backend) ke client (frontend) untuk dirender ke dalam tabel secara dinamis.

<br>

## 2. Struktur Direktori

Karena menggunakan pendekatan **Pure Node.js**, aplikasi ini sangat ringan dan efisien karena tidak memerlukan instalasi *dependency* eksternal ataupun folder `node_modules`.

```text
2311102133_CRUD-MAHASISWA/
│
├── assets/                # Folder untuk menyimpan screenshot laporan
│   ├── LogoTelkom.png
│   ├── home.jpeg          # Halaman utama (tabel)
│   ├── tambahdata.jpeg    # Form tambah
│   ├── editdata.jpeg      # Form edit
│   └── hapusdata.jpeg     # Pop up konfirmasi hapus
│
├── views/                 # Folder frontend (tampilan HTML)
│   ├── index.html         # Halaman utama (tabel)
│   ├── tambah.html        # Halaman form tambah data
│   └── edit.html          # Halaman edit data
│
├── server.js              # Backend (Pure NodeJS, API CRUD)
│
├── package.json           # Konfigurasi project
└── README.md              # Dokumentasi aplikasi
3. Struktur Halaman
Website CRUD Mahasiswa ini memiliki struktur halaman sebagai berikut:

Halaman Home / Tampil Data
Halaman ini menampilkan data mahasiswa dalam bentuk tabel interaktif memakai plugin jQuery DataTables. Data diambil dari server dalam format JSON dan ditampilkan secara dinamis.


<img src="2311102133_CRUD-MAHASISWA/assets/home.jpeg" alt="Halaman Home" width="800">

Terdapat pop-up konfirmasi bawaan browser saat tombol hapus ditekan untuk mencegah penghapusan data yang tidak disengaja.


<img src="2311102133_CRUD-MAHASISWA/assets/hapusdata.jpeg" alt="Pop Up Hapus" width="800">

Halaman Form (Tambah Data)
Halaman ini digunakan untuk menambahkan data mahasiswa baru. User dapat mengisi form berupa NIM, Nama Lengkap, dan memilih Jenis Kelamin.


<img src="2311102133_CRUD-MAHASISWA/assets/tambahdata.jpeg" alt="Halaman Tambah Data" width="800">

Halaman Edit (Edit Data)
Halaman ini digunakan untuk mengubah data mahasiswa yang sudah ada. Data lama akan ditarik dari server dan ditampilkan secara otomatis pada form berdasarkan ID.


<img src="2311102133_CRUD-MAHASISWA/assets/editdata.jpeg" alt="Halaman Edit Data" width="800">

4. Kode Program
A. server.js (Backend)
JavaScript
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring'); 

let dataMahasiswa = [
    { id: 1, nim: "1202230001", nama: "Christoba Joshua", gender: "Laki-laki" },
    { id: 2, nim: "1202230002", nama: "Siti Fotonah", gender: "Perempuan" }
];

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const path = reqUrl.pathname;

    if (path === '/' && req.method === 'GET') {
        fs.readFile('./views/index.html', (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    else if (path === '/api/mahasiswa' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dataMahasiswa));
    }
    else if (path === '/tambah' && req.method === 'GET') {
        fs.readFile('./views/tambah.html', (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    else if (path === '/tambah' && req.method === 'POST') {
        let bodyForm = '';
        req.on('data', chunk => { bodyForm += chunk.toString(); });
        req.on('end', () => {
            const formData = qs.parse(bodyForm);
            const newId = dataMahasiswa.length > 0 ? dataMahasiswa[dataMahasiswa.length - 1].id + 1 : 1;
            dataMahasiswa.push({ id: newId, nim: formData.nim, nama: formData.nama, gender: formData.gender });
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    else if (path.startsWith('/edit/') && req.method === 'GET') {
        const idMhs = parseInt(path.split('/')[2]);
        const mhs = dataMahasiswa.find(m => m.id === idMhs);
        if (mhs) {
            fs.readFile('./views/edit.html', 'utf8', (err, content) => {
                let htmlSiapTampil = content
                    .replace('{{id}}', mhs.id).replace('{{nim}}', mhs.nim).replace('{{nama}}', mhs.nama)
                    .replace('{{select_L}}', mhs.gender === 'Laki-laki' ? 'selected' : '')
                    .replace('{{select_P}}', mhs.gender === 'Perempuan' ? 'selected' : '');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(htmlSiapTampil);
            });
        }
    }
    else if (path.startsWith('/edit/') && req.method === 'POST') {
        const idMhs = parseInt(path.split('/')[2]);
        let bodyForm = '';
        req.on('data', chunk => { bodyForm += chunk.toString(); });
        req.on('end', () => {
            const formData = qs.parse(bodyForm);
            const indexMhs = dataMahasiswa.findIndex(m => m.id === idMhs);
            if (indexMhs !== -1) {
                dataMahasiswa[indexMhs].nim = formData.nim;
                dataMahasiswa[indexMhs].nama = formData.nama;
                dataMahasiswa[indexMhs].gender = formData.gender;
            }
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    else if (path.startsWith('/hapus/') && req.method === 'GET') {
        const idMhs = parseInt(path.split('/')[2]);
        dataMahasiswa = dataMahasiswa.filter(m => m.id !== idMhs);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    }
});

server.listen(3000, () => console.log('Server MONEV jalan di http://localhost:3000'));
Penjelasan server.js:
Program di atas merupakan aplikasi backend murni menggunakan Node.js yang berjalan pada port 3000. Aplikasi ini berfungsi sebagai server untuk mengelola data mahasiswa yang disimpan sementara dalam variabel array. Modul bawaan http dan fs digunakan untuk memproses request dan menampilkan file frontend.

B. /views/index.html
HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Data Mahasiswa</title>
    <link href="[https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css](https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css)" rel="stylesheet">
    <link rel="stylesheet" href="[https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css](https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css)">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="mb-4 text-center">Data Mahasiswa (Tugas CRUD MONEV)</h3>
                <table id="tabelMhs" class="table table-hover table-bordered" style="width:100%">
                    <thead class="table-dark">
                        <tr>
                            <th>NIM</th>
                            <th>Nama Lengkap</th>
                            <th>Gender</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
    <script src="[https://code.jquery.com/jquery-3.7.0.min.js](https://code.jquery.com/jquery-3.7.0.min.js)"></script>
    <script src="[https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js](https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js)"></script>
    <script src="[https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js](https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js)"></script>
</body>
</html>
Penjelasan /views/index.html:
Halaman utama yang menampilkan data dalam bentuk tabel interaktif menggunakan plugin jQuery DataTables. Data diambil dari API /api/mahasiswa dalam format JSON.

5. Kesimpulan
Aplikasi web CRUD Mahasiswa telah berhasil dibangun dengan memanfaatkan pendekatan Pure Node.js. Data dirender dalam format JSON menggunakan plugin jQuery DataTables dan tampilan antarmuka web dibangun menggunakan framework Bootstrap 5, memenuhi seluruh kriteria spesifikasi teknis untuk tugas MONEV 1.

6. Link Lampiran
Video Presentasi MONEV 1: [Masukkan Link GDrive Video Di Sini]

Slide Presentasi (PPT): [Masukkan Link GDrive PPT Di Sini]
