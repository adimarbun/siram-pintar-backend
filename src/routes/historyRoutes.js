const express = require('express');
const HistoryController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route harus divalidasi dengan token
router.post('/', authMiddleware, HistoryController.createHistory);

module.exports = router;
