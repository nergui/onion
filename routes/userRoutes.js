const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Import the db instance

// Create a new user without needing an ID from the client
router.post('/', async (req, res) => {
  try {
    let data = req.body;
    // Ensure dob is a valid date or remove if not using
    // data.dob = new Date(data.dob);

    // Automatically generate an ID for the new user
    const response = await db.collection('users').add({
      firstname: data.firstname,
      lastname: data.lastname,
      // dob: data.dob, // Uncomment if using date of birth
      running_balance: data.running_balance
    });
    res.status(200).send(`User added with ID: ${response.id}`);
  } catch (error) {
    res.status(500).send('Error adding user: ' + error.message);
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error getting users: ' + error.message);
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();
    if (!doc.exists) {
      res.status(404).send('User not found');
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send('Error getting user: ' + error.message);
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    await userRef.update(req.body);
    res.status(200).send('User updated');
  } catch (error) {
    res.status(500).send('Error updating user: ' + error.message);
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    await userRef.delete();
    res.status(200).send('User deleted');
  } catch (error) {
    res.status(500).send('Error deleting user: ' + error.message);
  }
});

// Endpoint to update user balance
router.put('/update-balance/:id', async (req, res) => {
  const { balanceChange } = req.body;
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).send('User not found');
    }

    // Calculate new balance
    const userData = doc.data();
    const newBalance = (userData.running_balance || 0) + balanceChange;

    // Update the balance
    await userRef.update({ running_balance: newBalance });
    res.status(200).send(`User balance updated to ${newBalance}`);
  } catch (error) {
    res.status(500).send('Error updating user balance: ' + error.message);
  }
});

module.exports = router;
