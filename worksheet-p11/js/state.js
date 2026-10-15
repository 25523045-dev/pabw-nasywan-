// state.js — satu objek untuk seluruh keadaan, dan satu-satunya tempat keadaan itu diubah.
// Aturan: events.js dan berkas lain TIDAK menulis ke state langsung; mereka memanggil fungsi pengubah.
// Setiap fungsi pengubah mengubah state dulu, lalu (bila perlu) menyimpan, lalu menggambar.
import {
  daftarFilm,
  daftarKategori,
  hitungGalat,
  samakanGenre,
} from "./data.js";
import { simpan, muat, aturUlang } from "./simpan.js";
import { render, renderTema, renderFormulir, renderApi } from "./dom.js";
import { ambilFilm, bacaInfoTerakhir } from "./api.js";

const BAWAAN = { kategoriAktif: "semua", tema: "terang" };

/* ---------- Keadaan ---------- */

let idBerikut = 1;

export const state = {
  daftarFilm: daftarFilm.map((f) => ({ ...f, id: idBerikut++ })),  // salinan, data asli tidak berubah
  kategoriAktif: BAWAAN.kategoriAktif,   // disimpan
  tema: BAWAAN.tema,                     // disimpan: "terang" | "gelap"
  idBaru: null,                          // film yang baru ditambah, disorot sekali
  formulir: {
    sudahCoba: false,                    // true setelah tombol Tambah Film pernah ditekan
    menunggu: false,                     // tombol kirim nonaktif sampai semua kolom layak
    galat: { judul: "", tahun: "", rating: "" },
    status: "",
  },
  api: {                                 // P10: film dari jaringan
    status: "memuat",                    // "memuat" | "berhasil" | "gagal"
    daftar: [],
    pesan: "",
    infoTerakhir: null,
  },
};

/* ---------- Pembantu internal ---------- */

// Setelah data atau pilihan berubah: simpan (hanya pilihan), gambar, lalu hapus sorotan sekali pakai.
function terapkan() {
  simpan(state);
  render(state);
  state.idBaru = null;
}

function galatKosong() {
  return { judul: "", tahun: "", rating: "" };
}

/* ---------- Memulihkan pilihan dari simpanan ---------- */

// Dipanggil sekali saat halaman dimuat. Nilai dari simpanan diperiksa satu per satu,
// jadi isi yang aneh (genre yang tidak dikenal, tema asing) jatuh ke nilai bawaan.
export function pulihkanPilihan() {
  const isi = muat();                                        // null bila belum ada / rusak / versi lama
  state.kategoriAktif = daftarKategori.includes(isi?.kategoriAktif)
    ? isi.kategoriAktif
    : BAWAAN.kategoriAktif;
  state.tema = isi?.tema === "gelap" || isi?.tema === "terang"
    ? isi.tema
    : BAWAAN.tema;
  render(state);
}

/* ---------- Fungsi pengubah ---------- */

export function pilihKategori(nilai) {
  if (!daftarKategori.includes(nilai)) return;               // nilai tak dikenal: abaikan
  state.kategoriAktif = nilai;
  terapkan();
}

export function alihTema() {
  state.tema = state.tema === "gelap" ? "terang" : "gelap";
  simpan(state);
  renderTema(state);                                         // hanya bagian tema; tabel tidak digambar ulang
}

export function hapusFilm(id) {
  const f = state.daftarFilm.find((item) => item.id === id);
  if (f && f.poster && f.poster.startsWith("blob:")) URL.revokeObjectURL(f.poster);
  state.daftarFilm = state.daftarFilm.filter((item) => item.id !== id);
  terapkan();
}

// Tombol Atur ulang: hapus simpanan, kembalikan pilihan ke nilai bawaan, gambar ulang.
// Sengaja TIDAK memanggil simpan() sesudahnya, supaya simpanan benar-benar kosong.
export function aturUlangPilihan() {
  aturUlang();                                               // localStorage.removeItem
  state.kategoriAktif = BAWAAN.kategoriAktif;
  state.tema = BAWAAN.tema;
  state.idBaru = null;
  render(state);
}

/* ---------- Formulir Tambah Film ---------- */

// Dipanggil saat tombol Tambah Film ditekan. `nilai` = isi kolom mentah (teks).
// Mengembalikan { sah, pertama }: pertama = nama kolom bermasalah pertama (untuk fokus), atau null.
export function kirimFormulir(nilai) {
  const f = state.formulir;
  f.sudahCoba = true;
  f.status = "";
  f.galat = hitungGalat(nilai);

  const pertama = Object.keys(f.galat).find((nama) => f.galat[nama] !== "") ?? null;
  const sah = pertama === null;
  f.menunggu = !sah;                                         // tombol menunggu, bukan gagal

  if (!sah) {
    renderFormulir(state);
    return { sah, pertama };
  }

  const genreIsi = nilai.genre.trim();
  const baru = {
    id: idBerikut++,
    judul: nilai.judul.trim(),
    tahun: Number(nilai.tahun),
    genre: genreIsi === "" ? "-" : samakanGenre(genreIsi, state.daftarFilm),
    rating: Number(nilai.rating),
    poster: nilai.berkas && nilai.berkas.type.startsWith("image/")
      ? URL.createObjectURL(nilai.berkas)
      : null,
  };
  state.daftarFilm = [...state.daftarFilm, baru];            // nilai baru, bukan push
  state.idBaru = baru.id;
  state.kategoriAktif = "semua";                             // supaya film baru pasti terlihat

  f.sudahCoba = false;
  f.menunggu = false;
  f.galat = galatKosong();
  f.status = `Film "${baru.judul}" ditambahkan.`;

  terapkan();                                                // render() sudah mencakup formulir
  return { sah, pertama };
}

// Dipanggil saat pengguna mengetik. Tidak melakukan apa pun sebelum tombol kirim pernah ditekan.
// Tidak menyimpan dan tidak menggambar ulang tabel: ini bukan "tindakan selesai".
export function ubahKolom(nama, nilai) {
  const f = state.formulir;
  if (!f.sudahCoba || !(nama in f.galat)) return;
  const galat = hitungGalat(nilai);
  f.galat = { ...f.galat, [nama]: galat[nama] };             // hanya kolom yang sedang diketik
  f.menunggu = Object.values(galat).some((teks) => teks !== "");
  renderFormulir(state);
}

/* ---------- Film dari API (P10) ---------- */

// Tiga keadaan: memuat -> berhasil | gagal. Penarikan datanya ada di js/api.js; di sini hanya
// keadaan yang berpindah, lalu digambar.
export async function muatApi() {
  state.api.status = "memuat";
  state.api.pesan = "";
  state.api.infoTerakhir = bacaInfoTerakhir();               // JSON.parse dari localStorage, null bila belum ada
  renderApi(state);
  try {
    const daftar = await ambilFilm();
    state.api.daftar = daftar;
    state.api.status = "berhasil";
  } catch (galat) {
    state.api.daftar = [];
    state.api.status = "gagal";
    state.api.pesan = galat.message;
  }
  renderApi(state);
}
