import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmergencySuppliesScreen({ navigation }) {
    const [checks, setChecks] = useState({});

    const toggleCheck = (id) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const supplies = [
        { id: 's1', text: 'Water (1 gallon per person, per day)' },
        { id: 's2', text: 'Non-perishable food (3-day supply)' },
        { id: 's3', text: 'Flashlight & extra batteries' },
        { id: 's4', text: 'First-aid kit' },
        { id: 's5', text: 'Whistle to signal for help' },
        { id: 's6', text: 'Dust mask to help filter contaminated air' },
        { id: 's7', text: 'Moist towelettes, garbage bags' },
        { id: 's8', text: 'Local maps' },
    ];

    return (
        <DetailLayout title="Supplies Kit" icon="bag-checked" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Supply Kit Checklist</Text>
                <Text style={styles.desc}>Ensure you have packed these essential items.</Text>
                
                <View style={styles.card}>
                    {supplies.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggleCheck(item.id)}>
                            <MaterialCommunityIcons 
                                name={checks[item.id] ? "check-circle" : "circle-outline"} 
                                size={24} 
                                color={checks[item.id] ? "#10b981" : "#94a3b8"} 
                            />
                            <Text style={[styles.checkText, checks[item.id] && styles.checkedText]}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </DetailLayout>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, paddingBottom: 30 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#064e3b' },
    desc: { fontSize: 14, color: '#475569', marginBottom: 10 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
    checkItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
    checkText: { flex: 1, fontSize: 15, color: '#334155' },
    checkedText: { textDecorationLine: 'line-through', color: '#94a3b8' },
});
