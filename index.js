const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const bodyParser = require('body-parser');
const { admin, db } = require('./model/firebase'); // Import the db instance
const verifyToken = require('./middleware/authMiddleware'); 
const { getAuthToken, createInvoice, checkInvoice } = require('./middleware/qpayHelpers'); // Assuming qpayHelpers contains the getAuthToken and createInvoice functions
const serviceRouter = require('./routes/serviceRoutes'); // assuming your file is named serviceRouter.js
const userRoutes = require('./routes/userRoutes'); // Import routes
app.use('/users', userRoutes); // Use routes
app.use('/api/service', serviceRouter);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
const port = 80;

const RELOAD_AMOUNT = 2000;  // Example amount


const models = require('./models'); // Import the models list

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
      const { invoiceId, userId } = req.body;  // Assuming userId is passed in request
      if (!invoiceId) {
          return res.status(400).send('Invoice ID is required.');
      }

      const environment = process.env.APP_ENVIRONMENT; // 'PROD' or 'DEV'
      const username = environment === 'PROD' ? process.env.QPAY_PROD_USERNAME : process.env.QPAY_DEV_USERNAME;
      const password = environment === 'PROD' ? process.env.QPAY_PROD_PASSWORD : process.env.QPAY_DEV_PASSWORD;

      const authToken = await getAuthToken(environment, username, password);
      const invoiceStatus = await checkInvoice(environment, authToken, invoiceId);

      if (invoiceStatus !== "succeeded") {  // Check if the invoice check was successful
          const userRef = db.collection('users').doc(userId);
          const userDoc = await userRef.get();

          if (!userDoc.exists) {
              return res.status(404).send('User not found');
          }

          // Update the running balance
          await userRef.update({
              running_balance: admin.firestore.FieldValue.increment(RELOAD_AMOUNT)
          });

          res.status(200).send({ success: true, message: "Invoice processed and balance updated", newBalance: userDoc.data().running_balance + RELOAD_AMOUNT });
      } else {
          res.status(200).send({ success: true, invoiceStatus });
      }
  } catch (error) {
      console.error('Error checking invoice:', error);
      res.status(500).send({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
