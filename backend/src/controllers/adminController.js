const { db } = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// --- COURSES ---

exports.getCourses = async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM Courses ORDER BY id ASC');
    // For each course, fetch its tests
    for (let course of courses) {
      const [tests] = await db.query('SELECT * FROM Tests WHERE courseId = ?', [course.id]);
      course.tests = tests;
    }
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { title, description, thumbnailUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO Courses (title, description, thumbnailUrl) VALUES (?, ?, ?)',
      [title, description, thumbnailUrl]
    );
    res.status(201).json({ message: 'Course added', courseId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding course' });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnailUrl } = req.body;
    await db.query(
      'UPDATE Courses SET title = ?, description = ?, thumbnailUrl = ? WHERE id = ?',
      [title, description, thumbnailUrl, id]
    );
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Courses WHERE id = ?', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting course' });
  }
};


// --- TESTS ---

exports.getTests = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [tests] = await db.query('SELECT * FROM Tests WHERE courseId = ?', [courseId]);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tests' });
  }
};

exports.addTest = async (req, res) => {
  try {
    const { courseId, title, videoUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO Tests (courseId, title, videoUrl) VALUES (?, ?, ?)',
      [courseId, title, videoUrl]
    );
    res.status(201).json({ message: 'Test added', testId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding test' });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Tests WHERE id = ?', [id]);
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting test' });
  }
};


// --- QUESTIONS ---

exports.getQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const [questions] = await db.query('SELECT * FROM Questions WHERE testId = ?', [testId]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching questions' });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation } = req.body;
    await db.query(
      'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation]
    );
    res.status(201).json({ message: 'Question added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Questions WHERE id = ?', [id]);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting question' });
  }
};


// --- STUDENTS & STATS ---

exports.getStudents = async (req, res) => {
  try {
    const [students] = await db.query(
      'SELECT id, name, email, role, isVerified, createdAt FROM Users WHERE role = "student" ORDER BY createdAt DESC'
    );
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [studentsCount] = await db.query('SELECT COUNT(*) as count FROM Users WHERE role="student"');
    const [coursesCount] = await db.query('SELECT COUNT(*) as count FROM Courses');
    const [testsCount] = await db.query('SELECT COUNT(*) as count FROM Tests');
    const [recentResults] = await db.query(`
      SELECT TR.*, U.name as studentName, T.title as testTitle 
      FROM TestResults TR
      JOIN Users U ON TR.userId = U.id
      JOIN Tests T ON TR.testId = T.id
      ORDER BY TR.createdAt DESC LIMIT 10
    `);
    
    // Detailed analysis
    const [performance] = await db.query(`
      SELECT 
        AVG(score * 100 / totalQuestions) as avgScore,
        COUNT(*) as totalAttempts,
        COUNT(DISTINCT userId) as uniqueStudents
      FROM TestResults
    `);

    res.json({
      students: studentsCount[0].count,
      courses: coursesCount[0].count,
      tests: testsCount[0].count,
      recentResults,
      avgScore: performance[0].avgScore || 0,
      totalAttempts: performance[0].totalAttempts || 0,
      uniqueStudents: performance[0].uniqueStudents || 0
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};


// --- AI MODULE ---

exports.generateAIQuestions = async (req, res) => {
  try {
    const { topic, testId, count = 5 } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      You are an expert clinical Optometry professor. 
      Generate ${count} high-quality, professional multiple-choice questions about "${topic}".
      The questions should be clinical and instructional.
      
      Return ONLY a JSON array of objects in this exact format:
      [
        {
          "questionText": "Question string?",
          "optionA": "Choice A",
          "optionB": "Choice B",
          "optionC": "Choice C",
          "optionD": "Choice D",
          "correctOption": "A",
          "explanation": "Brief reasoning for why the answer is correct."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON if needed (sometimes Gemini adds markdown)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(jsonStr);

    // If testId is provided, auto-save them
    if (testId) {
      for (let q of questions) {
        await db.query(
          'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [testId, q.questionText, q.optionA, q.optionB, q.optionC, q.optionD, q.correctOption, q.explanation]
        );
      }
    }

    res.json({ message: `Successfully generated ${questions.length} questions`, questions });
  } catch (error) {
    console.error('AI ERROR:', error);
    res.status(500).json({ message: 'Error generating AI questions', error: error.message });
  }
};
