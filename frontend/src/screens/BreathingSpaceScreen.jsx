import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DetailLayout from '../components/DetailLayout';

export default function BreathingSpaceScreen({ navigation }) {
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathingTimeLeft, setBreathingTimeLeft] = useState(30);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let interval = null;
        if (isBreathing && breathingTimeLeft > 0) {
            interval = setInterval(() => setBreathingTimeLeft((prev) => prev - 1), 1000);
        } else if (isBreathing && breathingTimeLeft === 0) {
            stopBreathingSession();
        }
        return () => clearInterval(interval);
    }, [isBreathing, breathingTimeLeft]);

    const startBreathingSession = () => {
        setIsBreathing(true);
        setBreathingTimeLeft(30);
        const inhale = Animated.timing(scaleAnim, { toValue: 1.8, duration: 4000, useNativeDriver: true });
        const exhale = Animated.timing(scaleAnim, { toValue: 1, duration: 4000, useNativeDriver: true });
        Animated.loop(Animated.sequence([inhale, exhale])).start();
    };

    const stopBreathingSession = () => {
        setIsBreathing(false);
        scaleAnim.stopAnimation();
        scaleAnim.setValue(1);
        setBreathingTimeLeft(30);
    };

    return (
        <DetailLayout title="Breathing Space" icon="weather-windy" color="#e0f2fe" navigation={navigation}>
            <View style={styles.container}>
                {!isBreathing ? (
                    <View style={styles.introContainer}>
                        <MaterialCommunityIcons name="lungs" size={80} color="#0ea5e9" style={{marginBottom: 20}} />
                        <Text style={styles.title}>Take a Moment to Breathe</Text>
                        <Text style={styles.description}>
                            Feeling anxious or overwhelmed? Start this quick 30-second guided breathing exercise to regain focus and calm your nervous system.
                        </Text>
                        <TouchableOpacity style={styles.startTrackBtn} onPress={startBreathingSession}>
                            <MaterialCommunityIcons name="timer-play-outline" size={24} color="#fff" />
                            <Text style={styles.startTrackText}>Start Interactive Session</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.breathingActiveContainer}>
                        <Text style={styles.breathingTimerText}>{breathingTimeLeft}s</Text>
                        
                        <View style={styles.breathingCircleContainer}>
                            <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]} />
                        </View>
                        
                        <Text style={styles.breathingInstructionText}>Inhale as it grows...{'\n'}Exhale as it shrinks.</Text>
                        
                        <TouchableOpacity style={styles.stopTrackBtn} onPress={stopBreathingSession}>
                            <Text style={styles.stopTrackText}>Stop Early</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    
    introContainer: { alignItems: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 24, elevation: 4, width: '100%', borderWidth: 1, borderColor: '#bae6fd' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0369a1', marginBottom: 16, textAlign: 'center' },
    description: { fontSize: 16, color: '#475569', textAlign: 'center', lineHeight: 24, marginBottom: 30 },
    
    startTrackBtn: { backgroundColor: '#0ea5e9', paddingHorizontal: 24, flexDirection: 'row', paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, width: '100%' },
    startTrackText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    
    breathingActiveContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
    breathingCircleContainer: { height: 250, justifyContent: 'center', alignItems: 'center', marginVertical: 40 },
    breathingCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#7dd3fc', opacity: 0.8 },
    
    breathingTimerText: { fontSize: 48, fontWeight: 'bold', color: '#0284c7' },
    breathingInstructionText: { fontSize: 20, color: '#0369a1', fontStyle: 'italic', textAlign: 'center', marginHorizontal: 20, lineHeight: 30 },
    
    stopTrackBtn: { backgroundColor: '#ef4444', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginBottom: 40 },
    stopTrackText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
