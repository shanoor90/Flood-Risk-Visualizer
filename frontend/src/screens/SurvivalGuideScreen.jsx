import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { guideService } from '../services/api';

export default function SurvivalGuideScreen({ navigation }) {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingSafe, setMarkingSafe] = useState(false);

    useEffect(() => {
        fetchShelters();
    }, []);

    const fetchShelters = async () => {
        try {
            // Mock lat/lon for now
            const response = await guideService.getShelters(6.9271, 79.8612);
            setShelters(response.data);
        } catch (error) {
            console.log("Error fetching shelters:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkSafe = async () => {
        setMarkingSafe(true);
        try {
            await guideService.markSafe({
                userId: "user_123",
                shelterId: "s1", // Ideally selected from list
                notes: "Safe at Community Center"
            });
            Alert.alert("Status Updated", "You have been marked as SAFE.");
        } catch (error) {
            Alert.alert("Error", "Could not update status.");
        } finally {
            setMarkingSafe(false);
        }
    };

    return (
        <DetailLayout 
            title="Offline Survival Guide" 
            icon="medical-bag" 
            color="#ecfdf5" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.guideHero}>
                    <MaterialCommunityIcons name="heart-flash" size={80} color="#10b981" />
                    <Text style={styles.heroTitle}>Survival & Medical Guide</Text>
                    
                    <TouchableOpacity 
                        style={styles.safeBtn}
                        onPress={handleMarkSafe}
                        disabled={markingSafe}
                    >
                        {markingSafe ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                                <Text style={styles.safeBtnText}>I AM SAFE</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Shelters Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nearest Safe Shelters</Text>
                    {loading ? (
                        <ActivityIndicator color="#10b981" />
                    ) : (
                        shelters.map((shelter, index) => (
                            <View key={shelter.id || index} style={styles.shelterCard}>
                                <View style={styles.shelterInfo}>
                                    <Text style={styles.shelterName}>{shelter.name}</Text>
                                    <Text style={styles.shelterLoc}>{shelter.location}</Text>
                                </View>
                                <View style={styles.shelterStatus}>
                                    <Text style={[
                                        styles.statusText, 
                                        { color: shelter.status === 'OPEN' ? '#10b981' : '#ef4444' }
                                    ]}>{shelter.status}</Text>
                                    <Text style={styles.capacityText}>Cap: {shelter.capacity}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.gridContainer}>
                    <GuideCard 
                        icon="package-variant-closed" 
                        title="Mobile Bundle" 
                        desc="Embedded emergency information package for offline use" 
                        onPress={() => navigation.navigate('MobileBundle')}
                    />
                    <GuideCard 
                        icon="bandage" 
                        title="Medical Guidance" 
                        desc="First-aid instructions and emergency medical steps" 
                        onPress={() => navigation.navigate('MedicalGuidance')}
                    />
                    <GuideCard 
                        icon="phone-classic" 
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

                <View style={styles.note}>
                    <Text style={styles.noteText}>
                        Tip: Download latest updates periodically when you have a stable connection to ensure contacts and shelters are up to date.
                    </Text>
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function GuideCard({ icon, title, desc, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name={icon} size={28} color="#10b981" />
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Text style={styles.cardDesc}>{desc}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { gap: 20, paddingBottom: 40 },
    guideHero: { alignItems: 'center', marginVertical: 10, gap: 10 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#059669' },
    safeBtn: {
        flexDirection: 'row',
        backgroundColor: '#10b981',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        gap: 8,
        elevation: 4,
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    safeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    
    section: { gap: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#064e3b', marginLeft: 4 },
    shelterCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        elevation: 2,
        alignItems: 'center'
    },
    shelterName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    shelterLoc: { fontSize: 13, color: '#666' },
    shelterStatus: { alignItems: 'flex-end' },
    statusText: { fontSize: 14, fontWeight: 'bold' },
    capacityText: { fontSize: 12, color: '#999' },

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
