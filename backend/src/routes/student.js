const express = require('express');
const router = express.Router();
const { 
  getCourses, getCourseTests, getTestQuestions, submitTestResult, getUserResults, getRandomQuestions
} = require('../controllers/studentController');

router.get('/questions/random', getRandomQuestions);
router.get('/courses', getCourses);
router.get('/courses/:courseId/tests', getCourseTests);
router.get('/tests/:testId/questions', getTestQuestions);
router.post('/tests/submit', submitTestResult);
router.get('/results/:userId', getUserResults);

module.exports = router;
