import axios from 'axios';
import { db } from '../firebase';
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';

// Keep backend URL for services that need server-side logic (like Weather/Risk calculation)
const BASE_URL = 'http://10.34.9.167:5000/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to convert Firestore timestamp to Date
const convertTimestamp = (docData) => {
    if (!docData) return docData;
    const data = { ...docData };
    if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        data.timestamp = data.timestamp.toDate();
    }
    if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate();
    }
    return data;
};

export const riskService = {
    getRiskData: (lat, lon) => api.get(`/risk?lat=${lat}&lon=${lon}`),
};

export const sosService = {
    sendSOS: (data) => api.post('/sos', data),
    triggerSOS: (data) => api.post('/sos/trigger-sos', data),
    getAlerts: () => api.get('/sos'),
    addContact: (data) => api.post('/sos/add-contact', data),
    getContacts: (userId) => api.get(`/sos/contacts/${userId}`),
};

export const familyService = {
    // Add member to subcollection: users/{userId}/family/{memberId}
    addMember: async (data) => {
        try {
            const { userId, memberId, memberName, relation } = data;
            await setDoc(doc(db, 'users', userId, 'family', memberId), {
                memberId,
                memberName,
                relation,
                addedAt: serverTimestamp()
            });
            return { data: { message: "Family member added successfully" } };
        } catch (error) {
            console.error("Firebase addMember error:", error);
            throw error;
        }
    },

    deleteMember: async (userId, memberId) => {
        try {
            await deleteDoc(doc(db, 'users', userId, 'family', memberId));
            return { data: { message: "Family member removed" } };
        } catch (error) {
            console.error("Firebase deleteMember error:", error);
            throw error;
        }
    },

    // Update member settings (Role, Access, etc.)
    updateMemberSettings: async (userId, memberId, settings) => {
        try {
            await setDoc(doc(db, 'users', userId, 'family', memberId), settings, { merge: true });
            return { data: { message: "Member settings updated" } };
        } catch (error) {
            console.error("Firebase updateMemberSettings error:", error);
            throw error;
        }
    },

    // Get family members and their latest location/risk
    getFamilyRisk: async (userId) => {
        try {
            const familySnapshot = await getDocs(collection(db, 'users', userId, 'family'));
            const familyList = [];

            for (const docSnap of familySnapshot.docs) {
                const member = docSnap.data();
                let location = null;
                let risk = { level: 'UNKNOWN', score: 0, color: '#94a3b8' };

                // Get latest location for this member
                const locQuery = query(
                    collection(db, 'locations'),
                    where('userId', '==', member.memberId),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                );
                const locSnapshot = await getDocs(locQuery);

                if (!locSnapshot.empty) {
                    const locData = locSnapshot.docs[0].data();
                    location = locData.location;
                    risk = locData.riskScore ? {
                        level: locData.riskScore > 70 ? 'HIGH' : locData.riskScore > 40 ? 'MODERATE' : 'SAFE',
                        score: locData.riskScore,
                        color: locData.riskScore > 70 ? '#ef4444' : locData.riskScore > 40 ? '#facc15' : '#4ade80'
                    } : risk;
                }

                familyList.push({
                    memberId: member.memberId,
                    memberName: member.memberName,
                    relation: member.relation,
                    location,
                    risk
                });
            }
            return { data: familyList };
        } catch (error) {
            console.error("Firebase getFamilyRisk error:", error);
            throw error;
        }
    },
};

export const guideService = {
    getGuide: () => api.get('/guide'),
    getShelters: (lat, lon) => api.get(`/guide/shelters?lat=${lat}&lon=${lon}`),
    markSafe: (data) => api.post('/guide/mark-safe', data),
};

export const locationService = {
    // Add location to 'locations' collection
    updateLocation: async (data) => {
        try {
            const { userId, location, riskScore, batteryLevel, gpsStatus } = data;
            await addDoc(collection(db, 'locations'), {
                userId,
                location,
                riskScore,
                batteryLevel: batteryLevel !== undefined ? Math.round(batteryLevel * 100) : null, // Convert 0.85 to 85
                gpsStatus: gpsStatus || "Active",
                timestamp: serverTimestamp()
            });
            return { data: { message: "Location updated" } };
        } catch (error) {
            console.error("Firebase updateLocation error:", error);
            throw error;
        }
    },

    // Get history for Temporal Recording
    getHistory: async (userId) => {
        try {
            const q = query(
                collection(db, 'locations'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(20)
            );
            const querySnapshot = await getDocs(q);
            const history = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestamp(doc.data())
            }));
            return { data: history };
        } catch (error) {
            console.error("Firebase getHistory error:", error);
            // Fallback to empty if index not ready
            return { data: [] };
        }
    },

    getLatestLocation: async (userId) => {
        try {
            const q = query(
                collection(db, 'locations'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return { data: convertTimestamp(querySnapshot.docs[0].data()) };
            }
            return { data: null };
        } catch (error) {
            console.error("Firebase getLatestLocation error:", error);
            throw error;
        }
    },

    // Update preferences (High-Risk Frequency, Active Tracking params)
    updatePreferences: async (data) => {
        try {
            const { userId, preferences } = data;
            await setDoc(doc(db, 'user_preferences', userId), {
                ...preferences,
                updatedAt: serverTimestamp()
            }, { merge: true });
            return { data: { message: "Preferences updated" } };
        } catch (error) {
            console.error("Firebase updatePreferences error:", error);
            throw error;
        }
    },

    getPreferences: async (userId) => {
        try {
            const docSnap = await getDoc(doc(db, 'user_preferences', userId));
            if (docSnap.exists()) {
                return { data: docSnap.data() };
            }
            return {
                data: {
                    gpsBackup: false,
                    highRiskFrequency: false,
                    temporalRecording: false,
                    familyAccess: false,
                    activeTracking: true
                }
            };
        } catch (error) {
            console.error("Firebase getPreferences error:", error);
            throw error;
        }
    },
};

export default api;
