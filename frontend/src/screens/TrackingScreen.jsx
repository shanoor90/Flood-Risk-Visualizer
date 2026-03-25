import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Platform, ScrollView, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import * as SMS from 'expo-sms';
import { locationService } from '../services/api';
import { authService } from '../services/authService';
import * as Location from 'expo-location';

export default function TrackingScreen({ navigation }) {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastSynced, setLastSynced] = useState(null);
    const [preferences, setPreferences] = useState({
        gpsBackup: false,
    });
    const [batteryLevel, setBatteryLevel] = useState(null);

    const trackingIntervalRef = useRef(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUserId(user.uid);
        }
        
        // Battery Monitoring
        const setupBattery = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel(level);
            if (level < 0.15) {
                promptSOS();
            }
        };
        setupBattery();
        const batterySubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(batteryLevel);
            if (batteryLevel < 0.15) {
                promptSOS();
            }
        });

        return () => {
            stopTracking();
            batterySubscription.remove();
        };
    }, []);

    const promptSOS = () => {
        Alert.alert(
            "Low Battery",
            "Your battery is below 15%. Would you like to send an SOS message with your location?",
            [
                { text: "No", style: "cancel" },
                { text: "Send SOS", onPress: () => navigation.navigate('SOS') }
            ]
        );
    };

    useEffect(() => {
        if (userId) {
            fetchPreferences();
        }
    }, [userId]);

    useEffect(() => {
        if (!loading && userId) {
            if (preferences.gpsBackup) {
                startTracking();
            } else {
                stopTracking();
            }
        }
    }, [preferences.gpsBackup, loading, userId]);

    const fetchPreferences = async () => {
        if (!userId) return;
        try {
            const response = await locationService.getPreferences(userId);
            if (response.data) {
                setPreferences(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.log("Error fetching preferences:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = async (key) => {
        if (!userId) return;
        const newPreferences = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPreferences);

        try {
            await locationService.updatePreferences({ userId: userId, preferences: newPreferences });
        } catch (error) {
            Alert.alert("Error", "Failed to save preference.");
            setPreferences(preferences);
        }
    };

    const startTracking = async () => {
        stopTracking();
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Location tracking requires permission.");
            return;
        }
        // GPS Backup = 15 mins (900000ms)
        const intervalMs = 900000;
        updateLocation();
        trackingIntervalRef.current = setInterval(updateLocation, intervalMs);
    };

    const stopTracking = () => {
        if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
            trackingIntervalRef.current = null;
        }
    };

    const updateLocation = async () => {
        if (!userId) return;
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const currentBattery = batteryLevel || await Battery.getBatteryLevelAsync();
            const payload = {
                userId: userId,
                location: { lat: location.coords.latitude, lon: location.coords.longitude },
                riskScore: 10, // Mock risk score for now
                batteryLevel: currentBattery
            };
            await locationService.updateLocation(payload);
            setLastSynced(new Date());
        } catch (error) {
            console.log("Error syncing location:", error);
        }
    };

    const getStatusText = () => {
        if (preferences.gpsBackup) return 'GPS Backup: Active (15m Sync)';
        return 'Tracking: Offline';
    };

    const shareOfflineLocation = async () => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required.");
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            if (!location) {
                location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            }
            const { latitude, longitude } = location.coords;
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            const message = `I am sharing my offline location. Track me here: ${mapUrl}`;
            
            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                await SMS.sendSMSAsync([], message);
            } else {
                Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
            }
        } catch (error) {
            Alert.alert("Error", "Could not get location.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="map-marker-path" size={24} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Location Tracking</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.satelliteContainer}>
                        <MaterialCommunityIcons name="satellite-variant" size={100} color="#16a34a" />
                    </View>
                    <Text style={styles.heroTitle}>Last Known Location Tracking</Text>
                    {lastSynced && (
                        <Text style={styles.lastSynced}>Last Synced: {lastSynced.toLocaleTimeString()}</Text>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.featureList}>
                        <TrackingItem
                            icon="database-sync"
                            title="GPS Backup"
                            desc="Periodic GPS location backup to backend server (Every 15 mins)"
                            onPress={() => navigation.navigate('GPSBackup')}
                        />

                         <TrackingItem
                            icon="message-flash"
                            title="SMS Offline Location"
                            desc="Send coordinates via standard SMS (Direct to Messenger)"
                            onPress={shareOfflineLocation}
                        />
                        <TrackingItem
                            icon="compass-outline"
                            title="Offline Breadcrumbs & Compass"
                            desc="Log your path locally and navigate to safety without internet"
                            onPress={() => navigation.navigate('Breadcrumbs')}
                        />
                    </View>
                )}

                {/* Status Bar */}
                <View style={styles.statusBar}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function TrackingItem({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#16a34a" />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94a3b8" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e8f5e9', // Light green theme as per screenshot
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: '#e8f5e9',
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    hero: {
        alignItems: 'center',
        marginBottom: 30,
    },
    satelliteContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#16a34a',
        marginTop: 10,
        textAlign: 'center',
    },
    lastSynced: {
        fontSize: 12,
        color: '#16a34a',
        marginTop: 4,
        fontStyle: 'italic',
    },
    featureList: {
        width: '100%',
        gap: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        width: '100%',
    },
    iconBox: {
        padding: 10,
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 2,
    },
    itemDesc: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    statusBar: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#22c55e',
        marginRight: 12,
    },
    statusText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
});
