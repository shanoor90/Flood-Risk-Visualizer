import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SurvivalGuideScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <MaterialCommunityIcons name="medical-bag" size={26} color="#1e3a8a" style={styles.headerIcon} />
                    <Text style={styles.headerTitle}>Offline Survival Guide</Text>
                </View>
                <View style={{ width: 40 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.heartContainer}>
                        <MaterialCommunityIcons name="heart-flash" size={100} color="#10b981" />
                    </View>
                    <Text style={styles.heroTitle}>Survival & Medical Guide</Text>
                </View>

                {/* Feature Cards */}
                <View style={styles.cardsContainer}>
                    <GuideCard 
                        icon="bandage" 
                        title="Mobile Bundle" 
                        desc="Embedded emergency information bundle in mobile app"
                        onPress={() => navigation.navigate('MobileBundle')}
                    />
                    
                    <GuideCard 
                        icon="phone-outline" 
                        title="Medical Guidance"
                        desc="First-aid instructions and medical guidance"
                        onPress={() => navigation.navigate('MedicalGuidance')}
                    />

                    <GuideCard 
                        icon="office-building" 
                        title="Emergency Directory"
                        desc="Local emergency contact directory and shelter locations"
                        onPress={() => navigation.navigate('EmergencyDirectory')}
                    />

                    <GuideCard 
                        icon="wifi-off" 
                        title="Internet Offline"
                        desc="Fully accessible without internet connectivity"
                        onPress={() => navigation.navigate('OfflineMode')}
                    />
                </View>

                {/* Footer Tip Section */}
                <View style={styles.footerNote}>
                    <Text style={styles.footerText}>
                        Tip: Download latest updates periodically when you have a stable connection to ensure contacts and shelters are up to date.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function GuideCard({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon} size={30} color="#10b981" />
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
        backgroundColor: '#f0fdf4', // Light green theme as per screenshot
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: '#f0fdf4',
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
    heartContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#10b981',
        marginTop: 10,
        textAlign: 'center',
    },
    cardsContainer: {
        width: '100%',
        gap: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
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
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    footerNote: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 10,
    },
    footerText: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});
