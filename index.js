const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./firebase'); // Import the db instance
const app = express();
const port = 3000;
const userRoutes = require('./routes/user'); // Import routes
const { streamOpenAI } = require('./routes/openaiStream'); // Import the streaming module
const models = require('./models'); // Import the models list

app.use(bodyParser.json());
app.use('/users', userRoutes); // Use routes

// Route to interact with OpenAI using streaming
app.post('/openai', (req, res) => {
  
  const { model, prompt } = req.body;
  console.log("Requested model:", model);  // Check the model being requested
  console.log("Available models:", models.openAI);  // See what's in your models object

  if (!models.openAI || !models.openAI[model]) {
    return res.status(400).json({ error: 'Invalid model specified' });
  }  
  res.setHeader('Content-Type', 'text/plain');
  streamOpenAI(model, prompt, res);
});

// Route to get the list of models
app.get('/models', (req, res) => {
  res.json(models);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
