import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, ScrollView, SafeAreaView, Text } from 'react-native';
import Navbar from './src/components/Navbar';
import RiskMapCard from './src/components/RiskMapCard';
import SOSButton from './src/components/SOSButton';
import FamilyList from './src/components/FamilyList';
import InfoCard from './src/components/InfoCard';

export default function App() {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?q=80&w=2070&auto=format&fit=crop' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <Navbar />
          
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.intro}>
                <Text style={styles.greeting}>Hello, User 👋</Text>
                <Text style={styles.subGreeting}>Stay safe during the floods.</Text>
            </View>

            {/* 1. SOS Button - High Priority */}
            <SOSButton />

            {/* 2. Map & Risk */}
            <RiskMapCard />

            {/* 3. Family */}
            <FamilyList />

            {/* 4. Grid for Info Cards */}
            <View style={styles.grid}>
                <View style={styles.col}>
                    <InfoCard type="tracking" />
                </View>
                <View style={styles.col}>
                    <InfoCard type="survival" />
                </View>
            </View>
            
          </ScrollView>
        </SafeAreaView>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
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
