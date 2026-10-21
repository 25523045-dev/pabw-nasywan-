<script setup>
// Nama berkas mengikuti tabel D.1 worksheet; isinya formulir Tambah Film.
// Formulir Tambah Film. Isi form = ref/reactive LOKAL di komponen ini (D.1);
// hanya film yang sudah sah dikirim ke state bersama lewat tambahFilm().
import { reactive, ref, watch } from 'vue'
import { hitungGalat } from '../data.js'
import { tambahFilm } from '../state.js'

const isian = reactive({ judul: '', tahun: '', genre: '', rating: '' })
const berkas = ref(null)                                  // foto poster yang dipilih
const galat = reactive({ judul: '', tahun: '', rating: '' })
const sudahCoba = ref(false)                              // true setelah tombol Tambah Film pernah ditekan
const menunggu = ref(false)                               // tombol kirim nonaktif sampai semua kolom layak
const status = ref('')

const elJudul = ref(null)
const elTahun = ref(null)
const elRating = ref(null)
const elPoster = ref(null)
const elemen = { judul: elJudul, tahun: elTahun, rating: elRating }

// v-model pada <input type="number"> mengubah isinya menjadi angka, padahal aturan validasi di
// data.js (P9) bekerja pada teks (nilai.trim()). Jadi diubah kembali menjadi teks di sini.
function nilaiTeks() {
  return {
    judul: String(isian.judul),
    tahun: String(isian.tahun),
    genre: String(isian.genre),
    rating: String(isian.rating),
  }
}

function pilihBerkas(event) {
  berkas.value = event.target.files[0] ?? null
}

function kirim() {
  sudahCoba.value = true
  status.value = ''
  Object.assign(galat, hitungGalat(nilaiTeks()))

  const pertama = Object.keys(galat).find((nama) => galat[nama] !== '') ?? null
  menunggu.value = pertama !== null                      // tombol menunggu, bukan gagal
  if (pertama !== null) {
    elemen[pertama].value.focus()                        // fokus ke kolom yang perlu diperbaiki
    return
  }

  const baru = tambahFilm({ ...nilaiTeks(), berkas: berkas.value })

  sudahCoba.value = false                                // sebelum kolom dikosongkan, agar watch tidak bereaksi
  menunggu.value = false
  Object.assign(galat, { judul: '', tahun: '', rating: '' })
  Object.assign(isian, { judul: '', tahun: '', genre: '', rating: '' })
  berkas.value = null
  elPoster.value.value = ''                              // <input type="file"> tidak bisa diisi lewat v-model
  status.value = `Film "${baru.judul}" ditambahkan.`
  elJudul.value.focus()
}

// Pesan hilang begitu isinya layak. Tidak melakukan apa pun sebelum tombol kirim pernah ditekan.
function ubahKolom(nama) {
  if (!sudahCoba.value) return
  const hasil = hitungGalat(nilaiTeks())
  galat[nama] = hasil[nama]                              // hanya kolom yang sedang diketik
  menunggu.value = Object.values(hasil).some((teks) => teks !== '')
}
watch(() => isian.judul, () => ubahKolom('judul'))
watch(() => isian.tahun, () => ubahKolom('tahun'))
watch(() => isian.rating, () => ubahKolom('rating'))
</script>

<template>
  <form id="form-film" novalidate @submit.prevent="kirim">
    <div class="form-kolom">
      <label for="judul">Judul Film</label>
      <input
        id="judul"
        ref="elJudul"
        v-model="isian.judul"
        type="text"
        name="judul"
        required
        aria-describedby="galat-judul"
        :aria-invalid="galat.judul !== '' ? 'true' : null"
      >
      <p id="galat-judul" class="pesan-galat" aria-live="polite" :hidden="galat.judul === ''">{{ galat.judul }}</p>
    </div>

    <div class="form-kolom">
      <label for="tahun">Tahun</label>
      <input
        id="tahun"
        ref="elTahun"
        v-model="isian.tahun"
        type="number"
        name="tahun"
        min="1900"
        max="2100"
        required
        aria-describedby="galat-tahun"
        :aria-invalid="galat.tahun !== '' ? 'true' : null"
      >
      <p id="galat-tahun" class="pesan-galat" aria-live="polite" :hidden="galat.tahun === ''">{{ galat.tahun }}</p>
    </div>

    <div class="form-kolom">
      <label for="genre">Genre (opsional)</label>
      <input id="genre" v-model="isian.genre" type="text" name="genre">
    </div>

    <div class="form-kolom">
      <label for="rating">Rating</label>
      <input
        id="rating"
        ref="elRating"
        v-model="isian.rating"
        type="number"
        name="rating"
        min="0"
        max="10"
        step="0.1"
        required
        aria-describedby="galat-rating"
        :aria-invalid="galat.rating !== '' ? 'true' : null"
      >
      <p id="galat-rating" class="pesan-galat" aria-live="polite" :hidden="galat.rating === ''">{{ galat.rating }}</p>
    </div>

    <div class="form-kolom form-kolom--file">
      <label for="poster">Foto Poster (opsional)</label>
      <input id="poster" ref="elPoster" type="file" name="poster" accept="image/*" @change="pilihBerkas">
    </div>

    <div class="kartu__kaki">
      <button type="submit" id="tombol-kirim" :disabled="menunggu">Tambah Film</button>
    </div>
    <p id="status-form" role="status">{{ status }}</p>
  </form>
</template>
