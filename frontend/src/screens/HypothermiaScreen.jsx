import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';

export default function HypothermiaScreen({ navigation }) {
    return (
        <DetailLayout title="Hypothermia" icon="snowflake" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Treatment Protocol</Text>
                
                <View style={styles.card}>
                    <StepItem num="1" title="Move to Safety" desc="Move the person out of the cold water and into a warm, dry area immediately." />
                    <StepItem num="2" title="Remove Wet Clothing" desc="Gently take off any wet clothes to stop further heat loss." />
                    <StepItem num="3" title="Dry the Person" desc="Wrap them in dry blankets or use your own body heat to help warm them up." />
                    <StepItem num="4" title="Warm Gradually" desc="Apply warm, dry compresses to the center of the body (neck, chest, groin). Do NOT apply direct heat like a heating pad." />
                    <StepItem num="5" title="Offer Warm Liquids" desc="If the person is conscious and can swallow easily, give warm, sweet, non-alcoholic drinks." />
                </View>

                <View style={styles.warningBox}>
                    <Text style={styles.warningTitle}>Warning!</Text>
                    <Text style={styles.warningDesc}>Do NOT rub or massage the person's limbs, as this can cause heart strain or tissue damage.</Text>
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
    warningBox: { backgroundColor: '#fee2e2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#fca5a5' },
    warningTitle: { fontSize: 16, fontWeight: 'bold', color: '#b91c1c', marginBottom: 4 },
    warningDesc: { fontSize: 14, color: '#991b1b', lineHeight: 20 },
});
