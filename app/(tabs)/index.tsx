
import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';

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
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
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
          Animated.timing(glitchAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(glitchAnim, {
            toValue: 0,
            duration: 200,
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
      console.log('Jam Now button pressed - starting call glitching');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      if (!isCallActive) {
        Alert.alert(
          'No Active Call',
          'Start a call first, then use "Jam Now" to glitch the call audio and simulate poor network quality.',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsJamming(true);
      
      Alert.alert(
        'Call Jamming Active',
        'Glitching call audio to simulate poor network quality. The caller will experience delays, static, and connection issues.',
        [
          { 
            text: 'Stop Jamming', 
            onPress: () => {
              console.log('Stopping call jamming');
              setIsJamming(false);
            }
          }
        ]
      );

      // Auto-stop jamming after 30 seconds (configurable in settings)
      setTimeout(() => {
        console.log('Auto-stopping jamming after timeout');
        setIsJamming(false);
      }, 30000);

    } catch (error) {
      console.error('Error in jam now:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      console.log('End Call button pressed');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsCallActive(false);
      setIsJamming(false);
      Alert.alert(
        'Call Ended',
        'Call has been terminated.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const simulateIncomingCall = () => {
    try {
      console.log('Simulating incoming call');
      Alert.alert(
        'Incoming Call',
        'Simulated call from +1 (555) 123-4567\n\nAnswer the call, then use "Jam Now" to glitch it!',
        [
          { 
            text: 'Decline', 
            style: 'cancel', 
            onPress: () => {
              console.log('Call declined');
              setIsCallActive(false);
            }
          },
          { 
            text: 'Answer', 
            onPress: () => {
              console.log('Call answered - now you can jam it!');
              setIsCallActive(true);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error simulating call:', error);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Status Display */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.title}>Call Glitcher</Text>
          <Text style={[commonStyles.text, { color: jamModeActive ? colors.success : colors.textSecondary }]}>
            {jamModeActive ? 'Jam Mode Active' : 'Idle'}
          </Text>
          {isCallActive && (
            <Text style={[commonStyles.textSecondary, { color: colors.warning, marginTop: 8 }]}>
              📞 Call Active - Ready to Jam
            </Text>
          )}
          {isJamming && (
            <Animated.Text 
              style={[
                commonStyles.textSecondary, 
                { 
                  color: colors.danger, 
                  marginTop: 4,
                  opacity: glitchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1]
                  })
                }
              ]}
            >
              ⚡ JAMMING ACTIVE ⚡
            </Animated.Text>
          )}
        </View>

        {/* Main Toggle */}
        <View style={commonStyles.section}>
          <TouchableOpacity
            onPress={toggleJamMode}
            style={[
              commonStyles.card,
              {
                backgroundColor: jamModeActive ? colors.success : colors.card,
                borderColor: jamModeActive ? colors.success : colors.grey,
              }
            ]}
          >
            <Animated.View
              style={[
                commonStyles.centerRow,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Icon
                name={jamModeActive ? 'radio' : 'radio-outline'}
                size={60}
                color={jamModeActive ? colors.background : colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={[
                  commonStyles.subtitle,
                  { color: jamModeActive ? colors.background : colors.text }
                ]}>
                  Jam Mode
                </Text>
                <Text style={[
                  commonStyles.textSecondary,
                  { color: jamModeActive ? colors.background : colors.textSecondary }
                ]}>
                  {jamModeActive ? 'Tap to disable' : 'Tap to enable'}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* How It Works */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 16 }]}>
            💡 How it works: Answer a call, then press "Jam Now" to simulate poor network quality with glitches, delays, and static.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Quick Actions</Text>
          
          <View style={commonStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                buttonStyles.primary, 
                { 
                  marginBottom: 12,
                  backgroundColor: isJamming ? colors.danger : colors.primary,
                  opacity: !isCallActive ? 0.5 : 1
                }
              ]}
              onPress={handleJamNow}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>
                {isJamming ? 'Stop Jamming' : 'Jam Now'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                buttonStyles.danger, 
                { 
                  marginBottom: 12,
                  opacity: !isCallActive ? 0.5 : 1
                }
              ]}
              onPress={handleEndCall}
              disabled={!isCallActive}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>
                End Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.secondary]}
              onPress={simulateIncomingCall}
            >
              <Text style={[commonStyles.text, { color: colors.text }]}>
                Simulate Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Instructions
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'left', lineHeight: 20 }]}>
            1. Enable "Jam Mode" above{'\n'}
            2. Receive or make a phone call{'\n'}
            3. During the call, press "Jam Now"{'\n'}
            4. The caller will hear glitches, delays, and static{'\n'}
            5. Adjust glitch settings in the Settings tab
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
