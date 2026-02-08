import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import GlassTiltCard from './GlassTiltCard';

export default function RiskMapCard() {
  return (
    <GlassTiltCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Flood Risk Visualization</Text>
      </View>
      
      <View style={styles.mapPlaceholder}>
        <FontAwesome5 name="map-marked-alt" size={40} color="rgba(255,255,255,0.8)" />
        <Text style={styles.mapText}>Interactive Map Area</Text>
      </View>

      <View style={styles.riskBarContainer}>
        <Text style={styles.riskLabel}>Current Risk Level</Text>
        <View style={styles.riskBar}>
            <LinearGradient
                colors={['#4ade80', '#facc15', '#ef4444']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBar}
            />
            {/* Indicator triangle */}
            <View style={[styles.indicator, { left: '80%' }]} /> 
        </View>
        <Text style={styles.riskStatus}>High Risk</Text>
      </View>
    </GlassTiltCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    minHeight: 200,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004aad',
  },
  mapPlaceholder: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mapText: {
    color: '#eee',
    marginTop: 4,
    fontSize: 12,
  },
  riskBarContainer: {
    marginTop: 8,
  },
  riskLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  riskBar: {
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginBottom: 4,
    position: 'relative',
    overflow: 'visible', 
  },
  gradientBar: {
    flex: 1,
    borderRadius: 6,
  },
  indicator: {
    position: 'absolute',
    top: -4,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
  },
  riskStatus: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444', 
  },
});
