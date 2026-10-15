// events.js — memasang SELURUH pendengar peristiwa, sekali, di satu tempat.
// Aturan: setiap tindakan pengguna memanggil tepat satu fungsi pengubah dari state.js.
// Berkas ini tidak menulis ke state langsung dan tidak menyentuh halaman selain lewat dom.js.
import {
  barisFilter,
  wadah,
  form,
  tema,
  tombolAturUlang,
  cobaLagi,
  bacaNilaiForm,
  kosongkanForm,
  fokusKolom,
  bacaTombolHapus,
  keluarkanBaris,
} from "./dom.js";
import {
  pilihKategori,
  alihTema,
  hapusFilm,
  aturUlangPilihan,
  kirimFormulir,
  ubahKolom,
  muatApi,
} from "./state.js";

export function pasangPendengar() {
  // Filter: satu pendengar di induk (delegation).
  barisFilter.addEventListener("click", (event) => {
    const tombol = event.target.closest("button");
    if (!tombol || !barisFilter.contains(tombol)) return;     // klik di luar tombol
    pilihKategori(tombol.dataset.kategori);
  });

  // Hapus film: delegation di <tbody>.
  wadah.addEventListener("click", (event) => {
    const sasaran = bacaTombolHapus(event);
    if (sasaran === null) return;
    if (!window.confirm(`Hapus "${sasaran.judul}" dari daftar?`)) return;
    keluarkanBaris(sasaran.tr, () => hapusFilm(sasaran.id));
  });

  // Form Tambah Film.
  form.addEventListener("submit", (event) => {
    event.preventDefault();                                   // baris pertama: halaman tidak dimuat ulang
    const { sah, pertama } = kirimFormulir(bacaNilaiForm());
    if (!sah) {
      fokusKolom(pertama);                                    // pindahkan fokus ke kolom yang perlu diperbaiki
      return;
    }
    kosongkanForm();
    fokusKolom("judul");
  });

  // Satu pendengar input di form (delegation): pesan hilang begitu isinya layak.
  form.addEventListener("input", (event) => {
    ubahKolom(event.target.name, bacaNilaiForm());
  });

  // Tema.
  tema.addEventListener("change", () => {
    alihTema();
  });

  // Atur ulang pilihan.
  tombolAturUlang.addEventListener("click", () => {
    aturUlangPilihan();
  });

  // Coba lagi memuat data API.
  cobaLagi.addEventListener("click", () => {
    muatApi();
  });
}
