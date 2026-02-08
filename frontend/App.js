import React from 'react';
import { StyleSheet, View, ImageBackground, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
              initialRouteName="Dashboard"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
              }}
            >
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
    backgroundColor: 'rgba(240, 249, 255, 0.6)', // Lighter, bluish overlay for day mode feel
  },
  safeArea: {
    flex: 1,
    marginTop: 30, // Basic safe area spacing
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  intro: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a', // Dark blue
  },
  subGreeting: {
    fontSize: 14,
    color: '#475569',
  },
  grid: {
    flexDirection: 'column', // Stacked for mobile, could be row for tablet
    gap: 8,
  },
  col: {
    width: '100%',
  },
});
