require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db } = require('./src/config/db');

async function resetUsers() {
  try {
    console.log('--- Database Repair & User Reset ---');
    
    // 1. Delete all users except the admin
    const adminEmail = '231904151023@cutmap.ac.in';
    console.log(`Deleting all users except ${adminEmail}...`);
    
    const [delResult] = await db.query('DELETE FROM Users WHERE email != ?', [adminEmail]);
    console.log(`✅ Deleted ${delResult.affectedRows} other users.`);

    // 2. Ensure admin exists (in case it was somehow deleted or not there)
    const [adminCheck] = await db.query('SELECT * FROM Users WHERE email = ?', [adminEmail]);
    
    if (adminCheck.length === 0) {
      console.log('Admin not found. Creating admin...');
      const adminPassword = 'Manasa@1231';
      const adminName = 'Admin';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.query(
        'INSERT INTO Users (name, email, password, role, isVerified) VALUES (?, ?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin', true]
      );
      console.log('✅ Admin user recreated successfully.');
    } else {
      console.log('✅ Admin user verified.');
    }

    // 3. Verify total users
    const [rows] = await db.query('SELECT count(*) as count FROM Users');
    console.log(`Total users in database: ${rows[0].count}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR during reset:', err.message);
    process.exit(1);
  }
}

resetUsers();
