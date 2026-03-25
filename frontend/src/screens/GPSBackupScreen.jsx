import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, SafeAreaView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService } from '../services/api';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { auth } from '../firebase'; 

export default function GPSBackupScreen({ navigation }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [duration, setDuration] = useState(15); // Default 15 mins
    const [history, setHistory] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    
    const userId = auth?.currentUser?.uid || "test_user_123";
    const mapRef = useRef(null);
    const trackingIntervalRef = useRef(null);

    // Initial Fetch Map History
    useEffect(() => {
        fetchHistoryAndLocation();
        return () => stopTracking(); // Cleanup on unmount
    }, []);

    const fetchHistoryAndLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setCurrentLocation(loc.coords);
            }
            
            // Get History
            const response = await locationService.getHistory(userId);
            if (response.data && response.data.length > 0) {
                 // Sort history so oldest is first for Polyline
                 const sortedData = response.data.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
                 setHistory(sortedData);
            }
        } catch (e) {
            console.error("Error fetching history", e);
        }
    };

    const startTracking = (intervalMinutes) => {
        setIsTracking(true);
        // Clear previous
        if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
        
        // Immediately trigger one backup
        triggerBackup();

        // Start interval
        const ms = intervalMinutes * 60 * 1000;
        trackingIntervalRef.current = setInterval(() => {
            triggerBackup();
        }, ms);
        Platform.OS === 'ios' ? null : Alert.alert("Backup Active", `GPS is now securely storing coordinates every ${intervalMinutes} minutes.`);
    };

    const stopTracking = () => {
        setIsTracking(false);
        if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
            trackingIntervalRef.current = null;
        }
    };

    const handleToggle = (val) => {
        setIsEnabled(val);
        if (val) {
            startTracking(duration);
        } else {
            stopTracking();
        }
    };

    const handleDurationSelect = (mins) => {
        setDuration(mins);
        if (isEnabled) {
            startTracking(mins);
        }
    };

    const triggerBackup = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const payload = {
                userId,
                location: {
                    lat: location.coords.latitude,
                    lon: location.coords.longitude
                },
                riskScore: 0,
                batteryLevel: 100,
                gpsStatus: "Backup Active"
            };

            await locationService.updateLocation(payload);
            
            // Refresh history on map
            fetchHistoryAndLocation();
        } catch (error) {
            console.error("Backup failed", error);
        }
    };

    // Prepare map points
    const mapCoords = history.filter(h => h.location && h.location.lat && h.location.lon).map(h => ({
        latitude: h.location.lat,
        longitude: h.location.lon
    }));

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="database-sync" size={24} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>GPS Backup</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* 1. Toggle Section */}
                <View style={styles.card}>
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleTextCol}>
                            <Text style={styles.cardTitle}>Enable GPS Backup</Text>
                            <Text style={styles.cardDesc}>Do you want to securely backup your location?</Text>
                        </View>
                        <Switch
                            value={isEnabled}
                            onValueChange={handleToggle}
                            trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                            thumbColor={isEnabled ? '#16a34a' : '#f8fafc'}
                        />
                    </View>
                </View>

                {/* 2. Duration Selection */}
                {isEnabled && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Backup Interval</Text>
                        <Text style={styles.cardDesc}>Select how often coordinates should be stored.</Text>
                        
                        <View style={styles.durationGrid}>
                            {[10, 15, 30, 60].map(mins => (
                                <TouchableOpacity 
                                    key={mins}
                                    style={[styles.durationBtn, duration === mins && styles.durationBtnActive]}
                                    onPress={() => handleDurationSelect(mins)}
                                >
                                    <Text style={[styles.durationTxt, duration === mins && styles.durationTxtActive]}>
                                        {mins === 60 ? '1 Hour' : `${mins} mins`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* 3. Map View */}
                <View style={[styles.card, styles.mapCard]}>
                    <Text style={styles.cardTitle}>Location Transformation Map</Text>
                    <Text style={styles.cardDesc}>View your historical backup path.</Text>
                    
                    <View style={styles.mapContainer}>
                        {(currentLocation || mapCoords.length > 0) ? (
                            <MapView
                                ref={mapRef}
                                style={styles.map}
                                initialRegion={{
                                    latitude: mapCoords.length > 0 ? mapCoords[mapCoords.length-1].latitude : (currentLocation?.latitude || 6.9271),
                                    longitude: mapCoords.length > 0 ? mapCoords[mapCoords.length-1].longitude : (currentLocation?.longitude || 79.8612),
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                }}
                            >
                                {mapCoords.length > 0 && (
                                    <>
                                        <Polyline 
                                            coordinates={mapCoords} 
                                            strokeColor="#3b82f6" 
                                            strokeWidth={4} 
                                        />
                                        {/* Start point */}
                                        <Marker coordinate={mapCoords[0]} pinColor="green" title="Start" />
                                        {/* Latest point */}
                                        <Marker coordinate={mapCoords[mapCoords.length - 1]} pinColor="red" title="Current" />
                                    </>
                                )}
                                {mapCoords.length === 0 && currentLocation && (
                                    <Marker 
                                        coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} 
                                        pinColor="red" 
                                        title="Current" 
                                    />
                                )}
                            </MapView>
                        ) : (
                            <View style={styles.mapLoading}>
                                <Text style={styles.mapLoadText}>Loading map data...</Text>
                            </View>
                        )}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backButton: { padding: 4 },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    headerIcon: { marginRight: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
    container: { padding: 16, paddingBottom: 40, gap: 16 },
    
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    cardDesc: { fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 18 },
    
    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    toggleTextCol: { flex: 1, paddingRight: 10 },
    
    durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
    durationBtn: { flexBasis: '48%', paddingVertical: 12, backgroundColor: '#f1f5f9', borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
    durationBtnActive: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
    durationTxt: { color: '#64748b', fontWeight: 'bold', fontSize: 14 },
    durationTxtActive: { color: '#2563eb' },
    
    mapCard: { padding: 12 },
    mapContainer: { height: 350, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e2e8f0' },
    map: { width: '100%', height: '100%' },
    mapLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mapLoadText: { color: '#64748b' }
});
