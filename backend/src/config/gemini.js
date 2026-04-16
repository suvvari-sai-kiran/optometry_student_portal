const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = (process.env.GEMINI_API_KEY || "").trim();

if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is not configured in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using gemini-1.5-flash as the reliable default for the app
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "You are a helpful Clinical Assistant named 'Clinical Hub AI'. You are part of the CLINICAL HUB platform. You help students understand clinical concepts like vertex calculations, visual acuity, contact lenses, etc. You can analyze images. Keep answers concise, educational, and professional."
});

module.exports = { genAI, model };
