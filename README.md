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

HTML (HyperText Markup Language): Bahasa markup standar yang digunakan untuk membuat struktur dasar halaman web.

Bootstrap 5: Framework CSS yang digunakan untuk membangun antarmuka web yang responsif dan modern secara cepat melalui kelas-utilitas dan komponen siap pakai.

Pure Node.js: Lingkungan runtime JavaScript di sisi server yang dijalankan tanpa framework tambahan (seperti Express). Pengolahan server, routing, dan manipulasi data dilakukan secara manual menggunakan modul bawaan http.

jQuery & DataTables: Library JavaScript yang menyederhanakan manipulasi DOM. Plugin DataTables digunakan untuk mengelola data dalam tabel secara otomatis, termasuk fitur pencarian dan paginasi.

JSON (JavaScript Object Notation): Format pertukaran data yang ringan digunakan untuk mengirimkan data mahasiswa dari server ke client.

2. Struktur Direktori

Aplikasi ini menggunakan struktur yang minimalis karena tidak memerlukan dependensi eksternal yang besar (tanpa node_modules).

2311102133_CRUD-MAHASISWA/
│
├── assets/                # Folder penyimpanan gambar laporan
│   ├── LogoTelkom.png
│   ├── index.jpeg         # Screenshot Halaman Utama
│   ├── tambahdata.jpeg    # Screenshot Form Tambah
│   ├── editdata.jpeg      # Screenshot Form Edit
│   └── hapusdata.jpeg     # Screenshot Konfirmasi Hapus
│
├── views/                 # Folder tampilan (Frontend)
│   ├── index.html         # Tampilan tabel utama
│   ├── tambah.html        # Form input data baru
│   └── edit.html          # Form pembaruan data
│
├── server.js              # Server Backend (Logic & Routing)
├── package.json           # Konfigurasi project
└── README.md              # Dokumentasi lengkap


3. Struktur Halaman

Berikut adalah tampilan fungsionalitas dari aplikasi CRUD Mahasiswa:

Halaman Utama (Tampil Data)

Menampilkan daftar mahasiswa yang diambil secara dinamis dari API server melalui DataTables.





<img src="2311102133_CRUD-MAHASISWA/assets/index.jpeg" width="800">

Fitur Hapus Data

Terdapat notifikasi konfirmasi sebelum data benar-benar dihapus dari memori server.





<img src="2311102133_CRUD-MAHASISWA/assets/hapusdata.jpeg" width="800">

Halaman Tambah Data

Formulir input untuk menambahkan NIM, Nama, dan Gender mahasiswa baru ke dalam database sementara.





<img src="2311102133_CRUD-MAHASISWA/assets/tambahdata.jpeg" width="800">

Halaman Edit Data

Formulir untuk memperbarui informasi mahasiswa berdasarkan ID yang dipilih.





<img src="2311102133_CRUD-MAHASISWA/assets/editdata.jpeg" width="800">

4. Kode Program

server.js (Backend)

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
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const formData = qs.parse(body);
            const newId = dataMahasiswa.length > 0 ? dataMahasiswa[dataMahasiswa.length - 1].id + 1 : 1;
            dataMahasiswa.push({ id: newId, nim: formData.nim, nama: formData.nama, gender: formData.gender });
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    else if (path.startsWith('/edit/') && req.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const mhs = dataMahasiswa.find(m => m.id === id);
        if (mhs) {
            fs.readFile('./views/edit.html', 'utf8', (err, content) => {
                let rendered = content
                    .replace('{{id}}', mhs.id).replace('{{nim}}', mhs.nim).replace('{{nama}}', mhs.nama)
                    .replace('{{select_L}}', mhs.gender === 'Laki-laki' ? 'selected' : '')
                    .replace('{{select_P}}', mhs.gender === 'Perempuan' ? 'selected' : '');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(rendered);
            });
        }
    }
    else if (path.startsWith('/edit/') && req.method === 'POST') {
        const id = parseInt(path.split('/')[2]);
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const formData = qs.parse(body);
            const index = dataMahasiswa.findIndex(m => m.id === id);
            if (index !== -1) {
                dataMahasiswa[index].nim = formData.nim;
                dataMahasiswa[index].nama = formData.nama;
                dataMahasiswa[index].gender = formData.gender;
            }
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    else if (path.startsWith('/hapus/') && req.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        dataMahasiswa = dataMahasiswa.filter(m => m.id !== id);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    }
});

server.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));


index.html

<!DOCTYPE html>
<html lang="id">
<head>
    <title>Sistem Mahasiswa</title>
    <link href="[https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css](https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css)" rel="stylesheet">
    <link rel="stylesheet" href="[https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css](https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css)">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <h3 class="text-center mb-4">Data Mahasiswa</h3>
        <a href="/tambah" class="btn btn-primary mb-3">Tambah Mahasiswa</a>
        <table id="myTable" class="table table-striped table-bordered">
            <thead class="table-dark">
                <tr><th>NIM</th><th>Nama</th><th>Gender</th><th>Aksi</th></tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <script src="[https://code.jquery.com/jquery-3.7.0.min.js](https://code.jquery.com/jquery-3.7.0.min.js)"></script>
    <script src="[https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js](https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js)"></script>
    <script>
        $(document).ready(function() {
            $('#myTable').DataTable({
                ajax: { url: '/api/mahasiswa', dataSrc: '' },
                columns: [
                    { data: 'nim' }, { data: 'nama' }, { data: 'gender' },
                    { data: null, render: d => `
                        <a href="/edit/${d.id}" class="btn btn-sm btn-warning">Edit</a>
                        <a href="/hapus/${d.id}" class="btn btn-sm btn-danger" onclick="return confirm('Yakin?')">Hapus</a>`
                    }
                ]
            });
        });
    </script>
</body>
</html>


5. Kesimpulan

Aplikasi CRUD ini berhasil dibangun menggunakan arsitektur Node.js murni, menunjukkan pemahaman mendalam tentang manajemen request/response secara manual tanpa framework Express. Integrasi Bootstrap dan jQuery DataTables memberikan pengalaman pengguna yang baik dan profesional dalam pengelolaan data mahasiswa.

6. Link Lampiran

Video Presentasi: [Link GDrive]

Slide PPT: [Link GDrive]
