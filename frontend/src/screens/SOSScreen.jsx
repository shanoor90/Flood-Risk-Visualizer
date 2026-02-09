import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Linking, ActivityIndicator, Platform } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import { sosService } from '../services/api';

export default function SOSScreen({ navigation }) {
    const [sending, setSending] = useState(false);

    const handleSOS = async () => {
        setSending(true);
        try {
            // 1. Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required for SOS.");
                setSending(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            
            // 2. Get Battery Level
            const batteryLevel = await Battery.getBatteryLevelAsync();

            // 3. Try Backend API
            const sosData = {
                userId: "user_123_mock", // Replace with real auth user ID later
                location: {
                    lat: location.coords.latitude,
                    lon: location.coords.longitude
                },
                batteryLevel: Math.round(batteryLevel * 100)
            };

            await sosService.triggerSOS(sosData);
            Alert.alert("SOS Sent", "Emergency alerts have been sent to your contacts.");

        } catch (error) {
            console.log("Backend failed, switching to SMS Fallback");
            // 4. Fallback to Native SMS
            const location = await Location.getCurrentPositionAsync({});
            const lat = location.coords.latitude;
            const lon = location.coords.longitude;
            const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
            const message = `SOS! I need help. Location: ${mapsLink}`;
            
            const operator = Platform.OS === 'android' ? '?' : '&';
            Linking.openURL(`sms:${operator}body=${encodeURIComponent(message)}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <DetailLayout 
            title="SOS Emergency System" 
            icon="alert-octagon" 
            color="#fee2e2" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.heroSection}>
                    <TouchableOpacity 
                        style={styles.sosButton} 
                        onPress={handleSOS}
                        disabled={sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <MaterialCommunityIcons name="broadcast" size={60} color="#fff" />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.heroTitle}>{sending ? "Sending SOS..." : "TAP TO SEND SOS"}</Text>
                    <Text style={styles.heroSubtitle}>Triggers Backend Alert + SMS Fallback</Text>
                </View>

                <View style={styles.featureList}>
                    <FeatureItem 
                        icon="gesture-tap" 
                        title="One-Touch Activation" 
                        desc="Instantly notifies emergency contacts with your live location." 
                    />
                    <FeatureItem 
                        icon="map-marker-radius" 
                        title="Automatic Capture" 
                        desc="Captures location, timestamp, and risk level automatically" 
                    />
                    <FeatureItem 
                        icon="cloud-sync" 
                        title="Backend Delivery" 
                        desc="Backend alert delivery via internet connection" 
                    />
                    <FeatureItem 
                        icon="message-text-outline" 
                        title="SMS Fallback" 
                        desc="SMS fallback activated when internet unavailable" 
                    />
                </View>

                <View style={styles.warningBox}>
                    <MaterialCommunityIcons name="information-variant" size={24} color="#b91c1c" />
                    <Text style={styles.warningText}>
                        Use only in real emergencies. Misuse may result in penalties or delayed response for actual victims.
                    </Text>
                </View>
            </View>
        </DetailLayout>
    );
}

function FeatureItem({ icon, title, desc }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={icon} size={24} color="#b91c1c" />
            </View>
            <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    sosButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#fee2e2'
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#b91c1c',
        marginTop: 0,
        letterSpacing: 1,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#7f1d1d',
        marginTop: 4,
    },
    featureList: {
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    featureDesc: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        alignItems: 'center',
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#b91c1c',
        fontStyle: 'italic',
    },
});
