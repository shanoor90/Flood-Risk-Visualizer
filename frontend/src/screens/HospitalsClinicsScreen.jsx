import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HospitalsClinicsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        fetchNearestHospitals();
    }, []);

    const fetchNearestHospitals = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission", "Location permission needed to find nearest hospitals.");
                setLoading(false);
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            if (!location) {
                location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            }
            const { latitude, longitude } = location.coords;

            // Overpass API to find nearest hospitals (limit to 3)
            const query = `[out:json];node(around:20000,${latitude},${longitude})[amenity=hospital];out 3;`;
            
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
                const results = data.elements.map(el => ({
                    id: el.id.toString(),
                    name: el.tags?.name || "Government Hospital",
                    phone: el.tags?.phone || el.tags?.['contact:phone'] || '1990'
                }));
                setHospitals(results);
            } else {
                // No elements found, use fallback
                setHospitals([
                    { id: 'f1', name: "National Hospital of Sri Lanka", phone: "0112 691 111" },
                    { id: 'f2', name: "Emergency Medical Service", phone: "1990" }
                ]);
            }
        } catch (error) {
            console.log("Hospital Fetch Error:", error.message);
            // Robust fallback data on any failure
            setHospitals([
                { id: 'f1', name: "National Hospital of Sri Lanka", phone: "0112 691 111" },
                { id: 'f2', name: "Emergency Medical Service", phone: "1990" }
            ]);
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
        <DetailLayout title="Hospitals & Clinics" icon="hospital-building" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Nearest Medical Facilities</Text>
                <Text style={styles.desc}>Government Hospitals located closest to your current position.</Text>
                
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#059669" />
                        <Text style={styles.loadingText}>Fetching nearest facilities...</Text>
                    </View>
                ) : (
                    hospitals.map((hospital, i) => (
                        <View key={hospital.id + i} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="hospital-box" size={32} color="#064e3b" />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.title}>{hospital.name}</Text>
                                    <Text style={styles.subtitle}>24/7 Emergency Care</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.callButton} onPress={() => makeCall(hospital.phone)}>
                                <MaterialCommunityIcons name="phone" size={24} color="#059669" />
                                <Text style={styles.callText}>CALL RECEPTION</Text>
                            </TouchableOpacity>
                        </View>
                    ))
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
    callButton: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#34d399', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, gap: 8 },
    callText: { color: '#059669', fontWeight: 'bold', fontSize: 16 },
});
