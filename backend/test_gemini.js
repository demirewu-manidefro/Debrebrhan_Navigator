require('dotenv').config();

async function testGemini() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    console.log("Sending request to Gemini SDK...");
    const result = await model.generateContent("Say hello in Amharic");
    const text = await result.response.text();
    console.log("Response:", text);
  } catch(e) {
    console.error(e);
  }
}

testGemini();
