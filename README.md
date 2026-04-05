\<h1 align="center"\>LAPORAN PRAKTIKUM\</h1\>
\<h1 align="center"\>APLIKASI BERBASIS PLATFORM\</h1\>

<br>

\<h2 align="center"\>TUGAS COTS MONEV 1\</h2\>
\<h2 align="center"\>CRUD DATA MAHASISWA\</h2\>

<br><br>

\<p align="center"\>
\<img src="2311102133\_CRUD-MAHASISWA/assets/LogoTelkom.png" width="350"\>
\</p\>
<br><br><br>

\<h2 align="center"\>Disusun Oleh :\</h2\>

\<p align="center" style="font-size:28px;"\>
\<b\>Christoba Joshua Hutagalung\</b\><br>
\<b\>2311102133\</b\><br>
\<b\>S1 Teknik Informatika 2023\</b\>
\</p\>
<br>
\<h2 align="center"\>Dosen Pengampu :\</h2\>

\<p align="center" style="font-size:28px;"\>
\<b\>Cahyo Prihantoro, S.Kom., M.Eng \</b\>
\</p\>
<br>

<br>
&lt;h1 align=&quot;center&quot;&gt;LABORATORIUM HIGH PERFORMANCE&lt;/h1&gt;
&lt;h1 align=&quot;center&quot;&gt;FAKULTAS INFORMATIKA&lt;/h1&gt;
&lt;h1 align=&quot;center&quot;&gt;UNIVERSITAS TELKOM PURWOKERTO&lt;/h1&gt;
&lt;h1 align=&quot;center&quot;&gt;TAHUN 2026&lt;/h1&gt;

\<hr\>

## 1\. Dasar Teori

**HTML** atau HyperText Markup Language merupakan bahasa dasar yang digunakan untuk membangun sebuah web dimana HTML menangani elemen-elemen dasar pada pembangunan sebuah website.<br>

**CSS & Bootstrap** merupakan framework yang membantu memperindah tampilan dari laman web yang telah dibangun dengan HTML. Aplikasi ini menggunakan Bootstrap 5 melalui CDN untuk mempercepat pengembangan antarmuka web, mencakup pembuatan tabel, tombol, dan form input.<br>

**Pure Node.js** Aplikasi ini dibangun menggunakan Node.js murni tanpa framework tambahan (seperti Express.js). Node JS merupakan runtime environment yang memungkinkan JavaScript dijalankan di sisi server. Pada aplikasi ini, NodeJS menangani routing dan proses CRUD langsung menggunakan modul bawaan http dan fs.<br>

**JAVASCRIPT & JQUERY** Javascript merupakan bahasa pemrograman scripting. jQuery adalah sebuah library Javascript yang memungkinkan manipulasi dokumen HTML dilakukan hanya dalam beberapa baris code. Dalam tugas ini, jQuery digunakan bersama plugin DataTables untuk menampilkan data mahasiswa secara dinamis yang bersumber dari API JSON lokal.<br>

**JSON (JavaScript Object Notation)** merupakan format pertukaran data yang ringan dan mudah dibaca oleh manusia maupun mesin. JSON digunakan sebagai format data yang dikirim dari server ke client untuk dirender ke dalam tabel secara dinamis.<br>

## 2\. Struktur Folder

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
```

## 3\. Struktur Halaman

Website CRUD Mahasiswa ini memiliki struktur halaman sebagai berikut :

### Halaman Home

Halaman home ini adalah halaman yang pertama kali ditampilkan ketika user mengakses web. halaman ini berisikan tabel daftar mahasiswa menggunakan jQuery DataTables dan tombol aksi edit dan hapus. Data diambil dari server dalam format JSON.
\<img src="2311102133\_CRUD-MAHASISWA/assets/home.jpeg"\>

Ketika tombol aksi hapus ditekan maka aplikasi akan memunculkan popup/notifikasi konfirmasi bawaan browser apakah data tersebut akan dihapus atau tidak.
\<img src="2311102133\_CRUD-MAHASISWA/assets/hapusdata.jpeg"\>

### Halaman Form (Tambah Data)

Halaman ini digunakan untuk menambahkan data mahasiswa baru. User dapat mengisi form berupa NIM, Nama Lengkap, dan Jenis Kelamin. Data dikirim ke server menggunakan metode POST.
\<img src="2311102133\_CRUD-MAHASISWA/assets/tambahdata.jpeg"\>

### Halaman Edit (Edit Data)

Halaman ini digunakan untuk mengubah data mahasiswa yang sudah ada. Data akan ditampilkan secara otomatis pada form berdasarkan ID yang dipilih. Perubahan dikirim kembali ke server menggunakan metode POST.
\<img src="2311102133\_CRUD-MAHASISWA/assets/editdata.jpeg"\>

## 4\. Kode Program

### A. server.js

```javascript
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
```

**Penjelasan `server.js`**
Program di atas merupakan aplikasi backend menggunakan **Pure Node.js** murni yang berjalan pada port 3000. Aplikasi ini berfungsi untuk mengelola data mahasiswa yang disimpan sementara dalam variabel array di memori. Modul bawaan http digunakan untuk membuat server dan fs digunakan untuk menyajikan file frontend. Aplikasi ini menerapkan konsep CRUD penuh melalui sistem routing manual yang menangani request GET dan POST tanpa framework eksternal.

### B. `/views/index.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Data Mahasiswa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm p-4">
            <h3 class="mb-4 text-center">Data Mahasiswa (Tugas CRUD MONEV)</h3>
            <a href="/tambah" class="btn btn-primary mb-4">+ Input Mahasiswa Baru</a>
            <table id="tabelMhs" class="table table-hover table-bordered" style="width:100%">
                <thead class="table-dark">
                    <tr><th>NIM</th><th>Nama Lengkap</th><th>Gender</th><th class="text-center">Aksi</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#tabelMhs').DataTable({
                ajax: { url: '/api/mahasiswa', dataSrc: '' },
                columns: [
                    { data: 'nim' }, { data: 'nama' }, { data: 'gender' },
                    { data: null, className: "text-center", render: function(data, type, row) {
                        return `<a href="/edit/${row.id}" class="btn btn-warning btn-sm">Edit</a>
                                <a href="/hapus/${row.id}" class="btn btn-danger btn-sm" onclick="return confirm('Yakin hapus?')">Hapus</a>`;
                    }}
                ]
            });
        });
    </script>
</body>
</html>
```

**Penjelasan `/views/index.html`**
Halaman ini adalah antarmuka utama yang menampilkan data dalam bentuk tabel interaktif menggunakan plugin **jQuery DataTables** dan framework **Bootstrap 5**. Data diambil secara asynchronous lewat request AJAX menuju API JSON di server lokal dan ditampilkan secara dinamis.

## 5\. Kesimpulan

Aplikasi web CRUD Mahasiswa telah berhasil dibangun dengan memanfaatkan pendekatan **Pure Node.js**. Aplikasi ini telah mengimplementasikan operasi CRUD dengan baik, merender data format JSON menggunakan jQuery DataTables, dan menggunakan Bootstrap 5 untuk antarmuka yang responsif, memenuhi seluruh kriteria spesifikasi teknis MONEV 1.

## 6\. Link Video Presentasi

  - **Video Presentasi:** [Masukkan Link GDrive Video Di Sini]
  - **Slide PPT:** [Masukkan Link GDrive PPT Di Sini]

-----

Semoga membantu dan MONEV-mu lancar besok, Joshua\! Gas kumpulin\!
