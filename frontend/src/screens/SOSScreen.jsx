import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Linking, ActivityIndicator, Platform, Modal, TextInput, ScrollView } from 'react-native';
import DetailLayout from '../components/DetailLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import { sosService } from '../services/api';

export default function SOSScreen({ navigation }) {
    const [sending, setSending] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '' });
    const [loadingContacts, setLoadingContacts] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await sosService.getContacts("user_123");
            setContacts(response.data);
        } catch (error) {
            console.log("Error fetching contacts:", error);
        }
    };

    const handleAddContact = async () => {
        if (!newContact.name || !newContact.phone) {
            Alert.alert("Required", "Please enter both name and phone number");
            return;
        }

        try {
            await sosService.addContact({
                userId: "user_123",
                name: newContact.name,
                phone: newContact.phone
            });
            setModalVisible(false);
            setNewContact({ name: '', phone: '' });
            fetchContacts();
            Alert.alert("Success", "Emergency contact added");
        } catch (error) {
            Alert.alert("Error", "Failed to add contact");
        }
    };

    const handleSOS = async () => {
        setSending(true);
        try {
            // 1. Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required for SOS.");
                setSending(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            
            // 2. Get Battery Level
            const batteryLevel = await Battery.getBatteryLevelAsync();

            // 3. Try Backend API
            const sosData = {
                userId: "user_123",
                location: {
                    lat: location.coords.latitude,
                    lon: location.coords.longitude
                },
                batteryLevel: Math.round(batteryLevel * 100)
            };

            const response = await sosService.triggerSOS(sosData);
            Alert.alert("SOS Sent", "Emergency alerts have been sent to your contacts/backend.");

        } catch (error) {
            console.log("Backend failed, switching to SMS Fallback");
            // 4. Fallback to Native SMS
            const location = await Location.getCurrentPositionAsync({});
            const lat = location.coords.latitude;
            const lon = location.coords.longitude;
            const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
            const message = `SOS! I need help. Location: ${mapsLink}`;
            
            // Use contacts from state if available, otherwise just open SMS app
            const phoneNumbers = contacts.map(c => c.phone).join(Platform.OS === 'android' ? ';' : ',');
            
            const operator = Platform.OS === 'android' ? '?' : '&';
            const separator = Platform.OS === 'android' ? ':' : ':/'; // iOS specific
            
            // Simple logic for now: Open SMS with body. 
            // Pre-filling recipients is tricky across platforms universally without specific library config,
            // but we can try to pass them in the URL schema if supported.
            // Standard: sms:12345678,...
            
            const url = `sms:${phoneNumbers}${operator}body=${encodeURIComponent(message)}`;
            Linking.openURL(url);

        } finally {
            setSending(false);
        }
    };

    return (
        <DetailLayout 
            title="SOS Emergency System" 
            icon="alert-octagon" 
            color="#fee2e2" 
            navigation={navigation}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.heroSection}>
                    <TouchableOpacity 
                        style={styles.sosButton} 
                        onPress={handleSOS}
                        disabled={sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <MaterialCommunityIcons name="broadcast" size={60} color="#fff" />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.heroTitle}>{sending ? "Sending SOS..." : "TAP TO SEND SOS"}</Text>
                    <Text style={styles.heroSubtitle}>Triggers Backend Alert + SMS Fallback</Text>
                </View>

                {/* Contacts Section */}
                <View style={styles.contactsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addContactBtn}>
                            <MaterialCommunityIcons name="plus" size={20} color="#b91c1c" />
                            <Text style={styles.addContactText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {contacts.length === 0 ? (
                        <Text style={styles.emptyText}>No emergency contacts added yet.</Text>
                    ) : (
                        contacts.map((contact, index) => (
                            <View key={contact.id || index} style={styles.contactItem}>
                                <View style={styles.contactIcon}>
                                    <MaterialCommunityIcons name="account-alert" size={24} color="#b91c1c" />
                                </View>
                                <View>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.featureList}>
                    <FeatureItem 
                        icon="gesture-tap" 
                        title="One-Touch Activation" 
                        desc="Instantly notifies emergency contacts with your live location." 
                    />
                    <FeatureItem 
                        icon="message-text-outline" 
                        title="SMS Fallback" 
                        desc="SMS fallback activated when internet unavailable" 
                    />
                </View>

                {/* Add Contact Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contact Name"
                                value={newContact.name}
                                onChangeText={(text) => setNewContact({...newContact, name: text})}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                value={newContact.phone}
                                onChangeText={(text) => setNewContact({...newContact, phone: text})}
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
                                    onPress={handleAddContact}
                                >
                                    <Text style={styles.textStyle}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </DetailLayout>
    );
}

function FeatureItem({ icon, title, desc }) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={icon} size={24} color="#b91c1c" />
            </View>
            <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
        paddingBottom: 40
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    sosButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#fee2e2'
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#b91c1c',
        marginTop: 0,
        letterSpacing: 1,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#7f1d1d',
        marginTop: 4,
    },
    contactsSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        elevation: 2
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#b91c1c'
    },
    addContactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    addContactText: {
        color: '#b91c1c',
        fontWeight: 'bold',
        fontSize: 12
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    contactIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactName: {
        fontWeight: 'bold',
        color: '#333'
    },
    contactPhone: {
        color: '#666',
        fontSize: 12
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10
    },
    featureList: {
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    featureDesc: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    // Modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#b91c1c'
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f8fafc'
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        minWidth: 100,
        alignItems: 'center'
    },
    buttonClose: {
        backgroundColor: "#94a3b8",
    },
    buttonAdd: {
        backgroundColor: "#b91c1c",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});
