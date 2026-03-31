const { db } = require('../config/db');

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


// --- STATS ---

exports.getStats = async (req, res) => {
  try {
    const [students] = await db.query('SELECT COUNT(*) as count FROM Users WHERE role="student"');
    const [courses] = await db.query('SELECT COUNT(*) as count FROM Courses');
    const [tests] = await db.query('SELECT COUNT(*) as count FROM Tests');
    res.json({
      students: students[0].count,
      courses: courses[0].count,
      tests: tests[0].count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
