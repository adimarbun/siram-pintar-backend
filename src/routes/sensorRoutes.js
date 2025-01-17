const express = require('express');
const router = express.Router();

router.get('/moisture/:keyId', (req, res) => {
  const { keyId } = req.params;

  // Simulasi data kelembapan
  const moisture = Math.random() * 200; // Nilai random antara 0-200
  res.status(200).json({ keyId, moisture });
});

module.exports = router;
