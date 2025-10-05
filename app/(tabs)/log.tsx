
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import PremiumBadge from '../../components/PremiumBadge';
import { supabase } from '../integrations/supabase/client';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  spacing, 
  borderRadius 
} from '../../styles/commonStyles';

interface LogEntry {
  id: string;
  contact_name: string;
  phone_number: string;
  duration: number;
  glitch_type: string;
  success: boolean;
  created_at: string;
  user_id?: string;
}

export default function LogScreen() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    {
      id: '1',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      contact_name: 'Sipho Ndlovu',
      phone_number: '+27 82 123 4567',
      duration: 45,
      glitch_type: 'Mixed',
      success: true,
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      contact_name: 'Lerato Molefe',
      phone_number: '+27 83 987 6543',
      duration: 23,
      glitch_type: 'Static Noise',
      success: true,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    loadCallHistory();
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  async function loadCallHistory() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('call_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setLogEntries(data);
        }
      }
    } catch (error) {
      console.error('Error loading call history:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
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
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const { error } = await supabase
                  .from('call_history')
                  .delete()
                  .eq('user_id', user.id);

                if (error) throw error;

                console.log('Clearing call history');
                setLogEntries([]);
                Alert.alert('Success', 'Call history cleared');
              }
            } catch (error) {
              console.error('Error clearing call history:', error);
              Alert.alert('Error', 'Failed to clear call history');
            }
          },
        },
      ]
    );
  };

  const getSuccessRate = (): number => {
    if (logEntries.length === 0) return 0;
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
          <View style={commonStyles.centerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.title, { textAlign: 'left', marginBottom: spacing.sm }]}>
                Call History
              </Text>
              <Text style={commonStyles.bodySecondary}>
                Track your jamming sessions and statistics
              </Text>
            </View>
            <PremiumBadge isPremium={userProfile?.is_premium || false} />
          </View>
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
                        <View style={commonStyles.centerRow}>
                          <Text style={[commonStyles.body, { fontWeight: '600', marginBottom: 2 }]}>
                            {entry.contact_name}
                          </Text>
                          <PremiumBadge isPremium={Math.random() > 0.5} size="small" />
                        </View>
                        <Text style={commonStyles.caption}>
                          {entry.phone_number}
                        </Text>
                      </View>
                    </View>
                    <Text style={[commonStyles.caption, { color: colors.textLight }]}>
                      {formatTime(entry.created_at)}
                    </Text>
                  </View>
                  
                  <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
                    <View style={commonStyles.centerRow}>
                      <Icon 
                        name={getGlitchTypeIcon(entry.glitch_type) as any} 
                        size={16} 
                        color={colors.textLight} 
                      />
                      <Text style={[commonStyles.caption, { marginLeft: spacing.xs }]}>
                        {entry.glitch_type}
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
