
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Slider from '../../components/Slider';

export default function SettingsScreen() {
  const [lagIntensity, setLagIntensity] = useState(50);
  const [glitchDuration, setGlitchDuration] = useState(30);
  const [staticVolume, setStaticVolume] = useState(25);
  const [autoDisconnect, setAutoDisconnect] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [glitchType, setGlitchType] = useState('Mixed');

  const glitchTypes = ['Packet Loss', 'Static Noise', 'Delay', 'Mixed'];

  const toggleSetting = (setting: string, value: boolean, setter: (value: boolean) => void) => {
    console.log(`Toggling ${setting}:`, !value);
    setter(!value);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.section, { marginTop: 20, marginBottom: 10 }]}>
          <Text style={commonStyles.title}>Settings</Text>
          <Text style={commonStyles.textSecondary}>
            Configure your glitch parameters
          </Text>
        </View>

        {/* Glitch Parameters */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { textAlign: 'left', marginBottom: 20 }]}>
            Glitch Parameters
          </Text>
          
          <View style={{ marginBottom: 25 }}>
            <View style={[commonStyles.row, { marginBottom: 10 }]}>
              <Text style={[commonStyles.text, { textAlign: 'left' }]}>
                Lag Intensity
              </Text>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                {lagIntensity}%
              </Text>
            </View>
            <Slider
              value={lagIntensity}
              onValueChange={setLagIntensity}
              minimumValue={0}
              maximumValue={100}
            />
          </View>

          <View style={{ marginBottom: 25 }}>
            <View style={[commonStyles.row, { marginBottom: 10 }]}>
              <Text style={[commonStyles.text, { textAlign: 'left' }]}>
                Glitch Duration
              </Text>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                {glitchDuration}s
              </Text>
            </View>
            <Slider
              value={glitchDuration}
              onValueChange={setGlitchDuration}
              minimumValue={5}
              maximumValue={60}
            />
          </View>

          <View style={{ marginBottom: 0 }}>
            <View style={[commonStyles.row, { marginBottom: 10 }]}>
              <Text style={[commonStyles.text, { textAlign: 'left' }]}>
                Static Volume
              </Text>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                {staticVolume}%
              </Text>
            </View>
            <Slider
              value={staticVolume}
              onValueChange={setStaticVolume}
              minimumValue={0}
              maximumValue={100}
            />
          </View>
        </View>

        {/* Glitch Type */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { textAlign: 'left', marginBottom: 15 }]}>
            Glitch Type
          </Text>
          
          {glitchTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                commonStyles.row,
                {
                  paddingVertical: 12,
                  borderBottomWidth: type !== glitchTypes[glitchTypes.length - 1] ? 1 : 0,
                  borderBottomColor: colors.grey,
                }
              ]}
              onPress={() => {
                console.log('Selected glitch type:', type);
                setGlitchType(type);
              }}
            >
              <Text style={[commonStyles.text, { textAlign: 'left' }]}>
                {type}
              </Text>
              <Icon
                name={glitchType === type ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={glitchType === type ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Toggle Settings */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { textAlign: 'left', marginBottom: 15 }]}>
            Behavior
          </Text>
          
          <View style={[commonStyles.row, { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }]}>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { textAlign: 'left' }]}>
                Auto Disconnect
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 12 }]}>
                Automatically end calls after glitch duration
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: autoDisconnect ? colors.primary : colors.grey,
                justifyContent: 'center',
                alignItems: autoDisconnect ? 'flex-end' : 'flex-start',
                paddingHorizontal: 3,
              }}
              onPress={() => toggleSetting('Auto Disconnect', autoDisconnect, setAutoDisconnect)}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.text,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={[commonStyles.row, { paddingVertical: 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { textAlign: 'left' }]}>
                Stealth Mode
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 12 }]}>
                Hide notifications from caller
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: stealthMode ? colors.primary : colors.grey,
                justifyContent: 'center',
                alignItems: stealthMode ? 'flex-end' : 'flex-start',
                paddingHorizontal: 3,
              }}
              onPress={() => toggleSetting('Stealth Mode', stealthMode, setStealthMode)}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.text,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy & Legal */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { textAlign: 'left', marginBottom: 15 }]}>
            Privacy & Legal
          </Text>
          
          <TouchableOpacity style={[commonStyles.row, { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }]}>
            <Text style={[commonStyles.text, { textAlign: 'left' }]}>
              Privacy Policy
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[commonStyles.row, { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.grey }]}>
            <Text style={[commonStyles.text, { textAlign: 'left' }]}>
              Terms of Service
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[commonStyles.row, { paddingVertical: 12 }]}>
            <Text style={[commonStyles.text, { textAlign: 'left' }]}>
              About
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
