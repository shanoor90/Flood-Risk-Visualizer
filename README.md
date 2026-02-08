# Flood Risk Visualizer 🌊🏹

A comprehensive mobile application designed to visualize flood risks, enable rapid emergency SOS alerts, track location history for recovery, and provide offline survival guidance. Built for high-stakes environmental safety using React Native (Expo) and Node.js.

## 🚀 Quick Start for Team Members

To get this project running on your local machine, follow these steps exactly:

### 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **Git**: Installed and configured.
- **Expo Go App**: Download on your phone if you want to test on a real device.

### 2. Clone the Repository
```bash
git clone https://github.com/shanoor90/Flood-Risk-Visualizer.git
cd Flood-Risk-Visualizer
```

### 3. Backend Setup
The backend handles the Sri Lankan Flood Risk calculation formula and Firestore data management.
```bash
cd backend
npm install
# Create a .env file based on .env.example if needed
npm run dev
```
*Port: [http://localhost:5000](http://localhost:5000)*

### 4. Frontend Setup
The frontend is built with React Native and includes a Glassmorphism dashboard with full navigation.
```bash
cd ../frontend
npm install
npm run web
```
*Port: [http://localhost:8081](http://localhost:8081)*

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

## 🤝 How Others Pull & Work

If you are a team member and want to contribute:
1. **Pull the Latest Changes**: Always run `git pull origin main` before starting work.
2. **Branching**: Create a new branch for your feature: `git checkout -b feature/your-feature-name`.
3. **Commit**: Keep commits descriptive.
4. **Push**: `git push origin feature/your-feature-name` and open a Pull Request.

## 📡 Deployment
- **Backend**: Deployed (or ready for deployment) to services like Heroku or Render.
- **Frontend**: Accessible via Expo Go or web build.

---
*Stay Safe and Stay Connected.*
