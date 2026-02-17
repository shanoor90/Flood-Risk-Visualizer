import React from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground, SafeAreaView, Platform } from 'react-native';
import Navbar from '../components/Navbar';
import RiskMapCard from '../components/RiskMapCard';
import SOSButton from '../components/SOSButton';
import FamilyList from '../components/FamilyList';
import InfoCard from '../components/InfoCard';

// The original rainy background image URL
const DASHBOARD_BG_URL = 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=2070&auto=format&fit=crop';

export default function DashboardScreen({ navigation }) {
  return (
    // 1. Wrap the entire screen in the Background Image
    <ImageBackground source={{ uri: DASHBOARD_BG_URL }} style={styles.bgImage} resizeMode="cover">
      
      {/* 2. Add the Light Overlay (to create the frosted effect) */}
      <View style={styles.bgOverlay}>
        
        {/* 3. Safe Area View handles the notches/status bar */}
        <SafeAreaView style={styles.safeArea}>
          
          <View style={styles.container}>
            <Navbar />
            
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.intro}>
                  <Text style={styles.greeting}>Hello, User 👋</Text>
                  <Text style={styles.subGreeting}>Stay safe during the floods.</Text>
              </View>

              {/* SOS Button */}
              <SOSButton onPress={() => navigation.navigate('SOS')} />

              {/* Map & Risk */}
              <RiskMapCard onPress={() => navigation.navigate('RiskDetail')} />

              {/* Family List */}
              <FamilyList onPress={() => navigation.navigate('Family')} />

              {/* Grid for Info Cards */}
              <View style={styles.grid}>
                  <View style={styles.col}>
                      <InfoCard type="tracking" onPress={() => navigation.navigate('Tracking')} />
                  </View>
                  <View style={styles.col}>
                      <InfoCard type="survival" onPress={() => navigation.navigate('SurvivalGuide')} />
                  </View>
              </View>
              
            </ScrollView>
          </View>

        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // --- New Layout Styles ---
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    flex: 1,
    // Original light blue tint (0.1 opacity)
    backgroundColor: 'rgba(240, 249, 255, 0.1)', 
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  
  // --- Existing Styles ---
  container: {
    flex: 1,
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
    color: '#1e3a8a', 
  },
  subGreeting: {
    fontSize: 14,
    color: '#475569',
  },
  grid: {
    flexDirection: 'column', 
    gap: 8,
  },
  col: {
    width: '100%',
  },
});