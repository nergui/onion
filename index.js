const express = require('express');
const bodyParser = require('body-parser');
const verifyToken = require('./middleware/authMiddleware'); 

const createGeminiStreamChat = require('./routes/gemini'); 
const { createOpenAIStreamChat } = require('./routes/openaiStream'); 
const createClaudeStreamChat = require('./routes/claude');

const { db } = require('./firebase'); // Import the db instance
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
const port = 80;
const userRoutes = require('./routes/user'); // Import routes

app.use(bodyParser.json());
app.use('/users', userRoutes); // Use routes
app.use(express.json()); // Middleware to parse JSON bodies

const models = require('./models'); // Import the models list
// Route to interact with OpenAI using streaming
app.post('/openai',verifyToken, (req, res) => {
  
  const { model, prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('prompt is required.');
  }
  res.setHeader('Content-Type', 'text/plain');
  createOpenAIStreamChat(model, prompt, res);
});

app.post('/claude', (req, res) => {
  const { model, prompt } = req.body;
  if (!prompt) {
    return res.status(400).send('prompt is required.');
  }
  console.log(createClaudeStreamChat)
  createClaudeStreamChat(model, prompt, res);
});


app.post('/gemini', (req, res) => {
  const { model, prompt } = req.body;
  if (!prompt) {
      return res.status(400).send('prompt is required.');
  }
  createGeminiStreamChat(model, prompt, res);
});

// Route to get the list of models
app.get('/models', (req, res) => {
  res.json(models);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
