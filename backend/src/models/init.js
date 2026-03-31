const { db } = require('../config/db');

async function initModels() {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'student') DEFAULT 'student',
      isVerified BOOLEAN DEFAULT FALSE,
      otp VARCHAR(6),
      otpExpiry DATETIME,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const coursesTable = `
    CREATE TABLE IF NOT EXISTS Courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      thumbnailUrl VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const testsTable = `
    CREATE TABLE IF NOT EXISTS Tests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      courseId INT,
      title VARCHAR(255) NOT NULL,
      videoUrl VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE
    )
  `;

  const questionsTable = `
    CREATE TABLE IF NOT EXISTS Questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      testId INT,
      questionText TEXT NOT NULL,
      optionA VARCHAR(255) NOT NULL,
      optionB VARCHAR(255) NOT NULL,
      optionC VARCHAR(255) NOT NULL,
      optionD VARCHAR(255) NOT NULL,
      correctOption ENUM('A', 'B', 'C', 'D') NOT NULL,
      explanation TEXT,
      FOREIGN KEY (testId) REFERENCES Tests(id) ON DELETE CASCADE
    )
  `;

  const testResultsTable = `
    CREATE TABLE IF NOT EXISTS TestResults (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      testId INT,
      score INT NOT NULL,
      totalQuestions INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (testId) REFERENCES Tests(id) ON DELETE CASCADE
    )
  `;

  const qnaTable = `
    CREATE TABLE IF NOT EXISTS QnaThreads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    )
  `;

  const qnaRepliesTable = `
    CREATE TABLE IF NOT EXISTS QnaReplies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      threadId INT,
      userId INT,
      content TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (threadId) REFERENCES QnaThreads(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    )
  `;

  try {
    await db.query(usersTable);
    console.log("✅ Users table ensured.");
    await db.query(coursesTable);
    console.log("✅ Courses table ensured.");
    await db.query(testsTable);
    console.log("✅ Tests table ensured.");
    await db.query(questionsTable);
    console.log("✅ Questions table ensured.");
    await db.query(testResultsTable);
    console.log("✅ TestResults table ensured.");
    await db.query(qnaTable);
    console.log("✅ QnaThreads table ensured.");
    await db.query(qnaRepliesTable);
    console.log("✅ QnaReplies table ensured.");
  } catch (error) {
    console.error("❌ Model Initialization Error:", error);
  }
}

module.exports = { initModels };
