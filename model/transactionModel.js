const db = require('../config/firebaseConfig');

const transactionsCollection = db.collection('transactions');

const createTransaction = async (transactionData) => {
  const { id, service_id, current_datetime, fee_per_query, user_id, response, status } = transactionData;
  await transactionsCollection.doc(id).set({
    service_id,
    current_datetime,
    fee_per_query,
    user_id,
    response,
    status
  });
};

const getTransactionById = async (id) => {
  const transactionDoc = await transactionsCollection.doc(id).get();
  return transactionDoc.exists ? transactionDoc.data() : null;
};

module.exports = { createTransaction, getTransactionById };
