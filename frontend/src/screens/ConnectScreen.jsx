import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import DetailLayout from '../components/DetailLayout';
import { familyService } from '../services/api';
import { authService } from '../services/authService';

const CONNECT_MEMBERS_KEY = "connect_members_list";

export default function ConnectScreen({ navigation }) {
    const [connectMembers, setConnectMembers] = useState([]);
    const [showAddConnect, setShowAddConnect] = useState(false);
    
    const [connectName, setConnectName] = useState('');
    const [connectPhone, setConnectPhone] = useState('');
    const [connectRelation, setConnectRelation] = useState('');
    const [homeLocation, setHomeLocation] = useState(null);
    const [fetchingLocation, setFetchingLocation] = useState(false);

    useEffect(() => {
        loadConnectMembers();
    }, []);

    const loadConnectMembers = async () => {
        try {
            const user = authService.getCurrentUser();
            if (user) {
                const response = await familyService.getConnectMembers(user.uid);
                if (response.data) setConnectMembers(response.data);
            }
        } catch (error) { console.log(error); }
    };

    const saveConnectMember = async () => {
        if (!connectName || !connectPhone || !connectRelation) {
            Alert.alert("Missing Info", "Please enter Name, Relation, and Phone.");
            return;
        }
        const user = authService.getCurrentUser();
        if (!user) {
            Alert.alert("Error", "User not logged in.");
            return;
        }
        
        const newMember = { 
            id: Date.now().toString(), 
            name: connectName, 
            phone: connectPhone, 
            relation: connectRelation,
            homeLocation: homeLocation
        };
        const updatedMembers = [...connectMembers, newMember];
        try {
            await familyService.addConnectMember(user.uid, newMember);
            
            setConnectMembers(updatedMembers);
            setShowAddConnect(false);
            setConnectName('');
            setConnectPhone('');
            setConnectRelation('');
            setHomeLocation(null);
            Alert.alert("Saved", "Connection saved successfully.");
        } catch (error) { 
            console.log("Save error:", error);
            Alert.alert("Error", "Could not save connection to database."); 
        }
    };

    const fetchCurrentLocationForHome = async () => {
        setFetchingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { Alert.alert("Permission denied", "Need location to set Home."); return; }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setHomeLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
            Alert.alert("Location Seized", "Current GPS coordinates bound to this contact's Home Base.");
        } catch (e) {
            Alert.alert("Error", "Failed to get location.");
        } finally {
            setFetchingLocation(false);
        }
    };

    const removeConnectMember = async (id) => {
        const updatedMembers = connectMembers.filter(m => m.id !== id);
        try {
            const user = authService.getCurrentUser();
            if (user) {
                await familyService.removeConnectMember(user.uid, id);
                setConnectMembers(updatedMembers);
            }
        } catch (error) { console.log(error); }
    };

    const handleCall = (phone) => Linking.openURL(`tel:${phone}`);
    const handleText = async (phone) => {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            await SMS.sendSMSAsync([phone], '');
        } else {
            Linking.openURL(Platform.OS === 'ios' ? `sms:${phone}` : `sms:${phone}?body=`);
        }
    };
    const handleShareLocation = async (phone) => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { Alert.alert("Permission denied", "Need location to share."); return; }
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            const message = `I need help or want to share my location! Here is where I am: ${mapsUrl}`;
            
            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                await SMS.sendSMSAsync([phone], message);
            } else {
                const url = Platform.OS === 'ios' ? `sms:${phone}&body=${encodeURIComponent(message)}` : `sms:${phone}?body=${encodeURIComponent(message)}`;
                Linking.openURL(url);
            }
        } catch (error) { Alert.alert("Error", "Could not fetch location."); }
    };

    const renderConnectMember = (item) => (
        <View key={item.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                    <MaterialCommunityIcons name="account" size={28} color="#15803d" />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberRelation}>{item.relation} • {item.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => removeConnectMember(item.id)} style={{padding: 8}}>
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>
            <View style={styles.connectActions}>
                <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#dcfce7'}]} onPress={() => handleCall(item.phone)}>
                    <MaterialCommunityIcons name="phone" size={20} color="#16a34a" />
                    <Text style={[styles.linkText, {color: '#16a34a'}]}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#e0f2fe'}]} onPress={() => handleText(item.phone)}>
                    <MaterialCommunityIcons name="message-text" size={20} color="#0284c7" />
                    <Text style={[styles.linkText, {color: '#0284c7'}]}>SMS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#fef3c7'}]} onPress={() => handleShareLocation(item.phone)}>
                    <MaterialCommunityIcons name="map-marker-radius" size={20} color="#d97706" />
                    <Text style={[styles.linkText, {color: '#d97706'}]}>Share Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <DetailLayout title="Local Contacts" icon="card-account-phone" color="#f3f4f6" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                
                <Text style={styles.headerSubtitle}>
                    Save emergency contacts directly to your database for quick access.
                </Text>

                <TouchableOpacity 
                    style={[styles.primaryBtn, showAddConnect && styles.primaryBtnCancel]} 
                    onPress={() => setShowAddConnect(!showAddConnect)}
                >
                    <MaterialCommunityIcons name={showAddConnect ? "close" : "card-account-phone-outline"} size={22} color="#fff" />
                    <Text style={styles.primaryBtnText}>{showAddConnect ? "Cancel Form" : "Add New Connection"}</Text>
                </TouchableOpacity>

                {showAddConnect && (
                    <View style={styles.formContainer}>
                        <Text style={styles.formHeader}>Connection Form</Text>
                        <TextInput style={styles.input} placeholder="Name (e.g. Dad)" value={connectName} onChangeText={setConnectName} />
                        <TextInput style={styles.input} placeholder="Relation (e.g. Parent)" value={connectRelation} onChangeText={setConnectRelation} />
                        <TextInput style={styles.input} placeholder="Phone Number" value={connectPhone} onChangeText={setConnectPhone} keyboardType="phone-pad" />
                        
                        <TouchableOpacity style={styles.locationBtn} onPress={fetchCurrentLocationForHome}>
                            <MaterialCommunityIcons name={homeLocation ? "map-marker-check" : "map-marker-account"} size={20} color={homeLocation ? "#fff" : "#0369a1"} />
                            <Text style={[styles.locationBtnText, homeLocation && {color: '#fff'}]}>
                                {fetchingLocation ? "Acquiring..." : homeLocation ? "Home Location Pinned" : "Set Current Location as Home"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.submitBtn} onPress={saveConnectMember}>
                            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                            <Text style={styles.submitBtnText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.listContainer}>
                    <Text style={styles.sectionHeader}>Saved Quick Contacts</Text>
                    {connectMembers.length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="contacts-outline" size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No quick connections added yet.</Text>
                        </View>
                    ) : (
                        connectMembers.map(item => renderConnectMember(item))
                    )}
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 60 },
    headerSubtitle: { fontSize: 15, color: '#475569', marginBottom: 20, textAlign: 'center', lineHeight: 22 },
    
    primaryBtn: { flexDirection: 'row', backgroundColor: '#374151', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 2, marginBottom: 20 },
    primaryBtnCancel: { backgroundColor: '#ef4444' },
    primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e5e7eb', elevation: 2 },
    formHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
    
    locationBtn: { flexDirection: 'row', backgroundColor: '#e0f2fe', padding: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#bae6fd' },
    locationBtnText: { color: '#0369a1', fontWeight: 'bold', fontSize: 14 },
    
    submitBtn: { flexDirection: 'row', backgroundColor: '#15803d', padding: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
    submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
    listContainer: { gap: 16 },
    
    memberCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2, borderWidth: 1, borderColor: '#f3f4f6' },
    memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
    memberName: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
    memberRelation: { fontSize: 14, color: '#64748b', marginTop: 4 },
    
    connectActions: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
    actionBtn: { flex: 1, flexDirection: 'row', paddingVertical: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 6 },
    linkText: { fontSize: 14, fontWeight: 'bold' },

    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'dashed' },
    emptyText: { color: '#94a3b8', fontSize: 15, marginTop: 12 },
});
