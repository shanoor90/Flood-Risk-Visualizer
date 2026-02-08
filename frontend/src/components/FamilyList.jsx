import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import GlassTiltCard from './GlassTiltCard';

const familyMembers = [
  { id: 1, name: 'Mom', role: 'Safe', color: '#22c55e' },
  { id: 2, name: 'Dad', role: 'Safe', color: '#22c55e' },
  { id: 3, name: 'Sarah', role: 'Syncing...', color: '#eab308' },
];

export default function FamilyList() {
  return (
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
