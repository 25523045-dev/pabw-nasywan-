// data.js — data mentah dan fungsi murni (tanpa DOM, tanpa state, tanpa penyimpanan).
// Dipindah dari js/app.js (P8): profil, daftarFilm, buatPerkenalan, formatKeahlian.
// Fungsi murni tambahan dari js/dom.js (P9): aturan validasi, hitungRataRating, samakanGenre.

/* ---------- Data mentah ---------- */

export const profil = {
  nama: "Nasywan Musyaffa",
  peran: "Mahasiswa Informatika yang belajar front-end",
  keahlian: ["HTML", "CSS", "JavaScript"],
  alamat: { kota: "Yogyakarta" },
};

// Kategori yang dikenal filter. "semua" selalu ada; sisanya cocok dengan data-kategori di profil.html.
export const daftarKategori = ["semua", "Fiksi Ilmiah", "Aksi", "Drama", "Fantasi"];

// Rating disimpan sebagai angka.
export const daftarFilm = [
  { judul: "Inception", tahun: 2010, genre: "Fiksi Ilmiah", rating: 9, poster: "poster-inception.jpg" },
  { judul: "Interstellar", tahun: 2014, genre: "Fiksi Ilmiah", rating: 9.5, poster: "poster-interstellar.jpg" },
  { judul: "The Dark Knight", tahun: 2008, genre: "Aksi", rating: 9, poster: "poster-dark-knight.jpg" },
  { judul: "Avatar", tahun: 2009, genre: "Fiksi Ilmiah", rating: 7.8, poster: "poster-avatar.svg" },
  { judul: "The Avengers", tahun: 2012, genre: "Aksi", rating: 8.1, poster: "poster-avengers.svg" },
  { judul: "Gladiator", tahun: 2000, genre: "Drama", rating: 8.5, poster: "poster-gladiator.svg" },
  { judul: "The Lord of the Rings: The Fellowship of the Ring", tahun: 2001, genre: "Fantasi", rating: 8.8, poster: "poster-lotr.svg" },
  { judul: "The Matrix", tahun: 1999, genre: "Fiksi Ilmiah", rating: 8.7, poster: "poster-matrix.svg" },
  { judul: "Spider-Man: No Way Home", tahun: 2021, genre: "Aksi", rating: 8.2, poster: "poster-spider-man-no-way-home.svg" },
  { judul: "Parasite", tahun: 2019, genre: "Drama", rating: 8.5, poster: "poster-parasite.svg" },
];

/* ---------- Fungsi murni pemformat (P8) ---------- */

export function buatPerkenalan({ nama, peran }) {
  return `${nama} — ${peran}`;
}

export const formatKeahlian = (daftar) => daftar.join(" · ");

/* ---------- Fungsi murni penghitung ---------- */

// Rata-rata rating satu angka di belakang koma; "-" bila daftar kosong.
export function hitungRataRating(daftar) {
  if (daftar.length === 0) return "-";
  const total = daftar.reduce((jumlah, f) => jumlah + f.rating, 0);
  return (total / daftar.length).toFixed(1) + "/10";
}

// Samakan penulisan genre dengan yang sudah ada ("aksi" -> "Aksi").
export function samakanGenre(genre, daftar) {
  const ada = daftar.find((f) => f.genre.toLowerCase() === genre.toLowerCase());
  return ada ? ada.genre : genre;
}

/* ---------- Aturan validasi form (P9) ---------- */

// Tiap aturan mengembalikan "" bila sah, atau pesan yang menyebut cara memperbaiki.
// Nilai kolom isian selalu teks, jadi angka diubah dengan Number() dulu.
export const aturan = {
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

export const namaKolomBerAturan = Object.keys(aturan);

// Hasilkan pesan galat untuk semua kolom: { judul: "", tahun: "...", rating: "" }.
export function hitungGalat(nilai) {
  const galat = {};
  namaKolomBerAturan.forEach((nama) => {
    galat[nama] = aturan[nama](nilai[nama]);
  });
  return galat;
}
