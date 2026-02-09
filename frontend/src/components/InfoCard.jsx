import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GlassTiltCard from './GlassTiltCard';
import { locationService, guideService } from '../services/api';

export default function InfoCard({ type, onPress }) {
    const isTracking = type === 'tracking';
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                if (isTracking) {
                    const response = await locationService.getHistory("user_123");
                    setData(response.data[0]); // Show latest location log
                } else {
                    const response = await guideService.getGuide();
                    setData(response.data);
                }
            } catch (error) {
                console.error("InfoCard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isTracking]);

    const title = isTracking ? "Last Known Location" : "Offline Survival Guide";
    const desc = isTracking 
        ? (data ? `Last seen at ${data.location.lat}, ${data.location.lon}` : "Updating tracking history...")
        : (data ? `${data.tips.length} Safety Tips Available Offline` : "Emergency information bundle.");
    
    return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
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
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.desc}>
                        {loading 
                            ? (isTracking ? "Locating..." : "Loading Guide...") 
                            : desc}
                    </Text>
                </View>
            </View>
        </GlassTiltCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginBottom: 12,
    // flex: 1, // Removed to allow natural height sizing
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
