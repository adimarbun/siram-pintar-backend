const express = require('express');
const DeviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route harus divalidasi dengan token
router.post('/', authMiddleware, DeviceController.createDevice);
router.get('/', authMiddleware, DeviceController.getDevices);
router.get('/:id', authMiddleware, DeviceController.getDeviceById);
router.put('/:id', authMiddleware, DeviceController.updateDevice);
router.delete('/:id', authMiddleware, DeviceController.deleteDevice);

module.exports = router;
