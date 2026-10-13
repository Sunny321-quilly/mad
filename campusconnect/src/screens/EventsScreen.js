import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, ROLE_PERMISSIONS } from '../data/sampleData';

export default function EventsScreen({ navigation }) {
  const { events, bookmarks, toggleBookmark, role } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUpcoming, setShowUpcoming] = useState(true);

  const canManage = ROLE_PERMISSIONS[role]?.includes('create') || false;

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = searchQuery === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchesDate = showUpcoming ? e.date >= today : e.date < today;
      return matchesSearch && matchesCategory && matchesDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, searchQuery, selectedCategory, showUpcoming, today]);

  const isBookmarked = (eventId) => bookmarks.some(b => b.id === eventId);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>Browse upcoming and past events</Text>
        </View>
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => navigation.navigate('CreatePost', { type: 'event' })}
        >
          <Ionicons name="add-circle" size={28} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <CategoryFilter
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, showUpcoming && styles.toggleBtnActive]}
          onPress={() => setShowUpcoming(true)}
        >
          <Text style={[styles.toggleText, showUpcoming && styles.toggleTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, !showUpcoming && styles.toggleBtnActive]}
          onPress={() => setShowUpcoming(false)}
        >
          <Text style={[styles.toggleText, !showUpcoming && styles.toggleTextActive]}>
            Past Events
          </Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          message={showUpcoming ? 'No upcoming events' : 'No past events'}
          subtitle="Try adjusting your search or filter"
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
              isBookmarked={isBookmarked(item.id)}
              onToggleBookmark={() => toggleBookmark(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  manageBtn: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
  },
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#1f2937',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
