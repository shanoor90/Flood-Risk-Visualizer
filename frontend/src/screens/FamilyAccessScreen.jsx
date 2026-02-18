import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FamilyAccessScreen({ navigation }) {
    return (
        <DetailLayout 
            title="Family Access" 
            icon="account-group" 
            color="#f3e8ff" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="home-heart" size={60} color="#7e22ce" />
                    </View>
                    <Text style={styles.heroTitle}>Family Access</Text>
                    <Text style={styles.statusText}>
                        Secure Location Sharing
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.manageBtn}
                    onPress={() => navigation.navigate('Family')}
                >
                    <MaterialCommunityIcons name="account-cog" size={24} color="#fff" />
                    <Text style={styles.btnText}>MANAGE FAMILY MEMBERS</Text>
                </TouchableOpacity>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionHeader}>Secure Access History</Text>
                    <Text style={styles.introText}>
                        In the event of communication loss, authorized family members can securely access the user’s recent location history.
                    </Text>

                    <View style={styles.bulletList}>
                        <InfoItem 
                            icon="heart-check" 
                            title="Peace of Mind" 
                            desc="Peace of mind during extreme weather events." 
                        />
                        <InfoItem 
                            icon="update" 
                            title="Real-time Updates" 
                            desc="Real-time updates on a loved one’s safety status." 
                        />
                        <InfoItem 
                            icon="map-marker-distance" 
                            title="Location Visibility" 
                            desc="Location visibility for coordination during evacuations." 
                        />
                        <InfoItem 
                            icon="shield-key" 
                            title="Controlled Access" 
                            desc="Controlled access with authentication and privacy safeguards." 
                        />
                    </View>
                    
                    <Text style={styles.footerText}>
                        Access permissions are configurable by the user to ensure privacy and data protection.
                    </Text>
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <View style={styles.item}>
            <MaterialCommunityIcons name={icon} size={28} color="#7e22ce" />
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
        backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16
    },
    heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#581c87' },
    statusText: { fontSize: 14, color: '#9333ea', marginTop: 4, fontWeight: 'bold' },

    manageBtn: {
        backgroundColor: '#9333ea',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        elevation: 3
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },

    infoSection: { gap: 12, marginTop: 10 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#581c87' },
    introText: { fontSize: 14, color: '#44403c', lineHeight: 22 },
    bulletList: { gap: 12, marginVertical: 8 },
    footerText: { fontSize: 14, color: '#581c87', fontStyle: 'italic', fontWeight: '500', marginTop: 8 },

    item: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#c084fc',
    },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#581c87', marginBottom: 2 },
    itemDesc: { fontSize: 13, color: '#44403c', lineHeight: 18 },
});
