const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Firebase (will log error if key is missing, but server will start)
const { db } = require('./config/firebaseConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Flood Risk Visualizer Backend is Running with Firebase Support!');
});

// Example API to get data from Firebase
app.get('/api/floods', async (req, res) => {
    try {
        if (!db) throw new Error("Database not initialized");
        const snapshot = await db.collection('floods').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message, hint: "Check if serviceAccountKey.json is valid" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
