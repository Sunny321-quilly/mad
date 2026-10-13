import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/sampleData';

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export default function AnnouncementDetailScreen({ route }) {
  const { announcement } = route.params;
  const category = CATEGORIES.find(c => c.id === announcement.category) || CATEGORIES[0];
  const priorityColor = priorityColors[announcement.priority] || '#6366f1';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getPriorityLabel = (p) => {
    return p.charAt(0).toUpperCase() + p.slice(1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
          <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <Text style={[styles.priorityText, { color: priorityColor }]}>
            {getPriorityLabel(announcement.priority)} Priority
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{announcement.title}</Text>

      <View style={styles.meta}>
        <View style={styles.metaRow}>
          <Ionicons name="person-circle-outline" size={18} color="#6b7280" />
          <Text style={styles.metaText}>{announcement.author}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{formatDate(announcement.date)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.body}>{announcement.body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    lineHeight: 30,
    marginBottom: 16,
  },
  meta: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  body: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
});
