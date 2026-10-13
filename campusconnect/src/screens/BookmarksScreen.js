import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';

export default function BookmarksScreen({ navigation }) {
  const { bookmarks, toggleBookmark } = useApp();

  const sorted = [...bookmarks].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarks</Text>
      <Text style={styles.subtitle}>Your saved events for quick reference</Text>

      {sorted.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          message="No bookmarked events"
          subtitle="Tap the bookmark icon on any event to save it here"
        />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
              isBookmarked={true}
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
