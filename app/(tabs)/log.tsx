
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  spacing, 
  borderRadius 
} from '../../styles/commonStyles';

interface LogEntry {
  id: string;
  timestamp: Date;
  contactName: string;
  phoneNumber: string;
  duration: number;
  glitchType: string;
  success: boolean;
}

export default function LogScreen() {
  const [logEntries] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      contactName: 'John Doe',
      phoneNumber: '+1 (555) 123-4567',
      duration: 45,
      glitchType: 'Mixed',
      success: true,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      contactName: 'Jane Smith',
      phoneNumber: '+1 (555) 987-6543',
      duration: 23,
      glitchType: 'Static Noise',
      success: true,
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      contactName: 'Mike Johnson',
      phoneNumber: '+1 (555) 456-7890',
      duration: 12,
      glitchType: 'Delay',
      success: false,
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      contactName: 'Sarah Wilson',
      phoneNumber: '+1 (555) 321-0987',
      duration: 67,
      glitchType: 'Packet Loss',
      success: true,
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      contactName: 'Unknown',
      phoneNumber: '+1 (555) 999-8888',
      duration: 34,
      glitchType: 'Mixed',
      success: true,
    },
  ]);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getGlitchTypeIcon = (type: string): string => {
    switch (type) {
      case 'Packet Loss':
        return 'wifi-outline';
      case 'Static Noise':
        return 'volume-high';
      case 'Delay':
        return 'time-outline';
      case 'Mixed':
        return 'flash';
      default:
        return 'radio';
    }
  };

  const clearLog = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all call history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            console.log('Clearing call history');
            // In a real app, you would clear the log entries here
            Alert.alert('Success', 'Call history cleared');
          },
        },
      ]
    );
  };

  const getSuccessRate = (): number => {
    const successfulCalls = logEntries.filter(entry => entry.success).length;
    return Math.round((successfulCalls / logEntries.length) * 100);
  };

  const getTotalDuration = (): number => {
    return logEntries.reduce((total, entry) => total + entry.duration, 0);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.lg,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <Text style={[commonStyles.title, { textAlign: 'left', marginBottom: spacing.sm }]}>
            Call History
          </Text>
          <Text style={commonStyles.bodySecondary}>
            Track your jamming sessions and statistics
          </Text>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: spacing.md, 
            paddingVertical: spacing.md,
            paddingBottom: spacing.xl 
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Statistics Cards */}
          <View style={[commonStyles.row, { marginBottom: spacing.lg }]}>
            <View style={[commonStyles.card, { flex: 1, marginRight: spacing.sm }]}>
              <View style={commonStyles.center}>
                <Text style={[commonStyles.title, { color: colors.primary, marginBottom: spacing.xs }]}>
                  {logEntries.length}
                </Text>
                <Text style={[commonStyles.caption, { textAlign: 'center' }]}>
                  Total Calls
                </Text>
              </View>
            </View>
            
            <View style={[commonStyles.card, { flex: 1, marginLeft: spacing.sm }]}>
              <View style={commonStyles.center}>
                <Text style={[commonStyles.title, { color: colors.success, marginBottom: spacing.xs }]}>
                  {getSuccessRate()}%
                </Text>
                <Text style={[commonStyles.caption, { textAlign: 'center' }]}>
                  Success Rate
                </Text>
              </View>
            </View>
          </View>

          <View style={[commonStyles.card, { marginBottom: spacing.lg }]}>
            <View style={[commonStyles.cardHeader, { marginBottom: spacing.sm }]}>
              <Icon name="time" size={24} color={colors.primary} />
              <Text style={[commonStyles.subtitle, { flex: 1, marginLeft: spacing.sm, marginBottom: 0 }]}>
                Total Jamming Time
              </Text>
              <Text style={[commonStyles.subtitle, { color: colors.primary }]}>
                {Math.floor(getTotalDuration() / 60)}m {getTotalDuration() % 60}s
              </Text>
            </View>
          </View>

          {/* Call History List */}
          <View style={commonStyles.section}>
            <View style={[commonStyles.row, { marginBottom: spacing.md }]}>
              <Text style={commonStyles.sectionTitle}>
                Recent Activity
              </Text>
              <TouchableOpacity onPress={clearLog}>
                <Text style={[commonStyles.caption, { color: colors.danger }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>

            {logEntries.length === 0 ? (
              <View style={[commonStyles.card, commonStyles.center, { paddingVertical: spacing.xxl }]}>
                <Icon name="call-outline" size={48} color={colors.textLight} />
                <Text style={[commonStyles.subtitle, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
                  No call history
                </Text>
                <Text style={[commonStyles.caption, { textAlign: 'center' }]}>
                  Your jamming sessions will appear here
                </Text>
              </View>
            ) : (
              logEntries.map((entry) => (
                <View key={entry.id} style={[commonStyles.card, { marginBottom: spacing.md }]}>
                  <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
                    <View style={commonStyles.centerRow}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: entry.success ? colors.success : colors.danger,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.md,
                      }}>
                        <Icon 
                          name={entry.success ? 'checkmark' : 'close'} 
                          size={20} 
                          color={colors.background} 
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[commonStyles.body, { fontWeight: '600', marginBottom: 2 }]}>
                          {entry.contactName}
                        </Text>
                        <Text style={commonStyles.caption}>
                          {entry.phoneNumber}
                        </Text>
                      </View>
                    </View>
                    <Text style={[commonStyles.caption, { color: colors.textLight }]}>
                      {formatTime(entry.timestamp)}
                    </Text>
                  </View>
                  
                  <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
                    <View style={commonStyles.centerRow}>
                      <Icon 
                        name={getGlitchTypeIcon(entry.glitchType) as any} 
                        size={16} 
                        color={colors.textLight} 
                      />
                      <Text style={[commonStyles.caption, { marginLeft: spacing.xs }]}>
                        {entry.glitchType}
                      </Text>
                    </View>
                    <Text style={[commonStyles.caption, { color: colors.textLight }]}>
                      {entry.duration}s duration
                    </Text>
                  </View>
                  
                  <View style={[commonStyles.badge, { 
                    backgroundColor: entry.success ? colors.success : colors.danger,
                    alignSelf: 'flex-start'
                  }]}>
                    <Text style={commonStyles.badgeText}>
                      {entry.success ? '✓ Successful' : '✗ Failed'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
