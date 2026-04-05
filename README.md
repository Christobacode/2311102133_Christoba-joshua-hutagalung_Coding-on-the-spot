<h1 align="center">LAPORAN PRAKTIKUM</h1>
<h1 align="center">APLIKASI BERBASIS PLATFORM</h1>

<h2 align="center">TUGAS COTS MONEV 1</h2>
<h2 align="center">CRUD DATA MAHASISWA</h2>

<p align="center">
<img src="2311102133_CRUD-MAHASISWA/assets/LogoTelkom.png" width="350" alt="Logo Telkom University">
</p>

<h2 align="center">Disusun Oleh :</h2>

<p align="center" style="font-size:24px;">
<b>Christoba Joshua Hutagalung</b>


<b>2311102133</b>


<b>S1 Teknik Informatika 2023</b>
</p>

<h2 align="center">Dosen Pengampu :</h2>

<p align="center" style="font-size:24px;">
<b>Cahyo Prihantoro, S.Kom., M.Eng</b>
</p>



<h2 align="center">LABORATORIUM HIGH PERFORMANCE


FAKULTAS INFORMATIKA


UNIVERSITAS TELKOM PURWOKERTO


TAHUN 2026</h2>

<hr>

1. Dasar Teori
HTML (HyperText Markup Language): Bahasa dasar struktur website.

CSS & Bootstrap: Framework untuk memperindah tampilan menggunakan Bootstrap 5 via CDN.

Pure Node.js: Dibangun menggunakan Node.js murni tanpa framework tambahan (seperti Express.js) untuk handling routing dan CRUD.

JQuery & DataTables: Library Javascript dan plugin untuk menampilkan data mahasiswa dalam tabel dinamis.

JSON (JavaScript Object Notation): Format pertukaran data dari server ke client.

2. Struktur Direktori
Plaintext
2311102133_CRUD-MAHASISWA/
│
├── assets/                # Screenshot laporan
│   ├── LogoTelkom.png
│   ├── home.jpeg          # Halaman utama
│   ├── tambahdata.jpeg    # Form tambah
│   ├── editdata.jpeg      # Form edit
│   └── hapusdata.jpeg     # Pop up konfirmasi
│
├── views/                 # Frontend
│   ├── index.html
│   ├── tambah.html
│   └── edit.html
│
├── server.js              # Backend
│
├── package.json
└── README.md
3. Struktur Halaman
Halaman Home / Tampil Data
Menampilkan data mahasiswa menggunakan jQuery DataTables dari sumber JSON.


<img src="2311102133_CRUD-MAHASISWA/assets/home.jpeg" width="800">

Konfirmasi hapus data menggunakan alert bawaan.


<img src="2311102133_CRUD-MAHASISWA/assets/hapusdata.jpeg" width="800">

Halaman Form (Tambah Data)
Form input NIM, Nama, dan Gender menggunakan metode POST.


<img src="2311102133_CRUD-MAHASISWA/assets/tambahdata.jpeg" width="800">

Halaman Edit (Edit Data)
Mengubah data mahasiswa berdasarkan ID dengan manipulasi string placeholder dari server.


<img src="2311102133_CRUD-MAHASISWA/assets/editdata.jpeg" width="800">

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
5. Kesimpulan
Aplikasi CRUD Mahasiswa berhasil dibangun menggunakan Pure Node.js, Bootstrap 5, dan jQuery DataTables dengan data format JSON sesuai kriteria MONEV 1.

6. Link Lampiran
Video Presentasi MONEV 1: [Masukkan Link GDrive Video Di Sini]

Slide Presentasi (PPT): [Masukkan Link GDrive PPT Di Sini]
