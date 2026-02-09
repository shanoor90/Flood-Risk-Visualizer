import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function GlassTiltCard({ children, style }) {
  return (
    <View style={[styles.cardContainer, style]}>
      <BlurView intensity={20} tint="light" style={styles.glassEffect}>
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  glassEffect: {
    // padding: 16, // Moved to gradient
  },
  gradient: {
    width: '100%',
    // height: '100%', // Removed to allow content to define height
    padding: 16, // Moved padding here for better control
  },
});
