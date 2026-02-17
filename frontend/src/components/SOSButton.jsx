import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassTiltCard from './GlassTiltCard';
import * as Location from 'expo-location';
import { sosService } from '../services/api';

export default function SOSButton() {
  const handlePress = async () => {
    const emergencyNumber = '0778644924';
    
    // 1. Get Location First (Best Effort)
    let locationData = { lat: 6.9271, lon: 79.8612 }; 
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            let userLoc = await Location.getCurrentPositionAsync({});
            locationData = { lat: userLoc.coords.latitude, lon: userLoc.coords.longitude };
        }
    } catch (e) {
        console.log("Location Error:", e);
    }

    // 2. Prepare Alert Data
    const sosData = {
        userId: "user_123", 
        location: locationData,
        riskLevel: "HIGH", 
        riskScore: 65
    };
    const smsBody = `SOS! I need help. My Location: https://maps.google.com/?q=${locationData.lat},${locationData.lon}`;

    // 3. Execute SOS Actions
    // Action A: Immediate Call
    Linking.openURL(`tel:${emergencyNumber}`).catch(err => console.error("Call Error:", err));
    
    // Action B: Open SMS (Small delay to allow dialer to register, though OS usually handles one at a time)
    // We'll trust the user to come back and send SMS if the call fails or ends.
    // OR we can try to open it. Opening two URLs in rapid succession often fails in RN.
    // Better Approach: Send Backend Alert and then Prompt/Open SMS.
    
    // Send to Backend (Fire & Forget)
    sosService.sendSOS(sosData).then((response) => {
         console.log("SOS Logged to Firebase:", response.data.alertId);
    }).catch(err => console.error("Backend SOS Error:", err));

    // Open SMS immediately after Call attempt?
    // Let's use a slight timeout or just trigger it.
    setTimeout(() => {
        Linking.openURL(`sms:${emergencyNumber}?body=${smsBody}`).catch(err => console.error("SMS Error:", err));
    }, 1000); 
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
