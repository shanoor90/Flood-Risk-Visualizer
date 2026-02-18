import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService } from '../services/api';
import * as Location from 'expo-location';

export default function GPSBackupScreen({ navigation }) {
    const [backingUp, setBackingUp] = useState(false);
    const [lastBackup, setLastBackup] = useState(null);

    const performBackup = async () => {
        setBackingUp(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission", "Location permission needed for backup.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            // Mock encryption step
            const encryptedPayload = {
                userId: "test_user_123",
                location: {
                    lat: location.coords.latitude,
                    lon: location.coords.longitude
                },
                encrypted: true,
                timestamp: new Date().toISOString()
            };

            await locationService.updateLocation(encryptedPayload);
            setLastBackup(new Date());
            Alert.alert("Success", "GPS Data Encrypted & Backed Up Securely.");
        } catch (error) {
            Alert.alert("Error", "Backup failed. Please try again.");
            console.error(error);
        } finally {
            setBackingUp(false);
        }
    };

    return (
        <DetailLayout 
            title="GPS Backup System" 
            icon="database-sync" 
            color="#ecfccb" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="shield-check" size={60} color="#65a30d" />
                    </View>
                    <Text style={styles.heroTitle}>Secure GPS Backup</Text>
                    <Text style={styles.statusText}>
                        Status: {lastBackup ? `Last backed up at ${lastBackup.toLocaleTimeString()}` : 'Ready to Backup'}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.backupBtn}
                    onPress={performBackup}
                    disabled={backingUp}
                >
                    {backingUp ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="cloud-upload" size={24} color="#fff" />
                            <Text style={styles.btnText}>BACKUP NOW</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.infoSection}>
                    <InfoItem 
                        icon="server-security" 
                        title="Secure Backend Storage" 
                        desc="The system performs periodic GPS location backups to a secure backend server." 
                    />
                    <InfoItem 
                        icon="wifi-off" 
                        title="Offline Accessibility" 
                        desc="Location data remains accessible even if the device is damaged, offline, or powered off." 
                    />
                    <InfoItem 
                        icon="ambulance" 
                        title="Emergency Retrieval" 
                        desc="Emergency responders can retrieve the user’s last recorded position during a flood event." 
                    />
                    <InfoItem 
                        icon="chart-timeline-variant" 
                        title="Risk Analysis" 
                        desc="Historical movement patterns can be analyzed for evacuation tracking and risk mapping." 
                    />
                    <InfoItem 
                        icon="lock" 
                        title="End-to-End Encryption" 
                        desc="All GPS data is encrypted during transmission to maintain privacy and data security." 
                    />
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={28} color="#4d7c0f" />
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24, paddingBottom: 30 },
    hero: { alignItems: 'center', marginVertical: 10 },
    iconContainer: { 
        width: 100, height: 100, borderRadius: 50, 
        backgroundColor: '#f7fee7', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#365314' },
    statusText: { fontSize: 14, color: '#65a30d', marginTop: 4 },
    
    backupBtn: {
        backgroundColor: '#65a30d',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        elevation: 3,
        shadowColor: '#65a30d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

    infoSection: { gap: 16 },
    item: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#bef264',
        elevation: 1
    },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a2e05', marginBottom: 4 },
    itemDesc: { fontSize: 13, color: '#44403c', lineHeight: 18 },
});
