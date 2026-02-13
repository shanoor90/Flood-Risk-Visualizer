// File: frontend/src/components/GlassCard.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

const GlassCard = ({ children, style, intensity = 20 }) => {
  return (
    <View style={[styles.container, style]}>
      {/* "intensity" controls the blur strength */}
      <BlurView intensity={intensity} tint="light" style={styles.blurContainer}>
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden', // Keeps the blur inside the rounded corners
    backgroundColor: 'transparent',
    // Border is essential for the "Glass" look
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // Shadow gives depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  blurContainer: {
    padding: 16,
    // White tint (0.15) makes text readable while keeping transparency
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    width: '100%',
  },
});

export default GlassCard;