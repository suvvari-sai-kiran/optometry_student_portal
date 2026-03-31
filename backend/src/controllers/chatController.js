const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handleChat = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error("DEBUG: GEMINI_API_KEY is missing or still set to the placeholder in .env");
      throw new Error("GEMINI_API_KEY is not configured on the backend.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages } = req.body;
    
    // We expect messages in format: [{ role: 'user'/'assistant', text: '...' }]
    // We need to convert it to Gemini's format: [{ role: 'user'/'model', parts: [{ text: '...' }] }]
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Try multiple model names for robustness
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash"];
    let model;
    let lastError;

    for (const name of modelNames) {
      try {
        model = genAI.getGenerativeModel({ 
          model: name,
          systemInstruction: "You are a helpful Eye Care Assistant named 'Eye Care Assistant'. You are part of an Optometry Learning Portal. You help students understand optometry concepts like vertex calculations, visual acuity, contact lenses, etc. Keep your answers concise, educational, and professional."
        });
        
        // Ensure history starts with a user message
        let validMessages = messages.slice(0, -1);
        if (validMessages.length > 0 && validMessages[0].role === 'assistant') {
          validMessages = validMessages.slice(1);
        }

        const history = validMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

        const chat = model.startChat({ history });
        const latestMessage = messages[messages.length - 1].text;
        const result = await chat.sendMessage(latestMessage);
        const responseText = result.response.text();

        return res.json({ reply: responseText });
      } catch (e) {
        console.warn(`⚠️ Model ${name} failed:`, e.status || e.message);
        lastError = e;
      }
    }

    throw lastError || new Error("All Gemini models failed.");
    
  } catch (error) {
    console.error('Final Gemini API Error:', error);
    const statusCode = error.status || 500;
    const errorMessage = statusCode === 429 ? "I'm a bit busy right now. Please try again in 1 minute!" : "I'm having trouble connecting to the brain center right now.";
    res.status(statusCode).json({ error: errorMessage });
  }
};
