// qpayHelpers.js
const axios = require('axios');

async function getAuthToken(environment, username, password) {
    
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
    const qPayAuthUrl = environment === 'PROD' ? process.env.QPAY_PROD_AUTH_URL : process.env.QPAY_DEV_AUTH_URL;
    
    try {
        const response = await axios.post(qPayAuthUrl, {}, {
            headers: { Authorization: `Basic ${basicAuth}` }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        throw error;
    }
}

async function createInvoice(environment, authToken, invoiceData) {
    const qPayInvoiceUrl = environment === 'PROD' ? process.env.QPAY_PROD_INVOICE_URL : process.env.QPAY_DEV_INVOICE_URL;
    
    try {
        const response = await axios.post(qPayInvoiceUrl, invoiceData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }
}
async function checkInvoice(environment, authToken, invoiceId) {
    const qPayCheckUrl = environment === 'PROD' ? process.env.QPAY_PROD_CHECK_URL : process.env.QPAY_DEV_CHECK_URL;

    try {
        const response = await axios.post(qPayCheckUrl, {
            object_type: 'INVOICE',
            object_id: invoiceId
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error checking invoice:', error);
        throw error;
    }
}
module.exports = {
    getAuthToken,
    createInvoice,
    checkInvoice // Exporting the new function
};
