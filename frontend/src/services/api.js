import axios from 'axios';

// Replace with your machine's IP address if testing on a physical device.
// Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) to find your local IP.
const BASE_URL = 'http://192.168.8.195:5000/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    addMember: (data) => api.post('/family/add', data),
    deleteMember: (userId, memberId) => api.delete(`/family/${userId}/${memberId}`),
    getFamilyRisk: (userId) => api.get(`/family/risk/${userId}`),
};

export const guideService = {
    getGuide: () => api.get('/guide'),
    getShelters: (lat, lon) => api.get(`/guide/shelters?lat=${lat}&lon=${lon}`),
    markSafe: (data) => api.post('/guide/mark-safe', data),
};

export const locationService = {
    updateLocation: (data) => api.post('/location', data),
    getHistory: (userId) => api.get(`/location/history/${userId}`),
    getLatestLocation: (userId) => api.get(`/location/latest/${userId}`),
    updatePreferences: (data) => api.post('/location/preferences', data),
    getPreferences: (userId) => api.get(`/location/preferences/${userId}`),
};



export default api;
