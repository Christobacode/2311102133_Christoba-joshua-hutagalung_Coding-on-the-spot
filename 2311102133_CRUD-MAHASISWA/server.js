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