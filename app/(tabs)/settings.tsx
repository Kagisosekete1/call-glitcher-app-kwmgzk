
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import Slider from '../../components/Slider';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  spacing, 
  borderRadius 
} from '../../styles/commonStyles';

export default function SettingsScreen() {
  const [glitchIntensity, setGlitchIntensity] = useState(50);
  const [glitchDuration, setGlitchDuration] = useState(30);
  const [staticVolume, setStaticVolume] = useState(25);
  const [autoDisconnect, setAutoDisconnect] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [glitchType, setGlitchType] = useState('Mixed');

  const glitchTypes = ['Packet Loss', 'Static Noise', 'Delay', 'Mixed'];

  const toggleSetting = (setting: string, value: boolean, setter: (value: boolean) => void) => {
    console.log(`Toggling ${setting} to:`, !value);
    setter(!value);
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            console.log('Resetting all settings to defaults');
            setGlitchIntensity(50);
            setGlitchDuration(30);
            setStaticVolume(25);
            setAutoDisconnect(false);
            setStealthMode(true);
            setHapticFeedback(true);
            setGlitchType('Mixed');
          },
        },
      ]
    );
  };

  const SettingCard = ({ 
    icon, 
    title, 
    description, 
    children 
  }: { 
    icon: string; 
    title: string; 
    description: string; 
    children: React.ReactNode;
  }) => (
    <View style={[commonStyles.card, { marginBottom: spacing.md }]}>
      <View style={[commonStyles.cardHeader, { marginBottom: spacing.md }]}>
        <Icon name={icon as any} size={24} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 2 }]}>
            {title}
          </Text>
          <Text style={commonStyles.caption}>
            {description}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );

  const SliderSetting = ({ 
    label, 
    value, 
    onValueChange, 
    unit = '',
    min = 0,
    max = 100 
  }: {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    unit?: string;
    min?: number;
    max?: number;
  }) => (
    <View style={{ marginBottom: spacing.md }}>
      <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
        <Text style={commonStyles.body}>{label}</Text>
        <Text style={[commonStyles.body, { color: colors.primary, fontWeight: '600' }]}>
          {value}{unit}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={1}
      />
    </View>
  );

  const ToggleSetting = ({ 
    label, 
    description, 
    value, 
    onValueChange 
  }: {
    label: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={[commonStyles.row, { marginBottom: spacing.md }]}>
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.body, { marginBottom: 2 }]}>
          {label}
        </Text>
        <Text style={commonStyles.caption}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.textLight}
      />
    </View>
  );

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
            Settings
          </Text>
          <Text style={commonStyles.bodySecondary}>
            Configure your call jamming preferences
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
          {/* Glitch Parameters */}
          <SettingCard
            icon="flash"
            title="Glitch Parameters"
            description="Adjust the intensity and characteristics of call glitching"
          >
            <SliderSetting
              label="Glitch Intensity"
              value={glitchIntensity}
              onValueChange={setGlitchIntensity}
              unit="%"
            />
            
            <SliderSetting
              label="Glitch Duration"
              value={glitchDuration}
              onValueChange={setGlitchDuration}
              unit="s"
              max={60}
            />
            
            <SliderSetting
              label="Static Volume"
              value={staticVolume}
              onValueChange={setStaticVolume}
              unit="%"
            />
          </SettingCard>

          {/* Glitch Type */}
          <SettingCard
            icon="options"
            title="Glitch Type"
            description="Choose the type of audio distortion to apply"
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {glitchTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    {
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.full,
                      borderWidth: 1,
                      borderColor: glitchType === type ? colors.primary : colors.border,
                      backgroundColor: glitchType === type ? colors.primary : colors.background,
                    }
                  ]}
                  onPress={() => {
                    console.log('Selected glitch type:', type);
                    setGlitchType(type);
                  }}
                >
                  <Text style={[
                    commonStyles.caption,
                    { 
                      color: glitchType === type ? colors.background : colors.text,
                      fontWeight: '600'
                    }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingCard>

          {/* Behavior Settings */}
          <SettingCard
            icon="settings"
            title="Behavior"
            description="Control how the app behaves during calls"
          >
            <ToggleSetting
              label="Auto Disconnect"
              description="Automatically end calls after jamming duration"
              value={autoDisconnect}
              onValueChange={setAutoDisconnect}
            />
            
            <ToggleSetting
              label="Stealth Mode"
              description="Hide notifications and run silently in background"
              value={stealthMode}
              onValueChange={setStealthMode}
            />
            
            <ToggleSetting
              label="Haptic Feedback"
              description="Vibrate when actions are performed"
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
            />
          </SettingCard>

          {/* App Information */}
          <SettingCard
            icon="information-circle"
            title="App Information"
            description="Version and support details"
          >
            <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
              <Text style={commonStyles.body}>Version</Text>
              <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                1.0.0
              </Text>
            </View>
            
            <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
              <Text style={commonStyles.body}>Build</Text>
              <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                2025.01.01
              </Text>
            </View>
            
            <TouchableOpacity
              style={[buttonStyles.outline, buttonStyles.small]}
              onPress={() => {
                Alert.alert(
                  'About Call Glitcher',
                  'Call Glitcher is a professional call management app that simulates poor network quality during calls. Use responsibly and in accordance with local laws.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={[buttonStyles.outlineText, buttonStyles.smallText]}>
                About
              </Text>
            </TouchableOpacity>
          </SettingCard>

          {/* Reset Settings */}
          <TouchableOpacity
            style={[buttonStyles.danger, { marginTop: spacing.md }]}
            onPress={resetSettings}
          >
            <View style={commonStyles.centerRow}>
              <Icon name="refresh" size={20} color={colors.background} />
              <Text style={[buttonStyles.dangerText, { marginLeft: spacing.sm }]}>
                Reset to Defaults
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
