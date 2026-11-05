const mongoose = require("mongoose");

// Embedded document: tidak punya _id sendiri
const itemSchema = new mongoose.Schema({
    namaProduk: { type: String, required: true, trim: true },
    harga:      { type: Number, required: true, min: 0 },
    jumlah:     { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    nomorPesanan: { type: String, required: true, unique: true, trim: true },
    customer:     { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },   // Referencing
    status:       { type: String, required: true, enum: ["pending", "dibayar", "dikirim", "selesai", "batal"] },
    totalHarga:   { type: Number, required: true, min: 1 },
    tanggalPesan: { type: String, required: true },
    items:        { type: [itemSchema], default: [] }                                           // Embedding
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);