const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/moisture/:keyId', (req, res) => {
  const { keyId } = req.params;

  // Simulasi data kelembapan
  const moisture = Math.random() * 200; // Nilai random antara 0-200
  res.status(200).json({ keyId, moisture });
});

router.get('/sensor-history/:id', authMiddleware, DeviceController.generateSensorHistory);

module.exports = router;
