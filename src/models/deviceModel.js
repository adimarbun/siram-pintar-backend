const db = require('../config/database'); // Sesuaikan dengan konfigurasi DB yang Anda gunakan

const DeviceModel = {
  async createDevice(plant_id, device_name, device_type) {
    const result = await db.query(
      'INSERT INTO devices (plant_id, device_name, device_type, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [plant_id, device_name, device_type]
    );
    return result.rows[0];
  },

  async getDevicesByPlant(plant_id) {
    const result = await db.query('SELECT * FROM devices WHERE plant_id = $1', [plant_id]);
    return result.rows;
  },

  async getDeviceById(device_id) {
    const result = await db.query('SELECT * FROM devices WHERE id = $1', [device_id]);
    return result.rows[0];
  },

  async updateDevice(device_id, device_name, device_type) {
    const result = await db.query(
      'UPDATE devices SET device_name = $1, device_type = $2 WHERE id = $3 RETURNING *',
      [device_name, device_type, device_id]
    );
    return result.rows[0];
  },

  async deleteDevice(device_id) {
    const result = await db.query('DELETE FROM devices WHERE id = $1 RETURNING *', [device_id]);
    return result.rows[0];
  }
};

module.exports = DeviceModel;
