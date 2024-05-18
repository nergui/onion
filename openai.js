const OpenAI = require('openai').default;
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
