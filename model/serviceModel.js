const db = require('../config/firebaseConfig');

const servicesCollection = db.collection('services');

const createService = async (serviceData) => {
  const { id, service_name, fee_per_query } = serviceData;
  await servicesCollection.doc(id).set({
    service_name,
    fee_per_query
  });
};

const getServiceById = async (id) => {
  const serviceDoc = await servicesCollection.doc(id).get();
  return serviceDoc.exists ? serviceDoc.data() : null;
};

module.exports = { createService, getServiceById };
