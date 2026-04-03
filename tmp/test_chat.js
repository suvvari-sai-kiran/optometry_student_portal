const axios = require('axios');

async function testChat() {
  try {
    const res = await axios.post('http://localhost:5000/api/chat', {
      messages: [{ role: 'user', text: 'hi' }]
    });
    console.log('Chatbot Response:', res.data);
  } catch (e) {
    console.error('Chatbot Error:', e.response ? e.response.data : e.message);
  }
}

testChat();
