
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import Slider from '../../components/Slider';
import Avatar from '../../components/Avatar';
import SimpleBottomSheet from '../../components/BottomSheet';
import { supabase } from '../integrations/supabase/client';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  inputStyles,
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
  
  // Profile state
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    phone: '',
    email: '',
    avatar_url: '',
    is_premium: false,
    theme: 'dark'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const glitchTypes = ['Packet Loss', 'Static Noise', 'Delay', 'Mixed'];
  const themes = ['light', 'dark', 'auto'];

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfile({
            username: data.username || '',
            full_name: data.full_name || '',
            phone: data.phone || '',
            email: data.email || user.email || '',
            avatar_url: data.avatar_url || '',
            is_premium: data.is_premium || false,
            theme: data.theme || 'dark'
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const updates = {
        id: user.id,
        username: profile.username,
        full_name: profile.full_name,
        phone: profile.phone,
        email: profile.email,
        avatar_url: profile.avatar_url,
        theme: profile.theme,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(filePath: string) {
    setProfile(prev => ({ ...prev, avatar_url: filePath }));
    await updateProfile();
  }

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  }

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

  const PremiumModal = () => (
    <Modal
      visible={showPremium}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPremium(false)}
    >
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.container}>
          <View style={[commonStyles.cardHeader, { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <Text style={commonStyles.title}>Go Premium</Text>
            <TouchableOpacity onPress={() => setShowPremium(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.md }}>
            <View style={[commonStyles.card, { marginBottom: spacing.md, borderColor: '#FFD700', borderWidth: 2 }]}>
              <View style={[commonStyles.center, { paddingVertical: spacing.lg }]}>
                <View style={{ backgroundColor: '#FFD700', borderRadius: 30, padding: spacing.md, marginBottom: spacing.md }}>
                  <Icon name="star" size={32} color={colors.background} />
                </View>
                <Text style={[commonStyles.title, { color: '#FFD700', marginBottom: spacing.sm }]}>
                  Premium Features
                </Text>
                <Text style={[commonStyles.bodySecondary, { textAlign: 'center' }]}>
                  Unlock advanced call jamming features and priority support
                </Text>
              </View>
            </View>

            <View style={[commonStyles.card, { marginBottom: spacing.md }]}>
              <View style={[commonStyles.cardHeader, { marginBottom: spacing.md }]}>
                <Text style={commonStyles.subtitle}>Monthly Plan</Text>
                <Text style={[commonStyles.title, { color: colors.primary }]}>R49/month</Text>
              </View>
              <TouchableOpacity style={buttonStyles.primary}>
                <Text style={buttonStyles.primaryText}>Choose Monthly</Text>
              </TouchableOpacity>
            </View>

            <View style={[commonStyles.card, { marginBottom: spacing.md, borderColor: colors.success, borderWidth: 1 }]}>
              <View style={[commonStyles.badge, { backgroundColor: colors.success, alignSelf: 'flex-start', marginBottom: spacing.sm }]}>
                <Text style={commonStyles.badgeText}>Save 20%</Text>
              </View>
              <View style={[commonStyles.cardHeader, { marginBottom: spacing.md }]}>
                <Text style={commonStyles.subtitle}>Annual Plan</Text>
                <Text style={[commonStyles.title, { color: colors.success }]}>R470/year</Text>
              </View>
              <TouchableOpacity style={[buttonStyles.primary, { backgroundColor: colors.success }]}>
                <Text style={buttonStyles.primaryText}>Choose Annual</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
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
            Configure your profile and app preferences
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
          {/* Profile Section */}
          <SettingCard
            icon="person-circle"
            title="Profile"
            description="Manage your account information and preferences"
          >
            <View style={[commonStyles.center, { marginBottom: spacing.lg }]}>
              <Avatar
                url={profile.avatar_url}
                size={80}
                onUpload={handleAvatarUpload}
              />
              {profile.is_premium && (
                <View style={[commonStyles.badge, { backgroundColor: '#FFD700', marginTop: spacing.sm }]}>
                  <Icon name="star" size={12} color={colors.background} />
                  <Text style={[commonStyles.badgeText, { color: colors.background, marginLeft: spacing.xs }]}>
                    Premium
                  </Text>
                </View>
              )}
            </View>

            {isEditing ? (
              <>
                <View style={inputStyles.container}>
                  <Text style={inputStyles.label}>Username</Text>
                  <TextInput
                    style={inputStyles.input}
                    placeholder="Enter username"
                    placeholderTextColor={colors.textLight}
                    value={profile.username}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, username: text }))}
                  />
                </View>

                <View style={inputStyles.container}>
                  <Text style={inputStyles.label}>Full Name</Text>
                  <TextInput
                    style={inputStyles.input}
                    placeholder="Enter full name"
                    placeholderTextColor={colors.textLight}
                    value={profile.full_name}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, full_name: text }))}
                  />
                </View>

                <View style={inputStyles.container}>
                  <Text style={inputStyles.label}>Phone Number</Text>
                  <TextInput
                    style={inputStyles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor={colors.textLight}
                    value={profile.phone}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={inputStyles.container}>
                  <Text style={inputStyles.label}>Email</Text>
                  <TextInput
                    style={inputStyles.input}
                    placeholder="Enter email"
                    placeholderTextColor={colors.textLight}
                    value={profile.email}
                    onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={commonStyles.row}>
                  <TouchableOpacity
                    style={[buttonStyles.outline, { flex: 1, marginRight: spacing.sm }]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={buttonStyles.outlineText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[buttonStyles.primary, { flex: 1, marginLeft: spacing.sm }]}
                    onPress={updateProfile}
                    disabled={loading}
                  >
                    <Text style={buttonStyles.primaryText}>
                      {loading ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
                  <Text style={commonStyles.body}>Username</Text>
                  <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                    {profile.username || 'Not set'}
                  </Text>
                </View>
                
                <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
                  <Text style={commonStyles.body}>Full Name</Text>
                  <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                    {profile.full_name || 'Not set'}
                  </Text>
                </View>
                
                <View style={[commonStyles.row, { marginBottom: spacing.sm }]}>
                  <Text style={commonStyles.body}>Phone</Text>
                  <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                    {profile.phone || 'Not set'}
                  </Text>
                </View>
                
                <View style={[commonStyles.row, { marginBottom: spacing.md }]}>
                  <Text style={commonStyles.body}>Email</Text>
                  <Text style={[commonStyles.body, { color: colors.textSecondary }]}>
                    {profile.email || 'Not set'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={buttonStyles.outline}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={buttonStyles.outlineText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </SettingCard>

          {/* Premium Section */}
          <SettingCard
            icon="star"
            title="Premium"
            description="Unlock advanced features and priority support"
          >
            <TouchableOpacity
              style={[buttonStyles.primary, { backgroundColor: '#FFD700' }]}
              onPress={() => setShowPremium(true)}
            >
              <View style={commonStyles.centerRow}>
                <Icon name="star" size={20} color={colors.background} />
                <Text style={[buttonStyles.primaryText, { marginLeft: spacing.sm }]}>
                  Go Premium
                </Text>
              </View>
            </TouchableOpacity>
          </SettingCard>

          {/* Theme Selection */}
          <SettingCard
            icon="color-palette"
            title="Theme"
            description="Choose your preferred app theme"
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {themes.map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    {
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.full,
                      borderWidth: 1,
                      borderColor: profile.theme === theme ? colors.primary : colors.border,
                      backgroundColor: profile.theme === theme ? colors.primary : colors.background,
                    }
                  ]}
                  onPress={() => setProfile(prev => ({ ...prev, theme }))}
                >
                  <Text style={[
                    commonStyles.caption,
                    { 
                      color: profile.theme === theme ? colors.background : colors.text,
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }
                  ]}>
                    {theme}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingCard>

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

          {/* Legal */}
          <SettingCard
            icon="document-text"
            title="Legal"
            description="Terms of use and privacy policy"
          >
            <View style={commonStyles.row}>
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginRight: spacing.sm }]}
                onPress={() => setShowTerms(true)}
              >
                <Text style={buttonStyles.outlineText}>Terms of Use</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginLeft: spacing.sm }]}
                onPress={() => setShowPrivacy(true)}
              >
                <Text style={buttonStyles.outlineText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
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
            style={[buttonStyles.danger, { marginTop: spacing.md, marginBottom: spacing.md }]}
            onPress={resetSettings}
          >
            <View style={commonStyles.centerRow}>
              <Icon name="refresh" size={20} color={colors.background} />
              <Text style={[buttonStyles.dangerText, { marginLeft: spacing.sm }]}>
                Reset to Defaults
              </Text>
            </View>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[buttonStyles.outline, { borderColor: colors.danger }]}
            onPress={handleLogout}
          >
            <View style={commonStyles.centerRow}>
              <Icon name="log-out" size={20} color={colors.danger} />
              <Text style={[buttonStyles.outlineText, { color: colors.danger, marginLeft: spacing.sm }]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <PremiumModal />

        {/* Terms Modal */}
        <Modal
          visible={showTerms}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowTerms(false)}
        >
          <SafeAreaView style={commonStyles.safeArea}>
            <View style={commonStyles.container}>
              <View style={[commonStyles.cardHeader, { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={commonStyles.title}>Terms of Use</Text>
                <TouchableOpacity onPress={() => setShowTerms(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.md }}>
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  By continuing, you agree to Call Glitcher's Terms of Use and Privacy Policy.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Call Glitcher provides simulated and customizable call experiences for entertainment and productivity purposes only.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Users must not use the app for harassment, fraud, or illegal activities.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Subscription payments for Premium plans are billed monthly or yearly as selected by the user.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Premium access remains active until the billing period ends or is canceled by the user.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Call Glitcher reserves the right to modify features, pricing, or access at any time to improve service quality.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Continued use of the app after updates means you accept any revised terms.
                </Text>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Privacy Modal */}
        <Modal
          visible={showPrivacy}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowPrivacy(false)}
        >
          <SafeAreaView style={commonStyles.safeArea}>
            <View style={commonStyles.container}>
              <View style={[commonStyles.cardHeader, { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={commonStyles.title}>Privacy Policy</Text>
                <TouchableOpacity onPress={() => setShowPrivacy(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.md }}>
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Call Glitcher respects your privacy and is committed to protecting your personal information.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  We collect only the information necessary to provide our services, including account information and usage data.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  Your personal information is never shared with third parties without your explicit consent.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  All data is encrypted and stored securely using industry-standard practices.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  You have the right to access, modify, or delete your personal information at any time.
                </Text>
                
                <Text style={[commonStyles.body, { marginBottom: spacing.md }]}>
                  For questions about our privacy practices, please contact our support team.
                </Text>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
