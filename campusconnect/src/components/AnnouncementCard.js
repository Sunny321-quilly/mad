import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/sampleData';

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export default function AnnouncementCard({ announcement, onPress, onEdit, onDelete, canManage }) {
  const category = CATEGORIES.find(c => c.id === announcement.category) || CATEGORIES[0];
  const priorityColor = priorityColors[announcement.priority] || '#6366f1';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
          <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
        </View>
        <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
      </View>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.body} numberOfLines={3}>{announcement.body}</Text>
      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <Ionicons name="person-circle-outline" size={16} color="#6b7280" />
          <Text style={styles.author}>{announcement.author}</Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.date}>{formatDate(announcement.date)}</Text>
        </View>
      </View>
      {canManage && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color="#6366f1" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
            <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  author: {
    fontSize: 12,
    color: '#6b7280',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
});
