const { db } = require('../config/firebaseConfig');
const weatherService = require('../services/weatherService');

exports.addFamilyMember = async (req, res) => {
    try {
        const { userId, memberId, memberName, relation } = req.body;

        if (!userId || !memberId) {
            return res.status(400).json({ error: "UserId and MemberId are required" });
        }

        if (db) {
            const familyRef = db.collection('users').doc(userId).collection('family');
            await familyRef.doc(memberId).set({
                memberName,
                relation,
                addedAt: new Date()
            });
        } else {
            console.log("[MOCK] Added family member:", { userId, memberId, memberName });
        }

        res.status(201).json({ message: "Family member added to safety circle" });
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
                    // Get last known location of member
                    const locSnapshot = await db.collection('locations')
                        .where('userId', '==', doc.id)
                        .orderBy('timestamp', 'desc')
                        .limit(1)
                        .get();
        
                    let risk = { level: 'UNKNOWN', score: 0 };
                    let location = null;
        
                    if (!locSnapshot.empty) {
                        location = locSnapshot.docs[0].data().location;
                        const weatherData = await weatherService.getWeatherData(location.lat, location.lon);
                        risk = weatherService.calculateRiskScore(weatherData);
                    }
        
                    results.push({
                        memberId: doc.id,
                        memberName: member.memberName,
                        location,
                        risk
                    });
                }
                return res.json(results);
            } catch (dbError) {
                console.warn("[BACKEND] Firestore error, falling back to mock family data:", dbError.message);
            }
        }
        
        // Mock Family Data (Fallback if db is null OR if db fails)
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
