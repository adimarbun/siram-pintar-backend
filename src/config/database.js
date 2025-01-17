const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  host: "103.127.97.2",
  database: "sirampintar",
  password: "password",
  port: 5432,
});

module.exports = pool;
