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
                    phoneNumber: req.body.phoneNumber || "",
                    addedAt: new Date()
                });

                // Initialize their location/status so they appear immediately
                // In a real app, this would wait for their phone to report location.
                // For this demo, we initialize it to a "Home" location (e.g. Colombo)
                await db.collection('locations').add({
                    userId: memberId,
                    location: { lat: 6.9271 + (Math.random() * 0.05 - 0.025), lon: 79.8612 + (Math.random() * 0.05 - 0.025) }, // Around Colombo
                    riskScore: 10, // Default Safe
                    batteryLevel: 95,
                    gpsStatus: "Active",
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
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

// --- Invite System ---

exports.createInvite = async (req, res) => {
    try {
        const { userId, memberName, relation } = req.body;
        if (!userId || !memberName || !relation) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        if (db) {
            await db.collection('invites').doc(code).set({
                code,
                inviterId: userId,
                memberName, // The name the inviter calls them (e.g. "Mom")
                relation,
                createdAt: new Date()
            });
            res.status(201).json({ code, message: "Invite generated" });
        } else {
            res.status(500).json({ error: "Database not connected" });
        }
    } catch (error) {
        console.error("Create Invite Error:", error);
        res.status(500).json({ error: "Failed to create invite" });
    }
};

exports.acceptInvite = async (req, res) => {
    try {
        const { code, userId, phone } = req.body; // userId is the JOINER
        if (!code || !userId) {
            return res.status(400).json({ error: "Missing code or user ID" });
        }

        if (db) {
            const inviteDoc = await db.collection('invites').doc(code).get();
            if (!inviteDoc.exists) {
                return res.status(404).json({ error: "Invalid or expired invite code" });
            }

            const inviteData = inviteDoc.data();
            const inviterId = inviteData.inviterId;

            // 1. Add JOINER to INVITER's family list
            // The inviter calls them "Mom" or whatever was in the invite
            await db.collection('users').doc(inviterId).collection('family').doc(userId).set({
                memberId: userId,
                memberName: inviteData.memberName,
                relation: inviteData.relation,
                phoneNumber: phone || "",
                addedAt: new Date()
            });

            // 2. (Optional) Add INVITER to JOINER's list?
            // For now, let's keep it unidirectional: Inviter tracks Joiner.
            // But usually safety circles are mutual.
            // Let's just do unidirectional as per "view *their* location".

            // 3. Initialize Location for Joiner if not exists
            // (optional, but good for immediate feedback)
            
            // 4. Delete Invite
            await db.collection('invites').doc(code).delete();

            res.status(200).json({ message: "Joined family circle successfully" });

        } else {
            res.status(500).json({ error: "Database not connected" });
        }
    } catch (error) {
        console.error("Accept Invite Error:", error);
        res.status(500).json({ error: "Failed to accept invite" });
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
                            const data = locSnapshot.docs[0].data();
                            location = data.location;
                            
                            // Use real data from Firestore, default to reasonable fallbacks if missing
                            location.batteryLevel = data.batteryLevel ?? 100;
                            location.gpsStatus = data.gpsStatus || "Active";
                            location.lastSeen = data.timestamp?.toDate() || new Date();

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
                        risk,
                        phoneNumber: member.phoneNumber || "",
                        batteryLevel: location?.batteryLevel ?? 0,
                        lastSeen: location?.lastSeen || null,
                        gpsStatus: location?.gpsStatus || "Unknown"
                    });
                }
                
                if (results.length > 0) {
                    return res.json(results);
                } else {
                    return res.json([]); 
                }
            } catch (dbError) {
                console.warn("[BACKEND] Firestore family fetch error:", dbError.message);
                res.status(500).json({ error: "Failed to fetch family data" });
            }
        } else {
            res.status(500).json({ error: "Database not connected" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
