import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, ScrollView, SafeAreaView } from 'react-native';
import Navbar from './src/components/Navbar';
import RiskCard from './src/components/RiskCard';
import MapView from './src/components/MapView';

export default function App() {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1547623126-778847d8b51c?q=80&w=1974&auto=format&fit=crop' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <Navbar />
          <ScrollView contentContainerStyle={styles.content}>
            <RiskCard title="Ampara" level="High" value="Water Level: 12ft" />
            <RiskCard title="Batticaloa" level="Medium" value="Water Level: 6ft" />
            
            <MapView />
            
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
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
