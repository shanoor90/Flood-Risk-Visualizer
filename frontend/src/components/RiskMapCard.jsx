import * as Location from 'expo-location';
import { riskService } from '../services/api';

export default function RiskMapCard() {
  const [riskData, setRiskData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(null);

  React.useEffect(() => {
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
  }, []);

  const riskLevel = riskData?.risk?.level || 'LOW';
  const riskScore = riskData?.risk?.score || 0;
  const riskColor = riskData?.risk?.color || '#4ade80';
  const lastUpdated = riskData?.risk?.lastUpdated || 'N/A';

  return (
    <GlassTiltCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Flood Risk Visualization</Text>
        <Text style={styles.timeTag}>Last Sync: {lastUpdated}</Text>
      </View>
      
      <View style={styles.mapPlaceholder}>
        <FontAwesome5 name="map-marked-alt" size={40} color="rgba(255,255,255,0.8)" />
        <Text style={styles.mapText}>
          {loading ? "Fetching data..." : `Live Location: ${riskData?.location?.lat}, ${riskData?.location?.lon}`}
        </Text>
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
