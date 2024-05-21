const express = require('express');
const bodyParser = require('body-parser');
const verifyToken = require('./middleware/authMiddleware'); // Adjust path as necessary
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

const { streamOpenAI } = require('./routes/openaiStream'); // Import the streaming module
const models = require('./models'); // Import the models list
// Route to interact with OpenAI using streaming
app.post('/openai',verifyToken, (req, res) => {
  
  const { model, prompt } = req.body;
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
