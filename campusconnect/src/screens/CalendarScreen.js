import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/sampleData';

export default function CalendarScreen({ navigation }) {
  const { events } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  };

  const getDateStr = (day) => {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const upcomingEvents = useMemo(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    return events
      .filter(e => e.date >= todayDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [events]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Calendar</Text>

      <View style={styles.monthNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.monthName}>{monthName}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map(d => (
          <Text key={d} style={styles.weekDay}>{d}</Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={styles.dayCell} />;
          }
          const dateStr = getDateStr(day);
          const dayEvents = eventsByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          return (
            <TouchableOpacity
              key={dateStr}
              style={[styles.dayCell, isToday && styles.todayCell]}
              onPress={() => {
                if (dayEvents.length > 0) {
                  navigation.navigate('EventDetail', { event: dayEvents[0] });
                }
              }}
            >
              <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
              {dayEvents.length > 0 && (
                <View style={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((e, i) => {
                    const cat = CATEGORIES.find(c => c.id === e.category);
                    return (
                      <View
                        key={i}
                        style={[styles.eventDot, { backgroundColor: cat?.color || '#6366f1' }]}
                      />
                    );
                  })}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.length === 0 ? (
          <Text style={styles.noEvents}>No upcoming events</Text>
        ) : (
          upcomingEvents.map(e => {
            const cat = CATEGORIES.find(c => c.id === e.category);
            return (
              <TouchableOpacity
                key={e.id}
                style={styles.upcomingItem}
                onPress={() => navigation.navigate('EventDetail', { event: e })}
              >
                <View style={[styles.upcomingDot, { backgroundColor: cat?.color || '#6366f1' }]} />
                <View style={styles.upcomingInfo}>
                  <Text style={styles.upcomingTitle}>{e.title}</Text>
                  <Text style={styles.upcomingDate}>{e.date} · {e.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    paddingTop: 16,
    paddingBottom: 12,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: {
    padding: 8,
  },
  monthName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    paddingVertical: 6,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: '#6366f1',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  todayText: {
    color: '#fff',
    fontWeight: '700',
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  upcomingSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  noEvents: {
    fontSize: 14,
    color: '#9ca3af',
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  upcomingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  upcomingDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
