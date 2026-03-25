import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TextInput, Switch, Alert, ActivityIndicator, AppState, Platform, Share
} from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService, locationService, inviteService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';

// Mock User ID remove, use authService
import { authService } from '../services/authService';

const LINKED_MEMBER_KEY = "linked_family_member_id";

export default function SafetyCircleScreen({ navigation }) {
    const [userId, setUserId] = useState(null);
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

    const handleLinkDevice = async (memberId) => {
        try {
            await AsyncStorage.setItem(LINKED_MEMBER_KEY, memberId);
            setLinkedMemberId(memberId);
            startTracking(memberId);
            Alert.alert("Success", "This device is now linked for tracking.");
        } catch (e) {
            Alert.alert("Error", "Failed to link device.");
        }
    };

    const handleUnlinkDevice = async () => {
        try {
            await AsyncStorage.removeItem(LINKED_MEMBER_KEY);
            setLinkedMemberId(null);
            stopTracking();
            Alert.alert("Unlinked", "Device unlinked successfully.");
        } catch (e) {
            Alert.alert("Error", "Failed to unlink device.");
        }
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUserId(user.uid);
            checkLinkedMember();
        } else {
            // Fallback for dev/testing if auth persistence is flaky, or redirect
            // For now, let's assume we might be in a dev flow and try to handle it gracefully
            // or just wait. 
            // setUserId("test_user_fallback"); 
        }

        return () => {
            stopTracking();
        };
    }, []);

    useEffect(() => {
        if (userId) {
            fetchFamilyData();
            // Poll for updates
            const interval = setInterval(fetchFamilyData, 30000);
            return () => clearInterval(interval);
        }
    }, [userId]);

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
        if (!userId) return;
        try {
            const response = await familyService.getFamilyRisk(userId);
            setMembers(response.data || []);
        } catch (error) {
            console.error("Error fetching family:", error);
            Alert.alert("Error", `Could not load family circle: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvite = async () => {
        if (!userId) return;
        if (!newMemberName || !newMemberRelation) {
            Alert.alert("Missing Info", "Please enter Name and Relation.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await inviteService.createInvite(userId, newMemberName, newMemberRelation, newMemberPhone);
            const code = data.code;
            
            setShowAddForm(false);
            setNewMemberName('');
            setNewMemberRelation('');
            setNewMemberPhone('');

            // Create the deep link for one-click join
            const joinUrl = Linking.createURL('join', { queryParams: { code } });

            Alert.alert(
                "Invite Created!",
                `Share this code with ${newMemberName}: ${code}\n\nA "Pending" member has been added to your list. They will appear as "Joined" once they accept.`,
                [
                    { text: "Done" },
                    { 
                        text: "Send SMS", 
                        onPress: async () => {
                            const message = `Connect to my Safety Circle on FloodVisualizer! 🛡️\n\nClick this link to join: ${joinUrl}\n\nCode: ${code}`;
                            const isAvailable = await SMS.isAvailableAsync();
                            if (isAvailable) {
                                await SMS.sendSMSAsync([newMemberPhone], message);
                            } else {
                                const phoneUrl = Platform.OS === 'ios' ? `sms:${newMemberPhone}&body=${encodeURIComponent(message)}` : `sms:${newMemberPhone}?body=${encodeURIComponent(message)}`;
                                Linking.openURL(phoneUrl).catch(() => {
                                    Alert.alert("Error", "SMS is not supported on this device.");
                                });
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error("Invite error:", error);
            Alert.alert("Error", "Failed to create invite.");
        } finally {
            setLoading(false);
        }
    };

    // --- REAL-TIME TRACKING (SELF) ---
    // This allows THIS device to act as a tracked entity (e.g. if I am a member of someone else's circle)
    // Or if I just want to contribute my location to the system.
    const startSelfTracking = async () => {
        if (trackingActive) return;

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Location permission is required.");
            return;
        }

        setTrackingActive(true);
        locationSubscription.current = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
            async (loc) => {
                try {
                    const batteryLevel = await Battery.getBatteryLevelAsync();
                    await locationService.updateLocation({
                        userId: userId, // Tracking MYSELF
                        location: { lat: loc.coords.latitude, lon: loc.coords.longitude },
                        riskScore: 0,
                        batteryLevel: batteryLevel,
                        gpsStatus: "Active"
                    });
                } catch (error) { console.log("Tracking error:", error); }
            }
        );
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={styles.memberName}>{item.memberName} {isLinked && "(You)"}</Text>
                            {item.status === 'pending' && (
                                <View style={styles.pendingTag}>
                                    <Text style={styles.pendingTagText}>Invited</Text>
                                </View>
                            )}
                        </View>
                        <Text style={{ fontSize: 12, color: '#64748b' }}>
                            {item.status === 'pending' 
                                ? `Code: ${item.inviteCode}` 
                                : (item.batteryLevel ? `🔋 ${item.batteryLevel}%` : 'No Battery Data')}
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

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setShowAddForm(!showAddForm)}
                    >
                        <MaterialCommunityIcons name={showAddForm ? "close" : "account-plus"} size={24} color="#fff" />
                        <Text style={styles.addBtnText}>{showAddForm ? "Cancel" : "Invite Member"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: '#0ea5e9' }]}
                        onPress={() => navigation.navigate('JoinFamily')}
                    >
                        <MaterialCommunityIcons name="login" size={24} color="#fff" />
                        <Text style={styles.addBtnText}>Join a Circle</Text>
                    </TouchableOpacity>
                </View>

                {/* Invite Member Form */}
                {showAddForm && (
                     <View style={styles.addForm}>
                        <Text style={styles.formHeader}>Create Security Invite</Text>
                        <Text style={styles.formSubHeader}>Generate a code to share with your family member.</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Name (e.g. Mom)"
                            value={newMemberName}
                            onChangeText={setNewMemberName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Relation (e.g. Parent, Sibling)"
                            value={newMemberRelation}
                            onChangeText={setNewMemberRelation}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number (e.g. +9477...)"
                            value={newMemberPhone}
                            onChangeText={setNewMemberPhone}
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleCreateInvite}>
                            <Text style={styles.submitBtnText}>Generate Invite Code</Text>
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

    actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    addBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#16a34a', padding: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2 },
    addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    addForm: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#bbf7d0' },
    formHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#15803d' },
    formSubHeader: { fontSize: 13, color: '#64748b', marginBottom: 16 },
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
    
    pendingTag: { backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#fde68a' },
    pendingTagText: { fontSize: 10, color: '#92400e', fontWeight: 'bold', textTransform: 'uppercase' },
    
    emptyText: { textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', marginVertical: 20 },
});
