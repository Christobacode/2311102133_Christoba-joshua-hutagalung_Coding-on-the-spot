<h1 align="center">LAPORAN PRAKTIKUM</h1>
<h1 align="center">APLIKASI BERBASIS PLATFORM</h1>

<h2 align="center">TUGAS COTS MONEV 1</h2>
<h2 align="center">CRUD DATA MAHASISWA</h2>



<p align="center">
<img src="assets/LogoTelkom.png" width="350">
</p>




<h2 align="center">Disusun Oleh :</h2>

<p align="center" style="font-size:28px;">
<b>Christoba Joshua Hutagalung</b>


<b>2311102133</b>


<b>S1 Teknik Informatika 2023</b>
</p>


<h2 align="center">Dosen Pengampu :</h2>

<p align="center" style="font-size:28px;">
<b>Cahyo Prihantoro, S.Kom., M.Eng </b>
</p>


<hr>

1. Dasar Teori
HTML atau HyperText Markup Language merupakan bahasa dasar yang digunakan untuk membangun sebuah web dimana HTML menangani elemen-elemen dasar pada pembangunan sebuah website.


CSS & Bootstrap merupakan framework yang membantu memperindah tampilan dari laman web yang telah dibangun dengan HTML. Aplikasi ini menggunakan Bootstrap 5 melalui CDN untuk mempercepat pengembangan antarmuka web, mencakup pembuatan tabel, tombol, dan form input.


Pure Node.js Aplikasi ini dibangun menggunakan Node.js murni tanpa framework tambahan. Node JS merupakan runtime environment yang memungkinkan JavaScript dijalankan di sisi server. Pada aplikasi ini, NodeJS menangani routing dan proses CRUD langsung menggunakan modul bawaan http dan fs.


JAVASCRIPT & JQUERY Javascript, seperti namanya, merupakan bahasa pemrograman scripting. jQuery adalah sebuah library Javascript yang dibuat oleh John Resig pada tahun 2006. Dalam tugas ini, jQuery digunakan bersama plugin DataTables untuk menampilkan, memfilter, dan memanipulasi data mahasiswa dalam bentuk tabel secara dinamis yang bersumber dari API JSON lokal.


JSON (JavaScript Object Notation) merupakan format pertukaran data yang ringan dan mudah dibaca oleh manusia maupun mesin. JSON digunakan sebagai format data yang dikirim dari server ke client untuk dirender ke dalam tabel.


2. Struktur Folder
Plaintext
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
3. Struktur  Halaman
Website CRUD Mahasiswa ini memiliki struktur halaman sebagai berikut :

Halaman Home
Halaman home ini adalah halaman yang pertama kali ditampilkan ketika user mengakses web. halaman ini berisikan tabel daftar mahasiswa dan tombol tambah, edit, dan hapus data. Terdapat juga pop-up konfirmasi saat tombol hapus ditekan.
<img src="assets/home.jpeg">
<img src="assets/hapusdata.jpeg">

Halaman Form (Tambah Data)
Digunakan untuk menambah data mahasiswa, dengan isi form berupa NIM, Nama Lengkap, dan Jenis Kelamin.
<img src="assets/tambahdata.jpeg">

Halaman Edit (Edit Data)
Digunakan untuk mengedit atau memperbarui data yang ada di tabel baik itu NIM, Nama Lengkap, maupun Jenis Kelamin.
<img src="assets/editdata.jpeg">

4. Kode Program
A. server.js
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
Penjelasan server.js
Program di atas merupakan aplikasi backend murni menggunakan Node.js yang berjalan pada port 3000. Aplikasi ini berfungsi sebagai server untuk mengelola data mahasiswa yang disimpan sementara dalam variabel array. Modul bawaan http dan fs digunakan untuk memproses request dan menampilkan file frontend. Aplikasi ini menerapkan konsep CRUD. Endpoint /api/mahasiswa digunakan untuk menampilkan seluruh data dalam format JSON. Endpoint /tambah menangani POST untuk data baru, /edit/:id untuk memperbarui data berdasarkan ID, dan /hapus/:id untuk menghapus data. Saat server dijalankan, aplikasi dapat diakses melalui http://localhost:3000.

B. /views/index.html
HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Data Mahasiswa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="mb-4 text-center">Data Mahasiswa (Tugas CRUD MONEV)</h3>
                <a href="/tambah" class="btn btn-primary mb-4">+ Input Mahasiswa Baru</a>
                
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

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#tabelMhs').DataTable({
                ajax: { url: '/api/mahasiswa', dataSrc: '' },
                columns: [
                    { data: 'nim' }, { data: 'nama' }, { data: 'gender' },
                    { data: null, className: "text-center", render: function(data, type, row) {
                            return `<a href="/edit/${row.id}" class="btn btn-warning btn-sm">Edit</a>
                                    <a href="/hapus/${row.id}" class="btn btn-danger btn-sm" onclick="return confirm('Serius nih mau dihapus datanya?')">Hapus</a>`;
                        }
                    }
                ]
            });
        });
    </script>
</body>
</html>
Penjelasan /views/index.html
Program di atas merupakan halaman utama aplikasi yang berfungsi untuk menampilkan data mahasiswa dalam bentuk tabel interaktif menggunakan plugin jQuery DataTables. Tampilan halaman dibangun menggunakan Bootstrap. Data diambil dari server melalui AJAX dengan endpoint /api/mahasiswa dalam format JSON yang kemudian ditampilkan secara dinamis ke dalam tabel. Pada setiap baris data tersedia tombol aksi untuk melakukan edit dan hapus data dengan konfirmasi.

C. /views/tambah.html
HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Tambah Mahasiswa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm" style="max-width: 600px; margin: auto;">
            <div class="card-header bg-primary text-white"><h5 class="mb-0">Form Tambah Data</h5></div>
            <div class="card-body">
                <form action="/tambah" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Nomor Induk Mahasiswa (NIM)</label>
                        <input type="number" name="nim" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nama Lengkap</label>
                        <input type="text" name="nama" class="form-control" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Jenis Kelamin</label>
                        <select name="gender" class="form-select" required>
                            <option value="" disabled selected>Pilih Gender...</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-success">Simpan Data</button>
                    <a href="/" class="btn btn-outline-secondary float-end">Kembali</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
Penjelasan /views/tambah.html
Program di atas merupakan halaman yang digunakan untuk menambahkan data mahasiswa baru (Create). Tampilan halaman dibangun menggunakan Bootstrap dengan form input yang terdiri dari NIM, nama, dan gender. Data yang dimasukkan akan dikirim ke server menggunakan method POST. Setelah data berhasil disimpan, pengguna akan diarahkan kembali ke halaman utama.

D. /views/edit.html
HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Edit Mahasiswa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm" style="max-width: 600px; margin: auto;">
            <div class="card-header bg-warning"><h5 class="mb-0">Form Edit Data</h5></div>
            <div class="card-body">
                <form action="/edit/{{id}}" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Nomor Induk Mahasiswa (NIM)</label>
                        <input type="number" name="nim" class="form-control" value="{{nim}}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nama Lengkap</label>
                        <input type="text" name="nama" class="form-control" value="{{nama}}" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Jenis Kelamin</label>
                        <select name="gender" class="form-select" required>
                            <option value="Laki-laki" {{select_L}}>Laki-laki</option>
                            <option value="Perempuan" {{select_P}}>Perempuan</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-success">Update Data</button>
                    <a href="/" class="btn btn-outline-secondary float-end">Batal</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
Penjelasan /views/edit.html
Program di atas merupakan halaman yang digunakan untuk mengubah data yang sudah ada (Update). Saat halaman dipanggil oleh backend, server mengganti teks placeholder dengan data asli milik mahasiswa. Pengguna dapat mengubah data dan mengirimkannya kembali ke server dengan form method POST.

5. Kesimpulan
Aplikasi web CRUD Mahasiswa telah berhasil dibangun dengan memanfaatkan pendekatan Pure Node.js tanpa framework eksternal. Aplikasi ini telah mengimplementasikan 3 halaman fungsional dan operasi CRUD dengan baik. Data dirender dalam format JSON menggunakan plugin jQuery DataTables dan tampilan antarmuka web dibangun menggunakan framework Bootstrap 5, memenuhi seluruh kriteria spesifikasi teknis untuk tugas MONEV 1.

6. Link Video Presentasi
[Masukkan Link Google Drive Video Di Sini]

[Masukkan Link Google Drive PPT Di Sini]
