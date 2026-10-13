import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyState({ icon = 'document-outline', message = 'No items found', subtitle }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="#d1d5db" />
      <Text style={styles.message}>{message}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#d1d5db',
    marginTop: 6,
  },
});
