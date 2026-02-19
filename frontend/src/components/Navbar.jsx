import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="menu" size={24} color="#1e3a8a" />
      </TouchableOpacity>
      <Text style={styles.title}>FloodRisk</Text>
      <TouchableOpacity>
        <Ionicons name="person-circle-outline" size={24} color="#1e3a8a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
});
