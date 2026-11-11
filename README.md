# RESTful API Topik 20. Agen Properti

REST API untuk mengelola data **Properti** dan **Agen** properti, dibangun dengan Express.js dan MongoDB (Mongoose).

| | |
|---|---|
| Mahasiswa | Muhammad Ilham Fajri (2428240082) |
| Entity utama | Model `Properti`, endpoint `/properti` |
| Entity pendukung | Model `Agen`, endpoint `/agen` |

## Teknologi

- Node.js, Express 5
- MongoDB dengan Mongoose 9
- dotenv (konfigurasi), cors, nodemon (pengembangan)

## Struktur Proyek

```
restful-api-app/
├── app.js                      # Titik masuk: middleware, route, koneksi database
├── seed.js                     # Mengisi data contoh (3 agen, 12 properti)
├── models/
│   ├── agenModel.js            # Skema Agen
│   └── propertiModel.js        # Skema Properti (embedding lokasi, referensi agen)
├── controllers/
│   ├── agenController.js
│   └── propertiController.js
├── routes/
│   ├── agenRoutes.js
│   └── propertiRoutes.js
├── middlewares/
│   ├── cekApiKey.js            # Validasi header x-api-key
│   ├── errorHandler.js         # Handler 404 dan error terpusat
│   └── logger.js               # Pencatat request
└── package.json
```

## Cara Menjalankan

### 1. Prasyarat

- Node.js (disarankan versi LTS)
- MongoDB yang berjalan lokal, atau MongoDB Atlas

### 2. Instal dependensi

```bash
npm install
```

### 3. Buat file `.env`

Buat file `.env` di root proyek:

```env
PORT=3000
API_KEY=isi-dengan-kunci-rahasia
CORS_ORIGIN=http://localhost:3000
DB_URI=mongodb://127.0.0.1:27017/properti_db
```

| Variabel | Fungsi |
|---|---|
| `PORT` | Port server (bawaan 3000 jika kosong) |
| `API_KEY` | Kunci yang harus dikirim di header `x-api-key` untuk request POST, PUT, dan DELETE |
| `CORS_ORIGIN` | Origin yang diizinkan mengakses API |
| `DB_URI` | Connection string MongoDB |

### 4. (Opsional) Isi data contoh

```bash
node seed.js
```

Perintah ini menghapus data lama, lalu mengisi 3 agen (`AG01` sampai `AG03`) dan 12 properti (`PRP-001` sampai `PRP-012`) dengan tipe rumah, ruko, dan tanah bergantian. Aman dijalankan berulang.

### 5. Jalankan server

```bash
npm run dev     # dengan nodemon (auto-reload)
npm start       # tanpa nodemon
```

Server berjalan di `http://localhost:PORT`.

## Autentikasi

Request yang mengubah data (**POST, PUT, DELETE**) wajib menyertakan header:

```
x-api-key: <nilai API_KEY di .env>
```

Request **GET** tidak memerlukan API key. Jika key salah atau tidak ada, server membalas `401 {"message":"API key tidak valid"}`.

## Model Data

### Agen

| Field | Tipe | Aturan |
|---|---|---|
| `kode` | String | Wajib, unik, trim, disimpan huruf besar |
| `nama` | String | Wajib, trim |

### Properti

| Field | Tipe | Aturan |
|---|---|---|
| `kodeProperti` | String | Wajib, unik, trim |
| `nama` | String | Wajib, trim |
| `harga` | Number | Wajib, minimal 0 |
| `tipe` | String | Wajib, trim. Dipakai untuk filter. Contoh isi: `rumah`, `ruko`, `tanah` |
| `lokasi` | Subdocument (embedding) | `{ alamat: String, kota: String }`, tanpa `_id` |
| `agenId` | ObjectId (referencing) | Wajib, `ref: 'Agen'` |
| `createdAt` | Date | Bawaan: waktu data dibuat |

## Endpoint

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| GET | `/agen` | - | Daftar semua agen |
| POST | `/agen` | API key | Tambah agen |
| GET | `/properti` | - | Daftar properti (filter, sort, pagination, projection) |
| GET | `/properti/:id` | - | Detail satu properti, termasuk data agen |
| POST | `/properti` | API key | Tambah properti |
| PUT | `/properti/:id` | API key | Ubah properti |
| DELETE | `/properti/:id` | API key | Hapus properti |

### Query parameter `GET /properti`

| Parameter | Contoh | Keterangan |
|---|---|---|
| `tipe` | `?tipe=ruko` | Filter berdasarkan tipe (cocok persis dengan isi data) |
| `kota` | `?kota=Palembang` | Filter berdasarkan `lokasi.kota` |
| `agen` | `?agen=AG01` | Filter berdasarkan kode agen |
| `page` | `?page=2` | Nomor halaman (bawaan 1) |
| `limit` | `?limit=5` | Jumlah data per halaman (bawaan 10, maksimal 50) |
| `sort` | `?sort=-harga` | Urutan: `kodeProperti`, `nama`, `harga`, `createdAt`. Awalan `-` berarti turun. Bawaan `-createdAt` |
| `fields` | `?fields=nama,harga` | Memilih field yang ditampilkan |

Parameter dapat digabung, misalnya `GET /properti?tipe=ruko&sort=harga&page=1&limit=5`.

Format respons daftar:

```json
{
  "data": [ ],
  "page": 1,
  "limit": 10,
  "total": 4,
  "totalPages": 1
}
```

## Contoh Request

### Tambah agen

```http
POST /agen
Content-Type: application/json
x-api-key: <API_KEY>

{"kode":"AG01","nama":"Hadi Agen"}
```

### Tambah properti

Isi `agenId` dengan `_id` agen dari respons `POST /agen` atau `GET /agen`.

```http
POST /properti
Content-Type: application/json
x-api-key: <API_KEY>

{
  "kodeProperti": "PRP-001",
  "nama": "Contoh nama",
  "harga": 10,
  "tipe": "rumah",
  "lokasi": { "alamat": "Contoh alamat", "kota": "Contoh kota" },
  "agenId": "<_id Agen>"
}
```

Respons sukses: `201 Created` beserta dokumen yang dibuat.

### Filter berdasarkan tipe

```http
GET /properti?tipe=ruko
```

### Detail properti

```http
GET /properti/<_id properti>
```

Field `agenId` pada respons berisi data agen lengkap (`populate`).

### Ubah properti

```http
PUT /properti/<_id properti>
Content-Type: application/json
x-api-key: <API_KEY>

{"harga": 250000000}
```

### Hapus properti

```http
DELETE /properti/<_id properti>
x-api-key: <API_KEY>
```

Respons sukses: `204 No Content`.

### Contoh dengan curl

```bash
curl http://localhost:3000/properti?tipe=ruko

curl -X POST http://localhost:3000/agen \
  -H "Content-Type: application/json" \
  -H "x-api-key: <API_KEY>" \
  -d '{"kode":"AG01","nama":"Hadi Agen"}'
```

## Kode Status dan Penanganan Error

| Status | Kapan terjadi | Contoh pesan |
|---|---|---|
| 200 | GET atau PUT berhasil | - |
| 201 | POST berhasil | - |
| 204 | DELETE berhasil | - |
| 400 | Validasi gagal, kode duplikat, ID tidak valid, `sort` atau `fields` tidak valid, JSON rusak | `kodeProperti sudah dipakai`, `ID tidak valid`, `Format JSON tidak valid` |
| 401 | API key salah atau tidak ada | `API key tidak valid` |
| 404 | Data atau rute tidak ditemukan | `Data tidak ditemukan` |
| 500 | Kesalahan server | `Terjadi kesalahan pada server` |

Semua error dikembalikan dalam format JSON `{ "message": "..." }`.

## Alasan Desain Data Model

| Data | Pola | Alasan |
|---|---|---|
| `lokasi` (di dalam Properti) | Embedding | Lokasi hanya berisi `alamat` dan `kota`, dan selalu dibaca bersama Properti dalam satu query (daftar maupun detail). Lokasi juga tidak dipakai berdiri sendiri, jadi disimpan di dalam dokumen Properti tanpa `_id` agar tidak perlu query tambahan. |
| `Agen` (lewat `agenId`) | Referencing | Satu agen bisa menangani banyak properti, sehingga menyimpan data agen di setiap properti akan menggandakan data dan sulit diperbarui. Agen disimpan sebagai koleksi tersendiri dan dihubungkan lewat `agenId` (ref `'Agen'`); detailnya diambil dengan `populate` hanya saat dibutuhkan. |