import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './firebaseConfig'; // Initialize Firebase

// --- Screen Imports ---
// Make sure these files exist from your previous work
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

// Existing Screens
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* We use a dark base background (#121212) here.
        This prevents white flashes during screen transitions.
      */}
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            // crucial: keeps screen backgrounds transparent so individual screen images show through
            cardStyle: { backgroundColor: 'transparent' }, 
          }}
        >
          {/* New Auth Screens */}
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
        </Stack.Navigator>
      </View>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}