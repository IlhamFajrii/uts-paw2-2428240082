const express = require('express');
const router = express.Router();
const propertiController = require('../controllers/propertiController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', propertiController.getAll);
router.get('/:id', propertiController.getById);
router.post('/', cekApiKey, propertiController.create);
router.put('/:id', cekApiKey, propertiController.update);
router.delete('/:id', cekApiKey, propertiController.remove);

module.exports = router;
