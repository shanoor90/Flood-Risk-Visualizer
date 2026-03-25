import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Alert, SafeAreaView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const BREADCRUMBS_KEY = 'offline_breadcrumbs_trail';
const SAFE_LOCATION_KEY = 'offline_safe_location';

// Helper to calculate bearing between two coordinates
function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = deg => (deg * Math.PI) / 180;
    const toDeg = rad => (rad * 180) / Math.PI;
    const l1 = toRad(lat1), l2 = toRad(lat2);
    const dl = toRad(lon2 - lon1);
    const y = Math.sin(dl) * Math.cos(l2);
    const x = Math.cos(l1) * Math.sin(l2) - Math.sin(l1) * Math.cos(l2) * Math.cos(dl);
    let brng = Math.atan2(y, x);
    return (toDeg(brng) + 360) % 360;
}

export default function BreadcrumbScreen({ navigation }) {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [safeLocation, setSafeLocation] = useState(null);
    const [compassMode, setCompassMode] = useState(false);
    
    // Compass state
    const [heading, setHeading] = useState(0);
    const [currentPos, setCurrentPos] = useState(null);
    const [bearingToSafe, setBearingToSafe] = useState(0);
    const mapRef = useRef(null);
    let headingSub = useRef(null);

    useEffect(() => {
        loadData();
        setupLocationTracking();
        return () => {
            if (headingSub.current) headingSub.current.remove();
        };
    }, []);

    const loadData = async () => {
        try {
            const crumbsStr = await AsyncStorage.getItem(BREADCRUMBS_KEY);
            const safeLocStr = await AsyncStorage.getItem(SAFE_LOCATION_KEY);
            
            if (crumbsStr) {
                let parsedCrumbs = JSON.parse(crumbsStr);
                // Filter to last 4 hours
                const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
                parsedCrumbs = parsedCrumbs.filter(c => c.timestamp > fourHoursAgo);
                setBreadcrumbs(parsedCrumbs);
                await AsyncStorage.setItem(BREADCRUMBS_KEY, JSON.stringify(parsedCrumbs));
            }
            if (safeLocStr) {
                setSafeLocation(JSON.parse(safeLocStr));
            }
        } catch (e) { console.log(e); }
    };

    const setupLocationTracking = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setCurrentPos({ lat: loc.coords.latitude, lon: loc.coords.longitude });

        // Compass orientation listener
        headingSub.current = await Location.watchHeadingAsync((data) => {
            setHeading(data.trueHeading !== -1 ? data.trueHeading : data.magHeading);
        });

        // "Auto-Drop" Breadcrumb every 30 mins simulation
        setInterval(() => dropBreadcrumb(), 30 * 60 * 1000);
    };

    useEffect(() => {
        if (currentPos && safeLocation) {
            const bearing = calculateBearing(currentPos.lat, currentPos.lon, safeLocation.lat, safeLocation.lon);
            setBearingToSafe(bearing);
        }
    }, [currentPos, safeLocation]);

    const dropBreadcrumb = async () => {
        try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const newCrumb = { lat: loc.coords.latitude, lon: loc.coords.longitude, timestamp: Date.now() };
            setCurrentPos({ lat: newCrumb.lat, lon: newCrumb.lon });
            
            const updated = [...breadcrumbs, newCrumb];
            setBreadcrumbs(updated);
            await AsyncStorage.setItem(BREADCRUMBS_KEY, JSON.stringify(updated));
            Alert.alert("Success", "Dropped a manual breadcrumb at your current location.");
        } catch (e) {
            Alert.alert("Error", "Could not get current location.");
        }
    };

    const pinSafeLocation = async () => {
        if (!currentPos) {
            Alert.alert("Wait", "Fetching GPS...");
            return;
        }
        try {
            setSafeLocation(currentPos);
            await AsyncStorage.setItem(SAFE_LOCATION_KEY, JSON.stringify(currentPos));
            Alert.alert("Pinned", "This spot is now your 'Safe Location'. In Compass Mode, the arrow will always point here.");
        } catch (e) { console.log(e); }
    };

    const runCompassMode = () => {
        if (!safeLocation) {
            Alert.alert("No Safe Location", "Pin a safe location first before entering compass mode!");
            return;
        }
        setCompassMode(!compassMode);
    };

    // The angle the arrow should rotate on the screen
    // It is the Bearing to Target minus Current Heading Face
    const pointerAngle = (bearingToSafe - heading + 360) % 360;

    if (compassMode) {
        return (
            <SafeAreaView style={styles.compassContainer}>
                <TouchableOpacity style={styles.exitCompassBtn} onPress={() => setCompassMode(false)}>
                    <MaterialCommunityIcons name="close" size={32} color="#fff" />
                    <Text style={styles.exitText}>Exit Compass</Text>
                </TouchableOpacity>

                <View style={styles.compassHeader}>
                    <Text style={styles.compassTitle}>EMERGENCY COMPASS</Text>
                    <Text style={styles.compassSub}>Follow the arrow to your Pinned Safe Location</Text>
                </View>

                <View style={styles.arrowContainer}>
                    <View style={[styles.arrowBox, { transform: [{ rotate: `${pointerAngle}deg` }] }]}>
                        <MaterialCommunityIcons name="navigation" size={180} color="#22c55e" />
                    </View>
                </View>

                <View style={styles.compassStats}>
                    <Text style={styles.statText}>Current Heading: {Math.round(heading)}°</Text>
                    <Text style={styles.statText}>Safe Point Bearing: {Math.round(bearingToSafe)}°</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Breadcrumb Trail</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.mapWrapper}>
                {currentPos ? (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: currentPos.lat,
                            longitude: currentPos.lon,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.015,
                        }}
                    >
                        <Marker coordinate={{ latitude: currentPos.lat, longitude: currentPos.lon }} title="You Are Here" pinColor="blue" />
                        
                        {safeLocation && (
                            <Marker coordinate={{ latitude: safeLocation.lat, longitude: safeLocation.lon }} title="Safe Location" pinColor="green" />
                        )}

                        {breadcrumbs.length > 0 && (
                            <Polyline
                                coordinates={breadcrumbs.map(c => ({ latitude: c.lat, longitude: c.lon }))}
                                strokeColor="#ef4444"
                                strokeWidth={4}
                                lineDashPattern={[10, 10]}
                            />
                        )}
                    </MapView>
                ) : (
                    <View style={styles.loadingMap}><Text>Waiting for GPS...</Text></View>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.controlsContainer}>
                <View style={styles.actionCard}>
                    <MaterialCommunityIcons name="map-marker-path" size={32} color="#ef4444" />
                    <View style={styles.actionText}>
                        <Text style={styles.actionTitle}>Manual Breadcrumb</Text>
                        <Text style={styles.actionDesc}>Log 1 point every 30 mins automatically, or tap here to drop instantly.</Text>
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={dropBreadcrumb}>
                        <Text style={styles.btnText}>Drop</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionCard}>
                    <MaterialCommunityIcons name="shield-home" size={32} color="#22c55e" />
                    <View style={styles.actionText}>
                        <Text style={styles.actionTitle}>Safe Location</Text>
                        <Text style={styles.actionDesc}>Pin your current spot as the safe zone for Compass mode.</Text>
                    </View>
                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#22c55e'}]} onPress={pinSafeLocation}>
                        <Text style={styles.btnText}>Pin</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.compassModeBtn} onPress={runCompassMode}>
                    <MaterialCommunityIcons name="compass" size={28} color="#fff" />
                    <Text style={styles.compassBtnText}>Enter High-Contrast Compass Mode</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
    
    mapWrapper: { height: '50%', width: '100%' },
    map: { ...StyleSheet.absoluteFillObject },
    loadingMap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0' },
    
    controlsContainer: { padding: 16, gap: 16 },
    actionCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', elevation: 2 },
    actionText: { flex: 1, marginHorizontal: 12 },
    actionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
    actionDesc: { fontSize: 12, color: '#64748b', marginTop: 4 },
    actionBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    
    compassModeBtn: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10, elevation: 4 },
    compassBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    // Compass Mode (Dark High-Contrast)
    compassContainer: { flex: 1, backgroundColor: '#000', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    exitCompassBtn: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    exitText: { color: '#fff', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },
    
    compassHeader: { alignItems: 'center', marginTop: 40 },
    compassTitle: { color: '#ef4444', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
    compassSub: { color: '#94a3b8', fontSize: 16, marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
    
    arrowContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    arrowBox: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center', borderRadius: 150, borderWidth: 4, borderColor: '#333' },
    
    compassStats: { padding: 30, backgroundColor: '#111', borderTopWidth: 1, borderColor: '#333' },
    statText: { color: '#fff', fontSize: 18, fontFamily: 'monospace', marginBottom: 10, textAlign: 'center' },
});
