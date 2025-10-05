
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Icon from '../../components/Icon';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  spacing, 
  borderRadius,
  shadows 
} from '../../styles/commonStyles';

export default function HomeScreen() {
  const [jamModeActive, setJamModeActive] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isJamming, setIsJamming] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glitchAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (jamModeActive) {
      console.log('Jam mode activated - starting pulse animation');
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      console.log('Jam mode deactivated - stopping pulse animation');
      pulseAnim.setValue(1);
    }
  }, [jamModeActive]);

  useEffect(() => {
    if (isJamming) {
      console.log('Starting glitch animation');
      const glitch = Animated.loop(
        Animated.sequence([
          Animated.timing(glitchAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glitchAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ])
      );
      glitch.start();
      return () => glitch.stop();
    } else {
      glitchAnim.setValue(0);
    }
  }, [isJamming]);

  const toggleJamMode = async () => {
    try {
      console.log('Toggling jam mode from', jamModeActive, 'to', !jamModeActive);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setJamModeActive(!jamModeActive);
    } catch (error) {
      console.error('Error toggling jam mode:', error);
    }
  };

  const handleJamNow = async () => {
    try {
      console.log('Jam Now button pressed');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      if (!isCallActive) {
        Alert.alert(
          'No Active Call',
          'Start a call first, then use "Jam Now" to simulate poor network quality.',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsJamming(!isJamming);
      
    } catch (error) {
      console.error('Error in jam now:', error);
    }
  };

  const simulateIncomingCall = () => {
    try {
      console.log('Simulating incoming call');
      Alert.alert(
        'Incoming Call',
        'Simulated call from +1 (555) 123-4567\n\nAnswer to test jamming features!',
        [
          { 
            text: 'Decline', 
            style: 'cancel', 
            onPress: () => setIsCallActive(false)
          },
          { 
            text: 'Answer', 
            onPress: () => setIsCallActive(true)
          }
        ]
      );
    } catch (error) {
      console.error('Error simulating call:', error);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.gradient.start, colors.gradient.end]}
          style={{
            paddingTop: spacing.xl,
            paddingBottom: spacing.xl,
            paddingHorizontal: spacing.md,
            borderBottomLeftRadius: borderRadius.xl,
            borderBottomRightRadius: borderRadius.xl,
            marginBottom: spacing.lg,
          }}
        >
          <View style={commonStyles.center}>
            <Text style={[commonStyles.title, { color: colors.background, marginBottom: spacing.xs }]}>
              Call Glitcher
            </Text>
            <View style={[commonStyles.centerRow, { marginBottom: spacing.sm }]}>
              <View style={[
                commonStyles.statusIndicator,
                jamModeActive ? commonStyles.statusActive : commonStyles.statusInactive
              ]} />
              <Text style={[commonStyles.body, { 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }]}>
                {jamModeActive ? 'Jam Mode Active' : 'Standby Mode'}
              </Text>
            </View>
            {isCallActive && (
              <View style={[commonStyles.badge, { backgroundColor: colors.warning }]}>
                <Text style={[commonStyles.badgeText, { color: colors.background }]}>
                  📞 Call Active
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={commonStyles.content}>
          {/* Main Control Card */}
          <View style={[commonStyles.card, { marginBottom: spacing.lg }]}>
            <TouchableOpacity
              onPress={toggleJamMode}
              style={{
                alignItems: 'center',
                paddingVertical: spacing.lg,
              }}
            >
              <Animated.View
                style={[
                  {
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: jamModeActive ? colors.primary : colors.backgroundAlt,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.md,
                    ...shadows.lg,
                  },
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <Icon
                  name={jamModeActive ? 'radio' : 'radio-outline'}
                  size={50}
                  color={jamModeActive ? colors.background : colors.primary}
                />
              </Animated.View>
              
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: spacing.xs }]}>
                {jamModeActive ? 'Jam Mode Active' : 'Activate Jam Mode'}
              </Text>
              <Text style={[commonStyles.caption, { textAlign: 'center' }]}>
                {jamModeActive ? 'Tap to disable' : 'Tap to enable call jamming'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={commonStyles.section}>
            <Text style={[commonStyles.sectionTitle, { marginBottom: spacing.md }]}>
              Quick Actions
            </Text>
            
            <TouchableOpacity
              style={[
                buttonStyles.primary,
                { 
                  marginBottom: spacing.md,
                  backgroundColor: isJamming ? colors.danger : colors.primary,
                  opacity: !isCallActive ? 0.6 : 1
                }
              ]}
              onPress={handleJamNow}
              disabled={!isCallActive}
            >
              <View style={commonStyles.centerRow}>
                {isJamming && (
                  <Animated.View style={{ opacity: glitchAnim, marginRight: spacing.sm }}>
                    <Icon name="flash" size={20} color={colors.background} />
                  </Animated.View>
                )}
                <Text style={buttonStyles.primaryText}>
                  {isJamming ? 'Stop Jamming' : 'Jam Now'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.secondary, { marginBottom: spacing.md }]}
              onPress={simulateIncomingCall}
            >
              <View style={commonStyles.centerRow}>
                <Icon name="call" size={20} color={colors.text} style={{ marginRight: spacing.sm }} />
                <Text style={buttonStyles.secondaryText}>
                  Simulate Call
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* How It Works */}
          <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
            <View style={[commonStyles.cardHeader, { marginBottom: spacing.md }]}>
              <Icon name="information-circle" size={24} color={colors.primary} />
              <Text style={[commonStyles.subtitle, { flex: 1, marginLeft: spacing.sm, marginBottom: 0 }]}>
                How It Works
              </Text>
            </View>
            
            <View style={{ marginBottom: spacing.sm }}>
              <View style={[commonStyles.centerRow, { justifyContent: 'flex-start', marginBottom: spacing.xs }]}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}>
                  <Text style={[commonStyles.caption, { color: colors.background, fontWeight: '600' }]}>1</Text>
                </View>
                <Text style={commonStyles.body}>Enable Jam Mode above</Text>
              </View>
              
              <View style={[commonStyles.centerRow, { justifyContent: 'flex-start', marginBottom: spacing.xs }]}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}>
                  <Text style={[commonStyles.caption, { color: colors.background, fontWeight: '600' }]}>2</Text>
                </View>
                <Text style={commonStyles.body}>Receive or make a call</Text>
              </View>
              
              <View style={[commonStyles.centerRow, { justifyContent: 'flex-start', marginBottom: spacing.xs }]}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}>
                  <Text style={[commonStyles.caption, { color: colors.background, fontWeight: '600' }]}>3</Text>
                </View>
                <Text style={commonStyles.body}>Press "Jam Now" during call</Text>
              </View>
              
              <View style={[commonStyles.centerRow, { justifyContent: 'flex-start' }]}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.sm,
                }}>
                  <Text style={[commonStyles.caption, { color: colors.background, fontWeight: '600' }]}>4</Text>
                </View>
                <Text style={commonStyles.body}>Caller hears glitches & delays</Text>
              </View>
            </View>
          </View>

          {/* Status Cards */}
          {(isCallActive || isJamming) && (
            <View style={commonStyles.section}>
              {isCallActive && (
                <View style={[commonStyles.card, { 
                  backgroundColor: colors.warning,
                  marginBottom: spacing.md 
                }]}>
                  <View style={commonStyles.centerRow}>
                    <Icon name="call" size={24} color={colors.background} />
                    <Text style={[commonStyles.body, { 
                      color: colors.background, 
                      marginLeft: spacing.sm,
                      fontWeight: '600'
                    }]}>
                      Call Active - Ready to Jam
                    </Text>
                  </View>
                </View>
              )}
              
              {isJamming && (
                <Animated.View style={[
                  commonStyles.card, 
                  { 
                    backgroundColor: colors.danger,
                    opacity: glitchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1]
                    })
                  }
                ]}>
                  <View style={commonStyles.centerRow}>
                    <Icon name="flash" size={24} color={colors.background} />
                    <Text style={[commonStyles.body, { 
                      color: colors.background, 
                      marginLeft: spacing.sm,
                      fontWeight: '600'
                    }]}>
                      ⚡ JAMMING ACTIVE ⚡
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
