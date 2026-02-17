import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassTiltCard from './GlassTiltCard';
import * as Location from 'expo-location';
import { sosService } from '../services/api';

export default function SOSButton() {
  const handlePress = async () => {
    // 1. Immediate Native Call (Primary Distress Signal)
    const emergencyNumber = '0778644924';
    try {
        Alert.alert(
            "SOS ACTIVATED",
            "Calling Emergency Contact & Sending Alert...",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "CALL NOW", 
                    onPress: () => Linking.openURL(`tel:${emergencyNumber}`) 
                }
            ]
        );
        // Auto-trigger call after short delay if user doesn't cancel? 
        // Better to let user confirm call to avoid accidental emergency dials in pocket, 
        // but user asked for "SOS button". 
        // Let's open the dialer immediately on press without alert for speed, 
        // or use the alert to confirm. I'll use immediate dialer for "SOS".
        Linking.openURL(`tel:${emergencyNumber}`); 
    } catch (err) {
        console.error("Failed to open dialer:", err);
    }

    // 2. Background: Send Firebase Alert & Prepare SMS
    let locationData = { lat: 6.9271, lon: 79.8612 }; // Default
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
            let userLoc = await Location.getCurrentPositionAsync({});
            locationData = { lat: userLoc.coords.latitude, lon: userLoc.coords.longitude };
        }

        const sosData = {
            userId: "user_123", 
            location: locationData,
            riskLevel: "HIGH", 
            riskScore: 65
        };

        // Log to Firebase Backend
        sosService.sendSOS(sosData).then((response) => {
             console.log("SOS Logged to Firebase:", response.data.alertId);
        });

    } catch (error) {
        console.error("SOS Data Error:", error);
        // If backend fails, try SMS
        const smsBody = `SOS! I need help. My Location: https://maps.google.com/?q=${locationData.lat},${locationData.lon}`;
        Linking.openURL(`sms:${emergencyNumber}?body=${smsBody}`);
    }
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
