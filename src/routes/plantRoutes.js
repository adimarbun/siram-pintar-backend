const express = require('express');
const PlantController = require('../controllers/plantController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route harus divalidasi dengan token
router.post('/', authMiddleware, PlantController.createPlant);
router.get('/', authMiddleware, PlantController.getPlants);
router.get('/:id', authMiddleware, PlantController.getPlantById);
router.put('/:id', authMiddleware, PlantController.updatePlant);
router.delete('/:id', authMiddleware, PlantController.deletePlant);

module.exports = router;
