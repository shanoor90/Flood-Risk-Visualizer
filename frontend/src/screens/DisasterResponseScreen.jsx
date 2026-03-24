import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DisasterResponseScreen({ navigation }) {
    return (
        <DetailLayout title="Disaster Response" icon="lifebuoy" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>During the Flood</Text>
                <Text style={styles.desc}>Critical immediate actions to take during an active disaster.</Text>
                
                <View style={styles.infoBlock}>
                    <MaterialCommunityIcons name="alert" size={30} color="#dc2626" style={{marginBottom: 8}} />
                    <Text style={styles.infoTitle}>Turn Around, Don't Drown!</Text>
                    <Text style={styles.infoDesc}>Just 6 inches of moving water can knock you down, and 12 inches can sweep away a vehicle. Never attempt to cross flooded areas.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Immediate Actions</Text>
                    <BulletItem text="If trapped in a building, move to the highest level." />
                    <BulletItem text="Do not climb into a closed attic (you may become trapped by rising water)." />
                    <BulletItem text="To signal rescue, use a flashlight, brightly colored cloth, or whistle." />
                    <BulletItem text="If in a vehicle and water is rising rapidly, abandon it and move to higher ground." />
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function BulletItem({ text }) {
    return (
        <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, paddingBottom: 30 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#064e3b' },
    desc: { fontSize: 14, color: '#475569' },
    infoBlock: { backgroundColor: '#fee2e2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#fca5a5' },
    infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#991b1b', marginBottom: 4 },
    infoDesc: { fontSize: 14, color: '#7f1d1d', lineHeight: 20 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, gap: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#064e3b', marginBottom: 8 },
    bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669', marginTop: 7 },
    bulletText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 20 },
});
