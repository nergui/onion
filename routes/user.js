const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Import the db instance

// Create a new user
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const response = await db.collection('users').add(data);
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

module.exports = router;
