import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SOSScreen({ navigation }) {
    return (
        <DetailLayout 
            title="SOS Emergency System" 
            icon="alert-octagon" 
            color="#fee2e2" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.heroSection}>
                    <MaterialCommunityIcons name="broadcast" size={80} color="#ef4444" />
                    <Text style={styles.heroTitle}>Rapid Emergency Response</Text>
                </View>

                <View style={styles.featureList}>
                    <FeatureItem 
                        icon="gesture-tap" 
                        title="One-Touch SOS" 
                        desc="Instant broadcast of emergency signals to authorities and your safety circle." 
                    />
                    <FeatureItem 
                        icon="map-marker-radius" 
                        title="Auto-Capture" 
                        desc="Automatically captures your precise GPS coordinates, current timestamp, and local risk level." 
                    />
                    <FeatureItem 
                        icon="cloud-sync" 
                        title="Reliable Delivery" 
                        desc="Secured backend delivery via internet. If connection fails, SMS fallback is triggered." 
                    />
                    <FeatureItem 
                        icon="message-text-outline" 
                        title="SMS Fallback" 
                        desc="Automatically sends emergency SMS with your location when data connection is unavailable." 
                    />
                </View>

                <View style={styles.warningBox}>
                    <MaterialCommunityIcons name="information-variant" size={24} color="#b91c1c" />
                    <Text style={styles.warningText}>
                        Use only in real emergencies. Misuse may result in penalties or delayed response for actual victims.
                    </Text>
                </View>
            </View>
        </DetailLayout>
    );
}

function FeatureItem({ icon, title, desc }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={icon} size={24} color="#b91c1c" />
            </View>
            <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#b91c1c',
        marginTop: 10,
    },
    featureList: {
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    featureDesc: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        alignItems: 'center',
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#b91c1c',
        fontStyle: 'italic',
    },
});
