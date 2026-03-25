import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import DetailLayout from '../components/DetailLayout';
import { familyService } from '../services/api';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Haversine formula to compute distance between two lat/lon points
function getDistanceInKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return (R * c).toFixed(1);
}

export default function DigitalFlareScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [currentPos, setCurrentPos] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const user = authService.getCurrentUser();
            if (!user) return;
            
            // 1. Grab Local Contacts from Connect storage
            const data = await AsyncStorage.getItem("connect_members_list");
            const localMembers = data ? JSON.parse(data) : [];
            
            // 2. Grab Live Location for Haversine without hanging
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let loc = await Location.getLastKnownPositionAsync({});
                if (!loc) {
                    loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                }
                setCurrentPos({ lat: loc.coords.latitude, lon: loc.coords.longitude });
            }
            
            setFamilyMembers(localMembers);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcast = async () => {
        if (!currentPos) {
            Alert.alert("Location Not Found", "Unable to get GPS, please enable location services.");
            return;
        }

        const validPhones = familyMembers
            .map(m => m.phone)
            .filter(p => p && p.trim() !== '');

        if (validPhones.length === 0) {
            Alert.alert("No Numbers", "No valid phone numbers found in your family network.");
            return;
        }

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentPos.lat},${currentPos.lon}`;
        const message = `I'm at ${currentPos.lat.toFixed(4)},${currentPos.lon.toFixed(4)}. I am safe. My fear level is Low. Check my location here: ${mapsUrl}`;

        // Create SMS String (Device specific comma vs semicolon handling)
        const recipientString = Platform.OS === 'ios' ? validPhones.join(',') : validPhones.join(';');
        const smsUrl = Platform.OS === 'ios' 
            ? `sms:${recipientString}&body=${encodeURIComponent(message)}`
            : `sms:${recipientString}?body=${encodeURIComponent(message)}`;

        Linking.openURL(smsUrl).catch(() => {
            Alert.alert("Error", "Could not open your SMS messenger.");
        });
    };

    return (
        <DetailLayout title="The Digital Flare" icon="flare" color="#fef2f2" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                
                <View style={styles.heroBox}>
                    <MaterialCommunityIcons name="broadcast" size={80} color="#dc2626" style={{marginBottom: 10}} />
                    <Text style={styles.heroTitle}>Broadcast Your Safety</Text>
                    <Text style={styles.heroSubtitle}>
                        In a crisis, cellular data often fails, but standard SMS usually pierces through congestion. 
                        Pressing the button below blasts an identical emergency SMS containing your exact GPS coordinates to your entire Family Network simultaneously.
                    </Text>
                </View>

                {/* THE BROADCAST BUTTON */}
                <TouchableOpacity style={styles.flareButton} onPress={handleBroadcast}>
                    <View style={styles.flarePulse}>
                        <MaterialCommunityIcons name="chat-alert" size={48} color="#fff" />
                    </View>
                    <Text style={styles.flareText}>TRIGGER "I'M SAFE" FLARE</Text>
                    <Text style={styles.flareSubText}>Message will read: "I am safe. My fear level is Low..."</Text>
                </TouchableOpacity>

                <View style={styles.proximitySection}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16}}>
                        <MaterialCommunityIcons name="radar" size={24} color="#0f172a" />
                        <Text style={styles.sectionHeader}>Family Proximity Radar</Text>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="small" color="#dc2626" />
                    ) : familyMembers.length === 0 ? (
                        <Text style={styles.emptyText}>No synced family members found.</Text>
                    ) : (
                        familyMembers.map(member => {
                            let distanceTxt = "Unknown Home Loc";
                            if (currentPos && member.homeLocation && member.homeLocation.lat) {
                                const dist = getDistanceInKm(currentPos.lat, currentPos.lon, member.homeLocation.lat, member.homeLocation.lon);
                                distanceTxt = `~${dist} km from you`;
                            }

                            return (
                                <View key={member.id} style={styles.memberCard}>
                                    <View style={styles.memberAvatar}>
                                        <MaterialCommunityIcons name="account" size={24} color="#1d4ed8" />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.memberName}>{member.name} <Text style={{fontWeight: 'normal', color: '#64748b'}}>({member.relation})</Text></Text>
                                        <Text style={[styles.distanceText, distanceTxt !== "Unknown Home Loc" && {color: '#dc2626', fontWeight: 'bold'}]}>
                                            <MaterialCommunityIcons name="map-marker-distance" size={14} /> {distanceTxt}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 60, alignItems: 'center' },
    
    heroBox: { alignItems: 'center', backgroundColor: '#fff', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#fecaca', marginBottom: 30, elevation: 2 },
    heroTitle: { fontSize: 22, fontWeight: '900', color: '#991b1b', marginBottom: 10, textTransform: 'uppercase' },
    heroSubtitle: { fontSize: 14, color: '#450a0a', textAlign: 'center', lineHeight: 22 },

    flareButton: { backgroundColor: '#dc2626', width: '100%', paddingVertical: 24, paddingHorizontal: 20, borderRadius: 24, alignItems: 'center', elevation: 8, shadowColor: '#dc2626', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { height: 6, width: 0 }, marginBottom: 40 },
    flarePulse: { backgroundColor: '#b91c1c', padding: 20, borderRadius: 40, marginBottom: 16 },
    flareText: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1.5, marginBottom: 8 },
    flareSubText: { fontSize: 14, color: '#fca5a5', textAlign: 'center', fontStyle: 'italic' },

    proximitySection: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2, borderWidth: 1, borderColor: '#e2e8f0' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    emptyText: { color: '#64748b', fontStyle: 'italic' },

    memberCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    memberAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    memberName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    distanceText: { fontSize: 14, color: '#64748b' }
});
