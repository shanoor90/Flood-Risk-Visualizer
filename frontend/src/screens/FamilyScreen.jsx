import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService } from '../services/api';
import { authService } from '../services/authService';

export default function FamilyScreen({ navigation }) {
    const [familyData, setFamilyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                setLoading(false);
                return;
            }
            const userId = user.uid;
            
            // Using backend API endpoint which safely fetches exact live location without Firebase permission blocks
            const response = await familyService.getFamilyRisk(userId);
            setFamilyData(response.data || []);
        } catch (error) {
            console.log("Family fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s for live tracking
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
                {/* Cleaned up UI: Government Announcements and Recent Alerts have been completely removed as requested. */}

                {/* Live Family Location Hub */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>Your Family Circle</Text>
                    <MaterialCommunityIcons name="radar" size={24} color="#16a34a" />
                </View>
                <Text style={styles.subHeaderText}>Live Location & Status Tracking</Text>
                
                {loading && familyData.length === 0 ? (
                     <ActivityIndicator size="large" color="#0369a1" style={{ marginVertical: 30 }} />
                ) : familyData.length > 0 ? (
                    <View style={styles.listContainer}>
                        {familyData.map(member => (
                            <View key={member.memberId} style={[styles.memberCard, { borderLeftColor: member.risk?.color || '#94a3b8' }]}>
                                <View style={styles.memberInfo}>
                                    <View style={[styles.avatar, { backgroundColor: (member.risk?.color || '#94a3b8') + '20' }]}>
                                        <MaterialCommunityIcons name="account" size={28} color={member.risk?.color || '#94a3b8'} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.memberName}>{member.memberName} <Text style={styles.relation}>({member.relation})</Text></Text>
                                        
                                        {/* Exact Location Section */}
                                        <View style={styles.locationContainer}>
                                            <MaterialCommunityIcons name="map-marker-radius" size={16} color="#0369a1" />
                                            <Text style={styles.locationText}>
                                                {member.location 
                                                    ? `Lat: ${member.location.lat.toFixed(4)}, Lon: ${member.location.lon.toFixed(4)}` 
                                                    : 'Location Unknown'}
                                            </Text>
                                        </View>

                                        {/* Stats Row */}
                                        <View style={styles.statsRow}>
                                            <View style={styles.badge}>
                                                <MaterialCommunityIcons name="battery-charging" size={14} color="#64748b" />
                                                <Text style={styles.badgeText}>{member.batteryLevel ? `${member.batteryLevel}%` : 'N/A'}</Text>
                                            </View>
                                            <View style={[styles.badge, { backgroundColor: member.gpsStatus === "Active" ? '#dcfce7' : '#fee2e2' }]}>
                                                <MaterialCommunityIcons name={member.gpsStatus === "Active" ? "satellite-uplink" : "satellite-variant"} size={14} color={member.gpsStatus === "Active" ? '#16a34a' : '#ef4444'} />
                                                <Text style={[styles.badgeText, { color: member.gpsStatus === "Active" ? '#16a34a' : '#ef4444' }]}>{member.gpsStatus || "Inactive"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="account-search" size={48} color="#cbd5e1" />
                        <Text style={styles.emptyText}>You haven't added any family members yet.</Text>
                    </View>
                )}

                {/* Quick Actions */}
                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Management Actions</Text>
                <View style={styles.cardsContainer}>
                    <FeatureCard
                        icon="account-multiple-plus"
                        title="Personalized Safety Circle"
                        desc="Invite new family members & send tracking requests"
                        onPress={() => navigation.navigate('SafetyCircle')}
                    />
                    <FeatureCard
                        icon="account-arrow-right"
                        title="Join a Safety Circle"
                        desc="Enter an invite code to securely share your location"
                        onPress={() => navigation.navigate('JoinFamily')}
                    />
                    <FeatureCard
                        icon="map-search-outline"
                        title="Real-Time Monitoring"
                        desc="View full map visualization and geographical risk"
                        onPress={() => navigation.navigate('RealTimeMonitoring')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureCard({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#0284c7" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
    headerIcon: { marginRight: 8 },
    container: { padding: 20, paddingBottom: 40 },
    
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, marginTop: 10 },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
    subHeaderText: { fontSize: 14, color: '#64748b', marginBottom: 20, fontStyle: 'italic' },
    
    listContainer: { gap: 12 },
    memberCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16,
        borderLeftWidth: 5, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8
    },
    memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    memberName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 },
    relation: { fontSize: 14, fontWeight: 'normal', color: '#64748b' },
    
    locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 8, alignSelf: 'flex-start' },
    locationText: { fontSize: 13, color: '#0369a1', marginLeft: 6, fontWeight: 'bold' },
    
    statsRow: { flexDirection: 'row', gap: 8 },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
    badgeText: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },

    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'dashed' },
    emptyText: { color: '#94a3b8', fontSize: 15, marginTop: 12 },

    cardsContainer: { gap: 12, marginTop: 10 },
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, borderWidth: 1, borderColor: '#f8fafc'
    },
    iconBox: { padding: 12, marginRight: 14, backgroundColor: '#e0f2fe', borderRadius: 12 },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
});
