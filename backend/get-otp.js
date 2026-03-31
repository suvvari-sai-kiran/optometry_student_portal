require('dotenv').config();
const { db } = require('./src/config/db');

async function checkUser() {
  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', ['saikiransuvvari6@gmail.com']);
    if (rows.length > 0) {
      console.log(`USER: ${rows[0].email}, Verified: ${rows[0].isVerified}`);
    } else {
      console.log('USER_NOT_FOUND');
    }
  } catch (err) {
    console.error('DB_ERROR', err);
  } finally {
    process.exit(0);
  }
}

checkUser();
