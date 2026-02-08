import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GlassTiltCard from './GlassTiltCard';

export default function RiskCard({ title, level, value }) {
  const getRiskColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'high': return '#ff4d4d';
      case 'medium': return '#ffcc00';
      case 'low': return '#33cc33';
      default: return '#ccc';
    }
  };

  return (
    <GlassTiltCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={[styles.level, { color: getRiskColor(level) }]}>{level}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </GlassTiltCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  level: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#ddd',
  },
});
