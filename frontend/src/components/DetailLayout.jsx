import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetailLayout({ title, icon, color, navigation, children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
        <LinearGradient
            colors={[color, color + 'CC', '#f8fafc']}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="chevron-left" size={32} color="#1e3a8a" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <MaterialCommunityIcons name={icon} size={28} color="#1e3a8a" />
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>
                <View style={{ width: 40 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
});
