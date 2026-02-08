import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function MapView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Maps Placeholder</Text>
      <Text style={styles.subtext}>(Will integrate Google Maps / Mapbox)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#aaa',
    fontSize: 12,
  },
});
