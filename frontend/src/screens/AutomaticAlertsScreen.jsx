import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, FlatList, Alert } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sosService } from '../services/api';

// Mock Government Updates
const GOV_UPDATES = [
    { id: 1, title: "Red Alert: Heavy Rainfall", time: "10 mins ago", source: "Met Dept", severity: "high" },
    { id: 2, title: "Evacuation Order: Zone A", time: "1 hour ago", source: "Disaster Mgmt", severity: "high" },
    { id: 3, title: "Relief Centers Open", time: "2 hours ago", source: "Local Govt", severity: "medium" },
];

// Mock Battery/Connectivity Alerts
const SYSTEM_ALERTS = [
    { id: 1, msg: "Dad's phone battery is below 10%", time: "15m ago", type: "battery" },
    { id: 2, msg: "Mom has lost GPS signal", time: "30m ago", type: "signal" },
];

export default function AutomaticAlertsScreen({ navigation }) {
    const [geofencingEnabled, setGeofencingEnabled] = useState(true);
    const [batteryAlertsEnabled, setBatteryAlertsEnabled] = useState(true);

    const handleSmartSOS = async () => {
        Alert.alert(
            "Activate Smart SOS?",
            "This will send an 'Extreme Danger' alert to all family members, bypassing Do Not Disturb.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "ACTIVATE",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Example trigger
                            await sosService.triggerSOS({
                                type: "EXTREME_DANGER",
                                location: { lat: 6.9271, lon: 79.8612 } // mock loc
                            });
                            Alert.alert("SOS Sent", "Emergency alert broadcasted to family circle.");
                        } catch (e) {
                            Alert.alert("Error", "Failed to send SOS. Please call emergency services.");
                        }
                    }
                }
            ]
        );
    };

    const renderGovUpdate = ({ item }) => (
        <View style={styles.updateCard}>
            <View style={styles.updateHeader}>
                <View style={[styles.badge, { backgroundColor: item.severity === 'high' ? '#fee2e2' : '#fef3c7' }]}>
                    <Text style={[styles.badgeText, { color: item.severity === 'high' ? '#dc2626' : '#d97706' }]}>
                        {item.source}
                    </Text>
                </View>
                <Text style={styles.timestamp}>{item.time}</Text>
            </View>
            <Text style={styles.updateTitle}>{item.title}</Text>
        </View>
    );

    const renderSystemAlert = ({ item }) => (
        <View style={styles.systemAlertRow}>
            <MaterialCommunityIcons
                name={item.type === 'battery' ? 'battery-alert' : 'signal-off'}
                size={20}
                color="#64748b"
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.sysAlertText}>{item.msg}</Text>
                <Text style={styles.sysAlertTime}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <DetailLayout
            title="Automatic Alerts"
            icon="bell-ring"
            color="#fee2e2"
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                {/* 1. Geofencing & Battery Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚙️ Alert Settings</Text>
                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingText}>
                                <Text style={styles.settingLabel}>Geofencing Alerts</Text>
                                <Text style={styles.settingDesc}>Notify if family enters Red Zone</Text>
                            </View>
                            <Switch
                                value={geofencingEnabled}
                                onValueChange={setGeofencingEnabled}
                                trackColor={{ false: "#e2e8f0", true: "#fca5a5" }}
                                thumbColor={geofencingEnabled ? "#dc2626" : "#f8fafc"}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingText}>
                                <Text style={styles.settingLabel}>Battery & Connectivity</Text>
                                <Text style={styles.settingDesc}>Notify on low battery / GPS loss</Text>
                            </View>
                            <Switch
                                value={batteryAlertsEnabled}
                                onValueChange={setBatteryAlertsEnabled}
                                trackColor={{ false: "#e2e8f0", true: "#fca5a5" }}
                                thumbColor={batteryAlertsEnabled ? "#dc2626" : "#f8fafc"}
                            />
                        </View>
                    </View>
                </View>

                {/* 2. Smart SOS Button */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🆘 Smart SOS</Text>
                    <TouchableOpacity style={styles.sosButton} onPress={handleSmartSOS}>
                        <View style={styles.sosIconContainer}>
                            <MaterialCommunityIcons name="broadcast" size={32} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.sosTitle}>EXTREME DANGER ALERT</Text>
                            <Text style={styles.sosSubtitle}>Bypass Do-Not-Disturb on all family devices</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 3. System Alerts Log */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📱 Recent System Alerts</Text>
                    <View style={styles.card}>
                        {SYSTEM_ALERTS.map(item => (
                            <View key={item.id}>
                                {renderSystemAlert({ item })}
                                <View style={styles.divider} />
                            </View>
                        ))}
                        <TouchableOpacity style={styles.viewAllBtn}>
                            <Text style={styles.viewAllText}>View All Logs</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. Official Government Updates */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📢 Official Government Updates</Text>
                    {GOV_UPDATES.map(item => (
                        <View key={item.id}>{renderGovUpdate({ item })}</View>
                    ))}
                </View>

            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#7f1d1d', marginBottom: 12, paddingHorizontal: 4 },

    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
    settingText: { flex: 1, paddingRight: 10 },
    settingLabel: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
    settingDesc: { fontSize: 12, color: '#6b7280' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

    sosButton: {
        backgroundColor: '#dc2626',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    sosIconContainer: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center', marginRight: 16
    },
    sosTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
    sosSubtitle: { fontSize: 12, color: '#fecaca', marginTop: 2 },

    systemAlertRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sysAlertText: { fontSize: 14, color: '#334155', fontWeight: '500' },
    sysAlertTime: { fontSize: 12, color: '#94a3b8' },
    viewAllBtn: { alignItems: 'center', paddingTop: 8 },
    viewAllText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },

    updateCard: {
        backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10,
        borderLeftWidth: 4, borderLeftColor: '#dc2626', elevation: 1
    },
    updateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    timestamp: { fontSize: 12, color: '#9ca3af' },
    updateTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937' }
});
