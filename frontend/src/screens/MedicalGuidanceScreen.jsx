import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MedicalGuidanceScreen({ navigation }) {
    return (
        <DetailLayout 
            title="Medical Guidance" 
            icon="medical-bag" 
            color="#ecfdf5" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="heart-pulse" size={60} color="#059669" />
                    </View>
                    <Text style={styles.heroTitle}>Emergency Medical Instructions</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            STABILIZATION PROTOCOLS
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.introText}>
                        This section provides step-by-step first-aid and emergency medical instructions tailored to flood-related incidents.
                    </Text>

                    <Text style={styles.sectionHeader}>Emergency Protocols:</Text>
                    
                    <View style={styles.bulletList}>
                        <InfoItem 
                            icon="bandage" 
                            title="Cuts & Wounds" 
                            desc="Treatment for minor cuts and open wounds to prevent infection." 
                        />
                        <InfoItem 
                            icon="snowflake" 
                            title="Hypothermia" 
                            desc="Managing body temperature in cold water exposure scenarios." 
                        />
                        <InfoItem 
                            icon="water-alert" 
                            title="Infection Prevention" 
                            desc="Preventing waterborne infections and maintaining hygiene." 
                        />
                        <InfoItem 
                            icon="bone" 
                            title="Fractures & Sprains" 
                            desc="How to handle and stabilize fractures and severe sprains." 
                        />
                        <InfoItem 
                            icon="human-handsup" 
                            title="Basic CPR" 
                            desc="Guidelines for Cardio-Pulmonary Resuscitation if required." 
                        />
                        <InfoItem 
                            icon="emoticon-confused-outline" 
                            title="Dehydration" 
                            desc="Identifying early and advanced dehydration symptoms." 
                        />
                    </View>

                    <View style={styles.footerNote}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#059669" style={{ marginBottom: 4 }} />
                        <Text style={styles.footerText}>
                            Instructions are presented in a simple, structured format to ensure usability under high-stress conditions. The goal is to assist users in stabilizing injuries until professional medical help arrives.
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
