require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    console.log("Key starting with:", process.env.GEMINI_API_KEY?.substring(0, 5) || "UNDEFINED");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const chat = model.startChat({
      history: [ { role: 'user', parts: [{ text: 'hello' }] } ]
    });

    console.log("Sending message...");
    const result = await chat.sendMessage("how are you");
    console.log("Response:", result.response.text());
  } catch (e) {
    console.error("ERROR CAUGHT:", e);
  }
}
test();
