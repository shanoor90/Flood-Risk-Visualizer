import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';

export default function DehydrationScreen({ navigation }) {
    return (
        <DetailLayout title="Dehydration" icon="emoticon-confused-outline" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Dehydration Management</Text>
                
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recognize the Signs</Text>
                    <BulletItem text="Extreme thirst or dry mouth." />
                    <BulletItem text="Less frequent urination and dark-colored urine." />
                    <BulletItem text="Fatigue, dizziness, or confusion." />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Immediate Treatment</Text>
                    <StepItem num="1" title="Sip Fluids Slowly" desc="Drink clean, safe water continuously but slowly to avoid vomiting." />
                    <StepItem num="2" title="Use ORS" desc="Mix an Oral Rehydration Solution packet with clean water to replace lost electrolytes." />
                    <StepItem num="3" title="Stay Cool" desc="Rest in a shaded, cool area to minimize sweating and further fluid loss." />
                    <StepItem num="4" title="Seek Medial Help" desc="If confusion or inability to keep fluids down occurs, seek medical intervention IV fluids may be necessary." />
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
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, gap: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#064e3b', marginBottom: 8 },
    stepItem: { flexDirection: 'row', gap: 12 },
    numCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },
    numText: { color: '#fff', fontWeight: 'bold' },
    stepTexts: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#064e3b', marginBottom: 2 },
    stepDesc: { fontSize: 14, color: '#475569', lineHeight: 20 },
    bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669', marginTop: 7 },
    bulletText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 20 },
});
