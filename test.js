const OpenAI = require('openai').default;
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(JSON.stringify(response, null, 2)); // Log the full response
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    console.log(error.response ? error.response.data : "No additional error info available.");
  }
}

// Example: Using command line argument as prompt
const prompt = process.argv[2] || "Tell me a joke.";
getResponse(prompt);
