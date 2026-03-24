import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';

export default function BasicCPRScreen({ navigation }) {
    return (
        <DetailLayout title="Basic CPR" icon="human-handsup" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>CPR Guidelines (Adult)</Text>
                
                <View style={styles.card}>
                    <StepItem num="1" title="Check for Warning" desc="Ensure the scene is safe. Tap the person's shoulder and shout, 'Are you okay?'" />
                    <StepItem num="2" title="Call for Help" desc="If they are unresponsive and not breathing normally, call emergency services immediately." />
                    <StepItem num="3" title="Position Hands" desc="Place the heel of one hand in the center of the chest. Place your other hand on top and interlace your fingers." />
                    <StepItem num="4" title="Push Hard and Fast" desc="Push straight down at least 2 inches at a rate of 100 to 120 compressions a minute." />
                    <StepItem num="5" title="Deliver Rescue Breaths" desc="If trained, give 2 rescue breaths after every 30 compressions. Otherwise, perform hands-only CPR until help arrives." />
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
