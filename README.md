# RESTful API Topik 20. Agen Properti

## Alasan Desain Data Model

| Data | Pola | Alasan |
|---|---|---|
| `lokasi` (di dalam Properti) | Embedding | Lokasi hanya berisi `alamat` dan `kota`, dan selalu dibaca bersama Properti dalam satu query (daftar maupun detail). Lokasi juga tidak dipakai berdiri sendiri, jadi disimpan di dalam dokumen Properti tanpa `_id` agar tidak perlu query tambahan. |
| `Agen` (lewat `agenId`) | Referencing | Satu agen bisa menangani banyak properti, sehingga menyimpan data agen di setiap properti akan menggandakan data dan sulit diperbarui. Agen disimpan sebagai koleksi tersendiri dan dihubungkan lewat `agenId` (ref `'Agen'`); detailnya diambil dengan `populate` hanya saat dibutuhkan. |
