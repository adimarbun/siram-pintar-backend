const DynamicCronManager = require('../services/cronService');

const CronController = {
  async addCron(req, res) {
    const { name, schedule, task } = req.body;

    if (!name || !schedule || !task) {
      return res.status(400).json({ message: 'name, schedule, dan task diperlukan.' });
    }

    try {
      DynamicCronManager.addJob(name, schedule, task);
      await DynamicCronManager.saveJobToDB(name, schedule, task);

      res.json({ message: `Cron job "${name}" berhasil ditambahkan.` });
    } catch (err) {
      res.status(500).json({ message: 'Gagal menambahkan cron job.', error: err.message });
    }
  },

  async removeCron(req, res) {
    const { name } = req.params;

    try {
      await DynamicCronManager.removeJob(name);

      res.json({ message: `Cron job "${name}" berhasil dihapus.` });
    } catch (err) {
      res.status(500).json({ message: 'Gagal menghapus cron job.', error: err.message });
    }
  },

  listCron(req, res) {
    const jobs = DynamicCronManager.listJobs();
    res.json({ jobs });
  },
};

module.exports = CronController;
