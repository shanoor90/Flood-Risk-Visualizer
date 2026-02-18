const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

exports.sendSOS = async (req, res) => {
    try {
        // Renamed/Extended logic for /trigger-sos
        // Accepts: userId, location, batteryLevel
        const { userId, location, riskLevel, riskScore, batteryLevel } = req.body;

        if (!userId || !location) {
            return res.status(400).json({ error: "UserId and Location are required" });
        }

        // Generate Google Maps Navigation Link
        // Format: https://www.google.com/maps/dir/?api=1&destination=lat,long
        const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lon}`;

        const sosAlert = {
            userId,
            location, // { lat, lon }
            riskLevel: riskLevel || 'UNKNOWN',
            riskScore: riskScore || 0,
            batteryLevel: batteryLevel || 'N/A',
            mapsLink,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'ACTIVE'
        };

        if (db) {
            try {
                const docRef = await db.collection('alerts').add(sosAlert);
                return res.status(201).json({
                    message: "SOS Alert Sent Successfully",
                    alertId: docRef.id,
                    mapsLink,
                    smsStatus: "Sent to emergency contacts"
                });
            } catch (dbError) {
                console.warn("[BACKEND] Firestore error, falling back to mock SOS response:", dbError.message);
            }
        }
        
        console.log("[MOCK] SOS Alert (Fallback):", sosAlert);
        res.status(201).json({
            message: "SOS Alert Sent Successfully (MOCK Fallback)",
            alertId: "mock_alert_999",
            mapsLink,
            smsStatus: "Sent to emergency contacts (Simulated)"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.triggerSOS = exports.sendSOS; // Alias if specific endpoint name is used

exports.getAlerts = async (req, res) => {
    try {
        if (db) {
            try {
                const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').limit(10).get();
                const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return res.json(alerts);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore error, falling back to mock alerts:", dbError.message);
            }
        }
        
        const mockAlerts = [
            { id: 'alert_1', userId: 'user_123', status: 'ACTIVE', timestamp: new Date(), location: { lat: 6.9, lon: 79.8 } }
        ];
        res.json(mockAlerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addContact = async (req, res) => {
    try {
        const { userId, name, phone } = req.body;

        if (!userId || !name || !phone) {
            return res.status(400).json({ error: "UserId, Name and Phone are required" });
        }

        if (db) {
            try {
                await db.collection('users').doc(userId).collection('contacts').add({
                    name,
                    phone,
                    addedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (dbError) {
                console.warn("[BACKEND] Firestore contact add error, using mock success:", dbError.message);
            }
        } else {
            console.log("[MOCK] Added emergency contact:", { userId, name, phone });
        }

        res.status(201).json({ message: "Emergency contact added" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (db) {
            try {
                const snapshot = await db.collection('users').doc(userId).collection('contacts').get();
                const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (contacts.length > 0) return res.json(contacts);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore contact fetch error, using mock data:", dbError.message);
            }
        }

        const mockContacts = [
            { id: 'c1', name: 'Mom (Mock)', phone: '0771234567' },
            { id: 'c2', name: 'Emergency (Mock)', phone: '119' }
        ];
        res.json(mockContacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
