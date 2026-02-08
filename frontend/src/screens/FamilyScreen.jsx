import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FamilyScreen({ navigation }) {
    return (
        <DetailLayout 
            title="Family Connection" 
            icon="account-group" 
            color="#e0f2fe" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.hero}>
                    <MaterialCommunityIcons name="heart-pulse" size={80} color="#0284c7" />
                    <Text style={styles.heroTitle}>Safety Circle Dashboard</Text>
                </View>

                <View style={styles.infoList}>
                    <CardItem 
                        title="Personalized Safety Circle" 
                        desc="Easily add and manage family members in your personalized Circle of Trust." 
                        icon="shield-account" 
                    />
                    <CardItem 
                        title="Relationship Management" 
                        desc="Secure backend storage manages complex family relationships and shared safety data." 
                        icon="server-network" 
                    />
                    <CardItem 
                        title="Continuous Monitoring" 
                        desc="Real-time monitoring of flood risks at the precise location of every family member." 
                        icon="radar" 
                    />
                    <CardItem 
                        title="Automatic Notifications" 
                        desc="Instant alerts triggered when family members enter designated high-risk flood zones." 
                        icon="bell-ring-outline" 
                    />
                </View>

                <View style={styles.blueBox}>
                    <Text style={styles.blueTitle}>Sharing is Safety</Text>
                    <Text style={styles.blueText}>
                        Invite your loved ones to share their location frequency to ensure everyone stays connected during the monsoon.
                    </Text>
                </View>
            </View>
        </DetailLayout>
    );
}

function CardItem({ title, desc, icon }) {
    return (
        <View style={styles.card}>
            <MaterialCommunityIcons name={icon} size={30} color="#0284c7" />
            <View style={{flex: 1}}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24 },
    hero: { alignItems: 'center', marginVertical: 10 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#0369a1', marginTop: 10 },
    infoList: { gap: 16 },
    card: { 
        backgroundColor: '#fff', 
        padding: 16, 
        borderRadius: 16, 
        flexDirection: 'row', 
        gap: 15, 
        alignItems: 'center',
        elevation: 3,
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    cardDesc: { fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 18 },
    blueBox: {
        backgroundColor: '#f0f9ff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    blueTitle: { color: '#0369a1', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    blueText: { color: '#0369a1', fontSize: 13, lineHeight: 18 },
});
