
import React, { useState } from 'react';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

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
      timestamp: new Date(Date.now() - 3600000),
      contactName: 'John Doe',
      phoneNumber: '+1 (555) 123-4567',
      duration: 45,
      glitchType: 'Mixed',
      success: true,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000),
      contactName: 'Jane Smith',
      phoneNumber: '+1 (555) 987-6543',
      duration: 30,
      glitchType: 'Static Noise',
      success: true,
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 86400000),
      contactName: 'Bob Johnson',
      phoneNumber: '+1 (555) 456-7890',
      duration: 15,
      glitchType: 'Packet Loss',
      success: false,
    },
  ]);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  const getGlitchTypeIcon = (type: string): keyof typeof Icon.prototype.props.name => {
    switch (type) {
      case 'Packet Loss':
        return 'wifi-outline';
      case 'Static Noise':
        return 'volume-high-outline';
      case 'Delay':
        return 'time-outline';
      case 'Mixed':
        return 'shuffle-outline';
      default:
        return 'help-outline';
    }
  };

  const clearLog = () => {
    console.log('Clear log requested - not implemented yet');
    // In a real app, this would clear the log entries
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={commonStyles.section}>
          <View style={commonStyles.row}>
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.title}>Call Log</Text>
              <Text style={commonStyles.textSecondary}>
                History of jammed calls
              </Text>
            </View>
            <TouchableOpacity
              onPress={clearLog}
              style={{
                backgroundColor: colors.danger,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text style={[commonStyles.textSecondary, { color: colors.text }]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Entries */}
        {logEntries.map(entry => (
          <View key={entry.id} style={commonStyles.card}>
            <View style={commonStyles.row}>
              <View style={{ flex: 1 }}>
                <View style={commonStyles.row}>
                  <Text style={commonStyles.subtitle}>{entry.contactName}</Text>
                  <View style={{
                    backgroundColor: entry.success ? colors.success : colors.danger,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}>
                    <Text style={[
                      commonStyles.textSecondary,
                      { color: colors.background, fontSize: 10 }
                    ]}>
                      {entry.success ? 'SUCCESS' : 'FAILED'}
                    </Text>
                  </View>
                </View>
                
                <Text style={commonStyles.textSecondary}>
                  {entry.phoneNumber}
                </Text>
                
                <View style={[commonStyles.row, { marginTop: 8 }]}>
                  <Text style={commonStyles.textSecondary}>
                    {formatTime(entry.timestamp)}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    {entry.duration}s duration
                  </Text>
                </View>
              </View>
              
              <View style={{ alignItems: 'center', marginLeft: 16 }}>
                <Icon
                  name={getGlitchTypeIcon(entry.glitchType)}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[commonStyles.textSecondary, { fontSize: 10, marginTop: 4 }]}>
                  {entry.glitchType}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {logEntries.length === 0 && (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
            <Icon name="list-outline" size={60} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16 }]}>
              No call history yet
            </Text>
            <Text style={commonStyles.textSecondary}>
              Jammed calls will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
