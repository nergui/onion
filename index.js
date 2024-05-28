const express = require('express');
const bodyParser = require('body-parser');
const verifyToken = require('./middleware/authMiddleware'); 
const { getAuthToken, createInvoice, checkInvoice } = require('./middleware/qpayHelpers'); // Assuming qpayHelpers contains the getAuthToken and createInvoice functions

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

app.post('/processQpayPayment', async (req, res) => {
  try {
      const { amount } = req.body;
      const environment = process.env.APP_ENVIRONMENT; // 'PROD' or 'DEV'
      const username = environment === 'PROD' ? process.env.QPAY_PROD_USERNAME : process.env.QPAY_DEV_USERNAME;
      const password = environment === 'PROD' ? process.env.QPAY_PROD_PASSWORD : process.env.QPAY_DEV_PASSWORD;
      const invoiceCode = environment === 'PROD' ? process.env.QPAY_PROD_INVOICE_CODE : process.env.QPAY_DEV_INVOICE_CODE;

      const authToken = await getAuthToken(environment, username, password);
      const invoiceNo = Date.now().toString();
      const invoiceData = {
          invoice_code: invoiceCode,
          sender_invoice_no: invoiceNo,
          invoice_receiver_code: 'terminal',
          invoice_description: 'FacesearchApp',
          sender_branch_code: 'FacesearchWeb',
          amount: amount,
      };

      const invoiceResponse = await createInvoice(environment, authToken, invoiceData);
      res.status(200).send({ success: true, response: invoiceResponse });
  } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).send({ error: error.message });
  }
});

app.post('/checkInvoice', async (req, res) => {
  try {
      const { invoiceId } = req.body;
      if (!invoiceId) {
          return res.status(400).send('Invoice ID is required.');
      }

      const environment = process.env.APP_ENVIRONMENT; // 'PROD' or 'DEV'
      const username = environment === 'PROD' ? process.env.QPAY_PROD_USERNAME : process.env.QPAY_DEV_USERNAME;
      const password = environment === 'PROD' ? process.env.QPAY_PROD_PASSWORD : process.env.QPAY_DEV_PASSWORD;

      const authToken = await getAuthToken(environment, username, password);

      const invoiceStatus = await checkInvoice(environment, authToken, invoiceId);
      res.status(200).send({ success: true, invoiceStatus });
  } catch (error) {
      console.error('Error checking invoice:', error);
      res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
