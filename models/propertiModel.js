const mongoose = require('mongoose');

// Embedding: lokasi disimpan di dalam dokumen Properti, tanpa _id
const lokasiSchema = new mongoose.Schema({
  alamat: String,
  kota: String,
}, { _id: false });

const propertiSchema = new mongoose.Schema({
  kodeProperti: { type: String, required: [true, 'kodeProperti wajib diisi'], unique: true, trim: true },
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  harga: { type: Number, required: [true, 'harga wajib diisi'], min: [0, 'harga minimal 0'] },
  // Dipakai untuk filter, contoh isi: rumah, ruko, tanah
  tipe: { type: String, required: [true, 'tipe wajib diisi'], trim: true },
  lokasi: lokasiSchema,
  // Referencing: menunjuk ke dokumen Agen
  agenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agen', required: [true, 'agenId wajib diisi'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Properti', propertiSchema);
