import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService } from '../services/api';
import * as Location from 'expo-location';

// Mock User ID for now - in real app this comes from Auth Context
const USER_ID = "test_user_123"; 

export default function TrackingScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [lastSynced, setLastSynced] = useState(null);
    const [preferences, setPreferences] = useState({
        gpsBackup: false,
        highRiskFrequency: false,
        temporalRecording: false,
        familyAccess: false,
        activeTracking: true
    });
    
    const trackingIntervalRef = useRef(null);

    useEffect(() => {
        fetchPreferences();
        return () => stopTracking(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (!loading) {
            if (preferences.activeTracking) {
                startTracking();
            } else {
                stopTracking();
            }
        }
    }, [preferences.activeTracking, preferences.highRiskFrequency, loading]);

    const fetchPreferences = async () => {
        try {
            const response = await locationService.getPreferences(USER_ID);
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
        const newPreferences = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPreferences); 

        try {
            await locationService.updatePreferences({ userId: USER_ID, preferences: newPreferences });
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
            setPreferences(prev => ({ ...prev, activeTracking: false }));
            return;
        }
        const intervalMs = preferences.highRiskFrequency ? 60000 : 900000; 
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
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const payload = {
                userId: USER_ID,
                location: { lat: location.coords.latitude, lon: location.coords.longitude },
                riskScore: 0 
            };
            await locationService.updateLocation(payload);
            setLastSynced(new Date());
        } catch (error) {
            console.log("Error syncing location:", error);
        }
    };

    const getStatusText = () => {
        if (!preferences.activeTracking) return 'Offline';
        const interval = preferences.highRiskFrequency ? '1m' : '15m';
        return `Active Tracking: Online (${interval} Interval)`;
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
                            desc="Periodic GPS location backup to backend server"
                            active={preferences.gpsBackup}
                            onToggle={() => togglePreference('gpsBackup')}
                        />
                        <TrackingItem 
                            icon="help-circle-outline" 
                            title="High-Risk Frequency" 
                            desc="Increased tracking frequency during high-risk conditions"
                            active={preferences.highRiskFrequency}
                            onToggle={() => togglePreference('highRiskFrequency')}
                        />
                        <TrackingItem 
                            icon="history" 
                            title="Temporal Recording" 
                            desc="Timestamp recording for temporal analysis"
                            active={preferences.temporalRecording}
                            onToggle={() => togglePreference('temporalRecording')}
                        />
                        <TrackingItem 
                            icon="account-group-outline" 
                            title="Family Access" 
                            desc="Family access to location history if contact is lost"
                            active={preferences.familyAccess}
                            onToggle={() => togglePreference('familyAccess')}
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

function TrackingItem({ icon, title, desc, active, onToggle }) {
    return (
        <TouchableOpacity style={styles.item} onPress={onToggle}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#16a34a" />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
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
