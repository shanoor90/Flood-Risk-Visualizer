import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function AmbulanceServicesScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [hospital, setHospital] = useState(null);

    useEffect(() => {
        fetchNearestHospital();
    }, []);

    const fetchNearestHospital = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission", "Location permission needed to find nearest hospital.");
                setLoading(false);
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            if (!location) {
                location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            }
            const { latitude, longitude } = location.coords;

            // Overpass API to find nearest hospital
            const query = `[out:json];node(around:15000,${latitude},${longitude})[amenity=hospital];out 1;`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("API returned non-JSON response");
            }

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error("Failed to parse JSON response");
            }

            if (data && data.elements && data.elements.length > 0) {
                const element = data.elements[0];
                const phone = element.tags?.phone || element.tags?.['contact:phone'] || '1990';
                setHospital({
                    name: element.tags?.name || "Govt. Hospital Ambulance",
                    distance: "Nearby",
                    phone: phone
                });
            } else {
                setHospital({ name: "National Suwa Seriya Ambulance", distance: "N/A", phone: "1990" });
            }
        } catch (error) {
            console.log("Ambulance Fetch Error:", error.message);
            setHospital({ name: "National Suwa Seriya Ambulance", distance: "N/A", phone: "1990" });
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
        <DetailLayout title="Ambulance Services" icon="ambulance" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Nearest Medical Transport</Text>
                <Text style={styles.desc}>Dispatch an ambulance to your current GPS location.</Text>
                
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#059669" />
                        <Text style={styles.loadingText}>Locating nearest Ambulance dispatch...</Text>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="hospital-marker" size={32} color="#064e3b" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.title}>{hospital?.name}</Text>
                                <Text style={styles.subtitle}>Type: Medical Emergency</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.callButton} onPress={() => makeCall(hospital?.phone)}>
                            <MaterialCommunityIcons name="phone" size={24} color="#fff" />
                            <Text style={styles.callText}>CALL {hospital?.phone}</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
