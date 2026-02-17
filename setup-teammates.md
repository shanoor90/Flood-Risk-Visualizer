# Flood Risk Visualizer - Teammate Setup Guide

## 1. Prerequisites
- Node.js (v18+)
- Git
- Expo Go App on your phone (Android/iOS)

## 2. Clone & Install
```bash
git clone https://github.com/shanoor90/Flood-Risk-Visualizer.git
cd Flood-Risk-Visualizer
```

### Backend
```bash
cd backend
npm install
# Start the server (Binds to 0.0.0.0 for network access)
node server.js
```
*Verify: You should see "Network Access: http://192.168.34.9:5000"*

### Frontend
```bash
cd frontend
npm install
```

## 3. Configuration for Mobile Testing
**CRITICAL:** To connect to the backend from your phone, you must point the app to the machine running the backend.

1. Open `frontend/src/services/api.js`
2. Update `BASE_URL` with the IP address of the backend machine (e.g., `192.168.34.9`).
   ```javascript
   const BASE_URL = 'http://192.168.34.9:5000/api/v1';
   ```
3. Ensure both devices are on the **same Wi-Fi network**.

## 4. Run the App
```bash
cd frontend
npx expo start
```
- Scan the QR code with Expo Go.

## 5. Troubleshooting
- **Axios Error / Network Error**: 
  - Check if `BASE_URL` matches the backend IP.
  - Check if Windows Firewall is blocking Node.js (Allow port 5000).
- **Infinite Loading**: 
  - Backend might be restarting or slow. We added caching to fix this!
