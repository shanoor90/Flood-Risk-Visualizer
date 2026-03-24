import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';

export default function FracturesSprainsScreen({ navigation }) {
    return (
        <DetailLayout title="Fractures & Sprains" icon="bone" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Stabilization Protocol</Text>
                
                <View style={styles.card}>
                    <StepItem num="R" title="Rest" desc="Stop moving the injured limb immediately to prevent further damage." />
                    <StepItem num="I" title="Ice" desc="Apply cold packs or ice wrapped in cloth to reduce swelling. Only do this if safe and dry." />
                    <StepItem num="C" title="Compression" desc="Wrap the injured area firmly, but not too tightly, with an elastic bandage." />
                    <StepItem num="E" title="Elevation" desc="Keep the injured limb raised above the level of the heart to help drain fluid." />
                </View>

                <View style={styles.warningBox}>
                    <Text style={styles.warningTitle}>For Suspected Bone Fractures:</Text>
                    <Text style={styles.warningDesc}>Do not attempt to realign the bone. Splint the limb in the position you found it to immobilize it until professional help arrives.</Text>
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
    warningBox: { backgroundColor: '#fffbeb', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#fde68a' },
    warningTitle: { fontSize: 16, fontWeight: 'bold', color: '#b45309', marginBottom: 4 },
    warningDesc: { fontSize: 14, color: '#92400e', lineHeight: 20 },
});
