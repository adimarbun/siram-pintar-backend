const db = require('../config/database');

const UserModel = {
  async createUser(email, name, passwordEncrypt) {
    const query = `
      INSERT INTO users (email, name, password_encrypt)
      VALUES ($1, $2, $3)
      RETURNING id, email, name;
    `;
    const values = [email, name, passwordEncrypt];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
  },
};

module.exports = UserModel;
