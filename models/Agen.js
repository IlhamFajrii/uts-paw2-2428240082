const mongoose = require("mongoose");

const AgenSchema = new mongoose.Schema({
    nama:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Agen", AgenSchemaSchema);