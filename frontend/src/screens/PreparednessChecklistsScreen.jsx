import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PreparednessChecklistsScreen({ navigation }) {
    const [checks, setChecks] = useState({});

    const toggleCheck = (id) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const checklistItems = [
        { id: '1', text: 'Prepare an emergency kit (water, food, flashlight, batteries).' },
        { id: '2', text: 'Know your evacuation routes and shelter locations.' },
        { id: '3', text: 'Secure important documents in a waterproof container.' },
        { id: '4', text: 'Move valuable items to higher floors.' },
        { id: '5', text: 'Have a family communication plan ready.' },
    ];

    return (
        <DetailLayout title="Preparedness" icon="clipboard-check-outline" color="#ecfdf5" navigation={navigation}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Before the Flood</Text>
                <Text style={styles.desc}>Complete this checklist to ensure you are fully prepared.</Text>
                
                <View style={styles.card}>
                    {checklistItems.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggleCheck(item.id)}>
                            <MaterialCommunityIcons 
                                name={checks[item.id] ? "check-box-outline" : "checkbox-blank-outline"} 
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
