import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sosService } from '../services/api';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

export default function SOSScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const handleTriggerSOS = async () => {
        setLoading(true);
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                Alert.alert("Error", "You must be logged in to trigger SOS.");
                return;
            }

            // Get location (mocking for now, usually would use Expo Location)
            const location = { lat: 6.9271, lon: 79.8612 }; 

            await sosService.triggerSOS({
                userId: user.uid,
                coords: location,
                battery: 85 // Mock battery
            });

            // Also save to Firestore
            await dataService.saveSOSAlert({
                userId: user.uid,
                location: location,
                status: 'active'
            });

            Alert.alert("SOS Triggered", "Emergency contacts have been notified.");
        } catch (error) {
            Alert.alert("SOS Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency SOS</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.content}>
                    <MaterialCommunityIcons name="alert-decagram" size={100} color="#ef4444" />
                    <Text style={styles.title}>Emergency Assistance</Text>
                    <Text style={styles.desc}>
                        Press the button below to notify your emergency contacts and local authorities with your current location.
                    </Text>

                    <TouchableOpacity 
                        style={[styles.sosButton, loading && styles.disabled]} 
                        onPress={handleTriggerSOS}
                        disabled={loading}
                    >
                        <Text style={styles.sosText}>{loading ? "SENDING..." : "TRIGGER SOS"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>What happens when you trigger SOS?</Text>
                    <Text style={styles.infoText}>• Your real-time location is shared with family members.</Text>
                    <Text style={styles.infoText}>• Emergency services receive a high-priority alert.</Text>
                    <Text style={styles.infoText}>• SMS notifications are sent to your verified contacts.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a' },
    container: { padding: 20 },
    content: { alignItems: 'center', marginVertical: 40 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginTop: 16 },
    desc: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 12, lineHeight: 24 },
    sosButton: { 
        backgroundColor: '#ef4444', 
        width: 200, 
        height: 200, 
        borderRadius: 100, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 40,
        elevation: 8,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    sosText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    disabled: { opacity: 0.6 },
    infoBox: { backgroundColor: '#fef2f2', padding: 20, borderRadius: 16, marginTop: 20 },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#b91c1c', marginBottom: 10 },
    infoText: { fontSize: 14, color: '#dc2626', marginBottom: 6 },
});
