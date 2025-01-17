const db = require('../config/database');

const PlantModel = {
  async createPlant(user_id, plant_name) {
    const query = `
      INSERT INTO plants (user_id, plant_name, created_at)
      VALUES ($1, $2, NOW())
      RETURNING *;
    `;
    const values = [user_id, plant_name];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getPlantsByUser(user_id) {
    const query = `
      SELECT * FROM plants WHERE user_id = $1 ORDER BY created_at DESC;
    `;
    const values = [user_id];
    const result = await db.query(query, values);
    return result.rows;
  },

  async getPlantById(user_id, plant_id) {
    const query = `
      SELECT * FROM plants WHERE id = $1 AND user_id = $2;
    `;
    const values = [plant_id, user_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updatePlant(user_id, plant_id, plant_name) {
    const query = `
      UPDATE plants
      SET plant_name = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *;
    `;
    const values = [plant_name, plant_id, user_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async deletePlant(user_id, plant_id) {
    const query = `
      DELETE FROM plants WHERE id = $1 AND user_id = $2;
    `;
    const values = [plant_id, user_id];
    const result = await db.query(query, values);
    return result.rowCount > 0;
  },
};

module.exports = PlantModel;
