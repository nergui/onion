// transactionModel.js
const { db } = require('./firebase');

const transactionsCollection = db.collection('transactions');

const createTransaction = async (transactionData) => {
    if (!transactionData.user_id || typeof transactionData.user_id !== 'string') {
        throw new Error("Invalid or missing 'user_id'");
    }
    if (!transactionData.service_id || typeof transactionData.service_id !== 'string') {
        throw new Error("Invalid or missing 'service_id'");
    }

    const newTransaction = {
        service_id: transactionData.service_id,
        user_id: transactionData.user_id,
        current_datetime: transactionData.current_datetime || new Date(),
        fee_per_query: transactionData.fee_per_query,
        response: transactionData.response || "",  // Provide a default value like an empty string
        status: transactionData.status
    };

    const transactionRef = await transactionsCollection.add(newTransaction);
    return transactionRef.id;
};
module.exports = { createTransaction };