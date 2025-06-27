const db = require('../config/database'); // Sesuaikan dengan konfigurasi DB yang Anda gunakan

const DeviceModel = {
  async createDevice(plant_id, device_name, device_type) {
    const result = await db.query(
      `INSERT INTO devices (plant_id, device_name, device_type, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING id, device_name, device_type, plant_id, created_at`,
      [plant_id, device_name, device_type]
    );

    const device = result.rows[0];

    // Generate deviceKey
    const deviceKey = `${device_name.toLowerCase().replace(/\s+/g, '')}-${device.id}`;

    // Update device with deviceKey
    const updatedResult = await db.query(
      `UPDATE devices 
       SET device_key = $1 
       WHERE id = $2 
       RETURNING *`,
      [deviceKey, device.id]
    );

    return updatedResult.rows[0];
  },

  async updateDevice(device_id, device_name, device_type) {
    const result = await db.query(
      `UPDATE devices 
       SET device_name = $1, 
           device_type = $2, 
           device_key = LOWER(REPLACE($1, ' ', '')) || '-' || CAST($3 AS TEXT)
       WHERE id = $3 
       RETURNING *`,
      [device_name, device_type, device_id]
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
      `UPDATE devices 
       SET device_name = $1, 
           device_type = $2, 
           device_key = LOWER(REPLACE($1, ' ', '')) || '-' || $3 
       WHERE id = $3 
       RETURNING *`,
      [device_name, device_type, device_id]
    );
    return result.rows[0];
  },

  async updateDeviceStatus(device_key, is_on) {
    const result = await db.query(
        'UPDATE devices SET is_on = $1 WHERE device_key = $2 RETURNING *',
        [is_on, device_key]
    );
    return result.rows[0]; 
  },

  async deleteDevice(device_id) {
    const result = await db.query('DELETE FROM devices WHERE id = $1 RETURNING *', [device_id]);
    return result.rows[0];
  },

  async getDeviceByKey(device_key) {
    const result = await db.query('SELECT * FROM devices WHERE device_key = $1', [device_key]);
    return result.rows[0];
  }
};

module.exports = DeviceModel;
