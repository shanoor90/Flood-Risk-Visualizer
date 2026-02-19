import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService } from '../services/api';

const { width } = Dimensions.get('window');

// Mock Data for "Real Data" simulation until expanded backend
const MOCK_WATER_LEVELS = [
    { id: 1, name: "City River", level: 8.5, danger: 10, unit: "m" },
    { id: 2, name: "North Dam", level: 42, danger: 50, unit: "%" },
    { id: 3, name: "East Canal", level: 2.1, danger: 3.5, unit: "m" }
];

const MOCK_RAINFALL = [
    { time: "Now", amount: "Light", icon: "weather-partly-rainy" },
    { time: "+1h", amount: "Heavy", icon: "weather-pouring" },
    { time: "+3h", amount: "Mod", icon: "weather-rainy" },
    { time: "+6h", amount: "Clear", icon: "weather-cloudy" }
];

export default function RealTimeMonitoringScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user's latest location to center map
        const fetchLoc = async () => {
            try {
                // Hardcoded ID for demo, ideally from auth context
                const response = await locationService.getLatestLocation("test_user_123");
                if (response.data && response.data.location) {
                    setLocation(response.data.location);
                } else {
                    // Default fallback: Colombo
                    setLocation({ lat: 6.9271, lon: 79.8612 });
                }
            } catch (e) {
                console.log("Loc error", e);
                setLocation({ lat: 6.9271, lon: 79.8612 });
            } finally {
                setLoading(false);
            }
        };
        fetchLoc();
    }, []);

    const renderWaterGauge = (item) => {
        const percentage = (item.level / item.danger) * 100;
        let color = '#22c55e';
        if (percentage > 80) color = '#ef4444';
        else if (percentage > 50) color = '#f59e0b';

        return (
            <View key={item.id} style={styles.gaugeContainer}>
                <View style={styles.gaugeHeader}>
                    <Text style={styles.gaugeName}>{item.name}</Text>
                    <Text style={styles.gaugeValue}>{item.level} / {item.danger} {item.unit}</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBar, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
                </View>
            </View>
        );
    };

    if (loading || !location) {
        return (
            <DetailLayout title="Real-Time Monitor" icon="monitor-dashboard" color="#e0f2fe" navigation={navigation}>
                <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 50 }} />
            </DetailLayout>
        );
    }

    return (
        <DetailLayout
            title="Real-Time Monitor"
            icon="monitor-dashboard"
            color="#e0f2fe"
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                {/* 1. Interactive Flood Heatmap */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Flood Risk Heatmap</Text>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: location.lat,
                                longitude: location.lon,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker coordinate={{ latitude: location.lat, longitude: location.lon }} title="You are here" />

                            {/* Simulated Risk Zones */}
                            <Circle
                                center={{ latitude: location.lat + 0.01, longitude: location.lon + 0.01 }}
                                radius={1000}
                                fillColor="rgba(239, 68, 68, 0.4)"
                                strokeColor="rgba(239, 68, 68, 0.8)"
                            />
                            <Circle
                                center={{ latitude: location.lat - 0.015, longitude: location.lon - 0.005 }}
                                radius={1500}
                                fillColor="rgba(245, 158, 11, 0.4)"
                                strokeColor="rgba(245, 158, 11, 0.8)"
                            />
                        </MapView>
                        <View style={styles.legend}>
                            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#ef4444' }]} /><Text style={styles.legendText}>Severe</Text></View>
                            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#f59e0b' }]} /><Text style={styles.legendText}>Moderate</Text></View>
                            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#3b82f6' }]} /><Text style={styles.legendText}>Safe</Text></View>
                        </View>
                    </View>
                </View>

                {/* 2. Live Water Level Gauges */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🌊 Live Water Levels</Text>
                    <View style={styles.card}>
                        {MOCK_WATER_LEVELS.map(renderWaterGauge)}
                    </View>
                </View>

                {/* 3. Rainfall Prediction Widget */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🌧️ Rainfall Prediction (Next 6h)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weatherScroll}>
                        {MOCK_RAINFALL.map((w, index) => (
                            <View key={index} style={styles.weatherCard}>
                                <Text style={styles.wTime}>{w.time}</Text>
                                <MaterialCommunityIcons name={w.icon} size={32} color="#0ea5e9" />
                                <Text style={styles.wAmount}>{w.amount}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* 4. Safe Route Navigation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧭 Safe Route Navigation</Text>
                    <TouchableOpacity style={styles.routeBtn}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.routeTitle}>Nearest Relief Center</Text>
                            <Text style={styles.routeSubtitle}>Via High Ground (4.2 km)</Text>
                        </View>
                        <MaterialCommunityIcons name="navigation" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.routeBtn, { backgroundColor: '#0ea5e9', marginTop: 10 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.routeTitle}>Navigate to Family Member</Text>
                            <Text style={styles.routeSubtitle}>Select a member to find safest path</Text>
                        </View>
                        <MaterialCommunityIcons name="account-search" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 12, paddingHorizontal: 4 },

    mapContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#bae6fd' },
    map: { width: '100%', height: 250 },
    legend: {
        flexDirection: 'row', justifyContent: 'space-around', padding: 8, backgroundColor: '#fff',
        borderTopWidth: 1, borderTopColor: '#e0f2fe'
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },

    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    gaugeContainer: { marginBottom: 16 },
    gaugeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    gaugeName: { fontSize: 14, fontWeight: '600', color: '#334155' },
    gaugeValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
    progressBarBg: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: 5 },

    weatherScroll: { flexDirection: 'row' },
    weatherCard: {
        alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12,
        marginRight: 10, width: 80, borderWidth: 1, borderColor: '#e0f2fe'
    },
    wTime: { fontSize: 13, fontWeight: 'bold', color: '#64748b', marginBottom: 4 },
    wAmount: { fontSize: 12, fontWeight: '600', color: '#0284c7', marginTop: 4 },

    routeBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e',
        padding: 16, borderRadius: 12, elevation: 2
    },
    routeTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    routeSubtitle: { fontSize: 12, color: '#dcfce7' }
});
