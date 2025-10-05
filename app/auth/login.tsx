
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Icon from '../../components/Icon';
import { supabase } from '../integrations/supabase/client';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  inputStyles, 
  spacing, 
  borderRadius 
} from '../../styles/commonStyles';

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''));
  };

  const handleLogin = async () => {
    try {
      console.log('Login attempt with:', emailOrPhone);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (!emailOrPhone || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setIsLoading(true);
      
      let authData;
      
      if (isValidEmail(emailOrPhone)) {
        // Email login
        authData = await supabase.auth.signInWithPassword({
          email: emailOrPhone,
          password: password,
        });
      } else if (isValidPhone(emailOrPhone)) {
        // Phone login
        authData = await supabase.auth.signInWithPassword({
          phone: emailOrPhone,
          password: password,
        });
      } else {
        Alert.alert('Error', 'Please enter a valid email or phone number');
        return;
      }

      const { data, error } = authData;

      if (error) {
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (data.user) {
        console.log('Login successful, navigating to main app');
        router.replace('/(tabs)');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password pressed');
    router.push('/auth/forgot-password');
  };

  const handleSignUp = () => {
    console.log('Sign up pressed');
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={commonStyles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={[colors.gradient.start, colors.gradient.end]}
            style={{
              paddingTop: spacing.xxl,
              paddingBottom: spacing.xl,
              paddingHorizontal: spacing.md,
              borderBottomLeftRadius: borderRadius.xl,
              borderBottomRightRadius: borderRadius.xl,
            }}
          >
            <View style={commonStyles.center}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
              }}>
                <Icon name="radio" size={40} color={colors.background} />
              </View>
              <Text style={[commonStyles.title, { color: colors.background }]}>
                Welcome Back
              </Text>
              <Text style={[commonStyles.bodySecondary, { 
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center' 
              }]}>
                Sign in to continue to Call Glitcher
              </Text>
            </View>
          </LinearGradient>

          {/* Login Form */}
          <View style={[commonStyles.content, { paddingTop: spacing.xl }]}>
            {/* Login Method Toggle */}
            <View style={[commonStyles.row, { marginBottom: spacing.md }]}>
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: loginMethod === 'email' ? colors.primary : colors.backgroundAlt,
                    marginRight: spacing.xs,
                  }
                ]}
                onPress={() => setLoginMethod('email')}
              >
                <Text style={[
                  commonStyles.caption,
                  { 
                    textAlign: 'center',
                    color: loginMethod === 'email' ? colors.background : colors.text,
                    fontWeight: '600'
                  }
                ]}>
                  Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: loginMethod === 'phone' ? colors.primary : colors.backgroundAlt,
                    marginLeft: spacing.xs,
                  }
                ]}
                onPress={() => setLoginMethod('phone')}
              >
                <Text style={[
                  commonStyles.caption,
                  { 
                    textAlign: 'center',
                    color: loginMethod === 'phone' ? colors.background : colors.text,
                    fontWeight: '600'
                  }
                ]}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email/Phone Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>
                {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon 
                    name={loginMethod === 'email' ? 'mail' : 'call'} 
                    size={20} 
                    color={emailFocused ? colors.primary : colors.textLight} 
                  />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    emailFocused && inputStyles.inputFocused
                  ]}
                  placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  placeholderTextColor={colors.textLight}
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType={loginMethod === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Password</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon 
                    name="lock-closed" 
                    size={20} 
                    color={passwordFocused ? colors.primary : colors.textLight} 
                  />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    passwordFocused && inputStyles.inputFocused,
                    { paddingRight: 48 }
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: spacing.md,
                    top: '50%',
                    marginTop: -12,
                  }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.textLight} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={{ alignSelf: 'flex-end', marginBottom: spacing.xl }}
            >
              <Text style={[commonStyles.caption, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                buttonStyles.primary,
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={buttonStyles.primaryText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Terms and Privacy */}
            <View style={[commonStyles.center, { marginVertical: spacing.lg }]}>
              <Text style={[commonStyles.caption, { textAlign: 'center', marginBottom: spacing.sm }]}>
                By logging in or signing up, you agree to Call Glitcher's
              </Text>
              <View style={commonStyles.centerRow}>
                <TouchableOpacity onPress={() => setShowTerms(true)}>
                  <Text style={[commonStyles.caption, { color: colors.primary }]}>
                    Terms of Use
                  </Text>
                </TouchableOpacity>
                <Text style={[commonStyles.caption, { marginHorizontal: spacing.xs }]}>
                  &
                </Text>
                <TouchableOpacity onPress={() => setShowPrivacy(true)}>
                  <Text style={[commonStyles.caption, { color: colors.primary }]}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={[commonStyles.divider, { marginVertical: spacing.md }]} />

            {/* Sign Up Link */}
            <View style={[commonStyles.centerRow, { marginBottom: spacing.xl }]}>
              <Text style={commonStyles.bodySecondary}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={[commonStyles.body, { color: colors.primary, fontWeight: '600' }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Skip for Demo */}
            <TouchableOpacity
              style={[buttonStyles.outline, { marginTop: spacing.md }]}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={buttonStyles.outlineText}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
