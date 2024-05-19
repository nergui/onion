const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./firebase'); // Import the db instance
const app = express();
const port = 3000;
const userRoutes = require('./routes/user'); // Import routes
const { streamOpenAI } = require('./routes/openaiStream'); // Import the streaming module

app.use(bodyParser.json());
app.use('/users', userRoutes); // Use routes

// Route to interact with OpenAI using streaming
app.post('/openai', (req, res) => {
  const prompt = req.body.prompt;
  res.setHeader('Content-Type', 'text/plain');
  streamOpenAI(prompt, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
