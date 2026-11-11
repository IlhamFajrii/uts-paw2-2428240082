// seed.js
// Mengisi basis data dengan 3 agen dan 12 properti. Aman dijalankan berulang:
// data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Agen = require('./models/agenModel');
const Properti = require('./models/propertiModel');

const TIPE = ['rumah', 'ruko', 'tanah'];
const KOTA = ['Palembang', 'Indralaya', 'Prabumulih', 'Lubuklinggau'];

async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Properti.deleteMany({});
  await Agen.deleteMany({});

  const agen = await Agen.insertMany([
    { kode: 'AG01', nama: 'Hadi Agen' },
    { kode: 'AG02', nama: 'Sari Agen' },
    { kode: 'AG03', nama: 'Budi Agen' },
  ]);

  const properti = Array.from({ length: 12 }, (_, i) => ({
    kodeProperti: `PRP-${String(i + 1).padStart(3, '0')}`,
    nama: `Properti Contoh ${i + 1}`,
    harga: (i + 1) * 150000000,
    tipe: TIPE[i % TIPE.length], // rumah, ruko, tanah bergantian
    lokasi: { alamat: `Jl. Contoh No. ${i + 1}`, kota: KOTA[i % KOTA.length] },
    agenId: agen[i % agen.length]._id,
  }));
  await Properti.insertMany(properti);

  console.log(`Seed selesai: ${agen.length} agen, ${properti.length} properti`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err.message); process.exit(1); });
