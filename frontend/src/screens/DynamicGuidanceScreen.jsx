import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DetailLayout from '../components/DetailLayout';

export default function DynamicGuidanceScreen({ navigation }) {
    const [emotionalState, setEmotionalState] = useState(null);
    const [mockRainLevel, setMockRainLevel] = useState('High');

    const getGuidanceMessage = () => {
        if (!emotionalState) return "Select how you're feeling for custom guidance.";
        const isHighFear = emotionalState === 'uneasy' || emotionalState === 'anxious';
        const isHighRain = mockRainLevel === 'High';

        if (!isHighFear && isHighRain) {
            return "You're doing great staying calm! The rain is picking up, so let's just make sure your phone is charging, just in case.";
        } else if (isHighFear && !isHighRain) {
            return "I see you're feeling anxious. Take a deep breath. Currently, the Google Map shows your area is clear. Why not check off one item on your 'Go-Bag' list to feel more prepared?";
        } else if (isHighFear && isHighRain) {
            return "You are not alone. Many people in your area are seeing this rain. Let's focus on the 'Evacuation Checklist' together.";
        } else {
            return "Risk is low, just stay informed and keep your emergency kit handy.";
        }
    };

    return (
        <DetailLayout title="Dynamic Guidance" icon="heart-pulse" color="#fdf2f8" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.headerTitle}>Determine Your Needs</Text>
                
                <View style={styles.weatherWidget}>
                    <Text style={styles.weatherTitle}>Current Area Rain Level:</Text>
                    <TouchableOpacity 
                        style={[styles.rainToggle, mockRainLevel === 'High' ? styles.rainHigh : styles.rainLow]} 
                        onPress={() => setMockRainLevel(mockRainLevel === 'High' ? 'Low' : 'High')}
                    >
                        <MaterialCommunityIcons name={mockRainLevel === 'High' ? "weather-pouring" : "weather-partly-cloudy"} size={24} color="#fff" />
                        <Text style={styles.rainToggleText}>{mockRainLevel} Rain (Tap to change)</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pulseContainer}>
                    <Text style={styles.pulseCheckTitle}>"How are you feeling right now?"</Text>
                    
                    <View style={styles.emojiScale}>
                        <TouchableOpacity 
                            style={[styles.emojiBtn, emotionalState === 'calm' && styles.emojiBtnSelected]} 
                            onPress={() => setEmotionalState('calm')}
                        >
                            <Text style={styles.emojiIcon}>😊</Text>
                            <Text style={styles.emojiText}>Calm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.emojiBtn, emotionalState === 'uneasy' && styles.emojiBtnSelected]} 
                            onPress={() => setEmotionalState('uneasy')}
                        >
                            <Text style={styles.emojiIcon}>😟</Text>
                            <Text style={styles.emojiText}>Uneasy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.emojiBtn, emotionalState === 'anxious' && styles.emojiBtnSelected]} 
                            onPress={() => setEmotionalState('anxious')}
                        >
                            <Text style={styles.emojiIcon}>😰</Text>
                            <Text style={styles.emojiText}>Anxious</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {emotionalState && (
                    <View style={styles.guidanceMessageCard}>
                        <MaterialCommunityIcons name="information-outline" size={32} color="#2563eb" style={{marginTop: 4}} />
                        <Text style={styles.guidanceMessageText}>{getGuidanceMessage()}</Text>
                    </View>
                )}
            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 60 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#be123c', marginBottom: 20, textAlign: 'center' },
    
    weatherWidget: { backgroundColor: '#f8fafc', padding: 20, borderRadius: 16, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
    weatherTitle: { fontSize: 14, color: '#64748b', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
    rainToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, gap: 10 },
    rainHigh: { backgroundColor: '#3b82f6' }, 
    rainLow: { backgroundColor: '#10b981' }, 
    rainToggleText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    
    pulseContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24 },
    pulseCheckTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', textAlign: 'center', marginBottom: 20 },
    emojiScale: { flexDirection: 'row', justifyContent: 'space-around' },
    emojiBtn: { alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', width: 90 },
    emojiBtnSelected: { backgroundColor: '#fdf2f8', borderColor: '#e11d48' },
    emojiIcon: { fontSize: 40, marginBottom: 10 },
    emojiText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
    
    guidanceMessageCard: { flexDirection: 'row', backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 2, padding: 20, borderRadius: 16, alignItems: 'flex-start', gap: 16 },
    guidanceMessageText: { fontSize: 16, color: '#1e3a8a', lineHeight: 24, flex: 1, fontWeight: '500' },
});
