import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator, AppState } from 'react-native';
import DetailLayout from '../components/DetailLayout';
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
    
    // Refs to manage intervals without re-triggering effects excessively
    const trackingIntervalRef = useRef(null);

    useEffect(() => {
        fetchPreferences();
        return () => stopTracking(); // Cleanup on unmount
    }, []);

    // Effect to manage tracking based on preferences
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
                // Merge with defaults to ensure all keys exist
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
        setPreferences(newPreferences); // Optimistic update

        try {
            await locationService.updatePreferences({ userId: USER_ID, preferences: newPreferences });
        } catch (error) {
            Alert.alert("Error", "Failed to save preference. Please try again.");
            setPreferences(preferences); // Revert on failure
        }
    };

    const startTracking = async () => {
        // 1. Stop existing to reset
        stopTracking();

        // 2. Request Permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Location tracking requires permission.");
            setPreferences(prev => ({ ...prev, activeTracking: false }));
            return;
        }

        // 3. Determine Interval
        // Normal: 15 mins (900000ms), High Risk: 1 min (60000ms) for demo/emergency
        const intervalMs = preferences.highRiskFrequency ? 60000 : 900000; 

        console.log(`Starting tracking... Interval: ${intervalMs}ms`);

        // 4. Initial immediate update
        updateLocation();

        // 5. Start Loop
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
                location: {
                    lat: location.coords.latitude,
                    lon: location.coords.longitude
                },
                riskScore: 0 // Ideally fetched from risk service
            };

            await locationService.updateLocation(payload);
            setLastSynced(new Date());
            console.log("Location synced:", payload.location);
        } catch (error) {
            console.log("Error syncing location:", error);
        }
    };

    const getStatusText = () => {
        if (!preferences.activeTracking) return 'Offline';
        const interval = preferences.highRiskFrequency ? '1m' : '15m';
        const riskLabel = preferences.highRiskFrequency ? ' - HIGH RISK' : '';
        return `Online (${interval} Interval${riskLabel})`;
    };

    return (
        <DetailLayout 
            title="Location Tracking" 
            icon="map-marker-path" 
            color="#dcfce7" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.heroSection}>
                    <MaterialCommunityIcons 
                        name={preferences.activeTracking ? "satellite-uplink" : "satellite-variant"} 
                        size={80} 
                        color={preferences.activeTracking ? "#16a34a" : "#94a3b8"} 
                    />
                    <Text style={styles.heroTitle}>Last Known Location Tracking</Text>
                    {lastSynced && (
                        <Text style={styles.lastSynced}>Last Synced: {lastSynced.toLocaleTimeString()}</Text>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#16a34a" />
                ) : (
                    <View style={styles.featureList}>
                        <TrackingItem 
                            icon="database-sync" 
                            title="GPS Backup" 
                            desc="Periodic GPS location backup to backend server"
                            active={preferences.gpsBackup}
                            onToggle={() => togglePreference('gpsBackup')}
                            onPress={() => navigation.navigate('GPSBackup')}
                        />
                        <TrackingItem 
                            icon="alert-decagram" 
                            title="High-Risk Frequency" 
                            desc="Increases update frequency to 1 min during emergencies"
                            active={preferences.highRiskFrequency}
                            onToggle={() => togglePreference('highRiskFrequency')}
                            onPress={() => navigation.navigate('HighRisk')}
                        />
                        <TrackingItem 
                            icon="history" 
                            title="Temporal Recording" 
                            desc="Timestamp recording for temporal analysis"
                            active={preferences.temporalRecording}
                            onToggle={() => togglePreference('temporalRecording')}
                            onPress={() => navigation.navigate('TemporalRecording')}
                        />
                        <TrackingItem 
                            icon="account-group-outline" 
                            title="Family Access" 
                            desc="Family access to location history if contact is lost"
                            active={preferences.familyAccess}
                            onToggle={() => togglePreference('familyAccess')}
                            onPress={() => navigation.navigate('FamilyAccess')}
                        />
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.statusBox}
                    onPress={() => navigation.navigate('ActiveTracking')}
                    activeOpacity={0.8}
                >
                    <View style={styles.statusInfo}>
                        <View style={[
                            styles.statusIndicator, 
                            { backgroundColor: preferences.activeTracking ? '#16a34a' : '#ef4444' }
                        ]} />
                        <View>
                            <Text style={styles.statusLabel}>Active Tracking</Text>
                            <Text style={styles.statusText}>{getStatusText()}</Text>
                        </View>
                    </View>
                    <Switch 
                        value={preferences.activeTracking}
                        onValueChange={() => togglePreference('activeTracking')}
                        trackColor={{ false: "#767577", true: "#dcfce7" }}
                        thumbColor={preferences.activeTracking ? "#16a34a" : "#f4f3f4"}
                    />
                </TouchableOpacity>
            </View>
        </DetailLayout>
    );
}

function TrackingItem({ icon, title, desc, active, onToggle, onPress }) {
    return (
        <TouchableOpacity style={[styles.item, active && styles.itemActive]} onPress={onPress || onToggle}>
            <MaterialCommunityIcons name={icon} size={28} color={active ? "#16a34a" : "#94a3b8"} />
            <View style={styles.textWrap}>
                <Text style={[styles.itemTitle, active && styles.textActive]}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
            <Switch 
                value={active}
                onValueChange={onToggle}
                trackColor={{ false: "#e2e8f0", true: "#dcfce7" }}
                thumbColor={active ? "#16a34a" : "#f4f3f4"}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24 },
    heroSection: { alignItems: 'center', paddingVertical: 10 },
    heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#16a34a', marginTop: 10 },
    featureList: { gap: 15 },
    item: { 
        flexDirection: 'row', 
        gap: 15, 
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    itemActive: {
        borderColor: '#16a34a',
        backgroundColor: '#f0fdf4'
    },
    textWrap: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748b' },
    textActive: { color: '#16a34a' },
    itemDesc: { fontSize: 13, color: '#94a3b8', lineHeight: 18 },
    lastSynced: { fontSize: 12, color: '#16a34a', marginTop: 4, fontStyle: 'italic' },
    statusBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusIndicator: { width: 12, height: 12, borderRadius: 6 },
    statusLabel: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },
    statusText: { fontSize: 14, color: '#1e3a8a', fontWeight: 'bold' },
});
