import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import GlassTiltCard from './GlassTiltCard';
import { familyService } from '../services/api';

export default function FamilyList({ onPress }) {
  const [familyMembers, setFamilyMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFamily = async () => {
      try {
        const userId = "user_123"; // Placeholder
        const response = await familyService.getFamilyRisk(userId);
        // Map the results to the UI format
        const mappedData = response.data.map(m => ({
          id: m.memberId,
          name: m.memberName,
          role: m.risk.level,
          color: m.risk.color,
          score: m.risk.score
        }));
        setFamilyMembers(mappedData);
      } catch (error) {
        console.error("Error fetching family risk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFamily();
  }, []);

  if (loading) return <Text style={{color: '#fff', textAlign: 'center'}}>Syncing Family Circle...</Text>;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlassTiltCard style={styles.card}>
      <Text style={styles.title}>Family Connection Dashboard</Text>
      
      <View style={styles.list}>
        {familyMembers.map((member) => (
          <View key={member.id} style={styles.item}>
            <View style={[styles.avatar, { borderColor: member.color }]}>
                {/* Placeholder Initials */}
                <Text style={styles.initials}>{member.name[0]}</Text>
            </View>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={[styles.status, { color: member.color }]}>{member.role}</Text>
          </View>
        ))}
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
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  item: {
    alignItems: 'center',
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
  },
  status: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
