import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import FamilyList from '../components/FamilyList'; // Import the list component
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService } from '../services/api';

export default function FamilyScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleAddMember = async () => {
        if (!name.trim()) {
            Alert.alert("Required", "Please enter a name");
            return;
        }

        setLoading(true);
        try {
            // Generating a random ID for now. In real app, this might be a phone number or email lookup.
            const newMemberId = `fam_${Date.now()}`;
            await familyService.addMember({
                userId: "user_123",
                memberId: newMemberId,
                memberName: name,
                relation: "Family"
            });
            
            setModalVisible(false);
            setName('');
            setRefreshTrigger(prev => prev + 1); // Trigger list refresh
            Alert.alert("Success", "Family member added!");
        } catch (error) {
            Alert.alert("Error", "Failed to add member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DetailLayout 
            title="Family Connection" 
            icon="account-group" 
            color="#e0f2fe" 
            navigation={navigation}
        >
            <View style={styles.container}>
                <View style={styles.hero}>
                    <MaterialCommunityIcons name="heart-pulse" size={80} color="#0284c7" />
                    <Text style={styles.heroTitle}>Safety Circle Dashboard</Text>
                    
                    <TouchableOpacity 
                        style={styles.addBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <MaterialCommunityIcons name="account-plus" size={20} color="#fff" />
                        <Text style={styles.addBtnText}>Add Member</Text>
                    </TouchableOpacity>
                </View>

                {/* Live Family List */}
                <FamilyList refreshTrigger={refreshTrigger} />

                <View style={styles.infoList}>
                    <CardItem 
                        title="Real-Time Monitoring" 
                        desc="Continuous flood risk monitoring at each member's location" 
                        icon="radar" 
                    />
                    <CardItem 
                        title="Automatic Alerts" 
                        desc="Automatic notifications when family enters high-risk zones" 
                        icon="bell-ring-outline" 
                    />
                </View>

                {/* Add Member Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Add Family Member</Text>
                            
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Name (e.g. Mom)"
                                value={name}
                                onChangeText={setName}
                            />
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.button, styles.buttonAdd]}
                                    onPress={handleAddMember}
                                    disabled={loading}
                                >
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textStyle}>Add</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </DetailLayout>
    );
}

function CardItem({ title, desc, icon }) {
    return (
        <View style={styles.card}>
            <MaterialCommunityIcons name={icon} size={30} color="#0284c7" />
            <View style={{flex: 1}}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24 },
    hero: { alignItems: 'center', marginVertical: 10, gap: 15 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#0369a1' },
    addBtn: {
        flexDirection: 'row',
        backgroundColor: '#0284c7',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        gap: 8,
        elevation: 3
    },
    addBtnText: { color: '#fff', fontWeight: 'bold' },
    infoList: { gap: 16 },
    card: { 
        backgroundColor: '#fff', 
        padding: 16, 
        borderRadius: 16, 
        flexDirection: 'row', 
        gap: 15, 
        alignItems: 'center',
        elevation: 3,
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    cardDesc: { fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 18 },
    
    // Modal Styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1e3a8a'
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 15
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        minWidth: 100,
        alignItems: 'center'
    },
    buttonClose: {
        backgroundColor: "#94a3b8",
    },
    buttonAdd: {
        backgroundColor: "#0284c7",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});
