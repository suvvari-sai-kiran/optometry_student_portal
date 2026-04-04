const { db } = require('../src/config/db');

async function resetDB() {
    try {
        console.log("Starting database reset...");
        await db.query('SET FOREIGN_KEY_CHECKS = 0;');
        await db.query('TRUNCATE TABLE Users;');
        await db.query('TRUNCATE TABLE Tests;');
        await db.query('TRUNCATE TABLE TestResults;');
        await db.query('TRUNCATE TABLE Questions;');
        await db.query('TRUNCATE TABLE Courses;');
        await db.query('TRUNCATE TABLE QnaThreads;');
        await db.query('TRUNCATE TABLE QnaReplies;');
        
        try {
            await db.query('TRUNCATE TABLE Patients;');
        } catch(e) {
            // Patient table might not exist yet, that's fine
        }
        
        await db.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log("✅ Database successfully reset. All users and records deleted.");
        process.exit(0);
    } catch (e) {
        console.error("❌ Error resetting db", e);
        process.exit(1);
    }
}

resetDB();
