import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';

export default function InfectionPreventionScreen({ navigation }) {
    return (
        <DetailLayout title="Infection Prevention" icon="water-alert" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Hygiene & Safety</Text>
                
                <View style={styles.card}>
                    <StepItem num="1" title="Avoid Floodwater" desc="Floodwaters can contain dangerous bacteria, chemicals, and debris. Minimize contact as much as possible." />
                    <StepItem num="2" title="Wash Frequently" desc="Wash hands with soap and clean water before eating, drinking, or treating wounds." />
                    <StepItem num="3" title="Boil Water" desc="If local water is compromised, boil water for at least 1 minute before drinking or cleaning." />
                    <StepItem num="4" title="Disinfect Surfaces" desc="Clean all surfaces that have come into contact with floodwater using a bleach solution." />
                    <StepItem num="5" title="Protect Open Wounds" desc="Keep all cuts covered with waterproof bandages to block bacteria from entering your bloodstream." />
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
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, gap: 16 },
    stepItem: { flexDirection: 'row', gap: 12 },
    numCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },
    numText: { color: '#fff', fontWeight: 'bold' },
    stepTexts: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#064e3b', marginBottom: 2 },
    stepDesc: { fontSize: 14, color: '#475569', lineHeight: 20 },
});
