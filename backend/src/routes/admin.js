const express = require('express');
const router = express.Router();
const { 
  getCourses, addCourse, editCourse, deleteCourse,
  getTests, addTest, deleteTest,
  getQuestions, addQuestion, deleteQuestion,
  getStudents, getStats, generateAIQuestions
} = require('../controllers/adminController');

// For simplicity in this demo, we assume authentication middleware already passed if hooked properly
// You would add `const auth = require('../middlewares/auth');` and `router.use(auth);` here

router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.put('/courses/:id', editCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/courses/:courseId/tests', getTests);
router.post('/tests', addTest);
router.delete('/tests/:id', deleteTest);

router.get('/tests/:testId/questions', getQuestions);
router.post('/questions', addQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/students', getStudents);
router.get('/stats', getStats);
router.post('/ai/generate-questions', generateAIQuestions);

module.exports = router;
