# Flood Risk Visualizer 🌊🏹

A comprehensive mobile application designed to visualize flood risks, enable rapid emergency SOS alerts, track location history for recovery, and provide offline survival guidance. Built for high-stakes environmental safety using React Native (Expo) and Node.js.

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Expo Go** app (installed on your iOS or Android device)

### 2. Installation
From the project root directory, run the following command to install dependencies for all components:
```bash
npm run install:all
```

### 3. Running the Application

#### **A. Run Full Stack (Recommended)**
To start both the backend and frontend simultaneously, use:
```bash
npm run start:all
```

#### **B. Run Components Separately**

**Backend Server (Exposes API):**
```bash
cd backend
npm run dev
```

**Frontend (Mobile App Bundler):**
```bash
cd frontend
npx expo start --go
```

### 4. Open on Mobile
1. Ensure your computer and mobile device are on the **same Wi-Fi network**.
2. Scan the QR code displayed in your terminal using the **Expo Go** app (Android) or the camera app (iOS).

---

## 📂 Project Structure

- `backend/`: Node.js & Express server handling risk calculations and data.
- `frontend/`: React Native (Expo) mobile application.

---

## 🛠 Features Overview

### 1. Flood Risk Visualization (Sri Lankan Formula)
Calculates live risk using localized weather data from Open-Meteo.
- **Formula**: `Risk Score = (Rainfall × 0.5) + (Storm Intensity × 0.3) + (Humidity × 0.2)`
- **Override**: Risk is set to **SEVERE** automatically if water level > 2.0m.

### 2. SOS Emergency System
- One-touch alert broadcasting.
- Auto-capture of GPS, timestamp, and local risk level.
- **SMS Fallback**: Triggered when the device is offline.

### 3. Family Connection Dashboard
- Create and manage a **Safety Circle**.
- Real-time monitoring of flood risks at the precise location of every family member.

### 4. Last Known Location Tracking
- Periodic GPS backups to the backend server.
- Temporal analysis of user paths for recovery mapping.

### 5. Offline Survival Guide
- Embedded medical and emergency directory.
- 100% accessible without internet connectivity.

---

## 📡 Configuration

### Backend IP Address
If testing on a physical device, ensure the `BASE_URL` in `frontend/src/services/api.js` matches your computer's local IP address.
Current configuration: `http://10.34.9.167:5000/api/v1`

---

## 🤝 Contributing

1. **Pull Latest**: `git pull origin main`
2. **Branch**: `git checkout -b feature/your-feature-name`
3. **Commit**: Keep it descriptive.
4. **Push**: `git push origin feature/your-feature-name`

---
*Stay Safe and Stay Connected.*
