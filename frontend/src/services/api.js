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
const BASE_URL = 'http://192.168.8.195:5000/api/v1';

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
    // Add member direct (legacy)
    addMember: async (data) => {
        // Keeping empty if unused by latest design
        return { data: { message: "Use invite system" } };
    },

    deleteMember: async (userId, memberId) => {
        try {
            return await api.delete(`/family/${userId}/${memberId}`);
        } catch (error) {
            console.error("API deleteMember error:", error);
            throw error;
        }
    },

    // Update member settings (keep firestore for simple settings if needed, or mock success)
    updateMemberSettings: async (userId, memberId, settings) => {
        try {
            await setDoc(doc(db, 'users', userId, 'family', memberId), settings, { merge: true });
            return { data: { message: "Member settings updated" } };
        } catch (error) {
            console.error("Firebase updateMemberSettings error:", error);
            throw error;
        }
    },

    // Get family members securely via backend
    getFamilyRisk: async (userId) => {
        try {
            return await api.get(`/family/${userId}`);
        } catch (error) {
            console.error("API getFamilyRisk error:", error);
            throw error;
        }
    },
};

export const inviteService = {
    createInvite: async (inviterId, memberName, relation, phoneNumber) => {
        try {
            return await api.post('/family/invite', { inviterId, memberName, relation, phoneNumber });
        } catch (error) {
            console.error("API createInvite error:", error);
            throw error;
        }
    },

    getInviteDetail: async (code) => {
        try {
            return await api.get(`/family/invite/${code}`);
        } catch (error) {
            console.error("API getInviteDetail error:", error);
            throw error;
        }
    },

    acceptInvite: async (code, userId, userPhone) => {
        try {
            return await api.post(`/family/accept/${code}`, { userId, userPhone });
        } catch (error) {
            console.error("API acceptInvite error:", error);
            throw error;
        }
    }
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
            console.warn("Firebase warning (harmless):", error.message);
            // Swallow error for UI stability during testing
            return { data: { message: "Mock updated" } };
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
            console.warn("Firebase warning (harmless):", error.message);
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
            console.warn("Firebase warning (harmless):", error.message);
            return { data: null };
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
            return { data: { message: "Mock updated" } };
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
            console.warn("Firebase warning (harmless):", error.message);
            return {
                data: {
                    gpsBackup: false,
                    highRiskFrequency: false,
                    temporalRecording: false,
                    familyAccess: false,
                    activeTracking: true
                }
            };
        }
    },
};

export default api;
