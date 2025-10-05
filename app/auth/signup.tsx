
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

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSignUp = async () => {
    try {
      console.log('Signup attempt');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (!fullName || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (signupMethod === 'email' && !email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }

      if (signupMethod === 'phone' && !phone) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return;
      }

      setIsLoading(true);
      
      let authData;
      
      if (signupMethod === 'email') {
        authData = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: 'https://natively.dev/email-confirmed',
            data: {
              full_name: fullName,
            }
          }
        });
      } else {
        authData = await supabase.auth.signUp({
          phone: phone,
          password: password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
      }

      const { data, error } = authData;

      if (error) {
        Alert.alert('Signup Failed', error.message);
        return;
      }

      if (signupMethod === 'email' && !data.session) {
        Alert.alert(
          'Check Your Email', 
          'Please check your inbox for email verification!',
          [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
        );
      } else if (signupMethod === 'phone' && !data.session) {
        Alert.alert(
          'Verify Phone Number', 
          'Please check your phone for the verification code!',
          [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
        );
      } else if (data.user) {
        console.log('Signup successful, navigating to main app');
        router.replace('/(tabs)');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    console.log('Login pressed');
    router.push('/auth/login');
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
                Create Account
              </Text>
              <Text style={[commonStyles.bodySecondary, { 
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center' 
              }]}>
                Join Call Glitcher today
              </Text>
            </View>
          </LinearGradient>

          {/* Signup Form */}
          <View style={[commonStyles.content, { paddingTop: spacing.xl }]}>
            {/* Full Name Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Full Name</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon name="person" size={20} color={colors.textLight} />
                </View>
                <TextInput
                  style={[inputStyles.input, inputStyles.inputWithIcon]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textLight}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Signup Method Toggle */}
            <View style={[commonStyles.row, { marginBottom: spacing.md }]}>
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: signupMethod === 'email' ? colors.primary : colors.backgroundAlt,
                    marginRight: spacing.xs,
                  }
                ]}
                onPress={() => setSignupMethod('email')}
              >
                <Text style={[
                  commonStyles.caption,
                  { 
                    textAlign: 'center',
                    color: signupMethod === 'email' ? colors.background : colors.text,
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
                    backgroundColor: signupMethod === 'phone' ? colors.primary : colors.backgroundAlt,
                    marginLeft: spacing.xs,
                  }
                ]}
                onPress={() => setSignupMethod('phone')}
              >
                <Text style={[
                  commonStyles.caption,
                  { 
                    textAlign: 'center',
                    color: signupMethod === 'phone' ? colors.background : colors.text,
                    fontWeight: '600'
                  }
                ]}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email/Phone Input */}
            {signupMethod === 'email' ? (
              <View style={inputStyles.container}>
                <Text style={inputStyles.label}>Email Address</Text>
                <View style={{ position: 'relative' }}>
                  <View style={inputStyles.iconContainer}>
                    <Icon name="mail" size={20} color={colors.textLight} />
                  </View>
                  <TextInput
                    style={[inputStyles.input, inputStyles.inputWithIcon]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            ) : (
              <View style={inputStyles.container}>
                <Text style={inputStyles.label}>Phone Number</Text>
                <View style={{ position: 'relative' }}>
                  <View style={inputStyles.iconContainer}>
                    <Icon name="call" size={20} color={colors.textLight} />
                  </View>
                  <TextInput
                    style={[inputStyles.input, inputStyles.inputWithIcon]}
                    placeholder="Enter your phone number"
                    placeholderTextColor={colors.textLight}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            )}

            {/* Password Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Password</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon name="lock-closed" size={20} color={colors.textLight} />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    { paddingRight: 48 }
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
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

            {/* Confirm Password Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Confirm Password</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon name="lock-closed" size={20} color={colors.textLight} />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    { paddingRight: 48 }
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: spacing.md,
                    top: '50%',
                    marginTop: -12,
                  }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon 
                    name={showConfirmPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.textLight} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Privacy */}
            <View style={[commonStyles.center, { marginVertical: spacing.lg }]}>
              <Text style={[commonStyles.caption, { textAlign: 'center', marginBottom: spacing.sm }]}>
                By signing up, you agree to Call Glitcher's
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

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                buttonStyles.primary,
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={buttonStyles.primaryText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[commonStyles.divider, { marginVertical: spacing.xl }]} />

            {/* Login Link */}
            <View style={[commonStyles.centerRow, { marginBottom: spacing.xl }]}>
              <Text style={commonStyles.bodySecondary}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={[commonStyles.body, { color: colors.primary, fontWeight: '600' }]}>
                  Sign In
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
