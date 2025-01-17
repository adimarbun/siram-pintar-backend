const express = require('express');
const router = express.Router();
const cronService = require('../services/cronService');

router.post('/add', async (req, res) => {
  const { name, schedule, task, options } = req.body;

  try {
    await cronService.saveJobToDB(name, schedule, task, options);
    cronService.addJob(name, schedule, task, options);
    res.status(201).json({ message: `Cron job "${name}" berhasil ditambahkan.` });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan cron job.', error: error.message });
  }
});

router.post('/remove', async (req, res) => {
  const { name } = req.body;

  try {
    await cronService.removeJob(name);
    res.status(200).json({ message: `Cron job "${name}" berhasil dihapus.` });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus cron job.', error: error.message });
  }
});

module.exports = router;
