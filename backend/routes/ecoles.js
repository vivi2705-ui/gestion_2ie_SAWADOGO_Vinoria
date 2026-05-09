const express = require('express');
const router = express.Router();
const ecoleController = require('../controllers/ecoleController');

// Routes CRUD
router.get('/', ecoleController.getAllEcoles);
router.get('/:id', ecoleController.getEcoleById);
router.post('/', ecoleController.createEcole);
router.put('/:id', ecoleController.updateEcole);
router.delete('/:id', ecoleController.deleteEcole);

module.exports = router; 