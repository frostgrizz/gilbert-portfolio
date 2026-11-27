# SEO & Domain Launch Guide — Gilbert Evan Arkananta

Domain utama yang dipakai paket ini: **https://gilbertevanarkananta.my.id/**
Penyedia domain: **IDwebhost**. Hosting: **Vercel**.

## File SEO yang sudah disiapkan

- `robots.txt` — mengizinkan crawler mengakses situs dan menunjukkan lokasi sitemap.
- `sitemap.xml` — daftar URL publik kanonis: halaman portofolio dan Sate Master 3D.
- `assets/og-cover.jpg` — gambar Open Graph 1200 × 630 untuk preview tautan.
- `index.html` — title, meta description, canonical, Open Graph, Twitter Card, dan JSON-LD `WebSite`, `ProfilePage`, serta `Person`.
- `projects/sate-master/index.html` — title, description, canonical, Open Graph, dan JSON-LD `VideoGame`.

Tidak ada token Google verifikasi palsu di dalam kode. Token itu harus dibuat dari akun Google Search Console milik pemilik domain.

## A. Pasang domain di Vercel

1. Pastikan repository GitHub sudah berisi **isi** folder proyek ini, dengan `index.html` di root repository.
2. Buka Vercel Dashboard → pilih project portofolio → **Settings → Domains**.
3. Tambahkan `gilbertevanarkananta.my.id`.
4. Tambahkan juga `www.gilbertevanarkananta.my.id`.
5. Pilih domain utama `gilbertevanarkananta.my.id`; atur `www` untuk redirect permanen ke domain utama jika opsi redirect ditampilkan.
6. Vercel akan menampilkan DNS record yang diminta untuk domain tersebut. Biarkan halaman ini terbuka; gunakan nilai persis yang tertera di dashboard, karena record yang disarankan bisa berbeda antar-konfigurasi.

## B. Masukkan DNS di IDwebhost

1. Login ke Member Area IDwebhost: https://member.idwebhost.com/.
2. Buka menu **Domain**, pilih `gilbertevanarkananta.my.id`, lalu buka **Kelola DNS / DNS Management**.
3. Pastikan layanan DNS memang dikelola melalui panel IDwebhost. Jika panel menyatakan nameserver belum mengarah ke DNS Management IDwebhost, ikuti petunjuk nameserver yang tampil di akun IDwebhost. Jangan mengganti nameserver secara sembarang: perubahan nameserver dapat memindahkan seluruh pengelolaan DNS, termasuk email.
4. Buat/perbarui record untuk domain utama (apex, host biasanya `@`) dan `www` sesuai **nilai persis yang diberikan Vercel**. Umumnya domain apex memakai record `A`, sedangkan `www` memakai `CNAME`, tetapi jangan menebak IP atau target CNAME.
5. Jangan menghapus record MX, SPF, DKIM, DMARC, atau record lain yang digunakan email/layanan lain. Hapus hanya record A/CNAME lama yang konflik dengan record website setelah yakin record itu memang tidak lagi dipakai.
6. Simpan perubahan. Kembali ke Vercel → Settings → Domains dan tekan **Refresh / Verify** bila tersedia. Tunggu DNS propagate. Vercel akan mengaktifkan HTTPS/SSL setelah domain terverifikasi.
7. Tes `https://gilbertevanarkananta.my.id/` dan `https://www.gilbertevanarkananta.my.id/`. Pastikan keduanya menuju ke situs dan `www` diarahkan ke domain utama.

## C. Verifikasi Google Search Console

1. Buka https://search.google.com/search-console/ dan login dengan akun Google yang ingin dipakai mengelola situs.
2. Klik pemilih properti → **Add property** → pilih **Domain**.
3. Masukkan hanya `gilbertevanarkananta.my.id` (tanpa `https://` dan tanpa path).
4. Google akan memberikan satu nilai TXT unik yang diawali `google-site-verification=`. Salin nilai persis dari layar Google.
5. Kembali ke IDwebhost → Kelola DNS → tambahkan TXT record baru:
   - Type: `TXT`
   - Host/Name: `@` (atau kosong jika panel mendefinisikan root domain sebagai kosong)
   - Value/Content: tempel token Google secara utuh
   - TTL: gunakan default
6. Jangan mengganti atau menimpa TXT record SPF yang sudah ada. Tambahkan TXT verifikasi Google sebagai record baru.
7. Simpan, kembali ke Search Console, lalu klik **Verify**. Jika belum berhasil, tunggu propagasi DNS lalu coba lagi. Jangan menghapus TXT token setelah berhasil; biarkan sebagai verifikasi kepemilikan.

## D. Kirim sitemap dan minta pengindeksan

Setelah domain aktif melalui HTTPS dan properti Search Console terverifikasi:

1. Di Search Console pilih properti `gilbertevanarkananta.my.id`.
2. Buka menu **Sitemaps**.
3. Pada Add a new sitemap, masukkan `sitemap.xml`, lalu klik **Submit**.
4. Buka **URL Inspection**, masukkan `https://gilbertevanarkananta.my.id/`, tunggu pemeriksaan URL, lalu klik **Request Indexing** jika tersedia.
5. Ulangi untuk `https://gilbertevanarkananta.my.id/projects/sate-master/`.
6. Pantau laporan **Pages / Indexing**, **Sitemaps**, dan **Performance**. Perbaiki error yang ditampilkan Google.

## E. Tes file setelah deployment

Buka alamat ini setelah DNS dan deployment selesai:

- `https://gilbertevanarkananta.my.id/robots.txt`
- `https://gilbertevanarkananta.my.id/sitemap.xml`
- `https://gilbertevanarkananta.my.id/assets/og-cover.webp`
- `https://gilbertevanarkananta.my.id/projects/sate-master/`

Sitemap harus menampilkan XML, robots.txt menampilkan aturan crawler, dan gambar OG harus dapat dibuka.

## Hal yang perlu dipahami

- SEO tidak menjamin Google akan langsung mengindeks situs atau menampilkan urutan/rich result tertentu. Google menentukan crawling, indexing, canonical, title link, dan snippet berdasarkan sistemnya.
- DNS propagation dapat membutuhkan waktu; status `Pending` di Vercel tidak selalu berarti file proyek salah.
- URL utama yang dipilih pada metadata dan sitemap adalah `https://gilbertevanarkananta.my.id/` (tanpa `www`). Konsistenkan domain utama ini di Vercel.
- Setelah mengubah kode, upload/commit perubahan ke branch yang terhubung dengan Vercel. Deployment produksi akan berjalan otomatis sesuai konfigurasi project.
