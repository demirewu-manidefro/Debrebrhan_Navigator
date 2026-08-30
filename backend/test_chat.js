require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('./db');

async function testChat() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const systemInstruction = `You are the official Debre Berhan City Navigator AI.
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

  try {
    const { rows } = await pool.query('SELECT * FROM places');
    const prompt = `Context (Available Places in Database):
${JSON.stringify(rows, null, 2)}

User Request: ሆስፒታሉ የት ነው?`;

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash", systemInstruction });
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
testChat();
