require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuration for both initial check and app connection
const dbConfig = process.env.DATABASE_URL 
  ? { uri: process.env.DATABASE_URL } 
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

// Initial connection to check/ensure DB (no DB name in URI if creating)
const poolWithoutDB = mysql.createPool({
  ...dbConfig,
  ssl: { rejectUnauthorized: false }
});

// App connection pool
const db = mysql.createPool({
  ...dbConfig,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkDatabase() {
  try {
    // Database name might be in the URI already, but checkDatabase tries to create it if using fields
    if (!process.env.DATABASE_URL && process.env.DB_NAME) {
      await poolWithoutDB.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
      console.log(`✅ Database '${process.env.DB_NAME}' ensured.`);
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

module.exports = { db, checkDatabase };
