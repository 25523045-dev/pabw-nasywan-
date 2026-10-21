<script setup>
// Deretan tombol genre + tombol atur ulang. Memakai state bersama (tanpa props).
import { daftarKategori } from '../data.js'
import { state, pilihKategori } from '../state.js'

// Tombol atur ulang tidak mengubah apa pun sendiri: ia memberi tahu induk (App.vue),
// yang memegang aturUlang() dari simpanan.js. Data turun lewat props, kabar naik lewat emit.
const emit = defineEmits(['atur-ulang'])
</script>

<template>
  <div class="filter-kepala">
    <p class="eyebrow">JELAJAHI KOLEKSI</p>
    <h3>Saring berdasarkan genre</h3>
    <div id="filter" role="group" aria-label="Saring film berdasarkan genre">
      <button
        v-for="kategori in daftarKategori"
        :key="kategori"
        type="button"
        :data-kategori="kategori"
        :class="{ aktif: state.kategoriAktif === kategori }"
        @click="pilihKategori(kategori)"
      >
        {{ kategori === 'semua' ? 'Semua' : kategori }}
      </button>
    </div>
    <button type="button" id="atur-ulang" @click="emit('atur-ulang')">Atur ulang pilihan</button>
  </div>
</template>
