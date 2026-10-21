<script setup>
// Nama berkas mengikuti tabel D.1 worksheet; isinya daftar film (data proyek = film).
// Tabel film yang lolos kategori aktif. Dihitung dari state, tidak disimpan di mana pun.
import { computed, ref } from 'vue'
import { state, hapusFilm } from '../state.js'

const tampil = computed(() =>
  state.daftarFilm.filter((f) => state.kategoriAktif === 'semua' || f.genre === state.kategoriAktif)
)

const pesanKosong = computed(() => {
  if (tampil.value.length > 0) return ''
  return state.daftarFilm.length === 0
    ? 'Daftar film kosong. Tambahkan film lewat formulir Tambah Film.'
    : 'Tidak ada film pada genre itu.'
})

// id baris yang sedang bermain efek menghilang (sebelum benar-benar dihapus dari state)
const menghilang = ref([])

function hapus(f) {
  if (menghilang.value.includes(f.id)) return
  if (!window.confirm(`Hapus "${f.judul}" dari daftar?`)) return
  const gerak = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  if (!gerak) {
    hapusFilm(f.id)
    return
  }
  menghilang.value.push(f.id)
  setTimeout(() => {
    hapusFilm(f.id)
    menghilang.value = menghilang.value.filter((id) => id !== f.id)
  }, 300)
}
</script>

<template>
  <div class="tabel-wrap" tabindex="0" role="region" aria-label="Galeri kartu film favorit">
    <table>
      <caption><span aria-hidden="true">▤</span>Daftar film favorit</caption>
      <thead>
        <tr>
          <th scope="col">Poster</th>
          <th scope="col">Judul Film</th>
          <th scope="col">Tahun</th>
          <th scope="col">Genre</th>
          <th scope="col">Rating</th>
        </tr>
      </thead>
      <tbody id="daftar">
        <!-- :key memuat id unik. Awalan kategori membuat baris digambar ulang saat filter berganti,
             sehingga animasi muncul bertahap berulang seperti di P11. -->
        <tr
          v-for="(f, urutan) in tampil"
          :key="state.kategoriAktif + '-' + f.id"
          :data-id="f.id"
          :style="{ '--i': urutan + 1 }"
          :class="{ 'baris-baru': f.id === state.idBaru, menghilang: menghilang.includes(f.id) }"
        >
          <td>
            <img
              v-if="f.poster"
              class="poster"
              :src="f.poster"
              :alt="`Poster film ${f.judul}`"
              width="200"
              height="300"
            >
            <span v-else class="poster-kosong">Tanpa foto</span>
          </td>
          <th scope="row">
            <span>{{ f.judul }}</span>
            <button
              type="button"
              class="tombol-hapus"
              :aria-label="`Hapus film ${f.judul}`"
              @click="hapus(f)"
            >
              Hapus
            </button>
          </th>
          <td>{{ f.tahun }}</td>
          <td>{{ f.genre }}</td>
          <td>{{ f.rating }}/10</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p id="pesan-kosong" role="status" aria-live="polite" :hidden="pesanKosong === ''">{{ pesanKosong }}</p>
</template>
