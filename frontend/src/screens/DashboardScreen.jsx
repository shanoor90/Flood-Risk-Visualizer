import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import Navbar from '../components/Navbar';
import RiskMapCard from '../components/RiskMapCard';
import SOSButton from '../components/SOSButton';
import FamilyList from '../components/FamilyList';
import InfoCard from '../components/InfoCard';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Navbar />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
            <Text style={styles.greeting}>Hello, User 👋</Text>
            <Text style={styles.subGreeting}>Stay safe during the floods.</Text>
        </View>

        {/* SOS Button - Leads to SOS Detail */}
        <SOSButton onPress={() => navigation.navigate('SOS')} />

        {/* Map & Risk - Leads to Risk Detail */}
        <RiskMapCard onPress={() => navigation.navigate('RiskDetail')} />

        {/* Family - Leads to Family Detail */}
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
  );
}

const styles = StyleSheet.create({
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
