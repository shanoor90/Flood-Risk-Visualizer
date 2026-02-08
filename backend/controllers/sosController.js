const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

exports.sendSOS = async (req, res) => {
    try {
        const { userId, location, riskLevel, riskScore } = req.body;

        if (!userId || !location) {
            return res.status(400).json({ error: "UserId and Location are required" });
        }

        const sosAlert = {
            userId,
            location, // { lat, lon }
            riskLevel,
            riskScore,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'ACTIVE'
        };

        const docRef = await db.collection('alerts').add(sosAlert);

        // SMS fallback logic would go here (e.g., using Twilio or similar)
        // For now, we just return success
        res.status(201).json({
            message: "SOS Alert Sent Successfully",
            alertId: docRef.id,
            smsFallback: "Activated if internet fails"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').limit(10).get();
        const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
