
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

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
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      contactName: 'John Doe',
      phoneNumber: '+1 (555) 123-4567',
      duration: 45,
      glitchType: 'Mixed',
      success: true,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      contactName: 'Jane Smith',
      phoneNumber: '+1 (555) 987-6543',
      duration: 30,
      glitchType: 'Static Noise',
      success: true,
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      contactName: 'Bob Johnson',
      phoneNumber: '+1 (555) 456-7890',
      duration: 15,
      glitchType: 'Packet Loss',
      success: false,
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      contactName: 'Unknown',
      phoneNumber: '+1 (555) 111-2222',
      duration: 60,
      glitchType: 'Delay',
      success: true,
    },
  ]);

  const formatTime = (date: Date) => {
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

  const getGlitchTypeIcon = (type: string) => {
    switch (type) {
      case 'Packet Loss':
        return 'wifi-outline';
      case 'Static Noise':
        return 'volume-high';
      case 'Delay':
        return 'time';
      case 'Mixed':
        return 'shuffle';
      default:
        return 'radio';
    }
  };

  const clearLog = () => {
    console.log('Clear log requested');
    // In a real app, this would clear the log entries
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={[commonStyles.section, { marginTop: 20, marginBottom: 10 }]}>
          <View style={commonStyles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.title, { textAlign: 'left' }]}>
                Call Log
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                History of jammed calls
              </Text>
            </View>
            <TouchableOpacity onPress={clearLog}>
              <Icon name="trash-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.subtitle, { color: colors.primary }]}>
                {logEntries.filter(entry => entry.success).length}
              </Text>
              <Text style={commonStyles.textSecondary}>Successful</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.subtitle, { color: colors.danger }]}>
                {logEntries.filter(entry => !entry.success).length}
              </Text>
              <Text style={commonStyles.textSecondary}>Failed</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.subtitle, { color: colors.text }]}>
                {logEntries.length}
              </Text>
              <Text style={commonStyles.textSecondary}>Total</Text>
            </View>
          </View>
        </View>

        {/* Log Entries */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {logEntries.map((entry) => (
            <View key={entry.id} style={[commonStyles.card, { marginBottom: 10 }]}>
              <View style={commonStyles.row}>
                <View style={{ marginRight: 15 }}>
                  <Icon
                    name={getGlitchTypeIcon(entry.glitchType)}
                    size={24}
                    color={entry.success ? colors.primary : colors.danger}
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <View style={[commonStyles.row, { marginBottom: 4 }]}>
                    <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600' }]}>
                      {entry.contactName}
                    </Text>
                    <Text style={[
                      commonStyles.textSecondary,
                      { fontSize: 12, color: entry.success ? colors.primary : colors.danger }
                    ]}>
                      {entry.success ? 'SUCCESS' : 'FAILED'}
                    </Text>
                  </View>
                  
                  <Text style={[commonStyles.textSecondary, { textAlign: 'left', marginBottom: 2 }]}>
                    {entry.phoneNumber}
                  </Text>
                  
                  <View style={commonStyles.row}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                      {entry.glitchType} • {entry.duration}s • {formatTime(entry.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          
          {logEntries.length === 0 && (
            <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
              <Icon name="list-outline" size={40} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 10 }]}>
                No call history yet
              </Text>
            </View>
          )}
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
