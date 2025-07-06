const db = require('../config/database');

const HistoryModel = {
  async createHistory(device_id, timestamp, value, created_at = null) {
    const query = `
      INSERT INTO sensor_histories (device_id, timestamp, value, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [device_id, timestamp, value, created_at || new Date()];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async bulkInsertHistories(device_id, histories) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const query = `
        INSERT INTO sensor_histories (device_id, timestamp, value, created_at)
        VALUES ($1, $2, $3, $4)
      `;
      for (const h of histories) {
        await client.query(query, [device_id, h.timestamp, h.value, h.created_at || new Date()]);
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

  async getHistoriesByDeviceAndDateRange(device_id, startDate, endDate) {
    // Konversi tanggal ke format yang tepat untuk range query
    const startDateTime = new Date(startDate + 'T00:00:00.000Z');
    const endDateTime = new Date(endDate + 'T23:59:59.999Z');
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new Error('Invalid date format');
    }
    
    const query = `
      SELECT * FROM sensor_histories 
      WHERE device_id = $1 AND timestamp >= $2 AND timestamp <= $3
      ORDER BY timestamp DESC;
    `;
    const result = await db.query(query, [device_id, startDateTime, endDateTime]);
    return result.rows;
  },
};

module.exports = HistoryModel;
