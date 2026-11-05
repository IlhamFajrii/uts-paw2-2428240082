const mongoose = require("mongoose");

// Embedded document: tidak punya _id sendiri
const itemSchema = new mongoose.Schema({
    Namaproperti: { type: String, required: true, trim: true },
    harga:      { type: Number, required: true, min: 0 },
    jumlah:     { type: Number, required: true, min: 1 },
    alamat:       { type: String, default: "" }
    
}, { _id: false });

const Propertischema = new mongoose.Schema({
    nomorPesanan: { type: String, required: true, unique: true, trim: true },
    customer:     { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },   // Referencing
    tipe:       { type: String, required: true, enum: ["tipe", "dibayar", "dikirim", "selesai", "batal"] },
    totalHarga:   { type: Number, required: true, min: 1 },
    tanggalPesan: { type: String, required: true },
    items:        { type: [itemSchema], default: [] }                                           // Embedding
}, { timestamps: true });

module.exports = mongoose.model("Properti", Propertischema);