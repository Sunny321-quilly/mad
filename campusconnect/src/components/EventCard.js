import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/sampleData';

export default function EventCard({ event, onPress, isBookmarked, onToggleBookmark }) {
  const category = CATEGORIES.find(c => c.id === event.category) || CATEGORIES[0];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const getDay = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').getDate();
  };

  const getMonth = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.dateBox}>
        <Text style={styles.dateDay}>{getDay(event.date)}</Text>
        <Text style={styles.dateMonth}>{getMonth(event.date)}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
          </View>
          <TouchableOpacity onPress={onToggleBookmark} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? '#6366f1' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.infoText}>{formatTime(event.time)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dateBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 22,
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e0e7ff',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
  },
});
