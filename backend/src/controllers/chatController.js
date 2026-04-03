const { model } = require('../config/gemini');

/**
 * Handle Chat with built-in SDK functionality
 * Optimized for Optometry Student Learning Portal
 */
exports.handleChat = async (req, res) => {
  const { messages, image } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format." });
  }

  try {
    // Convert history for Gemini SDK format
    // IMPORTANT: Gemini SDK requires the first message in history to be from the 'user' role.
    // We also limit the history to the last 20 messages to avoid token limit issues.
    const MAX_HISTORY = 20;
    let history = messages.slice(0, -1)
      .slice(-MAX_HISTORY)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

    // Find the first 'user' message index to ensure history starts correctly
    const firstUserIndex = history.findIndex(m => m.role === 'user');
    if (firstUserIndex !== -1) {
      history = history.slice(firstUserIndex);
    } else {
      history = []; // No user messages in the windowed history yet
    }

    const currentMsg = messages[messages.length - 1];
    let parts = [{ text: currentMsg.text }];

    // Add image support if present
    if (image && image.data && image.mimeType) {
      console.log("DEBUG: Processing multimodal input (text + image)...");
      parts.push({
        inlineData: {
          data: image.data.split(',')[1] || image.data,
          mimeType: image.mimeType
        }
      });
    }

    // Initialize chat session with history
    const chat = model.startChat({ history });
    
    // Send message and wait for response
    const result = await chat.sendMessage(parts);
    const response = await result.response;
    const reply = response.text();

    console.log("✅ SDK Chat Success");
    return res.json({ reply });

  } catch (error) {
    console.error("❌ Gemini SDK Error:", error.message);
    
    const status = error.status || 500;
    let fallbackMsg = "I'm having trouble connecting to the brain center right now.";
    
    if (status === 429) {
      fallbackMsg = "I'm a bit busy right now. Please try again in a minute!";
    }

    res.status(status).json({ 
      reply: fallbackMsg, 
      error: error.message 
    });
  }
};
