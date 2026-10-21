# Worksheet P12 — Build Produksi dengan Vite

## Deskripsi

Worksheet P12 merupakan pengembangan aplikasi web menggunakan Vue dan Vite. Pada worksheet ini dilakukan proses build untuk menghasilkan aset produksi yang lebih ringkas dan pengujian aplikasi melalui development server serta production preview.

## Implementasi

Pada worksheet ini diterapkan:

- Pengembangan aplikasi menggunakan Vue dan Vite.
- Pengelolaan aset CSS, JavaScript, dan gambar.
- Build produksi menggunakan `npm run build`.
- Pengujian hasil build menggunakan `npm run preview`.
- Pemeriksaan jumlah request dan ukuran transfer melalui tab Network.
- Pemeriksaan Console pada browser.
- Penggunaan Git untuk menyimpan riwayat perubahan.

## Perintah Pengujian

```bash
npm run dev
npm run build
npm run preview
```

Development server menggunakan port `5173`, sedangkan preview produksi menggunakan port `4173` secara default.

## Hasil Build

Build berhasil dijalankan menggunakan Vite.

- `dist/index.html`: 0,54 kB.
- `dist/assets/index-C8Hnbxx7.css`: 21,46 kB.
- `dist/assets/index-BsR0jJAE.js`: 80,64 kB.

## Hasil Pengujian Network

- Development: 38 requests, 3,7 MB transferred.
- Production preview: 16 requests. Total transferred perlu dilengkapi berdasarkan hasil pengukuran di browser.

## Bukti Pengujian

Lampirkan screenshot aplikasi pada production preview, hasil pemeriksaan Network, dan Console browser sesuai ketentuan worksheet.

## Deklarasi Penggunaan AI

Lengkapi bagian ini berdasarkan penggunaan AI yang benar-benar dilakukan selama pengerjaan worksheet.
