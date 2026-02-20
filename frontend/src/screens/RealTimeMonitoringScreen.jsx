import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Linking, Modal, FlatList } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService, familyService, guideService, riskService } from '../services/api';

const { width } = Dimensions.get('window');

// Mock Data for "Real Data" simulation until expanded backend
const MOCK_WATER_LEVELS = [
    { id: 1, name: "City River", level: 8.5, danger: 10, unit: "m", lat: 6.935, lon: 79.855 },
    { id: 2, name: "North Dam", level: 42, danger: 50, unit: "%", lat: 6.945, lon: 79.865 },
    { id: 3, name: "East Canal", level: 2.1, danger: 3.5, unit: "m", lat: 6.925, lon: 79.875 }
];

export default function RealTimeMonitoringScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [heatmapEnabled, setHeatmapEnabled] = useState(true);
    const [showFamilyModal, setShowFamilyModal] = useState(false);

    useEffect(() => {
        // Fetch user's latest location to center map
        const fetchData = async () => {
            try {
                // Hardcoded ID for demo, ideally from auth context
                const userId = "test_user_123";
                
                // 1. Get Location
                const locResponse = await locationService.getLatestLocation(userId);
                let userLoc = { lat: 6.9271, lon: 79.8612 }; // Default (Colombo)
                
                if (locResponse.data && locResponse.data.location) {
                    userLoc = locResponse.data.location;
                }
                setLocation(userLoc);

                // 2. Get Family Locations
                const famResponse = await familyService.getFamilyRisk(userId);
                setFamilyMembers(famResponse.data || []);

                // 3. Get Weather Forecast (Rainfall)
                const riskResponse = await riskService.getRiskData(userLoc.lat, userLoc.lon);
                if (riskResponse.data && riskResponse.data.weather && riskResponse.data.weather.forecast) {
                    setWeatherForecast(riskResponse.data.weather.forecast);
                }

            } catch (e) {
                console.log("Fetch error", e);
                // Fallback location
                setLocation({ lat: 6.9271, lon: 79.8612 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNavigateToShelter = async () => {
        if (!location) return;
        try {
            const response = await guideService.getShelters(location.lat, location.lon);
            const shelters = response.data;
            if (shelters && shelters.length > 0) {
                // Sort by distance (simple calc)
                const nearest = shelters.sort((a, b) => {
                    const distA = Math.hypot(a.lat - location.lat, a.lon - location.lon);
                    const distB = Math.hypot(b.lat - location.lat, b.lon - location.lon);
                    return distA - distB;
                })[0];
                
                const url = `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}&travelmode=driving`;
                Linking.openURL(url);
            } else {
                alert("No shelters found nearby.");
            }
        } catch (error) {
            console.log("Nav error", error);
            alert("Failed to find shelters.");
        }
    };

    const handleNavigateToFamily = (member) => {
        if (!member.location) {
            alert("Member location unknown.");
            return;
        }
        const url = `https://www.google.com/maps/dir/?api=1&destination=${member.location.lat},${member.location.lon}&travelmode=driving`;
        Linking.openURL(url);
        setShowFamilyModal(false);
    };

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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={styles.sectionTitle}>⚠️ Flood Risk Heatmap</Text>
                        <TouchableOpacity onPress={() => setHeatmapEnabled(!heatmapEnabled)}>
                             <MaterialCommunityIcons name={heatmapEnabled ? "eye" : "eye-off"} size={24} color="#0c4a6e" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            initialRegion={{
                                latitude: location.lat,
                                longitude: location.lon,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker coordinate={{ latitude: location.lat, longitude: location.lon }} title="You">
                                <View style={[styles.markerBase, { backgroundColor: '#3b82f6' }]}>
                                    <MaterialCommunityIcons name="account" size={16} color="white" />
                                </View>
                            </Marker>

                            {/* Family Markers */}
                            {familyMembers.map(member => (
                                member.location && (
                                    <Marker 
                                        key={member.memberId}
                                        coordinate={{ latitude: member.location.lat, longitude: member.location.lon }}
                                        title={member.memberName}
                                        description={`Risk: ${member.risk?.level || 'Unknown'}`}
                                    >
                                        <View style={[styles.markerBase, { backgroundColor: member.risk?.color || '#94a3b8' }]}>
                                            <MaterialCommunityIcons name="account-group" size={16} color="white" />
                                        </View>
                                    </Marker>
                                )
                            ))}

                            {/* Water Level Markers */}
                            {MOCK_WATER_LEVELS.map(wl => (
                                <Marker 
                                    key={`wl-${wl.id}`}
                                    coordinate={{ latitude: wl.lat, longitude: wl.lon }}
                                    title={wl.name}
                                    description={`Level: ${wl.level}${wl.unit}`}
                                >
                                    <View style={[styles.markerBase, { backgroundColor: '#06b6d4', borderRadius: 4 }]}>
                                        <MaterialCommunityIcons name="waves" size={16} color="white" />
                                    </View>
                                </Marker>
                            ))}

                            {/* Heatmap Overlay */}
                            {heatmapEnabled && (
                                <>
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
                                </>
                            )}
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
                    <Text style={styles.sectionTitle}>🌧️ Rainfall Prediction (Next Days)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weatherScroll}>
                        {weatherForecast.length > 0 ? (
                            weatherForecast.map((rain, index) => (
                                <View key={index} style={styles.weatherCard}>
                                    <Text style={styles.wTime}>Day {index + 1}</Text>
                                    <MaterialCommunityIcons 
                                        name={rain > 10 ? "weather-pouring" : rain > 0 ? "weather-rainy" : "weather-cloudy"} 
                                        size={32} 
                                        color="#0ea5e9" 
                                    />
                                    <Text style={styles.wAmount}>{rain}mm</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ fontStyle: 'italic', color: '#666' }}>Loading forecast...</Text>
                        )}
                    </ScrollView>
                </View>

                {/* 4. Safe Route Navigation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧭 Safe Route Navigation</Text>
                    <TouchableOpacity style={styles.routeBtn} onPress={handleNavigateToShelter}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.routeTitle}>Nearest Relief Center</Text>
                            <Text style={styles.routeSubtitle}>Tap to navigate via Google Maps</Text>
                        </View>
                        <MaterialCommunityIcons name="navigation" size={28} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.routeBtn, { backgroundColor: '#0ea5e9', marginTop: 10 }]}
                        onPress={() => setShowFamilyModal(true)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.routeTitle}>Navigate to Family Member</Text>
                            <Text style={styles.routeSubtitle}>Select a member to find safest path</Text>
                        </View>
                        <MaterialCommunityIcons name="account-search" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Family Selection Modal */}
            <Modal visible={showFamilyModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Family Member</Text>
                        <FlatList
                            data={familyMembers}
                            keyExtractor={item => item.memberId}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.modalItem}
                                    onPress={() => handleNavigateToFamily(item)}
                                >
                                    <MaterialCommunityIcons name="account" size={24} color="#0ea5e9" />
                                    <Text style={styles.modalItemText}>{item.memberName}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowFamilyModal(false)}>
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 12, paddingHorizontal: 4 },

    mapContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#bae6fd' },
    map: { width: '100%', height: 300 },
    legend: {
        flexDirection: 'row', justifyContent: 'space-around', padding: 8, backgroundColor: '#fff',
        borderTopWidth: 1, borderTopColor: '#e0f2fe'
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 12, fontWeight: 'bold', color: '#334155' },

    markerBase: {
        padding: 6, borderRadius: 12, borderWidth: 2, borderColor: 'white', elevation: 3
    },

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
    routeSubtitle: { fontSize: 12, color: '#dcfce7' },

    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20
    },
    modalContent: {
        backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: '60%'
    },
    modalTitle: {
        fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#0f172a'
    },
    modalItem: {
        flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12
    },
    modalItemText: {
        fontSize: 16, color: '#334155', fontWeight: '500'
    },
    modalCloseBtn: {
        marginTop: 16, padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, alignItems: 'center'
    },
    modalCloseText: {
        color: '#64748b', fontWeight: 'bold'
    }
});
