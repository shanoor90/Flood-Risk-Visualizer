const { admin, db } = require('../config/firebaseConfig');

// 1. Get Family Members with active Location / Risk
exports.getFamilyRisk = async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: "Firebase DB not configured in Server!" });
        const { userId } = req.params;
        
        const familySnapshot = await db.collection('users').doc(userId).collection('family').get();
        
        // Parallelize fetching details for all family members
        const familyList = await Promise.all(familySnapshot.docs.map(async (docSnap) => {
            const member = docSnap.data();
            let location = null;
            let risk = { level: 'UNKNOWN', score: 0, color: '#94a3b8' };

            try {
                // Fetch the absolute latest tracking point
                const locSnapshot = await db.collection('locations')
                    .where('userId', '==', member.memberId)
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .get();

                if (!locSnapshot.empty) {
                    const locData = locSnapshot.docs[0].data();
                    location = locData.location;
                    
                    if (locData.riskScore !== undefined) {
                        risk = {
                            level: locData.riskScore > 70 ? 'HIGH' : locData.riskScore > 40 ? 'MODERATE' : 'SAFE',
                            score: locData.riskScore,
                            color: locData.riskScore > 70 ? '#ef4444' : locData.riskScore > 40 ? '#facc15' : '#4ade80'
                        };
                    }
                }
            } catch (err) {
                 console.log("Location fetch error for", member.memberId, err.message);
            }

            return {
                memberId: member.memberId || docSnap.id,
                memberName: member.memberName,
                relation: member.relation,
                status: member.status || 'joined',
                batteryLevel: member.batteryLevel,
                gpsStatus: member.gpsStatus,
                inviteCode: member.inviteCode,
                location,
                risk
            };
        }));

        res.json(familyList);
    } catch (error) {
        console.error("getFamilyRisk API Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Create Invite Code for SMS
exports.createInvite = async (req, res) => {
    try {
        const { inviterId, memberName, relation, phoneNumber } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Parallelize both writes for faster response
        await Promise.all([
            // 1. Save Invite globally
            db.collection('invites').doc(code).set({
                inviterId, memberName, relation, phoneNumber,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            }),
            
            // 2. Drop a "pending" clone directly into the user's circle
            db.collection('users').doc(inviterId).collection('family').doc(`pending_${code}`).set({
                memberId: `pending_${code}`,
                memberName,
                relation,
                phoneNumber: phoneNumber || null,
                status: 'pending',
                inviteCode: code,
                addedAt: admin.firestore.FieldValue.serverTimestamp()
            })
        ]);
        
        res.json({ code });
    } catch (error) {
        console.error("createInvite API Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Accept Invite
exports.acceptInvite = async (req, res) => {
    try {
        const { code } = req.params;
        const { userId, userPhone } = req.body; // the ACCEPTING mobile user

        const inviteRef = db.collection('invites').doc(code);
        const inviteSnap = await inviteRef.get();

        if (!inviteSnap.exists) {
            return res.status(400).json({ error: "Invalid or expired invite code." });
        }

        const inviteData = inviteSnap.data();
        const { inviterId, memberName, relation } = inviteData;

        // 1. Map into host's real circle
        await db.collection('users').doc(inviterId).collection('family').doc(userId).set({
            memberId: userId, 
            memberName: memberName,
            relation: relation,
            phoneNumber: userPhone || null,
            status: 'joined',
            joinedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Erase dummy pending doc
        try {
            await db.collection('users').doc(inviterId).collection('family').doc(`pending_${code}`).delete();
        } catch (e) { console.log('No pending delete', e); }

        // 3. Burn the invite ticket
        await inviteRef.delete();

        res.json({ message: "Joined family successfully!", inviterId });
    } catch (error) {
        console.error("acceptInvite API Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete Member
exports.deleteMember = async (req, res) => {
    try {
        const { userId, memberId } = req.params;
        await db.collection('users').doc(userId).collection('family').doc(memberId).delete();
        res.json({ message: "Family member removed" });
    } catch (error) {
        console.error("deleteMember API Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 5. Get Invite Details
exports.getInviteDetail = async (req, res) => {
    try {
        const { code } = req.params;
        const inviteSnap = await db.collection('invites').doc(code).get();
        if (!inviteSnap.exists) throw new Error("Invalid code");
        
        const data = inviteSnap.data();
        const inviterSnap = await db.collection('users').doc(data.inviterId).get();
        const inviterName = inviterSnap.exists ? inviterSnap.data().username : "Someone";
        
        res.json({ ...data, inviterName });
    } catch (error) {
        console.error("getInviteDetail API Error:", error);
        res.status(500).json({ error: error.message });
    }
};
