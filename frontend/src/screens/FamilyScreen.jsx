import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService } from '../services/api';

const MOCK_GOV_ALERTS = [
    { id: 1, title: "Met Dept Warning", message: "Heavy rainfall expected in Western Province.", type: "warning", time: "2h ago" },
    { id: 2, title: "Irrigation Dept", message: "Kelani River water level rising. Be alert.", type: "danger", time: "4h ago" }
];

export default function FamilyScreen({ navigation }) {
    const [familyData, setFamilyData] = useState([]);
    const [systemAlerts, setSystemAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = "test_user_123"; // TODO: Get from auth
            const response = await familyService.getFamilyRisk(userId);
            const members = response.data || [];
            setFamilyData(members);
            generateSystemAlerts(members);
        } catch (error) {
            console.log("Family fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSystemAlerts = (members) => {
        const alerts = [];
        
        members.forEach(m => {
            // 1. Flood Risk Alert
            if (m.risk?.level === 'HIGH' || m.risk?.level === 'SEVERE') {
                alerts.push({
                    id: `risk-${m.memberId}`,
                    title: `High Flood Risk: ${m.memberName}`,
                    message: `${m.memberName} is in a ${m.risk.level} risk zone!`,
                    icon: "home-flood",
                    color: "#ef4444",
                    priority: 1
                });
            }

            // 2. Extreme Danger (High Risk + GPS Lost)
            if ((m.risk?.level === 'HIGH' || m.risk?.level === 'SEVERE') && m.gpsStatus === 'Lost') {
                alerts.unshift({ // Add to top
                    id: `extreme-${m.memberId}`,
                    title: `EXTREME DANGER: ${m.memberName}`,
                    message: `Cannot locate ${m.memberName} in High Risk Zone! Last seen: ${new Date(m.lastSeen).toLocaleTimeString()}`,
                    icon: "alert-octagon",
                    color: "#b91c1c",
                    priority: 0
                });
            }

            // 3. Low Battery
            if (m.batteryLevel < 10) {
                alerts.push({
                    id: `batt-${m.memberId}`,
                    title: `Low Battery: ${m.memberName}`,
                    message: `${m.memberName}'s battery is critically low (${m.batteryLevel}%).`,
                    icon: "battery-alert",
                    color: "#f59e0b",
                    priority: 2
                });
            }

            // 4. GPS Loss
            if (m.gpsStatus === 'Lost' && m.risk?.level !== 'HIGH') {
                alerts.push({
                    id: `gps-${m.memberId}`,
                    title: `GPS Signal Lost: ${m.memberName}`,
                    message: `No location update from ${m.memberName} recently.`,
                    icon: "satellite-uplink",
                    color: "#64748b",
                    priority: 3
                });
            }
        });

        // Sort by priority
        setSystemAlerts(alerts.sort((a, b) => a.priority - b.priority));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="account-group" size={28} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Family Connection</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
            >
                {/* 1. Alerts Dashboard */}
                <View style={styles.alertSection}>
                    <Text style={styles.sectionHeader}>⚠️ Recent Alerts</Text>
                    {systemAlerts.length > 0 ? (
                        systemAlerts.map(alert => (
                            <View key={alert.id} style={[styles.alertCard, { borderLeftColor: alert.color }]}>
                                <MaterialCommunityIcons name={alert.icon} size={28} color={alert.color} />
                                <View style={styles.alertContent}>
                                    <Text style={[styles.alertTitle, { color: alert.color }]}>{alert.title}</Text>
                                    <Text style={styles.alertMsg}>{alert.message}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No active system alerts. Everyone is safe.</Text>
                    )}
                </View>

                {/* 2. Government Alerts */}
                <View style={styles.alertSection}>
                    <Text style={styles.sectionHeader}>📢 Government Announcements</Text>
                    {MOCK_GOV_ALERTS.map(alert => (
                        <View key={alert.id} style={styles.govCard}>
                            <View style={styles.govHeader}>
                                <Text style={styles.govTitle}>{alert.title}</Text>
                                <Text style={styles.govTime}>{alert.time}</Text>
                            </View>
                            <Text style={styles.govMsg}>{alert.message}</Text>
                        </View>
                    ))}
                </View>

                {/* 3. Feature Actions (Existing) */}
                <Text style={styles.sectionHeader}>Quick Actions</Text>
                <View style={styles.cardsContainer}>
                    <FeatureCard
                        icon="account-circle-outline"
                        title="Personalized Safety Circle"
                        desc="Manage family members & phone numbers"
                        onPress={() => navigation.navigate('SafetyCircle')}
                    />
                    <FeatureCard
                        icon="power"
                        title="Real-Time Monitoring"
                        desc="View family locations & flood map"
                        onPress={() => navigation.navigate('RealTimeMonitoring')}
                    />
                     <FeatureCard
                        icon="database-outline"
                        title="Family Relationships"
                        desc="Manage relationship data"
                        onPress={() => navigation.navigate('FamilyRelationships')}
                    />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Stay Connected</Text>
                    <Text style={styles.infoText}>
                        Ensure family members keep their GPS on. Alerts are generated automatically based on their last known location.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureCard({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#0077b6" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f0f9ff', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#f0f9ff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
    headerIcon: { marginRight: 8 },
    container: { padding: 20 },
    
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 12, marginTop: 10 },
    
    alertSection: { marginBottom: 20 },
    alertCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12,
        marginBottom: 10, borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1
    },
    alertContent: { marginLeft: 12, flex: 1 },
    alertTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
    alertMsg: { fontSize: 13, color: '#475569' },
    emptyText: { color: '#64748b', fontStyle: 'italic', marginLeft: 4 },

    govCard: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ffedd5' },
    govHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    govTitle: { fontSize: 14, fontWeight: 'bold', color: '#c2410c' },
    govTime: { fontSize: 12, color: '#9a3412' },
    govMsg: { fontSize: 13, color: '#431407' },

    cardsContainer: { gap: 12 },
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05
    },
    iconBox: { padding: 10, marginRight: 10, backgroundColor: '#e0f2fe', borderRadius: 50 },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 2 },
    cardDesc: { fontSize: 13, color: '#64748b' },

    infoCard: {
        backgroundColor: 'rgba(224, 242, 254, 0.8)', borderRadius: 16, padding: 20, marginTop: 30,
        borderWidth: 1, borderColor: '#bae6fd'
    },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#0369a1', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#0e7490' },
});
