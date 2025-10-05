
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Icon from '../../components/Icon';
import { 
  colors, 
  commonStyles, 
  buttonStyles, 
  inputStyles, 
  spacing, 
  borderRadius 
} from '../../styles/commonStyles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    try {
      console.log('Login attempt with email:', email);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setIsLoading(true);
      
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login successful, navigating to main app');
      router.replace('/(tabs)');
      
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
            {/* Email Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Email or Phone</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon 
                    name="mail" 
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
                  placeholder="Enter your email or phone"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
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

            {/* Divider */}
            <View style={[commonStyles.divider, { marginVertical: spacing.xl }]} />

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
