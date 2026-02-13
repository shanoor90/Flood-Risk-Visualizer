// File: frontend/App.js

import React from 'react';
import { StyleSheet, View, ImageBackground, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- Import your new screens here ---
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

// Existing screens
import DashboardScreen from './src/screens/DashboardScreen';
import RiskDetailScreen from './src/screens/RiskDetailScreen';
import SOSScreen from './src/screens/SOSScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import FamilyScreen from './src/screens/FamilyScreen';
import SurvivalGuideScreen from './src/screens/SurvivalGuideScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=2070&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <Stack.Navigator 
              // 1. Set the initial route to Login
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
              }}
            >
              {/* 2. Add the Login and Signup screens to the stack */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              
              {/* Existing App Screens */}
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="RiskDetail" component={RiskDetailScreen} />
              <Stack.Screen name="SOS" component={SOSScreen} />
              <Stack.Screen name="Tracking" component={TrackingScreen} />
              <Stack.Screen name="Family" component={FamilyScreen} />
              <Stack.Screen name="SurvivalGuide" component={SurvivalGuideScreen} />
            </Stack.Navigator>
          </SafeAreaView>
        </View>
        <StatusBar style="light" />
      </ImageBackground>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(240, 249, 255, 0.1)', 
  },
  safeArea: {
    flex: 1,
    marginTop: 30, 
  },
});