import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FamilyList({ onPress }) {
  const familyMembers = [
    { id: 1, name: 'Mom', safe: true },
    { id: 2, name: 'Dad', safe: true },
    { id: 3, name: 'Sister', safe: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Status</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.seeAll}>Manage</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.list}>
        {familyMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={[styles.avatar, member.safe ? styles.safe : styles.danger]}>
              <Text style={styles.avatarText}>{member.name[0]}</Text>
            </View>
            <Text style={styles.memberName}>{member.name}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addCard} onPress={onPress}>
          <Ionicons name="add" size={24} color="#64748b" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  list: {
    flexDirection: 'row',
  },
  memberCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  safe: {
    backgroundColor: '#22c55e',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  memberName: {
    fontSize: 12,
    color: '#475569',
  },
  addCard: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
});
