import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';

export default function CutsWoundsScreen({ navigation }) {
    return (
        <DetailLayout title="Cuts & Wounds" icon="bandage" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Treatment Protocol</Text>
                
                <View style={styles.card}>
                    <StepItem num="1" title="Wash Hands" desc="Always wash your hands with soap and clean water or use hand sanitizer before treating a wound." />
                    <StepItem num="2" title="Stop the Bleeding" desc="Apply gentle pressure with a clean cloth or bandage. Elevate the wound if possible." />
                    <StepItem num="3" title="Clean the Wound" desc="Rinse the cut thoroughly with clear, safe water. Avoid using contaminated floodwater." />
                    <StepItem num="4" title="Apply Antibiotic" desc="Apply a thin layer of an antibiotic ointment or petroleum jelly to keep the surface moist and prevent scarring." />
                    <StepItem num="5" title="Cover the Wound" desc="Apply a sterile bandage or gauze. Change the dressing daily or whenever it becomes wet or dirty." />
                    <StepItem num="6" title="Watch for Infection" desc="Seek medical help if you notice expanded redness, increasing pain, drainage, or warmth." />
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
