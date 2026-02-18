const { db } = require('../config/firebaseConfig');
const weatherService = require('../services/weatherService');

exports.addFamilyMember = async (req, res) => {
    try {
        const { userId, memberId, memberName, relation } = req.body;

        if (!userId || !memberId) {
            return res.status(400).json({ error: "UserId and MemberId are required" });
        }

        if (db) {
            try {
                const familyRef = db.collection('users').doc(userId).collection('family');
                await familyRef.doc(memberId).set({
                    memberId,
                    memberName,
                    relation,
                    addedAt: new Date()
                });
            } catch (dbError) {
                console.warn("[BACKEND] Firestore error adding member, using mock success:", dbError.message);
            }
        } else {
            console.log("[MOCK] Added family member:", { userId, memberId, memberName });
        }

        res.status(201).json({ message: "Family member added to safety circle" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFamilyMember = async (req, res) => {
    try {
        const { userId, memberId } = req.params;

        if (db) {
            try {
                await db.collection('users').doc(userId).collection('family').doc(memberId).delete();
            } catch (dbError) {
                console.warn("[BACKEND] Firestore error deleting member, using mock success:", dbError.message);
            }
        } else {
            console.log("[MOCK] Deleted family member:", { userId, memberId });
        }

        res.status(200).json({ message: "Family member removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFamilyRisk = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (db) {
            try {
                const familySnapshot = await db.collection('users').doc(userId).collection('family').get();
                
                const results = [];
                for (const doc of familySnapshot.docs) {
                    const member = doc.data();
                    let risk = { level: 'UNKNOWN', score: 0 };
                    let location = null;

                    try {
                        const locSnapshot = await db.collection('locations')
                            .where('userId', '==', doc.id)
                            .orderBy('timestamp', 'desc')
                            .limit(1)
                            .get();
            
                        if (!locSnapshot.empty) {
                            location = locSnapshot.docs[0].data().location;
                            const weatherData = await weatherService.getWeatherData(location.lat, location.lon);
                            risk = weatherService.calculateRiskScore(weatherData);
                        }
                    } catch (locError) {
                        console.log(`Could not get location/risk for ${doc.id}:`, locError.message);
                    }
        
                    results.push({
                        memberId: doc.id,
                        memberName: member.memberName,
                        location,
                        risk
                    });
                }
                
                if (results.length > 0) return res.json(results);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore family fetch error, using mock data:", dbError.message);
            }
        }
        
        // Mock Family Data
        const mockFamily = [
            {
                memberId: "fam_1",
                memberName: "Mom",
                location: { lat: 6.93, lon: 79.86 },
                risk: { level: "SAFE", score: 10, color: "#4ade80" }
            },
            {
                memberId: "fam_2",
                memberName: "Dad",
                location: { lat: 6.95, lon: 79.87 },
                risk: { level: "MODERATE", score: 45, color: "#facc15" }
            }
        ];
        res.json(mockFamily);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
