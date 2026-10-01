# Worksheet P5 — Layout Modern: Flexbox dan Grid

Project ini merupakan lanjutan dari Pertemuan 4 dengan susunan layout yang diperbarui menggunakan Grid dan Flexbox.

## Implementasi P5
- Kerangka halaman memakai Grid dengan tiga baris: header, isi, footer.
- Area isi memakai Grid dengan sidebar dan konten utama.
- Navbar memakai Flexbox dan `gap`.
- Galeri memakai `repeat(auto-fit, minmax(...))` tanpa media query khusus galeri.
- Kartu memakai Grid untuk struktur isi dan Flexbox pada bagian kaki kartu.
- Penempatan memakai grid area dan span.
- Item panjang diberi `min-width: 0` dan `overflow-wrap: anywhere` untuk mencegah luberan.
- Kartu diberi `min-height` agar tinggi lebih seragam.


## Worksheet P5
Project ini menggunakan layout modern sesuai Worksheet P5: Grid untuk kerangka halaman dan Flexbox untuk navbar/isi kartu, galeri adaptif dengan `repeat(auto-fit, minmax(16rem, 1fr))`, serta perbaikan `min-width: 0` dan `overflow-wrap` untuk mencegah overflow.
