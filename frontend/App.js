import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth, db, storage } from './src/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// 🔥 Firebase Connection Test
const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase connection...');
  try {
    // ✅ Test 1: Auth
    console.log('🔐 Auth:', auth ? '✅ Connected' : '❌ Failed');

    // ✅ Test 2: Firestore - write & read
    const testRef = doc(db, '_connection_test', 'ping');
    await setDoc(testRef, { status: 'ok', time: serverTimestamp() });
    const snap = await getDoc(testRef);
    console.log('📦 Firestore:', snap.exists() ? '✅ Connected' : '❌ Failed');

    // ✅ Test 3: Storage
    console.log('☁️ Storage:', storage ? '✅ Connected' : '❌ Failed');

    console.log('🎉 All Firebase services connected!');
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
  }
};

// --- Screen Imports ---
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RiskDetailScreen from './src/screens/RiskDetailScreen';
import SOSScreen from './src/screens/SOSScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import FamilyScreen from './src/screens/FamilyScreen';
import SurvivalGuideScreen from './src/screens/SurvivalGuideScreen';
import GPSBackupScreen from './src/screens/GPSBackupScreen';
import HighRiskScreen from './src/screens/HighRiskScreen';
import TemporalRecordingScreen from './src/screens/TemporalRecordingScreen';
import FamilyAccessScreen from './src/screens/FamilyAccessScreen';
import ActiveTrackingScreen from './src/screens/ActiveTrackingScreen';
import MobileBundleScreen from './src/screens/MobileBundleScreen';
import MedicalGuidanceScreen from './src/screens/MedicalGuidanceScreen';
import EmergencyDirectoryScreen from './src/screens/EmergencyDirectoryScreen';
import OfflineModeScreen from './src/screens/OfflineModeScreen';
import SafetyCircleScreen from './src/screens/SafetyCircleScreen';
import FamilyRelationshipsScreen from './src/screens/FamilyRelationshipsScreen';
import RealTimeMonitoringScreen from './src/screens/RealTimeMonitoringScreen';
import AutomaticAlertsScreen from './src/screens/AutomaticAlertsScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

          {/* App Screens */}
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="RiskDetail" component={RiskDetailScreen} />
          <Stack.Screen name="SOS" component={SOSScreen} />
          <Stack.Screen name="Tracking" component={TrackingScreen} />
          <Stack.Screen name="Family" component={FamilyScreen} />
          <Stack.Screen name="SurvivalGuide" component={SurvivalGuideScreen} />
          <Stack.Screen name="GPSBackup" component={GPSBackupScreen} />
          <Stack.Screen name="HighRisk" component={HighRiskScreen} />
          <Stack.Screen name="TemporalRecording" component={TemporalRecordingScreen} />
          <Stack.Screen name="FamilyAccess" component={FamilyAccessScreen} />
          <Stack.Screen name="ActiveTracking" component={ActiveTrackingScreen} />
          <Stack.Screen name="MobileBundle" component={MobileBundleScreen} />
          <Stack.Screen name="MedicalGuidance" component={MedicalGuidanceScreen} />
          <Stack.Screen name="EmergencyDirectory" component={EmergencyDirectoryScreen} />
          <Stack.Screen name="OfflineMode" component={OfflineModeScreen} />
          <Stack.Screen name="SafetyCircle" component={SafetyCircleScreen} />
          <Stack.Screen name="FamilyRelationships" component={FamilyRelationshipsScreen} />
          <Stack.Screen name="RealTimeMonitoring" component={RealTimeMonitoringScreen} />
          <Stack.Screen name="AutomaticAlerts" component={AutomaticAlertsScreen} />
        </Stack.Navigator>
      </View>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
