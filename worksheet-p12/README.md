## Pertemuan 12: Build Tooling, npm, dan Framework SPA

**Topik halaman:** Film Favorit Saya (halaman P11 dipindahkan ke proyek Vue + Vite, tanpa mengubah perilakunya).

### Cara menjalankan

```
npm install
npm run dev        # server pengembangan, catat nomor port-nya (localStorage terikat port)
npm run build      # menghasilkan folder dist/
npm run preview    # menjalankan isi dist/ seperti situs sungguhan
```

### Perkakas (lembar A)

| Perintah | Versi |
| --- | --- |
| `node -v` | ISI: tulis hasil node -v |
| `npm -v` | ISI: tulis hasil npm -v |

Port `npm run dev`: ISI (mis. 5173).

### Susunan proyek

| Berkas | Tanggung jawab |
| --- | --- |
| `index.html` | Hanya `<div id="app">` dan satu `<script type="module" src="/src/main.js">` |
| `src/main.js` | Titik masuk; satu-satunya tempat enam berkas CSS P04-P06 diimpor (tokens, base, layout, komponen, tema, responsif) |
| `src/App.vue` | Induk: merakit empat komponen, memasang `onMounted` (muat simpanan) dan `watch` (tulis simpanan), tombol atur ulang |
| `src/components/KepalaProfil.vue` | Identitas ("Tentang Saya"); **satu-satunya yang menerima props** (`profil`, dibaca saja) |
| `src/components/TombolFilter.vue` | Tombol genre + tombol atur ulang; state bersama, mengabari induk lewat `emit` |
| `src/components/DaftarProyek.vue` | Tabel film yang disaring (`v-for` + `:key` id unik); hapus film |
| `src/components/FormKontak.vue` | Formulir Tambah Film; isi form di `ref`/`reactive` lokal (`v-model`) |
| `src/state.js` | Satu `reactive()` + fungsi pengubah. Tidak ada `render()` lagi |
| `src/simpanan.js` | `simpan`, `muat`, `aturUlang`, `KUNCI = "pabw-p11"`, `VERSI = 2` (dari `js/simpan.js` P11, isi sama) |
| `src/data.js` | Data + fungsi murni (P8/P9). Ditambah `id` unik pada tiap film dan awalan `/` pada alamat poster |
| `src/api.js` | Dari P10, isi tidak diubah; satu-satunya yang memanggil `fetch` |
| `public/` | Poster, gambar, dan `films.json` (dibaca lewat alamat `/nama`) |

### Keputusan yang perlu diketahui

- **Tampilan = hasil state.** `reactive()` menggantikan `render(state)`; template Vue (`v-for`, `v-if`, `:class`, `{{ }}`) yang menggambar.
- **Props turun, kabar naik.** `KepalaProfil` hanya membaca props. `TombolFilter` tidak mengubah simpanan sendiri: ia `emit('atur-ulang')`, induk yang memanggil `aturUlang()`.
- **Isi form lokal.** `v-model` pada `<input type="number">` mengubah nilai menjadi angka, sedangkan aturan validasi P9 bekerja pada teks. `FormKontak.vue` mengubahnya kembali menjadi teks (`nilaiTeks()`) sebelum divalidasi.
- **Simpanan** (kunci `pabw-p11`, `VERSI = 2`): hanya `kategoriAktif` dan `tema`. `onMounted` memuat sekali; `watch(state, ..., { deep: true })` menulis. Tombol atur ulang menghapus simpanan lalu menulis ulang nilai bawaan (sesuai E.3).
- **Yang sengaja tidak disimpan:** film tambahan dan foto posternya (URL `blob:`), isi form.
- **Perubahan dari P11:** `render()`, `dom.js`, `events.js` hilang (digantikan template); `js/app.js` hilang (digantikan `App.vue` + `main.js`); kunci simpanan tetap `pabw-p11`; label di kepala halaman "P11" menjadi "P12".

### Hasil build (lembar F)

| Yang diukur | Sebelum build (`npm run dev`) | Sesudah build (`dist/`) |
| --- | --- | --- |
| Ukuran seluruh berkas yang dikirim | ISI | ISI |
| Jumlah berkas yang dikirim peramban | ISI | ISI |

Tangkapan layar halaman dari `npm run preview`: ISI (nama berkas / lokasi).

### Pengungkapan penggunaan AI

- **Dibantu AI (Claude):** penulisan awal kode di `src/` (`App.vue`, empat komponen, `state.js`, `main.js`, `index.html`), pemindahan P11 ke bentuk komponen, dan draf jawaban tiket keluar.
- **Dikerjakan sendiri:** ISI. Tulis dengan jujur bagian yang kamu kerjakan sendiri (mis. menjalankan perintah di terminal, mencoba semua pemeriksaan di tabel, mengukur ukuran build, memahami dan menjelaskan kodenya).
- Topik dan isi halaman (Film Favorit Saya, token, CSS P04-P06) berasal dari pekerjaan saya sendiri di pertemuan sebelumnya.
