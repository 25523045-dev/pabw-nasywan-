## Pertemuan 11: Modul, State, dan Penyimpanan Klien

**Mahasiswa:** Nasywan Musyaffa · NIM 25523045
**Topik halaman:** Film Favorit Saya (lanjutan P9, dengan kartu "Film dari API" dari P10).

### Cara menjalankan

Halaman memakai `type="module"`, jadi harus dibuka lewat server lokal (bukan klik dua kali).
Pakai satu nomor port tetap, karena simpanan terikat pada alamat termasuk port-nya.

```
python -m http.server 8000      # lalu buka http://localhost:8000/profil.html
```

### Susunan modul

| Berkas | Satu tanggung jawab | Mengimpor |
| --- | --- | --- |
| `js/data.js` | Data mentah dan fungsi murni (pemformat, penghitung, aturan validasi) | tidak ada |
| `js/state.js` | Satu objek `state` dan semua fungsi pengubahnya | data, simpan, dom, api |
| `js/dom.js` | Seluruh sentuhan ke halaman: pemilih, `render(state)`, kelas | data |
| `js/events.js` | Memasang seluruh pendengar peristiwa | dom, state |
| `js/app.js` | Perakit: hanya import dan pemanggilan, tanpa logika | dom, state, events, simpan |
| `js/simpan.js` | Satu-satunya yang menyentuh `localStorage` untuk pilihan pengguna | tidak ada |
| `js/api.js` | Dari P10, dipakai apa adanya (satu-satunya yang memanggil `fetch`) | tidak ada |

Lima modul wajib adalah data, state, dom, events, app. `simpan.js` dan `api.js` dihitung terpisah:
`simpan.js` dibuat supaya `state.js` tidak memikul dua pekerjaan (keadaan dan penyimpanan).
Tidak ada impor memutar: arah impor selalu ke bawah (app → events → state → dom → data).
`dom.js` tidak mengimpor `state.js`; `render(state)` menerima state sebagai argumen.

### Keputusan yang perlu diketahui

- **State di satu objek.** `daftarFilm`, `kategoriAktif`, `tema`, `idBaru`, `formulir` (sudah coba, galat, status,
  tombol menunggu), dan `api` (memuat/berhasil/gagal). Variabel lepas di `dom.js` P9 (`film`, `pilihan`,
  `idBaru`, `sudahCoba`) sudah tidak ada.
- **Tampilan = fungsi dari state.** Tombol aktif digambar dari `state.kategoriAktif`, bukan dibaca dari kelas
  tombol. Kotak centang tema hanya cerminan `state.tema`. `render(state)` bisa dipanggil dua kali berturut-turut
  tanpa mengubah atau melipatgandakan tampilan.
- **Satu pintu perubahan.** `events.js` tidak menulis ke state; tiap tindakan memanggil satu fungsi di
  `state.js` (`pilihKategori`, `alihTema`, `hapusFilm`, `kirimFormulir`, `ubahKolom`, `aturUlangPilihan`, `muatApi`).
  Yang dibaca `events.js` dari halaman hanya masukan pengguna (`data-kategori` tombol yang diklik, isi kolom form).
- **Render sebagian.** Mengetik di form dan mengganti tema tidak menggambar ulang tabel
  (`renderFormulir`, `renderTema`), supaya animasi baris tidak berulang pada setiap ketikan.
- **Yang disimpan** (kunci `pabw-p11`, `VERSI = 2`): `{ versi, kategoriAktif, tema }` lewat `JSON.stringify`.
- **Yang sengaja tidak disimpan:** daftar film tambahan dan foto posternya (URL `blob:` hanya hidup selama tab
  terbuka, dan foto tidak layak disimpan di 5 MB per alamat), isi formulir, serta token, kata sandi, atau data
  pribadi apa pun (`localStorage` tidak terenkripsi). Akibatnya film yang ditambahkan lewat form hilang saat
  halaman dimuat ulang. Itu perilaku yang sama seperti P9.
- **Simpanan rusak.** `muat()` dibungkus `try/catch`, memeriksa `versi`, membuang simpanan rusak atau berbentuk
  lama, lalu mengembalikan `null`. `pulihkanPilihan()` memeriksa tiap nilai (genre yang tidak dikenal atau tema
  asing jatuh ke nilai bawaan `"semua"` / `"terang"`).
- **Tombol "Atur ulang pilihan"** memanggil `localStorage.removeItem`, mengembalikan state ke nilai bawaan, lalu
  menggambar ulang. Sengaja tidak memanggil `simpan()` sesudahnya.
- **Perubahan dari P9/P10:** kunci lama `"tema"` diganti satu kunci `pabw-p11` (pilihan tema lama tidak dibawa);
  `window.gambar` dari P10 dihapus; kode percobaan Console dari `app.js` P8 (demo `??`, `?.`, `console.table`,
  `profil.namaa` yang sengaja salah) dihapus. `window.state` dan `window.muat` di akhir `app.js` hanya untuk
  pemeriksaan di Console.
- Perilaku halaman tidak ditambah selain tombol atur ulang yang diminta worksheet.

### Pemeriksaan yang dijalankan

Diuji otomatis di Chromium (Playwright) lewat server lokal: 10 baris awal, ganti kategori lalu muat ulang dan tab
baru, tema, `bukan-json` / `{}` / versi lama / nilai asing di `localStorage`, tombol atur ulang, form (galat, fokus,
tambah film, genre disamakan), hapus film, kegagalan lalu "Coba lagi" pada API, dan Console tanpa galat tak
tertangani. Pemeriksaan yang sama perlu diulang sendiri di peramban Anda; lihat folder `Bukti/`.

### Versi Node.js (pekerjaan rumah untuk Pertemuan 12)

- `node -v`: ______ (isi setelah memasang Node.js LTS)
- `npm -v`: ______

### Deklarasi penggunaan AI

> SUNTING bagian ini sesuai kenyataan sebelum diunggah.

- Dibantu AI (Claude): draf kelima modul wajib (`data.js`, `state.js`, `dom.js`, `events.js`, `app.js`) dan
  `simpan.js`, penyesuaian `profil.html` (satu `<script type="module">`, tombol atur ulang, id profil),
  gaya tombol atur ulang di `komponen.css`, skrip uji otomatis, draf README ini, dan draf isian worksheet.
- Saya kerjakan sendiri: ______ (contoh: menyalin hasil P9/P10, menjalankan di peramban, merusak simpanan dari
  Console dan menangkap layarnya, memahami dan menyesuaikan setiap baris, commit dan push).
