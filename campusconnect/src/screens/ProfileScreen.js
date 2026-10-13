import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ROLES, ROLE_LABELS, ROLE_PERMISSIONS } from '../data/sampleData';

const roleIcons = {
  student: 'school-outline',
  teacher: 'person-outline',
  admin: 'shield-checkmark-outline',
};

const roleColors = {
  student: '#3b82f6',
  teacher: '#10b981',
  admin: '#8b5cf6',
};

export default function ProfileScreen() {
  const { role, setRole, bookmarks, announcements, events } = useApp();

  const handleRoleChange = (newRole) => {
    if (newRole === role) return;
    Alert.alert(
      'Switch Role',
      `Switch to ${ROLE_LABELS[newRole]}? This will change your permissions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => setRole(newRole) },
      ]
    );
  };

  const permissions = ROLE_PERMISSIONS[role] || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: roleColors[role] + '20' }]}>
          <Ionicons name={roleIcons[role]} size={40} color={roleColors[role]} />
        </View>
        <Text style={styles.name}>CampusConnect User</Text>
        <Text style={styles.email}>user@campusconnect.edu</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleColors[role] + '20' }]}>
          <Text style={[styles.roleText, { color: roleColors[role] }]}>
            {ROLE_LABELS[role]}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{announcements.length}</Text>
            <Text style={styles.statLabel}>Announcements</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookmarks.length}</Text>
            <Text style={styles.statLabel}>Bookmarks</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Switch Role</Text>
        <Text style={styles.sectionDesc}>
          Change your role to explore different permission levels
        </Text>
        {Object.values(ROLES).map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleOption,
              role === r && { borderColor: roleColors[r], backgroundColor: roleColors[r] + '08' },
            ]}
            onPress={() => handleRoleChange(r)}
          >
            <View style={styles.roleOptionLeft}>
              <View style={[styles.roleIcon, { backgroundColor: roleColors[r] + '20' }]}>
                <Ionicons name={roleIcons[r]} size={22} color={roleColors[r]} />
              </View>
              <View>
                <Text style={styles.roleOptionTitle}>{ROLE_LABELS[r]}</Text>
                <Text style={styles.roleOptionDesc}>
                  {r === 'student' && 'View announcements, events, and bookmark'}
                  {r === 'teacher' && 'View announcements, events, and bookmark'}
                  {r === 'admin' && 'Full access including create, edit, and delete'}
                </Text>
              </View>
            </View>
            {role === r && (
              <Ionicons name="checkmark-circle" size={24} color={roleColors[r]} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Permissions</Text>
        <View style={styles.permissionList}>
          {['view', 'bookmark', 'create', 'edit', 'delete'].map(perm => {
            const hasPermission = permissions.includes(perm);
            return (
              <View key={perm} style={styles.permissionRow}>
                <Ionicons
                  name={hasPermission ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={hasPermission ? '#10b981' : '#ef4444'}
                />
                <Text style={[styles.permissionText, !hasPermission && styles.permissionTextOff]}>
                  {perm.charAt(0).toUpperCase() + perm.slice(1)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CampusConnect v1.0</Text>
        <Text style={styles.footerSub}>School Announcement and Events App</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 28,
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  roleOptionDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  permissionList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  permissionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  permissionTextOff: {
    color: '#d1d5db',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  footerSub: {
    fontSize: 12,
    color: '#d1d5db',
    marginTop: 4,
  },
});
