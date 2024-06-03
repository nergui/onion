const express = require('express');
const router = express.Router();
const axios = require('axios');
const {fetchService} = require('../model/serviceModel');
const { getUserById, updateUser } = require('../model/userModel'); // Adjust path as needed
const { createTransaction } = require('../model/transactionModel'); // Adjust path as needed




// Import service-specific functions
const createGeminiStreamChat = require('./gemini'); 
const { createOpenAIStreamChat } = require('./openaiStream'); 
const createClaudeStreamChat = require('./claude');

const serviceFunctions = {
    gemini: createGeminiStreamChat,
    openai: createOpenAIStreamChat,
    claude: createClaudeStreamChat
};

router.post('/:serviceName', async (req, res) => {
    const { userId, prompt, model } = req.body;
    const serviceName = req.params.serviceName;

    try {
        const service = await fetchService(serviceName);
        if (!service) {
            return res.status(404).send('Service not found123');
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.running_balance < service.fee_per_query) {
            return res.status(403).send('Insufficient funds');
        }

        // Call the specific service function dynamically
        if (!serviceFunctions[serviceName]) {
            return res.status(404).send('Service function not found');
        }

        // Stream response to the client
        const serviceFunction = serviceFunctions[serviceName];
        await serviceFunction(model, prompt, res, async (success) => {
            if (success) {
                console.log(`Updating balance for user ${userId}. Deducting ${service.fee_per_query}.`);
                // Update user balance and log the transaction only if streaming was successful
                user.running_balance -= service.fee_per_query;
                await updateUser(userId, { running_balance: user.running_balance });

                await createTransaction({
                    service_id: serviceName,
                    user_id: userId,
                    current_datetime: new Date(),
                    fee_per_query: service.fee_per_query,
                    status: 'success'
                }); 
            }else {
                console.log("Failed to complete the service, not updating balance user ${userId}");
            }
        });

    } catch (error) {
        console.error('Error processing service request:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

module.exports = router;
