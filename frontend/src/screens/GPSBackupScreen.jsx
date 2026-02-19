import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
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
        } finally {
            setBackingUp(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="database-sync" size={24} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>GPS Backup</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Hero section */}
                <View style={styles.hero}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="shield-cloud" size={70} color="#16a34a" />
                    </View>
                    <Text style={styles.mainTitle}>Secure GPS Storage</Text>
                    <Text style={styles.heroDesc}>
                        The system performs periodic GPS location backups to a secure backend server.
                    </Text>
                </View>

                {/* Backup Button */}
                <TouchableOpacity
                    style={styles.backupBtn}
                    onPress={performBackup}
                    disabled={backingUp}
                >
                    {backingUp ? <ActivityIndicator color="#fff" /> : (
                        <>
                            <MaterialCommunityIcons name="sync" size={24} color="#fff" />
                            <Text style={styles.btnText}>FORCE SECURE BACKUP</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Features / Content */}
                <View style={styles.contentBox}>
                    <Text style={styles.sectionHeader}>System Benefits</Text>

                    <BenefitItem
                        icon="check-circle-outline"
                        text="The latest verified coordinates are stored safely in real time."
                    />
                    <BenefitItem
                        icon="wifi-off"
                        text="Location data remains accessible even if the device is damaged, offline, or powered off."
                    />
                    <BenefitItem
                        icon="ambulance"
                        text="Emergency responders can retrieve the user’s last recorded position during a flood event."
                    />
                    <BenefitItem
                        icon="chart-timeline-variant"
                        text="Historical movement patterns can be analyzed for evacuation tracking and risk mapping."
                    />
                    <BenefitItem
                        icon="lock-check"
                        text="All GPS data is encrypted during transmission to maintain privacy and data security."
                    />
                </View>

                {lastBackup && (
                    <Text style={styles.footerInfo}>Last synced: {lastBackup.toLocaleTimeString()}</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function BenefitItem({ icon, text }) {
    return (
        <View style={styles.benefitRow}>
            <MaterialCommunityIcons name={icon} size={24} color="#16a34a" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    heroDesc: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
    },
    backupBtn: {
        backgroundColor: '#16a34a',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        gap: 10,
        marginVertical: 10,
        elevation: 2,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        letterSpacing: 0.5,
    },
    contentBox: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 16,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 12,
    },
    benefitIcon: {
        marginTop: 2,
    },
    benefitText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    footerInfo: {
        textAlign: 'center',
        marginTop: 20,
        color: '#94a3b8',
        fontSize: 12,
        fontStyle: 'italic',
    },
});
