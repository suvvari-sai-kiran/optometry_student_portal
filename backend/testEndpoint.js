async function testEndpoint() {
  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: 'user', text: 'Hi, what is vertex distance?' }]
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    if (data.reply) {
      console.log("✅ Reply:", data.reply);
    } else {
      console.log("❌ Error:", data.error);
    }
  } catch (e) {
    console.error("Request Error:", e.message);
  }
}

testEndpoint();
