<script setup>
// Satu-satunya komponen yang menerima props (D.3). Anak hanya MEMBACA props, tidak mengubahnya.
import { buatPerkenalan, formatKeahlian } from '../data.js'

const props = defineProps({
  profil: { type: Object, required: true },
})
</script>

<template>
  <div class="profil-saya">
    <h3 id="profil-nama" :title="buatPerkenalan(props.profil)">{{ props.profil.nama }}</h3>
    <p id="profil-peran">{{ props.profil.peran }}</p>
    <dl>
      <div>
        <dt>Keahlian</dt>
        <dd id="profil-keahlian">{{ formatKeahlian(props.profil.keahlian) }}</dd>
      </div>
      <div>
        <dt>Kota</dt>
        <dd id="profil-kota">{{ props.profil.alamat?.kota ?? '-' }}</dd>
      </div>
    </dl>
    <p>Halaman ini berisi daftar film yang saya sukai.</p>
  </div>
</template>
