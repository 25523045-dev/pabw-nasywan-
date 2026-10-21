<script setup>
import { computed, onMounted, watch } from 'vue'
import { profil, daftarKategori, hitungRataRating } from './data.js'
import { state, BAWAAN, alihTema, muatApi } from './state.js'
import { muat, simpan, aturUlang } from './simpanan.js'

// Tanpa empat baris impor ini Vue hanya memberi peringatan "Failed to resolve component"
// dan halaman tampil kosong. Nama berkas ditulis persis sama, huruf besar-kecilnya juga.
import KepalaProfil from './components/KepalaProfil.vue'
import TombolFilter from './components/TombolFilter.vue'
import DaftarProyek from './components/DaftarProyek.vue'
import FormKontak from './components/FormKontak.vue'

// Data induk -> anak lewat props (hanya KepalaProfil): :profil="identitas"
const identitas = profil

/* ---------- Simpanan (kunci "pabw-p11", VERSI 2: dipakai apa adanya dari P11) ---------- */

// onMounted membaca simpanan satu kali, saat komponen pertama dipasang.
// muat() sudah membuang simpanan rusak / berbentuk lama; nilainya tetap diperiksa satu per satu.
onMounted(() => {
  const isi = muat()
  if (isi) {
    if (daftarKategori.includes(isi.kategoriAktif)) state.kategoriAktif = isi.kategoriAktif
    if (isi.tema === 'gelap' || isi.tema === 'terang') state.tema = isi.tema
  }
  document.title = `Film Favorit — ${profil.nama}`
  muatApi() // P10: ambil film dari API (tidak ditunggu, halaman tidak tertahan)
})

// watch menulis simpanan setiap kali state berubah. Tidak ada pemanggilan simpan() di template.
// simpan() hanya memilih kategoriAktif dan tema, jadi daftar film dan foto tidak ikut tersimpan.
watch(state, (nilai) => simpan(nilai), { deep: true })

// Tombol atur ulang (P11 lembar D.2): hapus simpanan, kembalikan ke nilai bawaan,
// lalu tulis ulang simpanan berisi nilai bawaan itu (bukan dibiarkan kosong).
function aturUlangPilihan() {
  aturUlang()
  state.kategoriAktif = BAWAAN.kategoriAktif
  state.tema = BAWAAN.tema
  state.idBaru = null
  simpan(state)
}

/* ---------- Turunan untuk template ---------- */

const jumlahFilm = computed(() => String(state.daftarFilm.length))
const rataRating = computed(() => hitungRataRating(state.daftarFilm))

const teksStatusApi = computed(() => {
  const api = state.api
  if (api.status === 'memuat') return 'Memuat...'
  if (api.status === 'gagal') return 'Gagal memuat data: ' + api.pesan
  if (api.daftar.length === 0) return 'Belum ada film'
  return `${api.daftar.length} film dimuat dari API.`
})
</script>

<template>
  <div class="page">
    <header class="kepala">
      <div class="kepala__isi">
        <div>
          <p class="eyebrow">KOLEKSI PRIBADI <span aria-hidden="true">/</span> P12</p>
          <h1><span class="kepala__ikon" aria-hidden="true">▤</span> Film <span class="judul-aksen">Favorit Saya</span></h1>
          <p class="kepala__deskripsi">Pilihan cerita yang selalu ingin ditonton kembali.</p>
        </div>

        <div class="kontrol-tema">
          <label for="tema" class="tombol-tema"><span aria-hidden="true">◐</span> Tema gelap</label>
          <input
            id="tema"
            type="checkbox"
            class="pengalih-tema"
            :checked="state.tema === 'gelap'"
            @change="alihTema"
          >
        </div>
      </div>
      <div class="kepala__montase" aria-hidden="true">
        <img src="/poster-inception.jpg" alt="">
        <img src="/poster-interstellar.jpg" alt="">
        <img src="/poster-dark-knight.jpg" alt="">
      </div>
    </header>

    <nav class="sisi navbar" aria-label="Navigasi utama">
      <a href="#daftar-film" aria-current="page"><span aria-hidden="true">▤</span> Daftar Film</a>
      <a href="#film-api"><span aria-hidden="true">☁</span> Dari API</a>
      <a href="#tambah-film"><span aria-hidden="true">＋</span> Tambah Film</a>
      <a href="#tentang-saya"><span aria-hidden="true">◉</span> Tentang Saya</a>
    </nav>

    <main class="utama">
      <section id="daftar-film" class="kartu sorotan">
        <div class="kartu__isi">
          <div class="bagian-kepala">
            <div>
              <p class="eyebrow">PILIHAN CERITA</p>
              <h2 class="judul-daftar"><span aria-hidden="true">▤</span>Daftar Film</h2>
              <p class="bagian-deskripsi">Kelola koleksi film favoritmu di sini.</p>
            </div>
            <span class="bagian-penanda">KOLEKSI PRIBADI</span>
          </div>

          <div class="daftar-pengantar">
            <figure>
              <img src="/film-favorit.jpg" alt="Ilustrasi koleksi film favorit" width="800" height="450" loading="lazy">
              <figcaption>Film yang meninggalkan kesan.</figcaption>
            </figure>

            <TombolFilter @atur-ulang="aturUlangPilihan" />
          </div>

          <p class="petunjuk-gulir">Pilih genre untuk menyaring koleksi film.</p>
          <DaftarProyek />
        </div>
      </section>

      <section id="film-api" class="kartu">
        <div class="kartu__isi">
          <div class="bagian-kepala">
            <div>
              <p class="eyebrow">DATA DARI JARINGAN</p>
              <h2>Film dari API</h2>
              <p class="bagian-deskripsi">Daftar ini diambil lewat fetch dari API publik.</p>
            </div>
            <span class="bagian-penanda">P10</span>
          </div>
          <p id="status-api" role="status" aria-live="polite">{{ teksStatusApi }}</p>
          <p v-if="state.api.infoTerakhir !== null" id="info-api" class="info-api">
            Kunjungan sebelumnya: {{ state.api.infoTerakhir.jumlah }} film.
          </p>
          <button v-if="state.api.status === 'gagal'" type="button" id="coba-lagi" @click="muatApi">Coba lagi</button>
          <div id="daftar-api" class="daftar-api">
            <template v-if="state.api.status === 'berhasil'">
              <article v-for="f in state.api.daftar" :key="f.id ?? f.title" class="kartu-api">
                <h3>{{ f.title }}</h3>
                <p>{{ f.director }} · {{ f.release_date }}</p>
              </article>
            </template>
          </div>
        </div>
      </section>

      <div class="galeri">
        <section id="tambah-film" class="kartu">
          <div class="kartu__isi">
            <div class="bagian-kepala">
              <div>
                <p class="eyebrow">PERBARUI KOLEKSI</p>
                <h2>Tambah Film</h2>
                <p class="bagian-deskripsi">Tambahkan film favoritmu ke koleksi.</p>
              </div>
              <span class="bagian-penanda">01</span>
            </div>
            <FormKontak />
          </div>
        </section>

        <section id="tentang-saya" class="kartu">
          <div class="kartu__isi">
            <div class="bagian-kepala">
              <div>
                <p class="eyebrow">CATATAN</p>
                <h2>Tentang Saya</h2>
              </div>
              <span class="bagian-penanda">02</span>
            </div>
            <KepalaProfil :profil="identitas" />
          </div>
        </section>

        <section id="ringkasan" class="kartu">
          <div class="kartu__isi">
            <div class="bagian-kepala">
              <div>
                <p class="eyebrow">ANGKA KOLEKSI</p>
                <h2>Ringkasan</h2>
              </div>
              <span class="bagian-penanda">03</span>
            </div>
            <dl class="ringkasan-list">
              <!-- :key berisi nilainya: elemen digambar ulang saat angka berubah, sehingga efek .bump main lagi -->
              <div><dt>Jumlah film</dt><dd id="jumlah-film" :key="jumlahFilm" class="bump">{{ jumlahFilm }}</dd></div>
              <div><dt>Rata-rata rating</dt><dd id="rata-rating" :key="rataRating" class="bump">{{ rataRating }}</dd></div>
            </dl>
          </div>
        </section>
      </div>
    </main>

    <footer>
      <p>&copy; 2026 Film Favorit Saya</p>
    </footer>
  </div>
</template>
