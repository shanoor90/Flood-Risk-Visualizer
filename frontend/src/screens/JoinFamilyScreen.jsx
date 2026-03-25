import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { inviteService } from '../services/api';
import { authService } from '../services/authService';

export default function JoinFamilyScreen({ navigation }) {
    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteDetail, setInviteDetail] = useState(null);
    const { params } = navigation.getState().routes.find(r => r.name === 'JoinFamily') || {};
    const routeCode = params?.code;

    useEffect(() => {
        if (routeCode && routeCode.length === 6) {
            checkCode(routeCode);
        }
    }, [routeCode]);

    const checkCode = async (val) => {
        setCode(val);
        if (val.length === 6) {
            try {
                const response = await inviteService.getInviteDetail(val);
                setInviteDetail(response.data);
            } catch (e) {
                setInviteDetail(null);
            }
        } else {
            setInviteDetail(null);
        }
    };

    const handleJoin = async () => {
        if (code.length !== 6) {
            Alert.alert("Invalid Code", "Please enter a 6-digit invite code.");
            return;
        }
        if (!phone) {
            Alert.alert("Missing Info", "Please enter your phone number.");
            return;
        }

        // Stop if not logged in
        const user = authService.getCurrentUser();
        if (!user) {
             Alert.alert("Error", "You must be logged in to join a family.");
             return;
        }

        // Ask for final explicit consent as requested before connecting
        Alert.alert(
            "Location Tracking Permission", 
            `Do you grant permission for ${inviteDetail ? inviteDetail.inviterName : "your family member"} to track your exact location at all times for your safety?`,
            [
                { text: "Decline", style: 'cancel' },
                { 
                    text: "Allow & Connect", 
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await inviteService.acceptInvite(code, user.uid, phone);
                            Alert.alert(
                                "Welcome!", 
                                "You have successfully joined the family circle and are now sharing your location.",
                                [{ text: "Open My Dashboard", onPress: () => navigation.navigate('Dashboard') }]
                            );
                        } catch (error) {
                            Alert.alert("Error", error.message || "Failed to connect.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="account-group-outline" size={64} color="#16a34a" style={styles.icon} />
                <Text style={styles.title}>Join a Family Circle</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code shared by your family member.</Text>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="key-variant" size={24} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Invite Code (e.g. 123456)"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={code}
                        onChangeText={checkCode}
                    />
                </View>

                {inviteDetail && (
                    <View style={styles.previewCard}>
                        <Text style={styles.previewText}>
                            Joining <Text style={{fontWeight:'bold'}}>{inviteDetail.inviterName}'s</Text> circle 
                            as <Text style={{fontWeight:'bold', color: '#16a34a'}}>{inviteDetail.relation}</Text>
                        </Text>
                    </View>
                )}
                
                 <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="phone" size={24} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Your Phone Number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleJoin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Join Family</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelLink} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0fdf4', justifyContent: 'center', padding: 20 },
    content: { backgroundColor: '#fff', borderRadius: 24, padding: 30, elevation: 4, alignItems: 'center' },
    icon: { marginBottom: 20, backgroundColor: '#dcfce7', borderRadius: 50, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#14532d', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 30 },
    
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 15, marginBottom: 16, width: '100%' },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#334155' },
    
    button: { backgroundColor: '#16a34a', paddingVertical: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#86efac' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    
    cancelLink: { marginTop: 20, padding: 10 },
    cancelText: { color: '#64748b', fontSize: 16 },

    previewCard: {
        backgroundColor: '#f0fdf4',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dcfce7',
        marginBottom: 20,
        width: '100%',
    },
    previewText: {
        fontSize: 14,
        color: '#166534',
        textAlign: 'center',
    }
});
