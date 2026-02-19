import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ActiveTrackingScreen({ navigation }) {
    return (
        <DetailLayout
            title="Active Tracking"
            icon="satellite-uplink"
            color="#ecfdf5"
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="broadcast" size={60} color="#059669" />
                    </View>
                    <Text style={styles.heroTitle}>Active Tracking Status</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            Active Tracking: Online (15m Interval)
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.introText}>
                        The application is currently monitoring and updating the user’s location every 15 minutes under normal risk conditions.
                    </Text>

                    <Text style={styles.sectionHeader}>Adaptive Frequency</Text>
                    <Text style={styles.subText}>
                        Tracking frequency automatically adapts based on:
                    </Text>

                    <View style={styles.bulletList}>
                        <InfoItem
                            icon="waves"
                            title="Flood risk level"
                            desc="Automatically increases precision when high-risk zones are detected."
                        />
                        <InfoItem
                            icon="weather-lightning-rainy"
                            title="Weather alerts"
                            desc="Responds immediately to severe weather and rainfall warnings."
                        />
                        <InfoItem
                            icon="bullhorn-outline"
                            title="Government emergency notifications"
                            desc="Syncs with official directives and emergency management protocols."
                        />
                        <InfoItem
                            icon="heart-pulse"
                            title="User safety status"
                            desc="Adjusts tracking behavior if an SOS event or distress signal is triggered."
                        />
                    </View>
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={24} color="#059669" />
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24, paddingBottom: 30 },
    hero: { alignItems: 'center', marginVertical: 10 },
    iconContainer: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#064e3b' },
    statusBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#10b981',
        marginTop: 8
    },
    statusText: { fontSize: 14, color: '#059669', fontWeight: 'bold' },

    infoSection: { gap: 12, marginTop: 10 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#064e3b', marginTop: 8 },
    subText: { fontSize: 14, color: '#374151', fontStyle: 'italic' },
    introText: { fontSize: 15, color: '#1f2937', lineHeight: 22, fontWeight: '500' },
    bulletList: { gap: 12, marginVertical: 8 },

    item: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#10b981',
        elevation: 1
    },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#064e3b', marginBottom: 2 },
    itemDesc: { fontSize: 13, color: '#4b5563', lineHeight: 18 },
});
