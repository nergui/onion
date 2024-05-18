const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./firebase'); // Import the db instance
const openai = require('./openai'); // Import OpenAI
const app = express();
const port = 3000;
const userRoutes = require('./routes/user'); // Import routes



app.use(bodyParser.json());
app.use('/users', userRoutes); // Use routes

// Route to interact with OpenAI
app.post('/openai', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(JSON.stringify(response, null, 2)); // Log the full response for debugging
    res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    res.status(500).send('Error interacting with OpenAI: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});