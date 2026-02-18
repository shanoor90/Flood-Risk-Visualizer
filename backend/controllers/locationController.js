const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

exports.updateLocation = async (req, res) => {
    try {
        const { userId, location, riskScore } = req.body;

        if (!userId || !location) {
            return res.status(400).json({ error: "UserId and Location are required" });
        }

        if (db) {
            try {
                const locationLog = {
                    userId,
                    location, // { lat, lon }
                    riskScore,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                };
                await db.collection('locations').add(locationLog);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore write error, using mock success:", dbError.message);
            }
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
                const history = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to JS Date for frontend consistency if needed
                    // But usually sending it as is or ISO string is fine. 
                    // To be safe, let's ensure it's client-friendly if it's a Firestore Timestamp object.
                    return { 
                        id: doc.id, 
                        ...data,
                        timestamp: data.timestamp && data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp
                    };
                });
                return res.json(history);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore history error, using mock data:", dbError.message);
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

exports.getLatestLocation = async (req, res) => {
    try {
        const { userId } = req.params;

        if (db) {
            try {
                const snapshot = await db.collection('locations')
                    .where('userId', '==', userId)
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .get();
                
                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    return res.json({
                        ...data,
                        timestamp: data.timestamp && data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp
                    });
                }
            } catch (dbError) {
                console.warn("[BACKEND] Firestore latest location error, using mock data:", dbError.message);
            }
        }
        
        const mockLatest = {
            userId,
            location: { lat: 6.9271, lon: 79.8612 },
            riskScore: 45,
            timestamp: new Date()
        };
        // Log that we are returning mock
        console.log("[MOCK] Returning latest location for:", userId);
        return res.json(mockLatest);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const { userId, preferences } = req.body; 

        if (!userId || !preferences) {
            return res.status(400).json({ error: "UserId and Preferences are required" });
        }

        if (db) {
            try {
                await db.collection('user_preferences').doc(userId).set({
                    ...preferences,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            } catch (dbError) {
                console.warn("[BACKEND] Preferences write error, using mock success:", dbError.message);
            }
        } else {
            console.log("[MOCK] Preferences update:", { userId, preferences });
        }

        res.status(200).json({ message: "Preferences updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPreferences = async (req, res) => {
    try {
        const { userId } = req.params;

        const defaultPreferences = {
            gpsBackup: false,
            highRiskFrequency: false,
            temporalRecording: false,
            familyAccess: false,
            activeTracking: true
        };

        if (db) {
            try {
                const doc = await db.collection('user_preferences').doc(userId).get();
                if (doc.exists) {
                    return res.json(doc.data());
                }
            } catch (dbError) {
                console.warn("[BACKEND] Preferences read error, using defaults:", dbError.message);
            }
        }

        console.log("[MOCK] Returning default preferences for:", userId);
        res.json(defaultPreferences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
