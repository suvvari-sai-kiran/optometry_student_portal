const { db } = require('../config/db');

exports.getCourses = async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM Courses ORDER BY id ASC');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

exports.getCourseTests = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [tests] = await db.query('SELECT * FROM Tests WHERE courseId = ?', [courseId]);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tests' });
  }
};

exports.getTestQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const [questions] = await db.query('SELECT * FROM Questions WHERE testId = ?', [testId]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching questions' });
  }
};

exports.getTestByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: 'Missing test title' });

    const normalizedTitle = title.trim().toLowerCase();
    const [exactTests] = await db.query('SELECT * FROM Tests WHERE LOWER(title) = ? LIMIT 1', [normalizedTitle]);
    if (exactTests.length > 0) {
      return res.json(exactTests[0]);
    }

    const normalizedSearch = normalizedTitle.replace(/\b4\b/g, 'four').replace(/\bfour\b/g, '4');
    const searchPatterns = [
      `%${normalizedTitle}%`,
      `%${normalizedSearch}%`,
      `%${normalizedTitle.replace(/test$/, '').trim()}%`
    ];

    for (const pattern of searchPatterns) {
      const [likeTests] = await db.query('SELECT * FROM Tests WHERE LOWER(title) LIKE ? LIMIT 1', [pattern]);
      if (likeTests.length > 0) {
        return res.json(likeTests[0]);
      }
    }

    const fallbackMap = {
      'corneal reflex test': ['cover', 'motility', 'ocular'],
      'worth 4 dot test': ['worth', 'four', 'dot'],
      'maddox wing test': ['prism', 'vergence', 'phoria'],
      'near point accommodation': ['accommodation', 'convergence', 'near point']
    };

    const fallbackTerms = fallbackMap[normalizedTitle] || [];
    for (const term of fallbackTerms) {
      const [fallbackTests] = await db.query('SELECT * FROM Tests WHERE LOWER(title) LIKE ? LIMIT 1', [`%${term}%`]);
      if (fallbackTests.length > 0) {
        return res.json(fallbackTests[0]);
      }
    }

    return res.status(404).json({ message: 'Test not found' });
  } catch (error) {
    console.error('Error fetching test by title:', error);
    res.status(500).json({ message: 'Server error fetching test by title' });
  }
};

exports.submitTestResult = async (req, res) => {
  try {
    const { userId, testId, score, totalQuestions } = req.body;
    await db.query(
      'INSERT INTO TestResults (userId, testId, score, totalQuestions) VALUES (?, ?, ?, ?)',
      [userId, testId, score, totalQuestions]
    );
    res.status(201).json({ message: 'Test result saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saving test result' });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const [results] = await db.query(
      "SELECT tr.*, t.title as testTitle, c.title as courseTitle " +
      "FROM TestResults tr " +
      "JOIN Tests t ON tr.testId = t.id " +
      "JOIN Courses c ON t.courseId = c.id " +
      "WHERE tr.userId = ? " +
      "ORDER BY tr.createdAt DESC",
      [userId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user results' });
  }
};

exports.getRandomQuestions = async (req, res) => {
  try {
    console.log(`[StudentController] Incoming Random Quiz Request - Count: ${req.query.count || 10}`);
    const limit = parseInt(req.query.count) || 10;
    const [questions] = await db.query(
      'SELECT q.*, t.title as testTitle FROM Questions q JOIN Tests t ON q.testId = t.id ORDER BY RAND() LIMIT ?',
      [limit]
    );
    console.log(`[StudentController] Successfully fetched ${questions.length} questions.`);
    res.json(questions);
  } catch (error) {
    console.error('[StudentController] Error fetching random questions:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
