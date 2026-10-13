import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/sampleData';

export default function CreatePostScreen({ route, navigation }) {
  const { type, item } = route.params || {};
  const { addAnnouncement, updateAnnouncement, addEvent, updateEvent, deleteAnnouncement, deleteEvent } = useApp();

  const isAnnouncement = type === 'announcement';
  const isEdit = !!item;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      if (isAnnouncement) {
        setTitle(item.title);
        setBody(item.body);
        setCategory(item.category);
        setPriority(item.priority);
        setAuthor(item.author);
      } else {
        setTitle(item.title);
        setDescription(item.description);
        setCategory(item.category);
        setDate(item.date);
        setTime(item.time);
        setLocation(item.location);
        setOrganizer(item.organizer);
      }
    }
  }, [item]);

  const handleSave = () => {
    if (isAnnouncement) {
      if (!title.trim() || !body.trim() || !author.trim()) {
        Alert.alert('Missing Fields', 'Please fill in all required fields.');
        return;
      }
      const announcement = {
        id: item?.id || `a${Date.now()}`,
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        author: author.trim(),
        date: item?.date || new Date().toISOString(),
      };
      if (isEdit) {
        updateAnnouncement(announcement);
      } else {
        addAnnouncement(announcement);
      }
    } else {
      if (!title.trim() || !description.trim() || !date.trim() || !time.trim() || !location.trim() || !organizer.trim()) {
        Alert.alert('Missing Fields', 'Please fill in all required fields.');
        return;
      }
      const event = {
        id: item?.id || `e${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        organizer: organizer.trim(),
        image: null,
      };
      if (isEdit) {
        updateEvent(event);
      } else {
        addEvent(event);
      }
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete',
      `Are you sure you want to delete this ${isAnnouncement ? 'announcement' : 'event'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isAnnouncement) {
              deleteAnnouncement(item.id);
            } else {
              deleteEvent(item.id);
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  const priorities = ['low', 'medium', 'high'];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {isEdit ? 'Edit' : 'Create'} {isAnnouncement ? 'Announcement' : 'Event'}
        </Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor="#9ca3af"
        />

        {isAnnouncement ? (
          <>
            <Text style={styles.label}>Body *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={body}
              onChangeText={setBody}
              placeholder="Enter announcement details"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Author *</Text>
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
              placeholder="e.g. Academic Office"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    category === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={[styles.chipText, category === cat.id && styles.chipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Priority</Text>
            <View style={styles.chipRow}>
              {priorities.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.chip,
                    priority === p && styles.chipPriorityActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter event description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="2026-10-20"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Time *</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="8:00 AM - 5:00 PM"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Main Gymnasium"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Organizer *</Text>
            <TextInput
              style={styles.input}
              value={organizer}
              onChangeText={setOrganizer}
              placeholder="e.g. Sports Office"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    category === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={[styles.chipText, category === cat.id && styles.chipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {isEdit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  saveBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 100,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipPriorityActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  chipTextActive: {
    color: '#fff',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
  },
});
