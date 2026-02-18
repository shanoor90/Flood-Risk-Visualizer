import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService } from '../services/api';

const USER_ID = "test_user_123";

export default function TemporalRecordingScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await locationService.getHistory(USER_ID);
            setHistory(response.data || []);
        } catch (error) {
            console.log("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyLeft}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#0284c7" />
                <View>
                    <Text style={styles.historyTime}>
                        {new Date(item.timestamp).toLocaleString()}
                    </Text>
                    <Text style={styles.historyCoords}>
                        Lat: {item.location?.lat?.toFixed(4)}, Lon: {item.location?.lon?.toFixed(4)}
                    </Text>
                </View>
            </View>
            <MaterialCommunityIcons name="map-marker-check" size={18} color="#16a34a" />
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.hero}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="history" size={60} color="#0284c7" />
                </View>
                <Text style={styles.heroTitle}>Timeline Analysis</Text>
                <Text style={styles.statusText}>
                    Status: ACTIVE (Recording Timestamps)
                </Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionHeader}>About Temporal Recording</Text>
                <Text style={styles.introText}>
                    Each recorded location is timestamped to support chronological tracking and flood impact analysis.
                </Text>

                <View style={styles.bulletList}>
                    <InfoItem 
                        icon="timeline-clock-outline" 
                        title="Movement Reconstruction" 
                        desc="Reconstruction of movement timelines during emergencies." 
                    />
                    <InfoItem 
                        icon="alert-remove-outline" 
                        title="Delay Identification" 
                        desc="Identification of delay patterns in evacuation." 
                    />
                    <InfoItem 
                        icon="city-variant-outline" 
                        title="Urban Planning" 
                        desc="Post-disaster data analytics for urban flood planning." 
                    />
                    <InfoItem 
                        icon="chart-bell-curve-cumulative" 
                        title="Risk Correlation" 
                        desc="Correlation between user movement and flood severity levels." 
                    />
                </View>
                
                <Text style={styles.footerText}>
                    Temporal data supports both immediate response decisions and long-term flood risk research.
                </Text>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Recent Movements</Text>
        </View>
    );

    return (
        <DetailLayout 
            title="Temporal Recording" 
            icon="clock-time-eight-outline" 
            color="#e0f2fe" 
            navigation={navigation}
        >
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item.id || Math.random().toString()}
                        renderItem={renderItem}
                        ListHeaderComponent={renderHeader}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No location history recorded yet.</Text>
                        }
                    />
                )}
            </View>
        </DetailLayout>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={24} color="#0369a1" />
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { marginBottom: 16 },
    hero: { alignItems: 'center', marginVertical: 10 },
    iconContainer: { 
        width: 100, height: 100, borderRadius: 50, 
        backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#0c4a6e' },
    statusText: { fontSize: 14, color: '#0284c7', marginTop: 4, fontWeight: 'bold' },

    infoSection: { gap: 12, marginTop: 10 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#0c4a6e' },
    introText: { fontSize: 14, color: '#44403c', lineHeight: 22 },
    bulletList: { gap: 12, marginVertical: 8 },
    footerText: { fontSize: 14, color: '#0c4a6e', fontStyle: 'italic', fontWeight: '500', marginTop: 8 },

    emptyText: { textAlign: 'center', color: '#64748b', marginTop: 20, fontStyle: 'italic' },

    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#38bdf8',
        elevation: 1,
        marginBottom: 8
    },
    historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    historyTime: { fontSize: 14, fontWeight: 'bold', color: '#0c4a6e' },
    historyCoords: { fontSize: 12, color: '#64748b' },

    item: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#bae6fd',
    },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 2 },
    itemDesc: { fontSize: 13, color: '#44403c', lineHeight: 18 },
});
