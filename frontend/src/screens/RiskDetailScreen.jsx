import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { riskService } from '../services/api';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RiskDetailScreen({ navigation }) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchData = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            let lat = 6.9271, lon = 79.8612; // Default

            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                lat = location.coords.latitude;
                lon = location.coords.longitude;
            }

            const response = await riskService.getRiskData(lat, lon);
            setData(response.data);
        } catch (err) {
            console.error(err);
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

    return (
        <DetailLayout 
            title="Flood Risk Visualization" 
            icon="water-outline" 
            color="#dbeafe" 
            navigation={navigation}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <Text style={styles.loadingText}>Fetching localized data...</Text>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.headerRow}>
                            <Text style={styles.lastUpdated}>
                                Last Updated: {new Date().toLocaleTimeString()}
                            </Text>
                            <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                                <MaterialCommunityIcons name="refresh" size={16} color="#1e3a8a" />
                                <Text style={styles.refreshText}>Refresh</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.scoreCard}>
                            <Text style={styles.scoreHeader}>Current Risk Score</Text>
                            <Text style={[styles.scoreValue, { color: risk?.color || '#333' }]}>{risk?.score || 0}</Text>
                            <Text style={[styles.statusLabel, { backgroundColor: risk?.color || '#999' }]}>{risk?.level || 'UNKNOWN'} RISK</Text>
                        </View>

                        <View style={styles.detailGrid}>
                            <WeatherItem label="Rainfall" value={`${weather?.rainfall || 0} mm`} icon="weather-pouring" />
                            <WeatherItem label="Temperature" value={`${weather?.temp || 0}°C`} icon="thermometer" />
                            <WeatherItem label="Water Level" value={`${weather?.waterLevel || 0} m`} icon="waves" />
                            <WeatherItem label="Storm Intensity" value={`${weather?.stormIntensity || 0}%`} icon="weather-lightning" />
                            <WeatherItem label="Humidity" value={`${weather?.humidity || 0}%`} icon="water-percent" />
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoTitle}>Sri Lankan Risk Equation:</Text>
                            <Text style={styles.infoText}>Risk = (Rainfall × 0.5) + (Storm × 0.3) + (Humidity × 0.2)</Text>
                            <View style={styles.divider} />
                            <Text style={styles.infoTitle}>Risk Level Thresholds:</Text>
                            <Text style={styles.infoText}>• 0-30: LOW (Green)</Text>
                            <Text style={styles.infoText}>• 31-55: MODERATE (Yellow)</Text>
                            <Text style={styles.infoText}>• 56-80: HIGH (Orange)</Text>
                            <Text style={styles.infoText}>• &gt;80: SEVERE (Red)</Text>
                            <View style={styles.divider} />
                            <Text style={[styles.infoText, { fontWeight: 'bold', color: '#b91c1c' }]}>
                                Note: If water level exceeds 2.0m, the risk is automatically set to SEVERE regardless of the score.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </DetailLayout>
    );
}

function WeatherItem({ label, value, icon }) {
    return (
        <View style={styles.gridItem}>
            <MaterialCommunityIcons name={icon} size={24} color="#1e3a8a" />
            <Text style={styles.itemLabel}>{label}</Text>
            <Text style={styles.itemValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { gap: 20, paddingBottom: 20 },
    loadingText: { textAlign: 'center', marginTop: 20, color: '#666' },
    
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
    lastUpdated: { fontSize: 12, color: '#94a3b8' },
    refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
    refreshText: { fontSize: 12, fontWeight: 'bold', color: '#1e3a8a' },

    scoreCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 4,
    },
    scoreHeader: {
        fontSize: 16,
        color: '#64748b',
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    statusLabel: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 20,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    itemLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    infoBox: {
        backgroundColor: 'rgba(30, 58, 138, 0.05)',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#1e3a8a',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        marginVertical: 10,
    },
});
