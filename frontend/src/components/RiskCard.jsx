import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GlassCard from './GlassCard'; // <--- Importing the static glass card

export default function RiskCard({ title, level, value }) {
  
  // Helper to determine color based on risk level
  const getRiskColor = (lvl) => {
    if (!lvl) return '#ccc';
    switch (lvl.toLowerCase()) {
      case 'high': return '#ff4d4d'; // Red
      case 'medium': return '#ffcc00'; // Amber
      case 'low': return '#33cc33'; // Green
      default: return '#ccc';
    }
  };

  return (
    // <--- Using GlassCard instead of GlassTiltCard
    <GlassCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.row}>
        {/* Risk Level (High/Med/Low) */}
        <Text style={[styles.level, { color: getRiskColor(level) }]}>
          {level}
        </Text>
        
        {/* Value (e.g. 45mm/hr) */}
        <Text style={styles.value}>{value}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    // Note: No background color here! GlassCard handles the transparency.
  },
  title: {
    fontSize: 14,
    color: '#eee', // Light gray for better readability on glass
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
    textTransform: 'uppercase', // Optional: makes HIGH/LOW look stronger
  },
  value: {
    fontSize: 14,
    color: '#fff', // Pure white for data values
    fontWeight: '500',
  },
});