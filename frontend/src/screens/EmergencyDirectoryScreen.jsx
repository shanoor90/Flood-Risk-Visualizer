import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmergencyDirectoryScreen({ navigation }) {
    return (
        <DetailLayout 
            title="Emergency Directory" 
            icon="folder-account" 
            color="#ecfdf5" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="phone-classic" size={60} color="#059669" />
                    </View>
                    <Text style={styles.heroTitle}>Emergency Resource Directory</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            LOCALLY STORED & VERIFIED
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.introText}>
                        The Emergency Directory provides locally stored contact information and shelter details relevant to flood emergencies.
                    </Text>

                    <Text style={styles.sectionHeader}>Key Contacts & locations:</Text>
                    
                    <View style={styles.bulletList}>
                        <InfoItem 
                            icon="police-badge" 
                            title="Hotlines" 
                            desc="Police and emergency hotlines for immediate assistance." 
                        />
                        <InfoItem 
                            icon="ambulance" 
                            title="Ambulance Services" 
                            desc="Quick access to local medical transport and ambulance dispatch." 
                        />
                        <InfoItem 
                            icon="shield-alert" 
                            title="Management Authorities" 
                            desc="Contacts for disaster management and relief authorities." 
                        />
                        <InfoItem 
                            icon="hospital-building" 
                            title="Hospitals & Clinics" 
                            desc="List of nearby hospitals and 24/7 medical centers." 
                        />
                        <InfoItem 
                            icon="home-city" 
                            title="Evacuation Shelters" 
                            desc="Government-approved shelters and safe locations." 
                        />
                    </View>

                    <View style={styles.footerNote}>
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="#059669" style={{ marginBottom: 4 }} />
                        <Text style={styles.footerText}>
                            Location-based filtering ensures users can quickly identify the nearest safe locations. This directory is periodically updated when online to maintain accuracy.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={24} color="#059669" />
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
        backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#064e3b', textAlign: 'center', paddingHorizontal: 20 },
    statusBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#10b981',
        marginTop: 8
    },
    statusText: { fontSize: 12, color: '#059669', fontWeight: 'bold' },

    infoSection: { gap: 12, marginTop: 10 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#064e3b', marginTop: 8 },
    introText: { fontSize: 15, color: '#1f2937', lineHeight: 22, fontWeight: '500' },
    bulletList: { gap: 12, marginVertical: 8 },

    item: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#10b981',
        elevation: 1
    },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#064e3b', marginBottom: 2 },
    itemDesc: { fontSize: 13, color: '#4b5563', lineHeight: 18 },

    footerNote: {
        backgroundColor: '#f0fdf4',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1fae5'
    },
    footerText: { fontSize: 13, color: '#064e3b', textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
});
