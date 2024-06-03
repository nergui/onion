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
  if (!id) {
    throw new Error('No user ID provided');
  }
  const userDoc = await usersCollection.doc(id).get();
  return userDoc.exists ? userDoc.data() : null;
};

const updateUser = async (userId, updateData) => {
  const userRef = db.collection('users').doc(userId);
  try {
      await userRef.update(updateData);
      console.log(`User ${userId} updated successfully.`);
  } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
  }
};


module.exports = { createUser, getUserById, updateUser };
