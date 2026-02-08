import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrackingScreen({ navigation }) {
    return (
        <DetailLayout 
            title="Location Tracking" 
            icon="map-marker-path" 
            color="#dcfce7" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.heroSection}>
                    <MaterialCommunityIcons name="satellite-variant" size={80} color="#16a34a" />
                    <Text style={styles.heroTitle}>Last Known Location Tracking</Text>
                </View>

                <View style={styles.featureList}>
                    <TrackingItem 
                        icon="database-sync" 
                        title="Periodic GPS Backup" 
                        desc="Your coordinates are periodically backed up to our secured backend server for recovery if communication is lost." 
                    />
                    <TrackingItem 
                        icon="timer-flash" 
                        title="Dynamic Frequency" 
                        desc="Tracking frequency automatically increases during high-risk conditions or triggered SOS events." 
                    />
                    <TrackingItem 
                        icon="history" 
                        title="Temporal Analysis" 
                        desc="Records detailed timestamps for all location logs, enabling path recovery and temporal analysis." 
                    />
                    <TrackingItem 
                        icon="account-group-outline" 
                        title="Family Oversight" 
                        desc="Designated safety contacts can access your last known location history if contact is lost." 
                    />
                </View>

                <View style={styles.statusBox}>
                    <View style={styles.statusIndicator} />
                    <Text style={styles.statusText}>Active Tracking: Online (15m Interval)</Text>
                </View>
            </View>
        </DetailLayout>
    );
}

function TrackingItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={28} color="#16a34a" />
            <View style={styles.textWrap}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24 },
    heroSection: { alignItems: 'center', paddingVertical: 10 },
    heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#16a34a', marginTop: 10 },
    featureList: { gap: 20 },
    item: { flexDirection: 'row', gap: 15, alignItems: 'center' },
    textWrap: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    itemDesc: { fontSize: 13, color: '#475569', lineHeight: 18 },
    statusBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        elevation: 2,
    },
    statusIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a' },
    statusText: { fontSize: 14, color: '#1e3a8a', fontWeight: '500' },
});
