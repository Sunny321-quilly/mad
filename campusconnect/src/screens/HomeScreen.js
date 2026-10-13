import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import AnnouncementCard from '../components/AnnouncementCard';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, ROLE_PERMISSIONS } from '../data/sampleData';

export default function HomeScreen({ navigation }) {
  const { announcements, dispatch, role } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const canManage = ROLE_PERMISSIONS[role]?.includes('create') || false;

  const filtered = useMemo(() => {
    return announcements.filter(a => {
      const matchesSearch = searchQuery === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [announcements, searchQuery, selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_ANNOUNCEMENT', payload: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>CampusConnect</Text>
          <Text style={styles.subGreeting}>Stay updated with school announcements</Text>
        </View>
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => navigation.navigate('CreatePost', { type: 'announcement' })}
        >
          <Ionicons name="add-circle" size={28} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search announcements..."
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

      {filtered.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          message="No announcements found"
          subtitle="Try adjusting your search or filter"
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AnnouncementCard
              announcement={item}
              onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
              onEdit={() => navigation.navigate('CreatePost', { type: 'announcement', item })}
              onDelete={() => handleDelete(item.id)}
              canManage={canManage}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bg: '#f9fafb',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  subGreeting: {
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
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
