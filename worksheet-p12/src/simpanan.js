// simpan.js — satu-satunya berkas yang menyentuh localStorage untuk pilihan pengguna.
// (js/api.js dari P10 punya simpanan sendiri untuk "kunjungan sebelumnya"; tidak diubah.)
//
// Yang disimpan hanya pilihan tampilan: kategori aktif dan tema.
// Yang SENGAJA tidak disimpan: daftar film tambahan dan fotonya (URL blob hanya hidup
// selama tab terbuka), isi formulir, token, kata sandi, atau data pribadi apa pun.

const KUNCI = "pabw-p11";
const VERSI = 2; // naikkan bila bentuk isi simpanan berubah

export function simpan(state) {
  const isi = {
    versi: VERSI,
    kategoriAktif: state.kategoriAktif,
    tema: state.tema,
  };
  try {
    localStorage.setItem(KUNCI, JSON.stringify(isi));
  } catch {
    // penyimpanan penuh atau dinonaktifkan: halaman tetap jalan, hanya tidak mengingat
  }
}

// Mengembalikan objek simpanan yang sah, atau null (belum pernah disimpan, rusak, atau versi lama).
// Pemanggil memakai nilai bawaan bila hasilnya null.
export function muat() {
  try {
    const isi = JSON.parse(localStorage.getItem(KUNCI));
    if (isi?.versi !== VERSI) {
      localStorage.removeItem(KUNCI); // bentuk lama atau kosong: buang
      return null;
    }
    return isi;
  } catch {
    try {
      localStorage.removeItem(KUNCI); // isi rusak: buang
    } catch {
      // abaikan
    }
    return null;
  }
}

export function aturUlang() {
  try {
    localStorage.removeItem(KUNCI);
  } catch {
    // abaikan
  }
}
