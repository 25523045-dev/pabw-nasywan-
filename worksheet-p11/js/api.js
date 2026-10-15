// js/api.js : lapisan data P10. Hanya berkas ini yang boleh memanggil fetch.
// Alamat ditulis satu kali di sini. Bila peladen tidak terjangkau dari kelas,
// ganti dengan './films.json' (berkas lokal, bentuk datanya sama).
const ALAMAT = 'https://ghibliapi.vercel.app/films';
const KUNCI_INFO = 'film-info-terakhir';

// Mengambil daftar film. Tiga kegagalan ditangkap di satu try/catch:
// jaringan mati (fetch menolak), status bukan 2xx (dilempar sendiri),
// dan badan bukan JSON (json() menolak).
export async function ambilFilm() {
  try {
    const respons = await fetch(ALAMAT);
    console.log('status', respons.status, 'ok', respons.ok);
    if (!respons.ok) throw new Error('status ' + respons.status);
    const data = await respons.json();
    simpanInfo(data.length);
    return data;
  } catch (galat) {
    console.error('gagal memuat', galat.message);
    throw galat; // dilempar lagi supaya app.js bisa menampilkannya di halaman
  }
}

// JSON.stringify: nilai -> teks, untuk disimpan ke localStorage.
function simpanInfo(jumlah) {
  try {
    const info = { jumlah: jumlah, waktu: new Date().toISOString() };
    localStorage.setItem(KUNCI_INFO, JSON.stringify(info));
  } catch (e) {
    // penyimpanan boleh gagal, tampilan tidak bergantung padanya
  }
}

// JSON.parse: teks -> nilai, untuk teks yang dipegang sendiri.
export function bacaInfoTerakhir() {
  try {
    const teks = localStorage.getItem(KUNCI_INFO);
    return teks ? JSON.parse(teks) : null;
  } catch (e) {
    return null;
  }
}
