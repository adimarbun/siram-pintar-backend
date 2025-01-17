const db = require('../config/database'); // Sesuaikan dengan konfigurasi database Anda

class ScheduleModel {
  /**
   * Menambahkan jadwal baru ke database.
   * @param {Object} scheduleData - Data jadwal yang akan ditambahkan.
   * @returns {Object} Jadwal yang berhasil dibuat.
   */
  static async create(scheduleData) {
    const {
      plant_id,
      device_id,
      watering_time,
      duration,
      schedule,
      frequency,
      day_of_month,
      once_on_date,
      moisture_threshold,
      active,
    } = scheduleData;

    const query = `
      INSERT INTO schedules (
        plant_id, 
        device_id, 
        watering_time, 
        duration, 
        schedule, 
        frequency, 
        day_of_month, 
        once_on_date, 
        moisture_threshold, 
        created_at, 
        updated_at, 
        active
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10) 
      RETURNING *;
    `;

    const values = [
      plant_id,
      device_id,
      watering_time,
      duration,
      schedule,
      frequency,
      day_of_month,
      once_on_date,
      moisture_threshold,
      active,
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating schedule:', error.message);
      throw error;
    }
  }

  /**
   * Mengambil semua jadwal dari database.
   * @returns {Array} Daftar semua jadwal.
   */
  static async getAll() {
    const query = 'SELECT * FROM schedules;';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching schedules:', error.message);
      throw error;
    }
  }

  /**
   * Mengambil jadwal berdasarkan ID.
   * @param {Number} id - ID jadwal.
   * @returns {Object} Data jadwal yang ditemukan.
   */
  static async getById(id) {
    const query = 'SELECT * FROM schedules WHERE id = $1;';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching schedule by ID:', error.message);
      throw error;
    }
  }

  /**
   * Memperbarui data jadwal berdasarkan ID.
   * @param {Number} id - ID jadwal.
   * @param {Object} scheduleData - Data jadwal yang diperbarui.
   * @returns {Object} Jadwal yang berhasil diperbarui.
   */
  static async update(id, scheduleData) {
    const {
      plant_id,
      device_id,
      watering_time,
      duration,
      schedule,
      frequency,
      day_of_month,
      once_on_date,
      moisture_threshold,
      active,
    } = scheduleData;

    const query = `
      UPDATE schedules 
      SET 
        plant_id = $2, 
        device_id = $3, 
        watering_time = $4, 
        duration = $5, 
        schedule = $6, 
        frequency = $7, 
        day_of_month = $8, 
        once_on_date = $9, 
        moisture_threshold = $10, 
        updated_at = NOW(), 
        active = $11
      WHERE id = $1 
      RETURNING *;
    `;

    const values = [
      id,
      plant_id,
      device_id,
      watering_time,
      duration,
      schedule,
      frequency,
      day_of_month,
      once_on_date,
      moisture_threshold,
      active,
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating schedule:', error.message);
      throw error;
    }
  }

  /**
   * Menghapus jadwal berdasarkan ID.
   * @param {Number} id - ID jadwal yang akan dihapus.
   * @returns {Object} Jadwal yang berhasil dihapus.
   */
  static async delete(id) {
    const query = 'DELETE FROM schedules WHERE id = $1 RETURNING *;';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting schedule:', error.message);
      throw error;
    }
  }
}

module.exports = ScheduleModel;
