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

## Upload melalui browser GitHub dan deploy ke Vercel

1. Ekstrak ZIP ini di komputer.
2. Buka repository GitHub melalui browser.
3. Pilih **Add file → Upload files**.
4. Buka folder hasil ekstrak, pilih seluruh isi folder (`Ctrl + A`), lalu seret ke halaman upload. Jangan mengunggah ZIP sebagai satu file.
5. Pastikan `index.html`, `styles.css`, `script.js`, `assets/`, dan `projects/` terlihat di root repository.
6. Isi commit message, lalu pilih **Commit changes**.
7. Di Vercel pilih **Add New → Project**, import repository, pilih Framework Preset **Other**, kosongkan Build Command, gunakan root sebagai Output Directory, lalu Deploy.
8. Untuk domain dan SEO, ikuti `SEO-DOMAIN-GUIDE.md`.


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

## SEO dan domain

Paket ini telah disiapkan untuk `https://gilbertevanarkananta.my.id/`. File `robots.txt`, `sitemap.xml`, Open Graph cover, canonical, metadata, dan JSON-LD sudah disertakan. Baca `SEO-DOMAIN-GUIDE.md` untuk pengaturan DNS IDwebhost, custom domain Vercel, serta verifikasi dan pengiriman sitemap melalui Google Search Console.
