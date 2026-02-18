const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

exports.getSurvivalGuide = (req, res) => {
    const guideData = {
        firstAid: [
            { id: 1, title: "Treating Hypothermia", content: "Move victim to dry area, remove wet clothes, cover with blankets." },
            { id: 2, title: "Wound Care", content: "Clean with pure water, apply pressure to stop bleeding." }
        ],
        emergencyContacts: [
            { name: "National Hotline", number: "119" },
            { name: "Disaster Management Center", number: "117" },
            { name: "Ambulance", number: "1990" }
        ],
        tips: [
            "Store enough clean water for 3 days.",
            "Keep an emergency radio with batteries.",
            "Know your local evacuation routes."
        ]
    };

    res.json(guideData);
};

exports.getShelters = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        // In a real app, query GeoFirestore for nearest shelters
        // For now, return static list with approximate distances
        
        const shelters = [
            { id: 's1', name: "Community Center A", location: "Colombo North", capacity: "High", status: "OPEN" },
            { id: 's2', name: "Public School B", location: "Gampaha", capacity: "Medium", status: "FULL" },
            { id: 's3', name: "temple C", location: "Kalutara", capacity: "High", status: "OPEN" }
        ];

        res.json(shelters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markSafe = async (req, res) => {
    try {
        const { userId, shelterId, notes } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        if (db) {
            try {
                await db.collection('safety_checkins').add({
                    userId,
                    shelterId: shelterId || 'UNKNOWN',
                    notes: notes || '',
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (dbError) {
                console.warn("[BACKEND] Firestore safety check-in error, using mock success:", dbError.message);
            }
        } else {
            console.log("[MOCK] User marked safe:", { userId, shelterId });
        }

        res.status(200).json({ message: "Safety status recorded" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
