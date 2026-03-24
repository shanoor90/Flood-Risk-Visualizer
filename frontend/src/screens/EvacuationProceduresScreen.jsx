import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EvacuationProceduresScreen({ navigation }) {
    return (
        <DetailLayout title="Evacuation" icon="run-fast" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Evacuation Guidelines</Text>
                <Text style={styles.desc}>Follow these steps when instructed to evacuate.</Text>
                
                <View style={styles.card}>
                    <StepItem num="1" title="Stay Informed" desc="Listen to local authorities and emergency broadcasts." />
                    <StepItem num="2" title="Grab Your Supply Kit" desc="Take your emergency supply kit and important documents." />
                    <StepItem num="3" title="Turn Off Utilities" desc="If instructed, turn off gas, electricity, and water." />
                    <StepItem num="4" title="Lock Your Home" desc="Secure your property before leaving." />
                    <StepItem num="5" title="Follow Designated Routes" desc="Do not take shortcuts; they may be blocked by floodwaters." />
                    <StepItem num="6" title="Avoid Floodwaters" desc="Never walk, swim, or drive through floodwaters." />
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

function StepItem({ num, title, desc }) {
    return (
        <View style={styles.stepItem}>
            <View style={styles.numCircle}>
                <Text style={styles.numText}>{num}</Text>
            </View>
            <View style={styles.stepTexts}>
                <Text style={styles.stepTitle}>{title}</Text>
                <Text style={styles.stepDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, paddingBottom: 30 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#064e3b' },
    desc: { fontSize: 14, color: '#475569', marginBottom: 10 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, gap: 16 },
    stepItem: { flexDirection: 'row', gap: 12 },
    numCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },
    numText: { color: '#fff', fontWeight: 'bold' },
    stepTexts: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#064e3b', marginBottom: 2 },
    stepDesc: { fontSize: 14, color: '#475569' },
});
