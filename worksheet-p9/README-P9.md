# Worksheet P9 — DOM, Event, dan Interaktivitas

Pengembangan Aplikasi Berbasis Web (SIF302) · Pertemuan 9 · NIM 25523045

Halaman "Film Favorit Saya" dari P8. Tabel film kini dibentuk dari data (`daftarFilm` di `js/app.js`),
dilengkapi filter genre dengan satu pendengar di induk, dan form Tambah Film dengan validasi per kolom.

## Cara menjalankan

Halaman memakai `type="module"`, jadi harus dibuka lewat server lokal (bukan klik dua kali):

```
python -m http.server 8000      # lalu buka http://localhost:8000/profil.html
```

Di VS Code boleh memakai ekstensi Live Server.

## Pembagian berkas

| Berkas | Isi |
| --- | --- |
| `profil.html` | Kerangka halaman. `<tbody id="daftar">` kosong sejak awal; skrip inline P8 dihapus |
| `js/app.js` | Data dan fungsi murni dari P8. Perubahan P9: kata `export` pada `profil` dan `daftarFilm`, dan tiap film diberi `poster` |
| `js/dom.js` | Satu-satunya berkas yang menyentuh halaman: memilih elemen, render, event, validasi, tema |
| `komponen.css` | Gaya P8 + tambahan P9 di bagian bawah (`.aktif`, `#filter`, pesan galat dari JavaScript, `[hidden]`) |

## Daftar elemen yang diisi (Lembar A.3)

| Bagian halaman | Pemilih | Diisi apa | Variabel |
| --- | --- | --- | --- |
| Daftar film | `#daftar` (`<tbody>`) | Satu `<tr>` per film | `wadah` |
| Baris tombol filter | `#filter` | Tidak diisi; induk satu pendengar `click` | `barisFilter` |
| Pesan daftar kosong | `#pesan-kosong` | Teks dan atribut `hidden` diatur di dalam `render` | `kosong` |
| Ringkasan | `#jumlah-film`, `#rata-rating` | Jumlah dan rata-rata rating dari `film` | `jumlahFilm`, `rataRating` |
| Form dan tiap kolomnya | `#form-film`, `#judul`, `#tahun`, `#genre`, `#rating`, `#poster`, `#tombol-kirim` | Pendengar `submit` dan `input` | `form`, `kolom.*`, `tombolKirim` |
| Pesan galat per kolom | `#galat-judul`, `#galat-tahun`, `#galat-rating` | Teks pesan dan aria-invalid | `pesanGalat.*` |

## Keputusan yang perlu diketahui

- Semua teks dari data dan dari pengguna dimasukkan dengan `textContent`, tidak pernah `innerHTML`.
- `render(daftar)` mengosongkan wadah di baris pertama, menangani keadaan kosong, lalu mengisi ulang.
  Setiap perubahan data (tambah, hapus, ganti filter) diikuti satu pemanggilan `tampilkan()`.
- Pendengar dipasang sekali, di luar `render`: filter di `#filter`, tombol Hapus di `#daftar`,
  `input` di form. Tombol dicari dengan `event.target.closest(...)`.
- `daftarFilm` disalin ke `film` (`map` + spread) supaya data asli tidak berubah saat menambah atau menghapus.
- Tombol "Drama" sengaja belum punya film, untuk memperlihatkan pesan keadaan kosong.
- Validasi berjalan setelah tombol Tambah Film ditekan pertama kali. Sesudah itu pesan galat diperbarui
  setiap kali mengetik, dan tombol menunggu (`disabled`) sampai semua kolom layak.
  Form diberi `novalidate` supaya pesan dari JavaScript yang tampil, bukan gelembung bawaan peramban.
- Setelah film ditambah, filter kembali ke "Semua" supaya film baru langsung terlihat.

## Deklarasi penggunaan AI

- **Dibantu AI (Claude, Anthropic):** draf `js/dom.js`, perubahan `profil.html` (wadah kosong, filter, id galat,
  pemindahan skrip inline ke `dom.js`), tambahan di `komponen.css`, dan README ini; juga pengujian di peramban.
- **Saya kerjakan sendiri:** _(isi dengan jujur, mis. menentukan topik film, menjalankan dan menguji di Chrome,
  membaca dan menjelaskan tiap fungsi di dom.js, tangkapan layar DevTools, commit dan push)_
