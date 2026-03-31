require('dotenv').config();
const mysql = require('mysql2/promise');

// Initial connection to create DB if it doesn't exist
const poolWithoutDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// App connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkDatabase() {
  try {
    await poolWithoutDB.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' ensured.`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

module.exports = { db, checkDatabase };
