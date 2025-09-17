
import React, { useState } from 'react';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Slider from '../../components/Slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const [glitchDuration, setGlitchDuration] = useState(30);
  const [lagIntensity, setLagIntensity] = useState(50);
  const [staticVolume, setStaticVolume] = useState(25);
  const [autoDisconnect, setAutoDisconnect] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [glitchType, setGlitchType] = useState('Mixed');

  const glitchTypes = ['Packet Loss', 'Static Noise', 'Delay', 'Mixed'];

  const toggleSetting = (setting: string, value: boolean, setter: (value: boolean) => void) => {
    console.log(`Toggling ${setting} from ${value} to ${!value}`);
    setter(!value);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.title}>Settings</Text>
          <Text style={commonStyles.textSecondary}>
            Configure glitch parameters and behavior
          </Text>
        </View>

        {/* Glitch Parameters */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Glitch Parameters</Text>
          
          <View style={{ marginTop: 20 }}>
            <View style={commonStyles.row}>
              <Text style={commonStyles.text}>Glitch Duration</Text>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                {glitchDuration}s
              </Text>
            </View>
            <Slider
              value={glitchDuration}
              onValueChange={setGlitchDuration}
              minimumValue={5}
              maximumValue={60}
              step={5}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={commonStyles.row}>
              <Text style={commonStyles.text}>Lag Intensity</Text>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                {lagIntensity}%
              </Text>
            </View>
            <Slider
              value={lagIntensity}
              onValueChange={setLagIntensity}
              minimumValue={0}
              maximumValue={100}
              step={10}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={commonStyles.row}>
              <Text style={commonStyles.text}>Static Volume</Text>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                {staticVolume}%
              </Text>
            </View>
            <Slider
              value={staticVolume}
              onValueChange={setStaticVolume}
              minimumValue={0}
              maximumValue={100}
              step={5}
            />
          </View>
        </View>

        {/* Glitch Type */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Glitch Type</Text>
          <View style={{ marginTop: 16 }}>
            {glitchTypes.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  console.log('Selected glitch type:', type);
                  setGlitchType(type);
                }}
                style={[
                  commonStyles.row,
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: glitchType === type ? colors.primary : colors.backgroundAlt,
                    borderRadius: 8,
                    marginBottom: 8,
                  }
                ]}
              >
                <Text style={[
                  commonStyles.text,
                  { color: glitchType === type ? colors.background : colors.text }
                ]}>
                  {type}
                </Text>
                {glitchType === type && (
                  <Icon
                    name="checkmark"
                    size={20}
                    color={colors.background}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Behavior Settings */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Behavior</Text>
          
          <TouchableOpacity
            onPress={() => toggleSetting('Auto Disconnect', autoDisconnect, setAutoDisconnect)}
            style={[commonStyles.row, { paddingVertical: 16 }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.text}>Auto Disconnect</Text>
              <Text style={commonStyles.textSecondary}>
                Automatically end calls after glitch duration
              </Text>
            </View>
            <View style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: autoDisconnect ? colors.success : colors.grey,
              justifyContent: 'center',
              alignItems: autoDisconnect ? 'flex-end' : 'flex-start',
              paddingHorizontal: 2,
            }}>
              <View style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: colors.text,
              }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleSetting('Stealth Mode', stealthMode, setStealthMode)}
            style={[commonStyles.row, { paddingVertical: 16 }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.text}>Stealth Mode</Text>
              <Text style={commonStyles.textSecondary}>
                Hide notifications during jamming
              </Text>
            </View>
            <View style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: stealthMode ? colors.success : colors.grey,
              justifyContent: 'center',
              alignItems: stealthMode ? 'flex-end' : 'flex-start',
              paddingHorizontal: 2,
            }}>
              <View style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: colors.text,
              }} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
