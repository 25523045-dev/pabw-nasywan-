// dom.js — satu-satunya berkas P9 yang menyentuh halaman.
// Data dan fungsi murni tetap di app.js (P8).
import { daftarFilm } from "./app.js";

/* ---------- 1. Memilih elemen (A.3) ---------- */

// Ambil elemen, atau berhenti dengan pesan yang jelas bila null (bukan menebak).
function ambil(pemilih) {
  const el = document.querySelector(pemilih);
  if (el === null) {
    throw new Error(`Elemen "${pemilih}" tidak ditemukan. Cocokkan id/kelas dengan profil.html.`);
  }
  return el;
}

const wadah = ambil("#daftar");               // <tbody> tempat baris film dipasang
const barisFilter = ambil("#filter");         // induk tombol filter
const kosong = ambil("#pesan-kosong");
const jumlahFilm = ambil("#jumlah-film");
const rataRating = ambil("#rata-rating");
const tema = ambil("#tema");

const form = ambil("#form-film");
const tombolKirim = ambil("#tombol-kirim");
const statusForm = ambil("#status-form");
const kolom = {
  judul: ambil("#judul"),
  tahun: ambil("#tahun"),
  genre: ambil("#genre"),
  rating: ambil("#rating"),
  poster: ambil("#poster"),
};
const pesanGalat = {
  judul: ambil("#galat-judul"),
  tahun: ambil("#galat-tahun"),
  rating: ambil("#galat-rating"),
};

/* ---------- 2. Data yang sedang tampil ---------- */

// Salinan dari app.js, supaya data asli tidak ikut berubah. Tiap film diberi id.
let idBerikut = 1;
let film = daftarFilm.map((f) => ({ ...f, id: idBerikut++ }));
let pilihan = "semua";        // kategori filter yang sedang berlaku
let idBaru = null;            // film yang baru ditambah, untuk disorot sekali

/* ---------- 3. Membuat elemen dari data (B) ---------- */

function buatBaris(f, urutan) {
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

/* ---------- 4. Satu fungsi render per bagian halaman (D.1) ---------- */

function render(daftar) {
  wadah.textContent = "";                     // 1. kosongkan lebih dulu

  if (daftar.length === 0) {                  // 2. periksa keadaan kosong
    kosong.textContent = film.length === 0
      ? "Daftar film kosong. Tambahkan film lewat formulir Tambah Film."
      : "Tidak ada film pada genre itu.";
    kosong.hidden = false;
    return;
  }
  kosong.hidden = true;

  const barang = document.createDocumentFragment();   // 3. isi ulang, digambar sekali
  daftar.forEach((f, urutan) => barang.append(buatBaris(f, urutan)));
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

function renderRingkasan() {
  perbarui(jumlahFilm, String(film.length));
  const rata = film.length === 0
    ? "-"
    : (film.reduce((total, f) => total + f.rating, 0) / film.length).toFixed(1) + "/10";
  perbarui(rataRating, rata);
}

function tandaiTombolAktif() {
  barisFilter.querySelectorAll("button").forEach((tombol) => {
    tombol.classList.toggle("aktif", tombol.dataset.kategori === pilihan);
  });
}

function saring() {
  return film.filter((f) => pilihan === "semua" || f.genre === pilihan);
}

// Setiap perubahan data (atau filter) diikuti tepat satu pemanggilan ini.
function tampilkan() {
  render(saring());
  renderRingkasan();
  tandaiTombolAktif();
  idBaru = null;
}

/* ---------- 5. Filter: satu pendengar di induk (C) ---------- */

// Dipasang SEKALI, di luar render.
barisFilter.addEventListener("click", (event) => {
  const tombol = event.target.closest("button");
  if (!tombol || !barisFilter.contains(tombol)) return;   // klik di luar tombol

  pilihan = tombol.dataset.kategori;
  tampilkan();
});

/* ---------- 6. Hapus film: delegation di <tbody> ---------- */

function hapusFilm(id) {
  const f = film.find((item) => item.id === id);
  if (f && f.poster && f.poster.startsWith("blob:")) URL.revokeObjectURL(f.poster);
  film = film.filter((item) => item.id !== id);
  tampilkan();
}

wadah.addEventListener("click", (event) => {
  const tombol = event.target.closest(".tombol-hapus");
  if (!tombol) return;
  const tr = tombol.closest("tr");
  if (tr.classList.contains("menghilang")) return;

  const id = Number(tr.dataset.id);
  const judul = tr.querySelector("th span").textContent;
  if (!window.confirm(`Hapus "${judul}" dari daftar?`)) return;

  const gerak = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (gerak) {
    tr.classList.add("menghilang");
    setTimeout(() => hapusFilm(id), 300);
  } else {
    hapusFilm(id);
  }
});

/* ---------- 7. Validasi form (D.2) ---------- */

// Tiap aturan mengembalikan "" bila sah, atau pesan yang menyebut cara memperbaiki.
// Nilai kolom isian selalu teks, jadi angka diubah dengan Number() dulu.
const aturan = {
  judul(nilai) {
    return nilai.trim() === ""
      ? "Judul film tidak boleh kosong. Tulis judul filmnya."
      : "";
  },
  tahun(nilai) {
    const isi = nilai.trim();
    if (isi === "") return "Tahun tidak boleh kosong. Tulis tahun rilis, misalnya 2014.";
    const angka = Number(isi);
    if (!Number.isInteger(angka) || angka < 1900 || angka > 2100) {
      return "Tahun harus bilangan bulat antara 1900 dan 2100.";
    }
    return "";
  },
  rating(nilai) {
    const isi = nilai.trim();
    if (isi === "") return "Rating tidak boleh kosong. Isi angka 0 sampai 10, misalnya 9.5.";
    const angka = Number(isi);
    if (Number.isNaN(angka) || angka < 0 || angka > 10) {
      return "Rating harus berupa angka antara 0 sampai 10.";
    }
    if (Math.round(angka * 10) / 10 !== angka) {
      return "Rating hanya boleh satu angka di belakang koma, misalnya 9.5.";
    }
    return "";
  },
};

let sudahCoba = false;   // true setelah pengguna pernah menekan Tambah Film

function tampilkanGalat(nama, teks) {
  const elemenGalat = pesanGalat[nama];
  elemenGalat.textContent = teks;             // teks, bukan HTML
  elemenGalat.hidden = teks === "";
  if (teks === "") {
    kolom[nama].removeAttribute("aria-invalid");
  } else {
    kolom[nama].setAttribute("aria-invalid", "true");
  }
}

// Periksa satu kolom dan tampilkan hasilnya.
function periksaKolom(nama) {
  const teks = aturan[nama](kolom[nama].value);
  tampilkanGalat(nama, teks);
  return teks === "";
}

// Periksa semua kolom; kembalikan apakah sah dan kolom pertama yang bermasalah.
function periksaSemuaKolom() {
  let pertama = null;
  Object.keys(aturan).forEach((nama) => {
    if (!periksaKolom(nama) && pertama === null) pertama = kolom[nama];
  });
  return { sah: pertama === null, pertama };
}

// Hanya menghitung, tanpa menampilkan pesan.
function semuaSah() {
  return Object.keys(aturan).every((nama) => aturan[nama](kolom[nama].value) === "");
}

// Samakan penulisan genre dengan yang sudah ada ("aksi" -> "Aksi").
function genreKanonik(genre) {
  const ada = film.find((f) => f.genre.toLowerCase() === genre.toLowerCase());
  return ada ? ada.genre : genre;
}

function tambahFilm() {
  const berkas = kolom.poster.files[0];
  const adaFoto = berkas && berkas.type.startsWith("image/");
  const genreIsi = kolom.genre.value.trim();

  const baru = {
    id: idBerikut++,
    judul: kolom.judul.value.trim(),
    tahun: Number(kolom.tahun.value),
    genre: genreIsi === "" ? "-" : genreKanonik(genreIsi),
    rating: Number(kolom.rating.value),
    poster: adaFoto ? URL.createObjectURL(berkas) : null,
  };
  film.push(baru);                            // data berubah dulu...
  idBaru = baru.id;
  pilihan = "semua";                          // supaya film baru pasti terlihat
  tampilkan();                                // ...lalu satu kali render
  return baru;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();                     // baris pertama: halaman tidak dimuat ulang
  sudahCoba = true;
  statusForm.textContent = "";

  const { sah, pertama } = periksaSemuaKolom();
  tombolKirim.disabled = !sah;                // tombol menunggu, bukan gagal

  if (!sah) {
    pertama.focus();                          // pindahkan fokus ke kolom yang perlu diperbaiki
    return;
  }

  const baru = tambahFilm();
  form.reset();
  Object.keys(aturan).forEach((nama) => tampilkanGalat(nama, ""));
  sudahCoba = false;
  tombolKirim.disabled = false;
  statusForm.textContent = `Film "${baru.judul}" ditambahkan.`;
  kolom.judul.focus();
});

// Satu pendengar input di form (delegation): pesan hilang begitu isinya layak.
form.addEventListener("input", (event) => {
  const nama = event.target.name;
  if (!(nama in aturan) || !sudahCoba) return;
  periksaKolom(nama);
  tombolKirim.disabled = !semuaSah();
});

/* ---------- 8. Ingat pilihan tema walau halaman di-refresh ---------- */

try {
  tema.checked = localStorage.getItem("tema") === "gelap";
  tema.addEventListener("change", () => {
    localStorage.setItem("tema", tema.checked ? "gelap" : "terang");
  });
} catch (err) { /* penyimpanan dinonaktifkan: abaikan */ }

/* ---------- 9. Render pertama, setelah semua fungsi siap ---------- */

tampilkan();
