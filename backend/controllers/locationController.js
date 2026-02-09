const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

exports.updateLocation = async (req, res) => {
    try {
        const { userId, location, riskScore } = req.body;

        if (!userId || !location) {
            return res.status(400).json({ error: "UserId and Location are required" });
        }

        if (db) {
            const locationLog = {
                userId,
                location, // { lat, lon }
                riskScore,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('locations').add(locationLog);
        } else {
            console.log("[MOCK] Location update:", { userId, location, riskScore });
        }

        res.status(201).json({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLocationHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (db) {
            try {
                const snapshot = await db.collection('locations')
                    .where('userId', '==', userId)
                    .orderBy('timestamp', 'desc')
                    .limit(20)
                    .get();
                const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return res.json(history);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore error, falling back to mock location history:", dbError.message);
            }
        }
        
        // Mock data
        const mockHistory = [
            { 
                id: 'mock_1', 
                userId, 
                location: { lat: 6.9271, lon: 79.8612 }, 
                riskScore: 45, 
                timestamp: new Date() 
            },
            { 
                id: 'mock_2', 
                userId, 
                location: { lat: 6.9300, lon: 79.8600 }, 
                riskScore: 30, 
                timestamp: new Date(Date.now() - 3600000) 
            }
        ];
        res.json(mockHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
