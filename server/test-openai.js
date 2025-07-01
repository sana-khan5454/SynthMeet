require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
});

(async () => {
  try {
    const response = await openai.models.list();
    console.log("✅ OpenAI is working. Models available:");
    console.log(response.data.map(model => model.id));
  } catch (err) {
    console.error("❌ OpenAI connection failed:", err);
  }
})();