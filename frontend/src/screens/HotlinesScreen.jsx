import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HotlinesScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [station, setStation] = useState(null);

    useEffect(() => {
        fetchNearestPolice();
    }, []);

    const fetchNearestPolice = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission", "Location permission needed to find nearest Police Station.");
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Use Overpass API to find nearest police station
            const query = `[out:json];node(around:10000,${latitude},${longitude})[amenity=police];out 1;`;
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });

            const data = await response.json();
            if (data.elements && data.elements.length > 0) {
                const element = data.elements[0];
                const phone = element.tags?.phone || element.tags?.['contact:phone'] || '119';
                setStation({
                    name: element.tags?.name || "Nearest Police Station",
                    distance: "Nearby",
                    phone: phone
                });
            } else {
                // Fallback to national emergency number
                setStation({ name: "National Police Emergency", distance: "N/A", phone: "119" });
            }
        } catch (error) {
            console.error("Location error:", error);
            setStation({ name: "National Police Emergency", distance: "N/A", phone: "119" });
        } finally {
            setLoading(false);
        }
    };

    const makeCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`).catch(err => {
            Alert.alert("Error", "Could not open dialer.");
        });
    };

    return (
        <DetailLayout title="Hotlines" icon="police-badge" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Police & Emergency Hotlines</Text>
                <Text style={styles.desc}>Immediate connection to the nearest available emergency responder.</Text>
                
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#059669" />
                        <Text style={styles.loadingText}>Locating nearest Police Station...</Text>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="shield-account" size={32} color="#064e3b" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.title}>{station?.name}</Text>
                                <Text style={styles.subtitle}>Response Time: Rapid ({station?.distance})</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.callButton} onPress={() => makeCall(station?.phone)}>
                            <MaterialCommunityIcons name="phone" size={24} color="#fff" />
                            <Text style={styles.callText}>CALL {station?.phone}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="fire-truck" size={32} color="#c53030" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.title}>Fire & Rescue</Text>
                            <Text style={styles.subtitle}>National Emergency Number</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.callButton, { backgroundColor: '#c53030' }]} onPress={() => makeCall("110")}>
                        <MaterialCommunityIcons name="phone" size={24} color="#fff" />
                        <Text style={styles.callText}>CALL 110</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, paddingBottom: 30 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#064e3b' },
    desc: { fontSize: 14, color: '#475569', marginBottom: 10 },
    loadingBox: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderRadius: 12 },
    loadingText: { marginTop: 12, color: '#059669', fontWeight: '500' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
    callButton: { backgroundColor: '#059669', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, gap: 8 },
    callText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
