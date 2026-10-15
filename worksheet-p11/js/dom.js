// dom.js — satu-satunya berkas yang menyentuh halaman: pemilih elemen, render, kelas.
// Tidak mengimpor state.js: render menerima state sebagai argumen, jadi tidak ada impor memutar.
// Aturan: berkas ini hanya MENGGAMBAR dari state; tidak ada keadaan yang dibaca kembali dari halaman.
import { profil, formatKeahlian, buatPerkenalan, hitungRataRating } from "./data.js";

/* ---------- 1. Memilih elemen ---------- */

// Ambil elemen, atau berhenti dengan pesan yang jelas bila null (bukan menebak).
function ambil(pemilih) {
  const el = document.querySelector(pemilih);
  if (el === null) {
    throw new Error(`Elemen "${pemilih}" tidak ditemukan. Cocokkan id/kelas dengan profil.html.`);
  }
  return el;
}

export const wadah = ambil("#daftar");               // <tbody> tempat baris film dipasang
export const barisFilter = ambil("#filter");         // induk tombol filter
export const tombolAturUlang = ambil("#atur-ulang");
export const tema = ambil("#tema");
export const form = ambil("#form-film");
export const kolom = {
  judul: ambil("#judul"),
  tahun: ambil("#tahun"),
  genre: ambil("#genre"),
  rating: ambil("#rating"),
  poster: ambil("#poster"),
};
export const cobaLagi = ambil("#coba-lagi");

const kosong = ambil("#pesan-kosong");
const jumlahFilm = ambil("#jumlah-film");
const rataRating = ambil("#rata-rating");
const tombolKirim = ambil("#tombol-kirim");
const statusForm = ambil("#status-form");
const pesanGalat = {
  judul: ambil("#galat-judul"),
  tahun: ambil("#galat-tahun"),
  rating: ambil("#galat-rating"),
};
const wadahApi = ambil("#daftar-api");
const statusApi = ambil("#status-api");
const infoApi = ambil("#info-api");

/* ---------- 2. Membuat elemen dari data ---------- */

function buatBaris(f, urutan, idBaru) {
  const tr = document.createElement("tr");
  tr.dataset.id = f.id;
  tr.style.setProperty("--i", urutan + 1);    // jeda animasi muncul bertahap

  const tdPoster = document.createElement("td");
  if (f.poster) {
    const img = document.createElement("img");
    img.className = "poster";
    img.src = f.poster;
    img.alt = `Poster film ${f.judul}`;
    img.width = 200;
    img.height = 300;
    tdPoster.append(img);
  } else {
    const tanpa = document.createElement("span");
    tanpa.className = "poster-kosong";
    tanpa.textContent = "Tanpa foto";
    tdPoster.append(tanpa);
  }

  const th = document.createElement("th");
  th.scope = "row";
  const teksJudul = document.createElement("span");
  teksJudul.textContent = f.judul;            // teks, bukan HTML
  const hapus = document.createElement("button");
  hapus.type = "button";
  hapus.className = "tombol-hapus";
  hapus.textContent = "Hapus";
  hapus.setAttribute("aria-label", `Hapus film ${f.judul}`);
  th.append(teksJudul, hapus);

  const tdTahun = document.createElement("td");
  tdTahun.textContent = f.tahun;
  const tdGenre = document.createElement("td");
  tdGenre.textContent = f.genre;
  const tdRating = document.createElement("td");
  tdRating.textContent = `${f.rating}/10`;

  tr.append(tdPoster, th, tdTahun, tdGenre, tdRating);
  if (f.id === idBaru) tr.className = "baris-baru";   // kelas diberikan sesudah isi
  return tr;
}

/* ---------- 3. Render: tampilan adalah fungsi dari state ---------- */

// Film yang lolos kategori aktif. Dihitung dari state, tidak disimpan di mana pun.
function saring(state) {
  return state.daftarFilm.filter(
    (f) => state.kategoriAktif === "semua" || f.genre === state.kategoriAktif
  );
}

function renderDaftar(state) {
  wadah.textContent = "";                     // 1. kosongkan lebih dulu
  const tampil = saring(state);               // dari state, bukan argumen

  if (tampil.length === 0) {                  // 2. periksa keadaan kosong
    kosong.textContent = state.daftarFilm.length === 0
      ? "Daftar film kosong. Tambahkan film lewat formulir Tambah Film."
      : "Tidak ada film pada genre itu.";
    kosong.hidden = false;
    return;
  }
  kosong.hidden = true;

  const barang = document.createDocumentFragment();   // 3. isi ulang, digambar sekali
  tampil.forEach((f, urutan) => barang.append(buatBaris(f, urutan, state.idBaru)));
  wadah.append(barang);
}

// Ubah teks; bila berubah, beri efek membal pada angkanya.
function perbarui(el, teks) {
  if (el.textContent === teks) return;
  el.textContent = teks;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function renderRingkasan(state) {
  perbarui(jumlahFilm, String(state.daftarFilm.length));
  perbarui(rataRating, hitungRataRating(state.daftarFilm));
}

// Tombol aktif digambar dari state.kategoriAktif, bukan dibaca dari kelas tombol.
function renderFilter(state) {
  barisFilter.querySelectorAll("button").forEach((tombol) => {
    tombol.classList.toggle("aktif", tombol.dataset.kategori === state.kategoriAktif);
  });
}

// CSS tema memakai #tema:checked; kotak centang itu hanya cerminan dari state.tema.
export function renderTema(state) {
  tema.checked = state.tema === "gelap";
}

export function renderProfil() {
  document.title = `Film Favorit — ${profil.nama}`;
  ambil("#profil-nama").textContent = profil.nama;
  ambil("#profil-nama").title = buatPerkenalan(profil);
  ambil("#profil-peran").textContent = profil.peran;
  ambil("#profil-keahlian").textContent = formatKeahlian(profil.keahlian);
  ambil("#profil-kota").textContent = profil.alamat?.kota ?? "-";
}

// Bagian formulir dipisah dari render(): mengetik tidak boleh menggambar ulang tabel.
export function renderFormulir(state) {
  Object.keys(pesanGalat).forEach((nama) => {
    const teks = state.formulir.galat[nama];
    pesanGalat[nama].textContent = teks;      // teks, bukan HTML
    pesanGalat[nama].hidden = teks === "";
    if (teks === "") {
      kolom[nama].removeAttribute("aria-invalid");
    } else {
      kolom[nama].setAttribute("aria-invalid", "true");
    }
  });
  tombolKirim.disabled = state.formulir.menunggu;
  statusForm.textContent = state.formulir.status;
}

// Film dari API (P10): hanya menyusun elemen dari state.api, tidak tahu dari mana data datang.
export function renderApi(state) {
  const api = state.api;
  cobaLagi.hidden = api.status !== "gagal";
  infoApi.hidden = api.infoTerakhir === null;
  if (api.infoTerakhir !== null) {
    infoApi.textContent = `Kunjungan sebelumnya: ${api.infoTerakhir.jumlah} film.`;
  }

  wadahApi.textContent = "";                  // kosongkan dulu, supaya kartu tidak berlipat
  if (api.status === "memuat") {
    statusApi.textContent = "Memuat...";
  } else if (api.status === "gagal") {
    statusApi.textContent = "Gagal memuat data: " + api.pesan;
  } else if (api.daftar.length === 0) {
    statusApi.textContent = "Belum ada film";
  } else {
    statusApi.textContent = `${api.daftar.length} film dimuat dari API.`;
    api.daftar.forEach((f) => {
      const kartu = document.createElement("article");
      kartu.className = "kartu-api";
      const judul = document.createElement("h3");
      judul.textContent = f.title;            // textContent, bukan innerHTML
      const info = document.createElement("p");
      info.textContent = `${f.director} · ${f.release_date}`;
      kartu.append(judul, info);
      wadahApi.append(kartu);
    });
  }
}

// Menggambar seluruh halaman dari state. Memanggilnya dua kali berturut-turut
// tidak mengubah maupun melipatgandakan tampilan.
export function render(state) {
  renderDaftar(state);
  renderRingkasan(state);
  renderFilter(state);
  renderTema(state);
  renderFormulir(state);
  renderApi(state);
}

/* ---------- 4. Pembantu untuk events.js (events.js tidak menyentuh halaman) ---------- */

// Nilai mentah kolom isian yang baru saja diisi pengguna (masukan, bukan keadaan aplikasi).
export function bacaNilaiForm() {
  return {
    judul: kolom.judul.value,
    tahun: kolom.tahun.value,
    genre: kolom.genre.value,
    rating: kolom.rating.value,
    berkas: kolom.poster.files[0] ?? null,
  };
}

export function kosongkanForm() {
  form.reset();
}

export function fokusKolom(nama) {
  kolom[nama].focus();
}

// Kenali klik pada tombol Hapus; kembalikan id dan judul barisnya, atau null.
export function bacaTombolHapus(event) {
  const tombol = event.target.closest(".tombol-hapus");
  if (!tombol) return null;
  const tr = tombol.closest("tr");
  if (tr.classList.contains("menghilang")) return null;
  return {
    tr,
    id: Number(tr.dataset.id),
    judul: tr.querySelector("th span").textContent,
  };
}

// Beri efek menghilang (bila pengguna tidak menolak gerakan), lalu jalankan sesudahnya.
export function keluarkanBaris(tr, sesudahnya) {
  const gerak = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (gerak) {
    tr.classList.add("menghilang");
    setTimeout(sesudahnya, 300);
  } else {
    sesudahnya();
  }
}
