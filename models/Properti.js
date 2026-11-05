const mongoose = require("mongoose");
const { Agent } = require("undici-types");

// Embedded document: tidak punya _id sendiri
const bangunan = new mongoose.Schema({
    Namaproperti: { type: String, required: true, trim: true },
    harga:      { type: Number, required: true, min: 0 }, 
    lokasi:       { type: String, default: "" }
    
}, { _id: false });

const Propertischema = new mongoose.Schema({
    AgenID:     { type: mongoose.Schema.Types.ObjectId, ref: "Agen", required: true },   // Referencing
    tipe:       { type: String, required: true, enum: ["rumah", "ruko","tanah"] },                                        // Embedding
}, { timestamps: true });

module.exports = mongoose.model("Properti", Propertischema);