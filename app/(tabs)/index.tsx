
import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';

export default function HomeScreen() {
  const [jamModeActive, setJamModeActive] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

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
      Alert.alert(
        'Jam Activated',
        'Call jamming simulation started!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error in jam now:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      console.log('End Call button pressed');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsCallActive(false);
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
      setIsCallActive(true);
      Alert.alert(
        'Incoming Call',
        'Simulated call from +1 (555) 123-4567',
        [
          { text: 'Decline', style: 'cancel', onPress: () => setIsCallActive(false) },
          { text: 'Answer', onPress: () => console.log('Call answered') }
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

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Quick Actions</Text>
          
          <View style={commonStyles.buttonContainer}>
            <TouchableOpacity
              style={[buttonStyles.primary, { marginBottom: 12 }]}
              onPress={handleJamNow}
            >
              <Text style={[commonStyles.text, { color: colors.background }]}>
                Jam Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.danger, { marginBottom: 12 }]}
              onPress={handleEndCall}
              disabled={!isCallActive}
            >
              <Text style={[commonStyles.text, { color: colors.text }]}>
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
      </View>
    </SafeAreaView>
  );
}
