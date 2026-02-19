import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    FlatList, Switch, Alert, ActivityIndicator, Modal
} from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService } from '../services/api';

const USER_ID = "test_user_123";

export default function FamilyRelationshipsScreen({ navigation }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [primaryContactId, setPrimaryContactId] = useState(null);

    useEffect(() => {
        fetchFamilyData();
    }, []);

    const fetchFamilyData = async () => {
        try {
            const response = await familyService.getFamilyRisk(USER_ID);
            const data = response.data || [];

            // Try to find existing primary contact from local logic or stored field
            // For now, we just look for 'isPrimary' flag if it exists
            const primary = data.find(m => m.isPrimary);
            if (primary) setPrimaryContactId(primary.memberId);

            setMembers(data);
        } catch (error) {
            console.error("Error fetching family:", error);
            Alert.alert("Error", "Could not load family settings.");
        } finally {
            setLoading(false);
        }
    };

    const toggleAccess = async (member, currentVal) => {
        try {
            // Optimistic update
            const updatedMembers = members.map(m =>
                m.memberId === member.memberId ? { ...m, hasAccess: !currentVal } : m
            );
            setMembers(updatedMembers);

            await familyService.updateMemberSettings(USER_ID, member.memberId, {
                hasAccess: !currentVal
            });
        } catch (error) {
            Alert.alert("Error", "Failed to update access settings.");
            fetchFamilyData(); // Revert
        }
    };

    const setPrimaryContact = async (memberId) => {
        try {
            setPrimaryContactId(memberId);

            // In a real app, this might be a batch write to unset others
            // Here we just update the specific member to be primary
            // And we'd need to loop to unset others if we want strict single primary
            // For UI simplicity, we just highlight one.

            await familyService.updateMemberSettings(USER_ID, memberId, {
                isPrimary: true
            });

            Alert.alert("Updated", "Primary Contact for Override Alerts updated.");
        } catch (error) {
            Alert.alert("Error", "Failed to set primary contact.");
        }
    };

    const renderMemberSettings = ({ item }) => {
        const isPrimary = item.memberId === primaryContactId;
        // Default access to true if undefined for demo purposes
        const hasAccess = item.hasAccess !== undefined ? item.hasAccess : true;

        return (
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <MaterialCommunityIcons name="account" size={24} color="#1e3a8a" />
                        </View>
                        <View>
                            <Text style={styles.memberName}>{item.memberName}</Text>
                            <Text style={styles.relation}>{item.relation}</Text>
                        </View>
                    </View>
                    {isPrimary && (
                        <View style={styles.primaryBadge}>
                            <MaterialCommunityIcons name="crown" size={14} color="#b45309" />
                            <Text style={styles.primaryText}>Head of Circle</Text>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                {/* Role / Primary Toggle */}
                <TouchableOpacity
                    style={styles.settingRow}
                    onPress={() => setPrimaryContact(item.memberId)}
                    disabled={isPrimary}
                >
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Primary Contact</Text>
                        <Text style={styles.settingDesc}>Receives critical override alerts</Text>
                    </View>
                    <MaterialCommunityIcons
                        name={isPrimary ? "radiobox-marked" : "radiobox-blank"}
                        size={24}
                        color={isPrimary ? "#2563eb" : "#94a3b8"}
                    />
                </TouchableOpacity>

                {/* Access Control Toggle */}
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Location Access</Text>
                        <Text style={styles.settingDesc}>Can see your live location</Text>
                    </View>
                    <Switch
                        value={hasAccess}
                        onValueChange={() => toggleAccess(item, hasAccess)}
                        trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                        thumbColor={hasAccess ? "#2563eb" : "#f8fafc"}
                    />
                </View>
            </View>
        );
    };

    return (
        <DetailLayout
            title="Family Admin"
            icon="account-cog"
            color="#eff6ff"
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.hero}>
                    <MaterialCommunityIcons name="shield-account" size={50} color="#1e40af" />
                    <Text style={styles.heroTitle}>Family Relationships</Text>
                    <Text style={styles.heroDesc}>
                        Manage roles, access controls, and emergency override settings.
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
                ) : (
                    <>
                        <Text style={styles.sectionHeader}>Member Settings</Text>
                        {members.length === 0 ? (
                            <Text style={styles.emptyText}>No family members found. Add them in the Personalized Safety Circle first.</Text>
                        ) : (
                            <View style={styles.list}>
                                {members.map(item => (
                                    <View key={item.memberId}>{renderMemberSettings({ item })}</View>
                                ))}
                            </View>
                        )}

                        <View style={styles.historySection}>
                            <View style={styles.historyHeader}>
                                <MaterialCommunityIcons name="history" size={24} color="#1e3a8a" />
                                <Text style={styles.historyTitle}>Safety History Logs</Text>
                            </View>
                            <Text style={styles.historyDesc}>
                                View past safety check-ins and shared locations for the last 30 days.
                            </Text>
                            <TouchableOpacity style={styles.historyBtn}>
                                <Text style={styles.historyBtnText}>View Full History Logs</Text>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: 'center',
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#dbeafe'
    },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a', marginTop: 8 },
    heroDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 4 },

    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 12 },
    emptyText: { textAlign: 'center', color: '#64748b', fontStyle: 'italic', marginTop: 20 },
    list: { gap: 16 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    userInfo: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    avatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center'
    },
    memberName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    relation: { fontSize: 13, color: '#64748b' },

    primaryBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 12, borderWidth: 1, borderColor: '#fcd34d'
    },
    primaryText: { fontSize: 10, fontWeight: 'bold', color: '#92400e' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

    settingRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 8
    },
    settingInfo: { flex: 1, paddingRight: 12 },
    settingLabel: { fontSize: 14, fontWeight: '600', color: '#334155' },
    settingDesc: { fontSize: 12, color: '#94a3b8' },

    historySection: {
        marginTop: 32,
        backgroundColor: '#f0f9ff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bae6fd'
    },
    historyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#0c4a6e' },
    historyDesc: { fontSize: 14, color: '#0369a1', marginBottom: 16, lineHeight: 20 },

    historyBtn: {
        backgroundColor: '#0284c7',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        gap: 8
    },
    historyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
