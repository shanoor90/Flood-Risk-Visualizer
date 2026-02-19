import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TextInput, FlatList, Switch, Alert, Linking, ActivityIndicator
} from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService, locationService } from '../services/api';

// Mock User ID for now (ideally from Auth context)
const USER_ID = "test_user_123";

export default function SafetyCircleScreen({ navigation }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSharingLocation, setIsSharingLocation] = useState(true);

    // Add Member State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [newMemberRelation, setNewMemberRelation] = useState('');

    useEffect(() => {
        fetchFamilyData();
    }, []);

    const fetchFamilyData = async () => {
        try {
            const response = await familyService.getFamilyRisk(USER_ID);
            setMembers(response.data || []);
        } catch (error) {
            console.error("Error fetching family:", error);
            Alert.alert("Error", "Could not load family circle.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberName || !newMemberPhone || !newMemberRelation) {
            Alert.alert("Missing Info", "Please fill all fields.");
            return;
        }

        try {
            // In a real app, phone would map to a userId. 
            // Here, using phone as ID for simplicity or simulation.
            await familyService.addMember({
                userId: USER_ID,
                memberId: newMemberPhone, // Using phone as unique ID
                memberName: newMemberName,
                relation: newMemberRelation
            });
            Alert.alert("Success", "Family member added!");
            setShowAddForm(false);
            setNewMemberName('');
            setNewMemberPhone('');
            setNewMemberRelation('');
            fetchFamilyData(); // Refresh list
        } catch (error) {
            Alert.alert("Error", "Failed to add member.");
        }
    };

    const handleCall = (phone) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleMessage = (phone) => {
        Linking.openURL(`sms:${phone}`);
    };

    const renderMember = ({ item }) => {
        // Determine status style
        let statusColor = '#94a3b8'; // Offline/Grey
        let statusText = 'Offline';
        let statusIcon = 'cloud-off-outline';

        if (item.risk) {
            if (item.risk.level === 'SAFE') {
                statusColor = '#16a34a';
                statusText = 'Safe';
                statusIcon = 'check-circle-outline';
            } else if (item.risk.level === 'HIGH' || item.risk.level === 'MODERATE') {
                statusColor = '#dc2626';
                statusText = 'High Risk Zone';
                statusIcon = 'alert-circle-outline';
            } else {
                statusText = 'Unknown';
            }
        }

        return (
            <View style={styles.memberCard}>
                <View style={styles.memberInfo}>
                    <View style={[styles.avatar, { backgroundColor: statusColor + '20' }]}>
                        <MaterialCommunityIcons name="account" size={24} color={statusColor} />
                    </View>
                    <View>
                        <Text style={styles.memberName}>{item.memberName} ({item.relation})</Text>
                        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
                            <MaterialCommunityIcons name={statusIcon} size={12} color={statusColor} style={{ marginRight: 4 }} />
                            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleMessage(item.memberId)} style={[styles.actionBtn, { backgroundColor: '#e0f2fe' }]}>
                        <MaterialCommunityIcons name="message-text-outline" size={20} color="#0284c7" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCall(item.memberId)} style={[styles.actionBtn, { backgroundColor: '#dcfce7' }]}>
                        <MaterialCommunityIcons name="phone-outline" size={20} color="#16a34a" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <DetailLayout
            title="Family Management"
            icon="shield-account"
            color="#f0fdf4"
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hub Header */}
                <View style={styles.hubHeader}>
                    <Text style={styles.hubTitle}>Personalized Safety Circle</Text>
                    <Text style={styles.hubSubtitle}>
                        Build your private network for the monsoon season.
                    </Text>
                </View>

                {/* Privacy Toggle */}
                <View style={styles.privacyContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <MaterialCommunityIcons name="eye-check-outline" size={24} color="#15803d" />
                        <View>
                            <Text style={styles.privacyTitle}>Share Live Location</Text>
                            <Text style={styles.privacyDesc}>Visible to circle members</Text>
                        </View>
                    </View>
                    <Switch
                        value={isSharingLocation}
                        onValueChange={setIsSharingLocation}
                        trackColor={{ false: "#767577", true: "#86efac" }}
                        thumbColor={isSharingLocation ? "#16a34a" : "#f4f3f4"}
                    />
                </View>

                {/* Add Member Button */}
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setShowAddForm(!showAddForm)}
                >
                    <MaterialCommunityIcons name={showAddForm ? "close" : "plus"} size={24} color="#fff" />
                    <Text style={styles.addBtnText}>{showAddForm ? "Cancel" : "Add Member"}</Text>
                </TouchableOpacity>

                {/* Add Member Form */}
                {showAddForm && (
                    <View style={styles.addForm}>
                        <Text style={styles.formHeader}>Invite via Phone or Circle Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name (e.g. Mom)"
                            value={newMemberName}
                            onChangeText={setNewMemberName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number / ID"
                            keyboardType="phone-pad"
                            value={newMemberPhone}
                            onChangeText={setNewMemberPhone}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Relation (e.g. Parent, Sibling)"
                            value={newMemberRelation}
                            onChangeText={setNewMemberRelation}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleAddMember}>
                            <Text style={styles.submitBtnText}>Send Invitation</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Member List */}
                <Text style={styles.sectionTitle}>Your Safety Circle</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#16a34a" />
                ) : (
                    <View style={styles.listContainer}>
                        {members.length === 0 ? (
                            <Text style={styles.emptyText}>No family members added yet.</Text>
                        ) : (
                            members.map(item => (
                                <View key={item.memberId}>{renderMember({ item })}</View>
                            ))
                        )}
                    </View>
                )}

                {/* Benefits Section */}
                <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsHeader}>Why use Safety Circle?</Text>
                    <InfoRow icon="heart-plus-outline" text="Peace of Mind" />
                    <InfoRow icon="update" text="Real-time Updates" />
                    <InfoRow icon="map-marker-radius" text="Location Visibility of Members" />
                    <InfoRow icon="shield-lock-outline" text="Family Access Control" />
                </View>

            </ScrollView>
        </DetailLayout>
    );
}

function InfoRow({ icon, text }) {
    return (
        <View style={styles.infoRow}>
            <MaterialCommunityIcons name={icon} size={20} color="#15803d" />
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    hubHeader: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#22c55e',
        elevation: 1
    },
    hubTitle: { fontSize: 20, fontWeight: 'bold', color: '#14532d' },
    hubSubtitle: { fontSize: 14, color: '#4b5563', marginTop: 4 },

    privacyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 1
    },
    privacyTitle: { fontSize: 16, fontWeight: 'bold', color: '#14532d' },
    privacyDesc: { fontSize: 12, color: '#6b7280' },

    addBtn: {
        flexDirection: 'row',
        backgroundColor: '#16a34a',
        padding: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        elevation: 2
    },
    addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    addForm: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#bbf7d0'
    },
    formHeader: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#15803d' },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 14
    },
    submitBtn: {
        backgroundColor: '#15803d',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    submitBtnText: { color: '#fff', fontWeight: 'bold' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#14532d', marginBottom: 12 },
    listContainer: { gap: 10 },
    memberCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        elevation: 1
    },
    memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
        width: 48, height: 48, borderRadius: 24,
        justifyContent: 'center', alignItems: 'center'
    },
    memberName: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
        alignSelf: 'flex-start'
    },
    statusText: { fontSize: 10, fontWeight: 'bold' },

    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: {
        width: 36, height: 36, borderRadius: 18,
        justifyContent: 'center', alignItems: 'center'
    },

    emptyText: { textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', marginVertical: 20 },

    benefitsSection: {
        marginTop: 30,
        backgroundColor: '#f0fdf4',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bbf7d0'
    },
    benefitsHeader: { fontSize: 16, fontWeight: 'bold', color: '#15803d', marginBottom: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    infoText: { fontSize: 14, color: '#166534', fontWeight: '500' }
});
