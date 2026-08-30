const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/places.json');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_if_not_set');

// System prompt specific to Debre Berhan
const systemInstruction = `You are the official Debre Berhan City Navigator AI (የደብረ ብርሃን ከተማ የቦታ መመሪያ ረዳት).
Rules:
1. Always respond in natural, friendly Amharic.
2. Rely strictly on the seed database and landmarks provided in the context. Do not invent fake coordinates.
3. If a place is not registered, politely say it's not found and ask for the nearest landmark or kebele.
4. At the end of every answer finding a place, always output this exact JSON block:

\`\`\`json
{
  "location_found": true,
  "place_name": "የቦታው ስም",
  "coordinates": { "lat": 9.xxxx, "lng": 39.xxxx },
  "landmark": "የቅርብ ምልክት"
}
\`\`\`
`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Read context (places data) to inject into the prompt
    let placesData = [];
    try {
      placesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
      console.error('Error reading places.json:', err);
    }

    // Prepare model
    // Using gemini-2.5-flash as it is fast and suitable for chat tasks.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Provide context of all places to the AI
    const prompt = `
Context (Available Places in Database):
${JSON.stringify(placesData, null, 2)}

User Request: ${message}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ error: 'Failed to get response from AI Chatbot' });
  }
});

module.exports = router;
