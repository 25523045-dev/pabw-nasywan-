## Pertemuan 10: JavaScript Asinkron (fetch, Promise, JSON)

**Mahasiswa:** Nasywan Musyaffa · NIM 25523045
**Topik halaman:** Film Favorit Saya (lanjutan P9), ditambah kartu "Film dari API".
**API:** https://ghibliapi.vercel.app/films (tanpa kunci akses). Cadangan bila tidak terjangkau: `films.json` lokal (ganti `ALAMAT` di `js/api.js`).

### Berkas
- `js/api.js` : berkas baru, lapisan data. Alamat di satu tempat, `respons.ok` diperiksa, satu try/catch, fungsi `ambilFilm` dan `bacaInfoTerakhir` diekspor. Satu-satunya berkas yang memanggil `fetch`.
- `js/dom.js` : menambah import, penggambar `gambarApi`, dan pemanggil `muatApi` (empat keadaan, try/catch). `js/app.js` tidak diubah.
- `profil.html` : menambah kartu `#film-api`. `komponen.css` : gaya kartu API.

### Deklarasi penggunaan AI
> SUNTING bagian ini sesuai kenyataan sebelum diunggah.
- Dibantu AI (Claude): draf `js/api.js`, draf bagian P10 di `js/dom.js`, kartu di `profil.html`, gaya di `komponen.css`, dan draf isian worksheet.
- Saya kerjakan sendiri: menyalin hasil P9, menjalankan di peramban, pengujian tiga kegagalan di DevTools, tangkapan layar empat keadaan, memahami dan menyesuaikan setiap baris kode.

### Bukti
Tangkapan layar keadaan berhasil, gagal, kosong, dan memuat ada di folder `Bukti/`.
