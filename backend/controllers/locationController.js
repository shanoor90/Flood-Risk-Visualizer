const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

exports.updateLocation = async (req, res) => {
    try {
        const { userId, location, riskScore } = req.body;

        if (!userId || !location) {
            return res.status(400).json({ error: "UserId and Location are required" });
        }

        const locationLog = {
            userId,
            location, // { lat, lon }
            riskScore,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('locations').add(locationLog);

        res.status(201).json({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLocationHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('locations')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
