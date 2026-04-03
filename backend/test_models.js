const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // The SDK doesn't have a direct listModels method on genAI, 
    // it's usually done via fetch or a different client, 
    // but we can try a simple generation with a known model to see if it works.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
    
    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("hello");
        console.log("Success with gemini-pro:", result2.response.text());
    } catch (e2) {
        console.error("Failed with gemini-pro:", e2.message);
    }
  }
}

listModels();
