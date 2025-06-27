const express = require('express');
const HistoryController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route harus divalidasi dengan token
router.post('/', authMiddleware, HistoryController.createHistory);

// GET history by device id and date range
router.get('/:deviceId/filter', authMiddleware, HistoryController.getByDeviceAndDateRange);

module.exports = router;
