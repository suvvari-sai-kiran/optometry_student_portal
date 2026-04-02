const axios = require('axios');

/**
 * Handle Chat with 3 retries and 10s timeout using Axios
 * Specified model: gemini-1.5-flash
 */
exports.handleChat = async (req, res) => {
  const { messages, image } = req.body;
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  const maxRetries = 3;
  const timeout = 10000; // 10s

  if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is not configured in .env");
    return res.status(500).json({ error: "Gemini API key is missing." });
  }

  // Construct Gemini request body
  const systemInstruction = "You are a helpful Eye Care Assistant named 'Eye Care Assistant'. You are part of an Optometry Learning Portal. You help students understand optometry concepts like vertex calculations, visual acuity, contact lenses, etc. You can analyze images. Keep answers concise, educational, and professional.";
  
  let contents = [];
  
  // History + Current Message
  messages.forEach(m => {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: (m.role === 'user' ? `${systemInstruction}\n\n` : '') + m.text }]
    });
  });

  // Multimodal image support
  if (image && image.data && image.mimeType) {
    console.log("DEBUG: Processing image attachment...");
    const lastContent = contents[contents.length - 1];
    if (lastContent.role === 'user') {
      lastContent.parts.push({
        inlineData: {
          data: image.data.split(',')[1] || image.data,
          mimeType: image.mimeType
        }
      });
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let attempts = 0;
  let lastError;

  while (attempts < maxRetries) {
    try {
      attempts++;
      console.log(`DEBUG: Chat attempt ${attempts}/${maxRetries} using model: gemini-1.5-flash`);
      
      const response = await axios.post(url, { contents }, { timeout });
      
      if (response.data && response.data.candidates && response.data.candidates[0].content) {
        const reply = response.data.candidates[0].content.parts[0].text;
        console.log(`✅ Success on attempt ${attempts}`);
        return res.json({ reply });
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      lastError = error;
      const status = error.response ? error.response.status : (error.code === 'ECONNABORTED' ? 408 : 500);
      console.error(`⚠️ Attempt ${attempts} failed (Status: ${status}):`, error.message);
      
      if (status === 429) {
        // Wait if rate limited
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
      } else if (status === 400 || status === 401 || status === 404) {
        // Don't retry on client errors
        break;
      }
    }
  }

  console.error(`❌ ALL ${maxRetries} ATTEMPTS FAILED. Final error:`, lastError.message);
  
  const finalStatus = lastError.response ? lastError.response.status : 500;
  const fallbackMsg = finalStatus === 429 
    ? "I'm a bit busy right now. Please try again in 1 minute!" 
    : "I'm having trouble connecting to the brain center right now.";
    
  res.status(finalStatus).json({ reply: fallbackMsg, error: lastError.message });
};
