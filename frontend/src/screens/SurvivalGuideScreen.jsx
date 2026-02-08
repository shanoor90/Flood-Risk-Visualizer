import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SurvivalGuideScreen({ navigation }) {
    return (
        <DetailLayout 
            title="Offline Survival Guide" 
            icon="medical-bag" 
            color="#ecfdf5" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.guideHero}>
                    <MaterialCommunityIcons name="heart-flash" size={80} color="#10b981" />
                    <Text style={styles.heroTitle}>Survival & Medical Guide</Text>
                </View>

                <View style={styles.gridContainer}>
                    <GuideCard 
                        icon="bandage" 
                        title="First-Aid Tips" 
                        desc="Immediate instructions for drowning, hypothermia, and flood-related injuries." 
                    />
                    <GuideCard 
                        icon="phone-classic" 
                        title="Emergency Contacts" 
                        desc="Quick directory for Navy, Red Cross, and local rescue coordinating centers." 
                    />
                    <GuideCard 
                        icon="home-city-outline" 
                        title="Shelter Directory" 
                        desc="Localized list of safe zones, high-ground shelters, and relief camps." 
                    />
                    <GuideCard 
                        icon="wifi-off" 
                        title="100% Offline" 
                        desc="All information is embedded in the app. Accessible without any cellular or data connection." 
                    />
                </View>

                <View style={styles.note}>
                    <Text style={styles.noteText}>
                        Tip: Download latest updates periodically when you have a stable connection to ensure contacts and shelters are up to date.
                    </Text>
                </View>
            </View>
        </DetailLayout>
    );
}

function GuideCard({ icon, title, desc }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name={icon} size={28} color="#10b981" />
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Text style={styles.cardDesc}>{desc}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 20 },
    guideHero: { alignItems: 'center', marginVertical: 10 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#059669', marginTop: 10 },
    gridContainer: { gap: 16 },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0fdf4',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    cardDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },
    note: {
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 12,
        fontStyle: 'italic',
    },
    noteText: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
});
