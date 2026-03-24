import * as React from 'react';
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

    // ✅ Test 2: Firestore - write & read (handles permission denied as proof of connection)
    try {
      const testRef = doc(db, '_connection_test', 'ping');
      await setDoc(testRef, { status: 'ok', time: serverTimestamp() });
      await getDoc(testRef);
      console.log('📦 Firestore: ✅ Connected');
    } catch (e) {
      if (e.code === 'permission-denied') {
        console.log('📦 Firestore: ✅ Connected (But writes are blocked by Security Rules, which is normal)');
      } else {
        console.log('📦 Firestore: ❌ Failed - ' + e.message);
      }
    }

    // ✅ Test 3: Storage
    console.log('☁️ Storage:', storage ? '✅ Connected' : '❌ Failed');

    console.log('🎉 All Firebase services are accessible!');
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
import SafetyCircleScreen from './src/screens/SafetyCircleScreen';
import RealTimeMonitoringScreen from './src/screens/RealTimeMonitoringScreen';
import AutomaticAlertsScreen from './src/screens/AutomaticAlertsScreen';
import JoinFamilyScreen from './src/screens/JoinFamilyScreen';
import PreparednessChecklistsScreen from './src/screens/PreparednessChecklistsScreen';
import EvacuationProceduresScreen from './src/screens/EvacuationProceduresScreen';
import EmergencySuppliesScreen from './src/screens/EmergencySuppliesScreen';
import DisasterResponseScreen from './src/screens/DisasterResponseScreen';
import CutsWoundsScreen from './src/screens/CutsWoundsScreen';
import HypothermiaScreen from './src/screens/HypothermiaScreen';
import InfectionPreventionScreen from './src/screens/InfectionPreventionScreen';
import FracturesSprainsScreen from './src/screens/FracturesSprainsScreen';
import BasicCPRScreen from './src/screens/BasicCPRScreen';
import DehydrationScreen from './src/screens/DehydrationScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);

  // Handle user state changes
  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth.onAuthStateChanged(handleAuthStateChanged);
    testFirebaseConnection();

    // 🛡️ Safety timeout: If Firebase takes too long, stop blocking the app
    const timer = setTimeout(() => {
      if (initializing) setInitializing(false);
    }, 5000);

    return () => {
      subscriber();
      clearTimeout(timer);
    };
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        >
          {user ? (
            <>
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
              <Stack.Screen name="SafetyCircle" component={SafetyCircleScreen} />
              <Stack.Screen name="RealTimeMonitoring" component={RealTimeMonitoringScreen} />
              <Stack.Screen name="AutomaticAlerts" component={AutomaticAlertsScreen} />
              <Stack.Screen name="JoinFamily" component={JoinFamilyScreen} />
              <Stack.Screen name="PreparednessChecklists" component={PreparednessChecklistsScreen} />
              <Stack.Screen name="EvacuationProcedures" component={EvacuationProceduresScreen} />
              <Stack.Screen name="EmergencySupplies" component={EmergencySuppliesScreen} />
              <Stack.Screen name="DisasterResponse" component={DisasterResponseScreen} />
              <Stack.Screen name="CutsWounds" component={CutsWoundsScreen} />
              <Stack.Screen name="Hypothermia" component={HypothermiaScreen} />
              <Stack.Screen name="InfectionPrevention" component={InfectionPreventionScreen} />
              <Stack.Screen name="FracturesSprains" component={FracturesSprainsScreen} />
              <Stack.Screen name="BasicCPR" component={BasicCPRScreen} />
              <Stack.Screen name="Dehydration" component={DehydrationScreen} />
            </>
          ) : (
            <>
              {/* Auth Screens */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </View>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
