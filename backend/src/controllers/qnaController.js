const { db } = require('../config/db');

exports.getThreads = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 
      "SELECT qt.*, u.name as authorName " +
      "FROM QnaThreads qt " +
      "JOIN Users u ON qt.userId = u.id";
    const params = [];
    
    if (search) {
      query += " WHERE qt.title LIKE ? OR qt.content LIKE ?";
      params.push("%" + search + "%", "%" + search + "%");
    }
    
    query += ' ORDER BY qt.createdAt DESC';
    
    const [threads] = await db.query(query, params);
    
    // Fetch reply count for each
    for (let thread of threads) {
      const [replies] = await db.query('SELECT COUNT(*) as count FROM QnaReplies WHERE threadId = ?', [thread.id]);
      thread.replyCount = replies[0].count;
    }
    
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching threads' });
  }
};

exports.getThread = async (req, res) => {
  try {
    const { id } = req.params;
    const [threads] = await db.query(
      "SELECT qt.*, u.name as authorName " +
      "FROM QnaThreads qt " +
      "JOIN Users u ON qt.userId = u.id " +
      "WHERE qt.id = ?",
      [id]
    );
    
    if (threads.length === 0) return res.status(404).json({ message: 'Thread not found' });
    
    const thread = threads[0];
    
    const [replies] = await db.query(
      "SELECT qr.*, u.name as authorName, u.role as authorRole " +
      "FROM QnaReplies qr " +
      "JOIN Users u ON qr.userId = u.id " +
      "WHERE qr.threadId = ? " +
      "ORDER BY qr.createdAt ASC",
      [id]
    );
    
    thread.replies = replies;
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching thread details' });
  }
};

exports.createThread = async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    const [result] = await db.query(
      'INSERT INTO QnaThreads (userId, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );
    res.status(201).json({ message: 'Thread created', threadId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating thread' });
  }
};

exports.replyToThread = async (req, res) => {
  try {
    const { id } = req.params; // threadId
    const { userId, content } = req.body;
    
    await db.query(
      'INSERT INTO QnaReplies (threadId, userId, content) VALUES (?, ?, ?)',
      [id, userId, content]
    );
    res.status(201).json({ message: 'Reply added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding reply' });
  }
};
