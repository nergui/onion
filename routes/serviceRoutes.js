const express = require('express');
const axios = require('axios');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const Transaction = require('../models/transactionModel');

const router = express.Router();

// Generic function to call external services
async function callExternalService(serviceUrl, prompt) {
    try {
        const response = await axios.post(serviceUrl, { prompt });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : error.message };
    }
}

// Route to handle external service calls
router.post('/:serviceName', async (req, res) => {
    const { userId, prompt } = req.body;
    const serviceName = req.params.serviceName;

    try {
        const service = await Service.findOne({ service_name: serviceName });
        if (!service) {
            return res.status(404).send('Service not found');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.running_balance < service.fee_per_query) {
            return res.status(403).send('Insufficient funds');
        }

        const serviceResponse = await callExternalService(`http://externalapi.com/${serviceName}`, prompt);
        if (!serviceResponse.success) {
            return res.status(500).send(serviceResponse.error);
        }

        // Deduct fee from user's balance if the query is successful
        user.running_balance -= service.fee_per_query;
        await user.save();

        // Log the transaction
        const transaction = new Transaction({
            service_id: service.id,
            user_id: user.id,
            current_datetime: new Date(),
            fee_per_query: service.fee_per_query,
            response: JSON.stringify(serviceResponse.data),
            status: 'success'
        });
        await transaction.save();

        res.send({ success: true, data: serviceResponse.data, balance: user.running_balance });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;