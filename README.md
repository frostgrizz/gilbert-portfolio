# Gilbert Evan Arkananta — Digital Portfolio

Portfolio statis berbasis HTML, CSS, dan JavaScript. Tidak membutuhkan framework atau proses build. Versi ini memiliki opening sinematik berbasis scroll, lanyard yang bisa diseret, showcase proyek, dan beberapa eksperimen interaktif.

## Isi folder

```text
gilbert-portfolio-v6/
├── index.html
├── styles.css
├── script.js
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── gilbert-portrait.webp
│   ├── sman1-klaten-photo.webp
│   ├── topographic-contours.svg
│   └── xblarblarr-dashboard.webp
└── projects/
    └── sate-master/
        └── index.html
```

## Menjalankan di komputer

1. Ekstrak folder ZIP.
2. Buka `index.html` di browser untuk melihat versi dasar.
3. Untuk pengalaman lokal yang lebih konsisten, jalankan server statis dari folder ini, misalnya dengan VS Code Live Server.

## Deploy ke Vercel melalui GitHub

1. Buat repository GitHub baru, misalnya `gilbert-portfolio`.
2. Clone repository tersebut menggunakan GitHub Desktop.
3. Salin seluruh isi folder ini ke folder repository lokal (pastikan `index.html` berada di root repository).
4. Di GitHub Desktop, isi Summary misalnya `Build personal portfolio`, klik **Commit to main**, lalu **Push origin**.
5. Login ke Vercel menggunakan GitHub, pilih **Add New → Project**, lalu import repository.
6. Framework Preset: **Other**. Build Command: kosong. Output Directory: `.` (root). Klik **Deploy**.
7. Setelah terhubung, setiap push baru ke branch utama akan memicu deployment baru.

## Bagian portofolio

- Opening sinematik dengan foto pribadi dan transisi zoom yang mengikuti scroll.
- Beranda dengan kartu identitas lanyard yang bisa diseret.
- Profil dan latar ketertarikan pada SECURE divisi Production.
- Empat area eksplorasi, toolkit, dan proses membangun karya.
- Perjalanan belajar dan dua proyek utama: XBLARBLARR serta Sate Master 3D.
- Prinsip berkarya, mini idea lab, FAQ, dan kontak Instagram.

## Interaksi yang tersedia

- Opening sinematik yang berubah mengikuti scroll dan menggunakan foto yang diberikan.
- Kartu lanyard yang dapat diseret dengan mouse atau touch, lalu kembali dengan gerakan pegas.
- Navigasi responsif dan progress halaman.
- Adegan proses yang tersusun bertahap saat discroll.
- Generator ide mini dengan tombol salin.
- FAQ accordion.
- Demo Sate Master 3D di `projects/sate-master/index.html`.

## Catatan konten

Informasi profil disusun dari detail yang diberikan: siswa SMA Negeri 1 Klaten, mengikuti ekstrakurikuler SECURE di divisi Production, tertarik pada web development, menggunakan Google Apps Script dan Google Sheets untuk proyek XBLARBLARR, serta membuat eksperimen Sate Master 3D. Daftar teknologi bukan klaim tingkat kemahiran profesional.


## V6 final polish notes
- Opening scroll shortened for a quicker transition into the home section.
- Identity card now lifts to a viewport-level layer while dragging, so it can be moved across the visible browser window with mouse or touch, then swings back to its lanyard.
- Logo mark uses a separately centered G glyph.
- Greeting uses the preferred nickname, Evan.
- Ticker is a continuous, pausable marquee.
- About section includes a subtle vector silhouette of the SMA Negeri 1 Klaten facade, based on the school's official exterior photos: https://sma1klaten.sch.id/
- Toolkit redesigned as a dark topographic skill constellation with selectable cards and animated bubble feedback.

- Footer G mark is centered independently from its small up-arrow accent.
- Lanyard dragging now uses a temporary viewport clone; the original card remains anchored in its home slot, preventing disappearance after drag, pointer cancellation, or tab focus changes.
- The About background uses the supplied SMA Negeri 1 Klaten facade photograph, softly blurred and faded into the paper surface.
- The topographic contour motif is applied consistently to light, dark, and gradient sections throughout the page.
