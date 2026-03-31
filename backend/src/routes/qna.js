const express = require('express');
const router = express.Router();
const { 
  getThreads, getThread, createThread, replyToThread
} = require('../controllers/qnaController');

router.get('/', getThreads);
router.get('/:id', getThread);
router.post('/', createThread);
router.post('/:id/reply', replyToThread);

module.exports = router;
