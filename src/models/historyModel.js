const db = require('../config/database');

const HistoryModel = {
  async createHistory(device_id, timestamp, value) {
    const query = `
      INSERT INTO sensor_histories (device_id, timestamp, value, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [device_id, timestamp, value];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async bulkInsertHistories(device_id, histories) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const query = `
        INSERT INTO sensor_histories (device_id, timestamp, value, created_at)
        VALUES ($1, $2, $3, NOW())
      `;
      for (const h of histories) {
        await client.query(query, [device_id, h.timestamp, h.value]);
      }
      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getHistoriesByDevice(device_id) {
    const query = `
      SELECT * FROM sensor_histories WHERE device_id = $1 ORDER BY timestamp DESC;
    `;
    const result = await db.query(query, [device_id]);
    return result.rows;
  },

  async getHistoryById(id) {
    const query = `
      SELECT * FROM sensor_histories WHERE id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async deleteHistoriesByDevice(device_id) {
    const query = `
      DELETE FROM sensor_histories WHERE device_id = $1;
    `;
    const result = await db.query(query, [device_id]);
    return result.rowCount > 0;
  },
};

module.exports = HistoryModel;
