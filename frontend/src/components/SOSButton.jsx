import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassTiltCard from './GlassTiltCard';

export default function SOSButton() {
  const handlePress = () => {
    Alert.alert("SOS SENT", "Your emergency alert with location has been broadcast to family and rescue teams.");
  };

  return (
    <GlassTiltCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#dc2626' }]}>SOS Emergency System</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <LinearGradient
                colors={['#ef4444', '#b91c1c']}
                style={styles.sosBtn}
            >
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.sendText}>SEND ALERT</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.desc}>
        One-touch SOS alert sends your location & risk level.
      </Text>
    </GlassTiltCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    // Add glowing border effect for SOS
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderWidth: 2,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    // color set inline
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  sosBtn: {
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#ef4444",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    gap: 10,
  },
  sosText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  sendText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginTop: 8,
  },
});
