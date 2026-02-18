import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import GlassTiltCard from './GlassTiltCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { familyService, locationService } from '../services/api';

export default function FamilyList({ onPress, refreshTrigger }) {
  const [familyMembers, setFamilyMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [locating, setLocating] = React.useState(null);

  const fetchFamily = async () => {
    setLoading(true);
    try {
      const userId = "user_123"; 
      
      const response = await familyService.getFamilyRisk(userId);
      if (response.data) {
           const mappedData = response.data.map(m => ({
              id: m.memberId,
              name: m.memberName,
              role: m.risk.level,
              color: m.risk.color || "#94a3b8", // Fallback color
              score: m.risk.score
            }));
           setFamilyMembers(mappedData);
      }
    } catch (error) {
      console.log("Family fetch error:", error);
      // Fallback only if empty?
      if (familyMembers.length === 0) {
          const localMock = [
            { id: "fav_1", name: "Mom", role: "SAFE", color: "#4ade80", score: 10 },
            { id: "fav_2", name: "Dad", role: "MODERATE", color: "#facc15", score: 45 }
          ];
          setFamilyMembers(localMock);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFamily();
  }, [refreshTrigger]);

  const handleDelete = (memberId, memberName) => {
      Alert.alert(
          "Remove Family Member",
          `Are you sure you want to remove ${memberName}?`,
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Remove", 
                  style: "destructive",
                  onPress: async () => {
                      try {
                          await familyService.deleteMember("user_123", memberId);
                          fetchFamily(); // Refresh list
                      } catch (error) {
                          Alert.alert("Error", "Could not remove member");
                      }
                  }
              }
          ]
      );
  };

  const handleLocate = async (memberId, memberName) => {
      setLocating(memberId);
      try {
          const response = await locationService.getLatestLocation(memberId);
          // Check if response.data is the location object or wrapped
          const loc = response.data;
          
          if (loc && loc.location) {
              const { lat, lon } = loc.location;
              const time = loc.timestamp ? new Date(loc.timestamp).toLocaleTimeString() : 'N/A';
              Alert.alert(
                  `Location: ${memberName}`,
                  `Latitude: ${lat}\nLongitude: ${lon}\nLast Seen: ${time}`,
                  [{ text: "OK" }]
              );
          } else {
               Alert.alert("Not Found", `No recent location found for ${memberName}.`);
          }
      } catch (error) {
          // If 404
           Alert.alert("Not Found", `No location data available for ${memberName}.`);
      } finally {
          setLocating(null);
      }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlassTiltCard style={styles.card}>
      <Text style={styles.title}>Family Connection Dashboard</Text>
      
      <View style={styles.list}>
        {familyMembers.length === 0 && !loading ? (
            <Text style={styles.emptyText}>No family members added yet.</Text>
        ) : (
            familyMembers.map((member) => (
            <View key={member.id} style={styles.itemWrapper}>
                 <View style={styles.item}>
                    <View style={[styles.avatar, { borderColor: member.color }]}>
                        <Text style={styles.initials}>{member.name ? member.name[0] : '?'}</Text>
                    </View>
                    <Text style={styles.name}>{member.name}</Text>
                    <Text style={[styles.status, { color: member.color }]}>{member.role}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.locateBtn}
                    onPress={() => handleLocate(member.id, member.name)}
                    disabled={locating === member.id}
                >
                    {locating === member.id ? (
                        <ActivityIndicator size="small" color="#0284c7" />
                    ) : (
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="#0284c7" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(member.id, member.name)}
                >
                    <MaterialCommunityIcons name="close-circle" size={20} color="#cbd5e1" />
                </TouchableOpacity>
            </View>
            ))
        )}
      </View>
      
      <Text style={styles.footer}>Family Safety Circle Active</Text>
    </GlassTiltCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 12,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  itemWrapper: {
      position: 'relative',
      alignItems: 'center',
  },
  deleteBtn: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: '#fff',
      borderRadius: 10,
  },
  locateBtn: {
      position: 'absolute',
      top: -5,
      left: -5,
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 2
  },
  item: {
    alignItems: 'center',
    width: 70,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  status: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
      color: '#94a3b8',
      fontStyle: 'italic',
      fontSize: 13,
      padding: 20
  },
  footer: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
