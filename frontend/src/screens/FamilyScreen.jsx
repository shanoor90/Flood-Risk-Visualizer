import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FamilyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Custom Header */}
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

            <ScrollView contentContainerStyle={styles.container}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.pulseContainer}>
                        <MaterialCommunityIcons name="pulse" size={80} color="#0077b6" />
                    </View>
                    <Text style={styles.heroTitle}>Safety Circle Dashboard</Text>
                </View>

                {/* Feature Cards Grid */}
                <View style={styles.cardsContainer}>
                    <FeatureCard
                        icon="account-circle-outline"
                        title="Personalized Safety Circle"
                        desc="Add family members to personalized Safety Circle"
                        onPress={() => navigation.navigate('SafetyCircle')}
                    />

                    <FeatureCard
                        icon="database-outline"
                        title="Family Relationships"
                        desc="Backend stores and manages family relationships"
                        onPress={() => navigation.navigate('FamilyRelationships')}
                    />

                    <FeatureCard
                        icon="power"
                        title="Real-Time Monitoring"
                        desc="Continuous flood risk monitoring at each member's location"
                        onPress={() => navigation.navigate('RealTimeMonitoring')}
                    />

                    <FeatureCard
                        icon="bell-outline"
                        title="Automatic Alerts"
                        desc="Automatic notifications when family enters high-risk zones"
                        onPress={() => navigation.navigate('AutomaticAlerts')}
                    />
                </View>

                {/* Footer Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Sharing is Safety</Text>
                    <Text style={styles.infoText}>
                        Invite your loved ones to share their location frequency to ensure everyone stays connected during the monsoon.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureCard({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#0077b6" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f9ff', // Very light blue
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: '#f0f9ff',
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
        alignItems: 'center',
    },
    hero: {
        alignItems: 'center',
        marginBottom: 30,
    },
    pulseContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginTop: 10,
    },
    cardsContainer: {
        width: '100%',
        gap: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconBox: {
        padding: 10,
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    infoCard: {
        backgroundColor: 'rgba(224, 242, 254, 0.8)',
        borderRadius: 16,
        padding: 20,
        marginTop: 30,
        width: '100%',
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0369a1',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#0e7490',
        lineHeight: 20,
    },
});
