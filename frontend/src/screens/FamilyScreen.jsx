import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authService } from '../services/authService';

export default function FamilyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="account-group" size={28} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Family Connection</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.container}
            >
                {/* Cleaned up UI: Government Announcements and Recent Alerts have been completely removed as requested. */}

                {/* Management Actions Section moved to top */}
                <Text style={[styles.sectionHeader, { marginTop: 10 }]}>Management Actions</Text>
                <View style={styles.cardsContainer}>

                    <FeatureCard
                        icon="map-search-outline"
                        title="Real-Time Monitoring"
                        desc="View full map visualization and geographical risk"
                        onPress={() => navigation.navigate('RealTimeMonitoring')}
                    />
                    {/* Brand New Dedicated Feature Screens */}
                    <FeatureCard
                        icon="heart-pulse"
                        title="Dynamic Positive Guidance"
                        desc="Receive contextual advice based on emotional state and weather"
                        onPress={() => navigation.navigate('DynamicGuidance')}
                    />
                    <FeatureCard
                        icon="flare"
                        title="The Digital Flare"
                        desc="Blast a localized offline Safe SMS broadcast to your entire synced network"
                        onPress={() => navigation.navigate('DigitalFlare')}
                    />
                    <FeatureCard
                        icon="weather-windy"
                        title="Breathing Space Board"
                        desc="Start a 30-second gamified breathing exercise for quick calm"
                        onPress={() => navigation.navigate('BreathingSpace')}
                    />
                    <FeatureCard
                        icon="card-account-phone"
                        title="Connect / Quick Contacts"
                        desc="Access local device contacts for instantaneous Call, SMS, or Loc Share"
                        onPress={() => navigation.navigate('Connect')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureCard({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#0284c7" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 30 : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
    headerIcon: { marginRight: 8 },
    container: { padding: 20, paddingBottom: 40 },
    
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, marginTop: 10 },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
    subHeaderText: { fontSize: 14, color: '#64748b', marginBottom: 20, fontStyle: 'italic' },
    
    cardsContainer: { gap: 12, marginTop: 10 },
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, borderWidth: 1, borderColor: '#f8fafc'
    },
    iconBox: { padding: 12, marginRight: 14, backgroundColor: '#e0f2fe', borderRadius: 12 },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
    cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
});
