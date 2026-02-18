import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated, Easing } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { locationService } from '../services/api';

const USER_ID = "test_user_123";

export default function HighRiskScreen({ navigation }) {
    const [isHighRisk, setIsHighRisk] = useState(false);
    // Pulse animation for the active indicator
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        fetchStatus();
        startPulse();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await locationService.getPreferences(USER_ID);
            if (response.data) {
                setIsHighRisk(response.data.highRiskFrequency);
            }
        } catch (error) {
            console.log("Error fetching status", error);
        }
    };

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    return (
        <DetailLayout 
            title="High-Risk Frequency" 
            icon="speedometer" 
            color="#ffe4e6" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <Animated.View style={[
                        styles.iconContainer, 
                        isHighRisk && { transform: [{ scale: pulseAnim }], backgroundColor: '#fee2e2' }
                    ]}>
                        <MaterialCommunityIcons 
                            name="alert-decagram" 
                            size={60} 
                            color={isHighRisk ? "#ef4444" : "#94a3b8"} 
                        />
                    </Animated.View>
                    <Text style={styles.heroTitle}>Dynamic Tracking System</Text>
                    <View style={[styles.statusBadge, isHighRisk ? styles.activeBadge : styles.inactiveBadge]}>
                         <Text style={[styles.statusText, isHighRisk ? styles.activeText : styles.inactiveText]}>
                            {isHighRisk ? "CURRENTLY ACTIVE (1m Interval)" : "NORMAL MODE (15m Interval)"}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionHeader}>Why High-Risk Frequency?</Text>
                    <Text style={styles.introText}>
                        During high-risk flood conditions (e.g., heavy rainfall alerts, rising water levels), 
                        the system automatically increases location update frequency.
                    </Text>

                    <InfoItem 
                        icon="crosshairs-gps" 
                        title="Accurate Real-Time Tracking" 
                        desc="Provides precise location data updates every minute to ensure recent data is always available." 
                    />
                    <InfoItem 
                        icon="run-fast" 
                        title="Faster Response" 
                        desc="Enables emergency responders to coordinate faster and more effectively." 
                    />
                    <InfoItem 
                        icon="eye-outline" 
                        title="Situational Awareness" 
                        desc="Improved visibility for disaster management authorities." 
                    />
                    <InfoItem 
                        icon="refresh-auto" 
                        title="Dynamic Reassessment" 
                        desc="Automatically adapts interval based on changing environmental conditions." 
                    />
                    <InfoItem 
                        icon="battery-charging-high" 
                        title="Battery Optimization" 
                        desc="When risks subside, tracking reverts to normal frequency to conserve power." 
                    />
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={28} color="#be123c" />
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
        backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#881337' },
    
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        borderWidth: 1,
    },
    activeBadge: { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
    inactiveBadge: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
    
    statusText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
    activeText: { color: '#ef4444' },
    inactiveText: { color: '#64748b' },

    infoSection: { gap: 16 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#881337', marginBottom: 4 },
    introText: { fontSize: 14, color: '#44403c', lineHeight: 22, marginBottom: 10, fontStyle: 'italic' },

    item: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#f43f5e',
        elevation: 1
    },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#881337', marginBottom: 4 },
    itemDesc: { fontSize: 13, color: '#44403c', lineHeight: 18 },
});
