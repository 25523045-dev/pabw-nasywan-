// src/state.js — satu objek reaktif untuk seluruh keadaan, dan fungsi pengubahnya.
// P11: state biasa + render(state) dipanggil sendiri. P12: reactive() — tidak ada render() lagi,
// Vue menggambar ulang bagian template yang bergantung pada nilai yang berubah.
import { reactive } from 'vue'
import { daftarFilm, daftarKategori, samakanGenre } from './data.js'
import { ambilFilm, bacaInfoTerakhir } from './api.js'

export const BAWAAN = { kategoriAktif: 'semua', tema: 'terang' }

// id berikutnya melanjutkan id terbesar di data.js
let idBerikut = Math.max(...daftarFilm.map((f) => f.id)) + 1

export const state = reactive({
  daftarFilm: daftarFilm.map((f) => ({ ...f })), // salinan, data asli tidak berubah
  kategoriAktif: BAWAAN.kategoriAktif,            // disimpan
  tema: BAWAAN.tema,                              // disimpan: 'terang' | 'gelap'
  idBaru: null,                                   // film yang baru ditambah, disorot sampai ada perubahan berikutnya
  api: {                                          // P10: film dari jaringan
    status: 'memuat',                             // 'memuat' | 'berhasil' | 'gagal'
    daftar: [],
    pesan: '',
    infoTerakhir: null,
  },
})

/* ---------- Fungsi pengubah: hanya mengubah state, tanpa render() ---------- */

export function pilihKategori(nilai) {
  if (!daftarKategori.includes(nilai)) return // nilai tak dikenal: abaikan
  state.kategoriAktif = nilai                 // tanpa render()
  state.idBaru = null
}

export function alihTema() {
  state.tema = state.tema === 'gelap' ? 'terang' : 'gelap'
}

// `isi` = nilai kolom form berupa teks, sudah lolos validasi di FormKontak.vue.
export function tambahFilm({ judul, tahun, genre, rating, berkas }) {
  const genreIsi = genre.trim()
  const baru = {
    id: idBerikut++,
    judul: judul.trim(),
    tahun: Number(tahun),
    genre: genreIsi === '' ? '-' : samakanGenre(genreIsi, state.daftarFilm),
    rating: Number(rating),
    poster: berkas && berkas.type.startsWith('image/') ? URL.createObjectURL(berkas) : null,
  }
  state.daftarFilm = [...state.daftarFilm, baru] // nilai baru, bukan push
  state.idBaru = baru.id
  state.kategoriAktif = 'semua'                  // supaya film baru pasti terlihat
  return baru
}

export function hapusFilm(id) {
  const f = state.daftarFilm.find((item) => item.id === id)
  if (f && f.poster && f.poster.startsWith('blob:')) URL.revokeObjectURL(f.poster)
  state.daftarFilm = state.daftarFilm.filter((item) => item.id !== id)
  state.idBaru = null
}

/* ---------- Film dari API (P10) ---------- */

// Tiga keadaan: memuat -> berhasil | gagal. Penarikan datanya ada di api.js (tidak diubah);
// di sini hanya keadaan yang berpindah.
export async function muatApi() {
  state.api.status = 'memuat'
  state.api.pesan = ''
  state.api.infoTerakhir = bacaInfoTerakhir() // JSON.parse dari localStorage, null bila belum ada
  try {
    state.api.daftar = await ambilFilm()
    state.api.status = 'berhasil'
  } catch (galat) {
    state.api.daftar = []
    state.api.status = 'gagal'
    state.api.pesan = galat.message
  }
}
