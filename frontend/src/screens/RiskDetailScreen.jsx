import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { riskService } from '../services/api';

export default function RiskDetailScreen({ navigation }) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchData = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            let lat = 6.9271, lon = 79.8612; // Default (Colombo)

            if (status === 'granted') {
                let location = await Location.getLastKnownPositionAsync({});
                if (!location) {
                    location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                }
                lat = location.coords.latitude;
                lon = location.coords.longitude;
            }

            const response = await riskService.getRiskData(lat, lon);
            console.log("Risk Data Response:", response.data);
            setData(response.data);
        } catch (err) {
            console.error("Risk Fetch Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const weather = data?.weather;
    const risk = data?.risk;

    // Helper to get color based on level
    const getRiskColor = (level) => {
        switch(level?.toUpperCase()) {
            case 'SEVERE': return '#ef4444'; // Red
            case 'HIGH': return '#f97316';   // Orange
            case 'MODERATE': return '#eab308'; // Yellow
            case 'LOW': return '#22c55e';    // Green
            default: return '#64748b';
        }
    };

    const riskColor = getRiskColor(risk?.level);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Custom Header matching screenshot */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="water-outline" size={24} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Flood Risk Visualization</Text>
                </View>
                <View style={{ width: 40 }} /> 
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Calculating risk stats...</Text>
                    </View>
                ) : (
                    <View style={styles.container}>
                        
                        {/* 🟢 Current Risk Score Card */}
                        <View style={styles.scoreCard}>
                            <Text style={styles.scoreHeader}>Current Risk Score</Text>
                            <Text style={[styles.scoreValue, { color: riskColor }]}>
                                {risk?.score || '0.00'}
                            </Text>
                            <View style={[styles.statusBadge, { backgroundColor: riskColor }]}>
                                <Text style={styles.statusLabel}>{risk?.level || 'UNKNOWN'} RISK</Text>
                            </View>
                        </View>

                        {/* 📊 Details Grid */}
                        <View style={styles.detailGrid}>
                            <WeatherItem 
                                label="Rainfall" 
                                value={`${weather?.rainfall || 0} mm`} 
                                icon="weather-pouring" 
                            />
                            <WeatherItem 
                                label="Temperature" 
                                value={`${weather?.temp || 0.0}°C`} 
                                icon="thermometer" 
                            />
                            <WeatherItem 
                                label="Water Level" 
                                value={`${weather?.waterLevel || 0.0} m`} 
                                icon="waves" 
                            />
                            <WeatherItem 
                                label="Storm Intensity" 
                                value={`${weather?.stormIntensity || 0}%`} 
                                icon="weather-lightning" 
                            />
                            <WeatherItem 
                                label="Humidity" 
                                value={`${weather?.humidity || 0}%`} 
                                icon="water-percent" 
                            />
                        </View>

                        {/* 📝 Risk Level Info */}
                        <View style={styles.infoBox}>
                            <Text style={styles.infoTitle}>Risk Level Thresholds:</Text>
                            
                            <View style={styles.thresholdRow}>
                                <View style={[styles.highlightBadge, { backgroundColor: '#22c55e' }]}>
                                    <Text style={styles.highlightText}>LOW</Text>
                                </View>
                            </View>
                            
                            <View style={styles.thresholdRow}>
                                <View style={[styles.highlightBadge, { backgroundColor: '#eab308' }]}>
                                    <Text style={styles.highlightText}>MODERATE</Text>
                                </View>
                            </View>
                            
                            <View style={styles.thresholdRow}>
                                <View style={[styles.highlightBadge, { backgroundColor: '#f97316' }]}>
                                    <Text style={styles.highlightText}>HIGH</Text>
                                </View>
                            </View>
                            
                            <View style={styles.thresholdRow}>
                                <View style={[styles.highlightBadge, { backgroundColor: '#ef4444' }]}>
                                    <Text style={styles.highlightText}>SEVERE</Text>
                                </View>
                            </View>
                            
                            <View style={styles.divider} />
                            
                            <Text style={styles.noteText}>
                                <Text style={{ fontWeight: 'bold' }}>Note:</Text> If water level exceeds 2.0m, the risk is automatically set to SEVERE regardless of the score.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function WeatherItem({ label, value, icon }) {
    return (
        <View style={styles.gridItem}>
            <MaterialCommunityIcons name={icon} size={28} color="#1e3a8a" />
            <Text style={styles.itemLabel}>{label}</Text>
            <Text style={styles.itemValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // Light slate background
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
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
    scrollContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    container: {
        gap: 16,
    },
    loadingContainer: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#64748b',
    },
    scoreCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    scoreHeader: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: 'bold',
        marginVertical: 12,
        letterSpacing: -1,
    },
    statusBadge: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 30,
    },
    statusLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    detailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    gridItem: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    itemLabel: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 8,
        marginBottom: 2,
    },
    itemValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    infoBox: {
        backgroundColor: '#f1f5f9', // Very light blue/slate
        padding: 20,
        borderRadius: 20,
        marginTop: 8,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    formulaText: {
        fontSize: 14,
        color: '#475569',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    thresholdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    thresholdText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
    highlightBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 4,
    },
    highlightText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    noteText: {
        fontSize: 13,
        color: '#991b1b', // Dark red for note
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 12,
    },
});
