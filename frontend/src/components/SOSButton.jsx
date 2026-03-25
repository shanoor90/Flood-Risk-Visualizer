import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import * as SMS from 'expo-sms';
import { LinearGradient } from 'expo-linear-gradient';
import GlassTiltCard from './GlassTiltCard';
import * as Location from 'expo-location';
import { sosService } from '../services/api';

export default function SOSButton() {
  const handlePress = async () => {
    const emergencyNumber = '0778644924';
    
    // 1. Get Location
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

    const mapsUrl = `https://maps.google.com/?q=${locationData.lat},${locationData.lon}`;
    const sosMessage = `🚨 EMERGENCY SOS! 🚨\nI need help. My current location is:\n${mapsUrl}`;

    // 2. Alert with Options
    Alert.alert(
        "Emergency SOS",
        "Choose how you want to send the alert:",
        [
            {
                text: "📞 Call Emergency",
                onPress: () => Linking.openURL(`tel:${emergencyNumber}`)
            },
            {
                text: "✉️ Send SMS",
                onPress: async () => {
                    const isAvailable = await SMS.isAvailableAsync();
                    if (isAvailable) {
                        await SMS.sendSMSAsync([emergencyNumber], sosMessage);
                    } else {
                        Linking.openURL(`sms:${emergencyNumber}?body=${encodeURIComponent(sosMessage)}`)
                    }
                }
            },
            { text: "Cancel", style: "cancel" }
        ]
    );

    // 3. Always Log to Backend
    sosService.sendSOS({
        userId: "user_123", 
        location: locationData,
        riskLevel: "HIGH", 
        riskScore: 65
    }).catch(err => console.error("Backend SOS Error:", err));
  };

  return (
    <GlassTiltCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#dc2626' }]}>SOS Emergency System</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <LinearGradient colors={['#ef4444', '#b91c1c']} style={styles.sosBtn}>
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.sendText}>SEND ALERT</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>One-touch SOS alert sends your location & risk level.</Text>
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
