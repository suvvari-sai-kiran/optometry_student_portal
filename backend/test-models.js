require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  
  const modelsToTest = ['gemini-1.5-flash', 'gemini-pro'];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hi');
      console.log(`✅ Success with ${modelName}:`, result.response.text().substring(0, 50));
      return; 
    } catch (e) {
      console.error(`❌ Failed with ${modelName}:`, e.message);
      if (e.response) {
        console.error("Response data:", e.response.status, e.response.statusText);
      }
    }
  }
}

listModels();
