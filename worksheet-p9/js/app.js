// ============================================================
// P8 — app.js (halaman "Film Favorit Saya")
// Cek dan ganti isi yang bertanda GANTI dengan datamu sendiri.
// Pastikan kamu bisa menjelaskan setiap baris sebelum dikumpulkan.
// ============================================================

// ---------- LEMBAR B: data sebagai variabel ----------
export const profil = {
  nama: "Nasywan Musyaffa",
  peran: "Mahasiswa Informatika yang belajar front-end",
  keahlian: ["HTML", "CSS", "JavaScript"], // GANTI bila perlu, minimal 3
  alamat: { kota: "Yogyakarta" },           // GANTI; dipakai untuk demo ?.
};

const jumlahFilm = 3; // angka sungguhan (number, bukan "3")
let pilihanAktif = "semua"; // let: nilainya akan berubah saat disaring

// Demo ?? dan ?. (aman dari null/undefined)
const julukan = profil.julukan ?? "-";          // tidak ada -> "-"
const provinsi = profil.alamat?.provinsi;       // undefined, bukan galat
const kotaAman = profil.domisili?.kota ?? "-";  // domisili tidak ada, tidak error

// Satu identitas dipakai di dua tempat (title + Console)
document.title = `Film Favorit — ${profil.nama}`;

const kalimat = `Nama saya ${profil.nama}, dan saya belajar ${profil.keahlian.length} hal.`;
console.log(kalimat);
console.log(typeof profil.nama, typeof jumlahFilm); // "string" "number"
console.log({ julukan, provinsi, kotaAman, pilihanAktif });

// ---------- LEMBAR C: dua fungsi murni ----------
function buatPerkenalan({ nama, peran }) {
  return `${nama} — ${peran}`;
}

const formatKeahlian = (daftar) => daftar.join(" · ");

console.log(buatPerkenalan(profil));
console.log(formatKeahlian(profil.keahlian));

// Uji cepat: panggil dengan 3 argumen berbeda
console.log(buatPerkenalan({ nama: "Nasywan", peran: "mahasiswa" }));
console.log(formatKeahlian(["Git"]));
console.log(formatKeahlian([]));

// ---------- LEMBAR D: array of object + map/filter/find ----------
// Isinya sama dengan tabel di halamanmu (rating disimpan sebagai angka)
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

console.table(profil.keahlian);
console.table(daftarFilm);

// filter: hanya film dengan genre tertentu
const fiksiIlmiah = daftarFilm.filter((film) => film.genre === "Fiksi Ilmiah");
console.table(fiksiIlmiah);

// find: satu film berdasarkan judul (undefined kalau tidak ada)
const interstellar = daftarFilm.find((film) => film.judul === "Interstellar");
console.log(interstellar);
console.log(daftarFilm.find((film) => film.judul === "Tidak Ada")); // undefined

// map: mengubah setiap isi, panjang hasil sama dengan array asal
const daftarJudul = daftarFilm.map((film) => film.judul);
console.log(daftarJudul, daftarJudul.length === daftarFilm.length); // ... true

// sort pada SALINAN supaya data asli tidak berubah
const urutRating = [...daftarFilm].sort((a, b) => b.rating - a.rating);
console.table(urutRating);
console.log(daftarFilm[0].judul); // tetap "Inception"

// ---------- LEMBAR E: tiga kasus sulit ----------

// 1) undefined karena label salah tulis
console.log(profil.namaa); // sengaja salah -> undefined. Catat di E.5, lalu benahi.

// 2) null dari querySelector (id tidak ada di HTML)
const elemen = document.querySelector("#tidak-ada");
console.log(elemen); // null
console.log(elemen?.textContent ?? "elemen tidak ditemukan");

// 3) nilai dari kolom isian selalu teks
const nilaiInput = document.querySelector("#tahun").value; // "" bila kosong, selalu string
console.log(typeof nilaiInput);
console.log("2010" + 1);          // "20101" (menyambung)
console.log(Number("2010") + 1);  // 2011