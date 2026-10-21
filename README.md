# UKM UTC UPITRA Landing Page

React + Vite + Tailwind CSS v4 + framer-motion + lucide-react.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil build di folder dist
npm run preview  # coba hasil build
```

## Struktur

- `src/UtcLandingMotion.jsx` seluruh landing page. Data (divisi, anggota, agenda, project, berita, prestasi, FAQ) ada di bagian atas file.
- `src/App.jsx` merender komponen landing page.
- `src/index.css` hanya berisi `@import "tailwindcss";`. Jangan tambahkan CSS bawaan template Vite.

## Mengganti konten

- Foto anggota: ubah array `MEN` dan `WOMEN` serta fungsi `person()`.
- Nama dan jabatan: ubah `DIVISIONS` dan `BPH`.
- Palet: hitam `#04060B`, biru tua `#0A192F`, biru muda `#38BDF8`, putih. Ganti lewat find and replace.

## Deploy ke GitHub Pages

1. Push ke branch `main`.
2. Di repo GitHub: Settings, Pages, Build and deployment, Source: **GitHub Actions**.
3. Setiap push ke `main` akan membangun dan menerbitkan situs secara otomatis lewat `.github/workflows/deploy.yml`.

Situs akan tersedia di `https://USERNAME.github.io/NAMA-REPO/`.
