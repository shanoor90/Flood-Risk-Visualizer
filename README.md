# Flood Risk Visualizer 🌊🏹

A comprehensive mobile application designed to visualize flood risks, enable rapid emergency SOS alerts, track location history for recovery, and provide offline survival guidance. Built for high-stakes environmental safety using React Native (Expo) and Node.js.

## 🚀 Complete Step-by-Step Setup Guide

Follow these steps exactly to get the project running on your machine:

### Step 1: Clone and Enter the Project
**If you don't have the folder yet:**
```bash
git clone https://github.com/shanoor90/Flood-Risk-Visualizer.git
cd Flood-Risk-Visualizer
```

**If you already have the folder (Error: "destination path already exists"):**
If you see the error *"destination path already exists"*, it means you already have a folder named `Flood-Risk-Visualizer`. 
- To get the **latest updates** without cloning again, run:
  ```bash
  cd Flood-Risk-Visualizer
  git pull origin main
  ```
- If your folder is **broken/older** and you want a **fresh start**, delete it first:
  ```bash
  rm -rf Flood-Risk-Visualizer  # Caution: This deletes your local changes!
  git clone https://github.com/shanoor90/Flood-Risk-Visualizer.git
  ```

### Step 2: Initialize the Backend
The backend manages the risk calculation engine and database connections.
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install all necessary dependencies:
   ```bash
   npm install
   ```
3. Prepare the Environment:
   - Create a file named `.env` in the `backend` folder.
   - Copy the content from `.env.example` into your new `.env` file.
4. **Note on Database**: Contact the project lead to receive the `serviceAccountKey.json` file. Place it inside the `backend/config/` directory (This file is ignored by Git for security).
5. Start the server:
   ```bash
   npm run dev
   ```
   *Your backend is now running at `http://localhost:5000`*

### Step 3: Initialize the Frontend
1. Open a **NEW second terminal window** (keep the backend terminal running).
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm run web
   ```
   *The app will open in your browser at `http://localhost:8081`*

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
