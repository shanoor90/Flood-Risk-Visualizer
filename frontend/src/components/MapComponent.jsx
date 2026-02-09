import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MapComponent({ location, riskLevel, riskScore }) {
    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.text}>Waiting for location...</Text>
            </View>
        );
    }

    const isHighRisk = riskLevel === 'HIGH' || riskLevel === 'SEVERE';
    const circleColor = isHighRisk ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.2)';
    const markerColor = isHighRisk ? '#ef4444' : '#22c55e';
    const iconName = isHighRisk ? 'waves' : 'weather-cloudy';

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: location.lat,
                    longitude: location.lon,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                region={{
                    latitude: location.lat,
                    longitude: location.lon,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                {/* Visual Overlay: Risk Zone Circle (Radius ~1km = 1000m) */}
                <Circle 
                    center={{ latitude: location.lat, longitude: location.lon }}
                    radius={1000}
                    fillColor={circleColor}
                    strokeColor={markerColor}
                />

                {/* Custom Marker */}
                <Marker coordinate={{ latitude: location.lat, longitude: location.lon }}>
                    <View style={[styles.markerContainer, { backgroundColor: markerColor }]}>
                        <MaterialCommunityIcons name={iconName} size={20} color="#fff" />
                    </View>
                </Marker>
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    text: {
        color: '#fff',
        fontSize: 12,
    },
    markerContainer: {
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 4,
    }
});
