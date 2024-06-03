// serviceModel.js
const { db } = require('./firebase');

const servicesCollection = db.collection('services');

const createService = async (serviceData) => {
  const { id, service_name, fee_per_query } = serviceData;
  await servicesCollection.doc(id).set({
    service_name,
    fee_per_query
  });
};

const fetchService = async (id) => {
  if (!id) {
    throw new Error('No service ID provided');
}
  const serviceDoc = await servicesCollection.doc(id).get();
  return serviceDoc.exists ? serviceDoc.data() : null;
};

module.exports = { createService, fetchService };
