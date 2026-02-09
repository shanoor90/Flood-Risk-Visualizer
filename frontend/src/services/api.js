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
};

export const familyService = {
    addMember: (data) => api.post('/family/add', data),
    getFamilyRisk: (userId) => api.get(`/family/risk/${userId}`),
};

export const locationService = {
    updateLocation: (data) => api.post('/location', data),
    getHistory: (userId) => api.get(`/location/history/${userId}`),
};

export const guideService = {
    getGuide: () => api.get('/guide'),
};

export default api;
