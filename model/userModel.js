const { db } = require('./firebase');
const usersCollection = db.collection('users');

const createUser = async (userData) => {
  const { id, firstname, lastname, dob, running_balance } = userData;
  await usersCollection.doc(id).set({
    firstname,
    lastname,
    dob,
    running_balance
  });
};

const getUserById = async (id) => {
  const userDoc = await usersCollection.doc(id).get();
  return userDoc.exists ? userDoc.data() : null;
};

const updateUser = async (id, updateData) => {
  await usersCollection.doc(id).update(updateData);
};

module.exports = { createUser, getUserById, updateUser };
