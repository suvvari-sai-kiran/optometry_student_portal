require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-l' });
    const result = await model.generateContent('Hi');
    console.log("Success with gemini-3.1-flash-l:", result.response.text());
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

test();
