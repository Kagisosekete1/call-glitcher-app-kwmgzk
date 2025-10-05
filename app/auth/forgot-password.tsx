
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleResetPassword = async () => {
    try {
      console.log('Reset password attempt with email:', email);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (!email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      
      // Simulate reset password process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Reset password email sent');
      setEmailSent(true);
      
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    console.log('Back to login pressed');
    router.back();
  };

  if (emailSent) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.container}>
          {/* Header */}
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
                <Icon name="checkmark-circle" size={40} color={colors.background} />
              </View>
              <Text style={[commonStyles.title, { color: colors.background }]}>
                Email Sent!
              </Text>
              <Text style={[commonStyles.bodySecondary, { 
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center' 
              }]}>
                Check your inbox for reset instructions
              </Text>
            </View>
          </LinearGradient>

          {/* Content */}
          <View style={[commonStyles.content, { paddingTop: spacing.xl }]}>
            <View style={[commonStyles.card, { marginBottom: spacing.xl }]}>
              <Text style={[commonStyles.body, { textAlign: 'center', marginBottom: spacing.md }]}>
                We've sent a password reset link to:
              </Text>
              <Text style={[commonStyles.subtitle, { 
                textAlign: 'center', 
                color: colors.primary,
                marginBottom: spacing.md 
              }]}>
                {email}
              </Text>
              <Text style={[commonStyles.caption, { textAlign: 'center' }]}>
                If you don't see the email, check your spam folder or try again with a different email address.
              </Text>
            </View>

            <TouchableOpacity
              style={buttonStyles.primary}
              onPress={handleBackToLogin}
            >
              <Text style={buttonStyles.primaryText}>
                Back to Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.outline, { marginTop: spacing.md }]}
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              <Text style={buttonStyles.outlineText}>
                Try Different Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={commonStyles.container}>
          {/* Header */}
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
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: spacing.xxl,
                left: spacing.md,
                zIndex: 1,
              }}
              onPress={handleBackToLogin}
            >
              <Icon name="arrow-back" size={24} color={colors.background} />
            </TouchableOpacity>
            
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
                <Icon name="key" size={40} color={colors.background} />
              </View>
              <Text style={[commonStyles.title, { color: colors.background }]}>
                Reset Password
              </Text>
              <Text style={[commonStyles.bodySecondary, { 
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center' 
              }]}>
                Enter your email to receive reset instructions
              </Text>
            </View>
          </LinearGradient>

          {/* Form */}
          <View style={[commonStyles.content, { paddingTop: spacing.xl }]}>
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Email Address</Text>
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
                  placeholder="Enter your email address"
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

            <TouchableOpacity
              style={[
                buttonStyles.primary,
                { marginTop: spacing.md },
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={buttonStyles.primaryText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.outline, { marginTop: spacing.md }]}
              onPress={handleBackToLogin}
            >
              <Text style={buttonStyles.outlineText}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
