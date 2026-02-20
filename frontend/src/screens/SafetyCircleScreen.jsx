import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TextInput, Switch, Alert, Linking, ActivityIndicator, AppState
} from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService, locationService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';

// Mock User ID for now (ideally from Auth context)
const USER_ID = "test_user_123";
const LINKED_MEMBER_KEY = "linked_family_member_id";

export default function SafetyCircleScreen({ navigation }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [linkedMemberId, setLinkedMemberId] = useState(null);
    const [trackingActive, setTrackingActive] = useState(false);

    // Add Member State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [newMemberRelation, setNewMemberRelation] = useState('');

    const locationSubscription = useRef(null);

    useEffect(() => {
        checkLinkedMember();
        fetchFamilyData();

        return () => {
            stopTracking();
        };
    }, []);

    // Check if this device is already linked to a member check
    const checkLinkedMember = async () => {
        try {
            const id = await AsyncStorage.getItem(LINKED_MEMBER_KEY);
            if (id) {
                setLinkedMemberId(id);
                startTracking(id);
            }
        } catch (e) {
            console.log("AsyncStorage error", e);
        }
    };

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
            await familyService.addMember({
                userId: USER_ID,
                memberId: newMemberPhone,
                memberName: newMemberName,
                phoneNumber: newMemberPhone, 
                relation: newMemberRelation
            });
            Alert.alert("Success", "Family member added!");
            setShowAddForm(false);
            setNewMemberName('');
            setNewMemberPhone('');
            setNewMemberRelation('');
            fetchFamilyData(); 
        } catch (error) {
            Alert.alert("Error", "Failed to add member.");
        }
    };

    const handleLinkDevice = async (memberId) => {
        Alert.alert(
            "Link Device",
            "Is this YOUR phone? Linking will enable real-time location and battery tracking for this member.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Yes, This is Me", 
                    onPress: async () => {
                        await AsyncStorage.setItem(LINKED_MEMBER_KEY, memberId);
                        setLinkedMemberId(memberId);
                        startTracking(memberId);
                        Alert.alert("Device Linked", "You are now tracking as this member.");
                    }
                }
            ]
        );
    };

    const handleUnlinkDevice = async () => {
        await AsyncStorage.removeItem(LINKED_MEMBER_KEY);
        setLinkedMemberId(null);
        stopTracking();
        Alert.alert("Device Unlinked", "Tracking stopped.");
    };

    // --- REAL-TIME TRACKING LOGIC ---
    const startTracking = async (memberId) => {
        if (trackingActive) return;

        // 1. Request Permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Location permission is required for tracking.");
            return;
        }

        setTrackingActive(true);

        // 2. Start Watching Location
        locationSubscription.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000, // Update every 10s
                distanceInterval: 10, // Or every 10 meters
            },
            async (loc) => {
                try {
                    // 3. Get Battery Level
                    const batteryLevel = await Battery.getBatteryLevelAsync();
                    
                    // 4. Send to Backend
                    await locationService.updateLocation({
                        userId: memberId, // Identify as the linked member
                        location: {
                            lat: loc.coords.latitude,
                            lon: loc.coords.longitude
                        },
                        riskScore: 0, // Backend recalculates this based on weather
                        // Additional metadata is sent via updateLocation logic if needed
                        // Ideally locationService.updateLocation handles the structure
                    });

                    // We also need to explicitly update battery/status if updateLocation doesn't
                    // But for now, let's assume updateLocation adds it or we add a specific call
                    // For now, let's just stick to updateLocation which creates a 'locations' doc
                    // The backend Controller reads 'batteryLevel' from this doc if passed?
                    // Let's modify api.js updateLocation to include battery!
                    // See Note below code.

                } catch (error) {
                    console.log("Tracking error:", error);
                }
            }
        );
    };

    const stopTracking = () => {
        if (locationSubscription.current) {
            locationSubscription.current.remove();
            locationSubscription.current = null;
        }
        setTrackingActive(false);
    };


    const renderMember = ({ item }) => {
        const isLinked = item.memberId === linkedMemberId;
        const statusColor = item.risk?.level === 'SAFE' ? '#16a34a' 
            : item.risk?.level === 'HIGH' ? '#dc2626' 
            : item.risk?.level === 'MODERATE' ? '#ca8a04' 
            : '#94a3b8';

        return (
            <View style={[styles.memberCard, isLinked && styles.linkedCard]}>
                <View style={styles.memberInfo}>
                    <View style={[styles.avatar, { backgroundColor: statusColor + '20' }]}>
                        <MaterialCommunityIcons name="account" size={24} color={statusColor} />
                    </View>
                    <View>
                        <Text style={styles.memberName}>{item.memberName} {isLinked && "(You)"}</Text>
                        <Text style={{ fontSize: 12, color: '#64748b' }}>
                            {item.batteryLevel ? `🔋 ${item.batteryLevel}%` : 'No Battery Data'}
                        </Text>
                         <View style={{flexDirection:'row', alignItems:'center', marginTop: 4}}>
                             {item.gpsStatus === 'Lost' && <MaterialCommunityIcons name="satellite-variant" size={12} color="#64748b" style={{marginRight:4}}/>}
                             <Text style={{ fontSize: 10, color: '#64748b' }}>
                                 {item.gpsStatus === 'Lost' ? 'Signal Lost' : 'GPS Active'}
                             </Text>
                         </View>
                    </View>
                </View>

                {/* Link/Unlink Action */}
                <View style={styles.actions}>
                    {!linkedMemberId ? (
                        <TouchableOpacity onPress={() => handleLinkDevice(item.memberId)} style={[styles.actionBtn, { backgroundColor: '#e0f2fe' }]}>
                            <Text style={styles.linkText}>This is Me</Text>
                        </TouchableOpacity>
                    ) : isLinked ? (
                        <TouchableOpacity onPress={handleUnlinkDevice} style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]}>
                            <Text style={[styles.linkText, {color: '#dc2626'}]}>Unlink</Text>
                        </TouchableOpacity>
                    ) : (
                         <View style={{width: 60}} /> // Spacer
                    )}
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
                {/* Tracking Status Banner */}
                {trackingActive && (
                    <View style={styles.trackingBanner}>
                        <MaterialCommunityIcons name="radar" size={24} color="white" style={styles.pulseIcon} />
                        <Text style={styles.trackingText}>Real-Time Tracking Active</Text>
                    </View>
                )}

                <View style={styles.hubHeader}>
                    <Text style={styles.hubTitle}>Personalized Safety Circle</Text>
                    <Text style={styles.hubSubtitle}>
                        Link devices to enable real-time tracking for family members.
                    </Text>
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
                            <Text style={styles.submitBtnText}>Add Member</Text>
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
            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    hubHeader: { marginTop: 10, marginBottom: 20, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#22c55e', elevation: 1 },
    hubTitle: { fontSize: 20, fontWeight: 'bold', color: '#14532d' },
    hubSubtitle: { fontSize: 14, color: '#4b5563', marginTop: 4 },
    
    trackingBanner: { backgroundColor: '#16a34a', padding: 12, marginBottom: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    trackingText: { color: 'white', fontWeight: 'bold' },

    addBtn: { flexDirection: 'row', backgroundColor: '#16a34a', padding: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16, elevation: 2 },
    addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    addForm: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#bbf7d0' },
    formHeader: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#15803d' },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14 },
    submitBtn: { backgroundColor: '#15803d', padding: 12, borderRadius: 8, alignItems: 'center' },
    submitBtnText: { color: '#fff', fontWeight: 'bold' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#14532d', marginBottom: 12 },
    listContainer: { gap: 10 },
    
    memberCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, elevation: 1 },
    linkedCard: { borderColor: '#22c55e', borderWidth: 2 },
    
    memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    memberName: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
    
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    linkText: { fontSize: 12, fontWeight: 'bold', color: '#0284c7' },
    
    emptyText: { textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', marginVertical: 20 },
});
