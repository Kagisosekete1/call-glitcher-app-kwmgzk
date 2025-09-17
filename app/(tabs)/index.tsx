
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const [jamModeActive, setJamModeActive] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const glowAnimation = new Animated.Value(0);

  useEffect(() => {
    if (jamModeActive) {
      // Start glowing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnimation.stopAnimation();
      glowAnimation.setValue(0);
    }
  }, [jamModeActive]);

  const toggleJamMode = async () => {
    console.log('Toggling jam mode:', !jamModeActive);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setJamModeActive(!jamModeActive);
  };

  const handleJamNow = async () => {
    console.log('Jam Now pressed');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Jam Activated',
      'Call glitching simulation started!',
      [{ text: 'OK' }]
    );
  };

  const handleEndCall = async () => {
    console.log('End Call pressed');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Call Ended',
      'Call has been terminated.',
      [{ text: 'OK' }]
    );
    setIsInCall(false);
  };

  const simulateIncomingCall = () => {
    console.log('Simulating incoming call');
    setIsInCall(true);
  };

  const glowColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.accent],
  });

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Status Section */}
        <View style={[commonStyles.section, { marginTop: 40 }]}>
          <Animated.View
            style={{
              backgroundColor: glowColor,
              borderRadius: 60,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Icon 
              name="wifi" 
              size={40} 
              color={colors.background}
            />
          </Animated.View>
          
          <Text style={commonStyles.title}>Call Glitcher</Text>
          <Text style={[
            commonStyles.subtitle,
            { color: jamModeActive ? colors.primary : colors.textSecondary }
          ]}>
            {jamModeActive ? 'JAM MODE ACTIVE' : 'IDLE'}
          </Text>
        </View>

        {/* Main Toggle */}
        <View style={[commonStyles.section, { marginTop: 40 }]}>
          <TouchableOpacity
            style={[
              {
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: jamModeActive ? colors.primary : colors.backgroundAlt,
                borderWidth: 4,
                borderColor: jamModeActive ? colors.accent : colors.grey,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }
            ]}
            onPress={toggleJamMode}
          >
            <Icon 
              name={jamModeActive ? "radio" : "radio-outline"} 
              size={60} 
              color={jamModeActive ? colors.background : colors.primary}
            />
            <Text style={{
              color: jamModeActive ? colors.background : colors.primary,
              fontSize: 16,
              fontWeight: '700',
              marginTop: 10,
            }}>
              {jamModeActive ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={[commonStyles.section, { marginTop: 20 }]}>
          <Text style={commonStyles.textSecondary}>Quick Actions</Text>
          
          <View style={{ flexDirection: 'row', gap: 15, marginTop: 15 }}>
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1 }]}
              onPress={handleJamNow}
              disabled={!jamModeActive}
            >
              <Icon name="flash" size={20} color={colors.background} />
              <Text style={{
                color: colors.background,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 5,
              }}>
                Jam Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.danger, { flex: 1 }]}
              onPress={handleEndCall}
            >
              <Icon name="call" size={20} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 5,
              }}>
                End Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Section */}
        <View style={[commonStyles.section, { marginTop: 40 }]}>
          <Text style={commonStyles.textSecondary}>Demo Mode</Text>
          <TouchableOpacity
            style={[buttonStyles.secondary, { marginTop: 10 }]}
            onPress={simulateIncomingCall}
          >
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
              Simulate Incoming Call
            </Text>
          </TouchableOpacity>
        </View>

        {/* Call Status */}
        {isInCall && (
          <View style={[commonStyles.card, { marginTop: 20, backgroundColor: colors.danger }]}>
            <Text style={[commonStyles.text, { color: colors.text }]}>
              📞 Incoming Call Detected
            </Text>
            <Text style={[commonStyles.textSecondary, { color: colors.text }]}>
              Jam mode will activate automatically
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
