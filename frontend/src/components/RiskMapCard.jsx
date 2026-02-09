import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import GlassTiltCard from './GlassTiltCard';
import * as Location from 'expo-location';
import { riskService } from '../services/api';
import MapComponent from './MapComponent';

export default function RiskMapCard({ onPress }) {
  const [riskData, setRiskData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(null);

  React.useEffect(() => {
    const fetchRisk = async (lat, lon) => {
      try {
        setLoading(true);
        const response = await riskService.getRiskData(lat, lon);
        setRiskData(response.data);
      } catch (error) {
        console.error("Error fetching risk data:", error);
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Fallback to Colombo if permission denied
        fetchRisk(6.9271, 79.8612);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchRisk(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const riskLevel = riskData?.risk?.level || 'LOW';
  const riskScore = riskData?.risk?.score || 0;
  const riskColor = riskData?.risk?.color || '#4ade80';
  const lastUpdated = riskData?.risk?.lastUpdated || 'N/A';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlassTiltCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Flood Risk Visualization</Text>
        <Text style={styles.timeTag}>Last Sync: {lastUpdated}</Text>
      </View>
      
      {/* Replaced Placeholder with MapComponent */}
      <View style={styles.mapContainer}>
        <MapComponent 
            location={riskData?.location} 
            riskLevel={riskLevel} 
            riskScore={riskScore} 
        />
        {!loading && (
             <View style={styles.overlayTag}>
                <Text style={styles.mapText}>
                    {`Lat: ${riskData?.location?.lat?.toFixed(4)}, Lon: ${riskData?.location?.lon?.toFixed(4)}`}
                </Text>
             </View>
        )}
      </View>

      <View style={styles.riskBarContainer}>
        <Text style={styles.riskLabel}>Current Risk Level ({riskScore})</Text>
        <View style={styles.riskBar}>
            <LinearGradient
                colors={['#4ade80', '#facc15', '#ef4444']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBar}
            />
            {/* Indicator triangle based on score */}
            <View style={[styles.indicator, { left: `${Math.min(100, riskScore)}%` }]} /> 
        </View>
        <Text style={[styles.riskStatus, { color: riskColor }]}>{riskLevel} Risk</Text>
      </View>
      </GlassTiltCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    minHeight: 200,
  },
  header: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004aad',
  },
  timeTag: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  mapContainer: {
    height: 180, // Increased height for better map visibility
    borderRadius: 12, // Slightly more rounded
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  overlayTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
