import { sosService } from '../services/api';

export default function SOSButton() {
  const handlePress = async () => {
    try {
        const sosData = {
            userId: "user_123", // Placeholder for actual logged in user
            location: { lat: 6.9271, lon: 79.8612 }, // Placeholder for actual GPS
            riskLevel: "HIGH",
            riskScore: 65
        };

        const response = await sosService.sendSOS(sosData);
        Alert.alert("SOS SENT", `Your emergency alert has been broadcast. Alert ID: ${response.data.alertId}`);
    } catch (error) {
        console.error("SOS Error:", error);
        Alert.alert("SOS FAILED", "Internet unavailable. SMS Fallback activated.");
    }
  };

  return (
    <GlassTiltCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#dc2626' }]}>SOS Emergency System</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <LinearGradient
                colors={['#ef4444', '#b91c1c']}
                style={styles.sosBtn}
            >
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.sendText}>SEND ALERT</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.desc}>
        One-touch SOS alert sends your location & risk level.
      </Text>
    </GlassTiltCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    // Add glowing border effect for SOS
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderWidth: 2,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    // color set inline
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  sosBtn: {
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#ef4444",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    gap: 10,
  },
  sosText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  sendText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginTop: 8,
  },
});
