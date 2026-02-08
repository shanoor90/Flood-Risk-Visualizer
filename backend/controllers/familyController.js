const { db } = require('../config/firebaseConfig');
const weatherService = require('../services/weatherService');

exports.addFamilyMember = async (req, res) => {
    try {
        const { userId, memberId, memberName, relation } = req.body;

        if (!userId || !memberId) {
            return res.status(400).json({ error: "UserId and MemberId are required" });
        }

        const familyRef = db.collection('users').doc(userId).collection('family');
        await familyRef.doc(memberId).set({
            memberName,
            relation,
            addedAt: new Date()
        });

        res.status(201).json({ message: "Family member added to safety circle" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFamilyRisk = async (req, res) => {
    try {
        const { userId } = req.params;
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

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
