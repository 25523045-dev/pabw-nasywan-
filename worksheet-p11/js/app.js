// app.js — perakit. Tidak berisi logika: hanya mengimpor modul lain dan menjalankannya berurutan.
// Satu-satunya skrip yang dipanggil profil.html: <script type="module" src="js/app.js">
import { renderProfil } from "./dom.js";
import { state, pulihkanPilihan, muatApi } from "./state.js";
import { pasangPendengar } from "./events.js";
import { muat } from "./simpan.js";

renderProfil();       // identitas dari data.js
pulihkanPilihan();    // muat simpanan -> state (nilai bawaan bila kosong/rusak) -> render pertama
pasangPendengar();    // semua pendengar, sekali
muatApi();            // P10: ambil film dari API (tidak ditunggu, halaman tidak tertahan)

// Hanya untuk pemeriksaan di Console (worksheet C.4 dan E.3): variabel modul tidak otomatis global.
// Tidak dipakai oleh kode aplikasi mana pun.
window.state = state;
window.muat = muat;
