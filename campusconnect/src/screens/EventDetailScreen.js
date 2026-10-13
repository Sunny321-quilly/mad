import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/sampleData';

export default function EventDetailScreen({ route }) {
  const { event } = route.params;
  const { bookmarks, toggleBookmark } = useApp();

  const category = CATEGORIES.find(c => c.id === event.category) || CATEGORIES[0];
  const isBookmarked = bookmarks.some(b => b.id === event.id);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: category.color + '20' }]}>
          <Ionicons name="calendar" size={40} color={category.color} />
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
          <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
          </View>
          <View>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="time-outline" size={20} color="#6366f1" />
          </View>
          <View>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{event.time}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="location-outline" size={20} color="#6366f1" />
          </View>
          <View>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="people-outline" size={20} color="#6366f1" />
          </View>
          <View>
            <Text style={styles.detailLabel}>Organizer</Text>
            <Text style={styles.detailValue}>{event.organizer}</Text>
          </View>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descTitle}>About this event</Text>
        <Text style={styles.descText}>{event.description}</Text>
      </View>

      <TouchableOpacity
        style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
        onPress={() => toggleBookmark(event)}
      >
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={isBookmarked ? '#fff' : '#6366f1'}
        />
        <Text style={[styles.bookmarkText, isBookmarked && styles.bookmarkTextActive]}>
          {isBookmarked ? 'Bookmarked' : 'Bookmark this event'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    paddingHorizontal: 16,
    marginBottom: 16,
    lineHeight: 30,
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 14,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
    marginTop: 2,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  bookmarkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    gap: 8,
  },
  bookmarkBtnActive: {
    backgroundColor: '#6366f1',
  },
  bookmarkText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
  },
  bookmarkTextActive: {
    color: '#fff',
  },
});
