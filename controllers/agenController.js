const Agen = require('../models/agenModel');

exports.create = async (req, res) => {
  try {
    const agen = await Agen.create(req.body);
    res.status(201).json(agen);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'kode agen sudah dipakai' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await Agen.find());
};
