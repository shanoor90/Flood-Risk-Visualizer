import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassTiltCard from './GlassTiltCard';

export default function InfoCard({ type }) {
    const isTracking = type === 'tracking';
    
    return (
        <GlassTiltCard style={styles.card}>
            <View style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: isTracking ? '#dbeafe' : '#dcfce7' }]}>
                    <MaterialCommunityIcons 
                        name={isTracking ? "map-marker-radius" : "medical-bag"} 
                        size={32} 
                        color={isTracking ? "#2563eb" : "#16a34a"} 
                    />
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {isTracking ? "Last Known Location" : "Offline Survival Guide"}
                    </Text>
                    <Text style={styles.desc}>
                        {isTracking 
                            ? "Periodically saves your last GPS location for family access."
                            : "First aid tips, emergency contacts & shelter info offline."
                        }
                    </Text>
                </View>
            </View>
        </GlassTiltCard>
    );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    flex: 1, // Allow equal height in grid
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
