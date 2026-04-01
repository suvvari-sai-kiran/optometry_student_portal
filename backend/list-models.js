require('dotenv').config();

async function listModels() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (!res.ok) {
      console.error("Failed to list models:", data);
      return;
    }
    
    console.log("Success! Models found:");
    data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})` || m.name));
  } catch (e) {
    console.error("Failed to list models:", e.message);
  }
}

listModels();
