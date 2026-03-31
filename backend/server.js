require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { checkDatabase } = require('./src/config/db');
const { initModels } = require('./src/models/init');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/student', require('./src/routes/student'));
app.use('/api/qna', require('./src/routes/qna'));
app.use('/api/chat', require('./src/routes/chat'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await checkDatabase();
  await initModels();
});
