import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Background Image for Glass Effect Context */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1547623126-778847d8b51c?q=80&w=1974&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <BlurView intensity={80} tint="light" style={styles.glassContainer}>
            <Text style={styles.title}>Flood Risk Visualizer</Text>
            <Text style={styles.subtitle}>Real-time monitoring & alerts</Text>
            
            <View style={styles.separator} />
            
            <Text style={styles.info}>
              Welcome to the Mobile App!
              Please run `npm install` to setup dependencies.
            </Text>
          </BlurView>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Dark overlay for better contrast
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    width: '85%',
    padding: 24,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 15,
  },
  info: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});
