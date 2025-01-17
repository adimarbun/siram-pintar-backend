const pool = require('../config/database');
class CronModel {
  static async getAllActive() {
    const result = await pool.query('SELECT * FROM cron_jobs WHERE active = true');
    return result.rows;
  }

  static async addOrUpdateJob(name, schedule, task, options = {}) {
    const query = `
      INSERT INTO cron_jobs (name, schedule, task, options, active)
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (name) 
      DO UPDATE SET schedule = EXCLUDED.schedule, task = EXCLUDED.task, options = EXCLUDED.options, active = true;
    `;
    await pool.query(query, [name, schedule, task, JSON.stringify(options)]);
  }

  static async deactivateJob(name) {
    const query = 'UPDATE cron_jobs SET active = false WHERE name = $1';
    await pool.query(query, [name]);
  }
}

module.exports = CronModel;
