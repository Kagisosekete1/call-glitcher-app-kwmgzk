
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

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      console.log('Sign up attempt with email:', email);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      setIsLoading(true);
      
      // Simulate sign up process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sign up successful, navigating to main app');
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Sign up failed. Please try again.');
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
                <Icon name="person-add" size={40} color={colors.background} />
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

          {/* Sign Up Form */}
          <View style={[commonStyles.content, { paddingTop: spacing.xl }]}>
            {/* Name Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Full Name</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon 
                    name="person" 
                    size={20} 
                    color={focusedField === 'name' ? colors.primary : colors.textLight} 
                  />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    focusedField === 'name' && inputStyles.inputFocused
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={inputStyles.container}>
              <Text style={inputStyles.label}>Email</Text>
              <View style={{ position: 'relative' }}>
                <View style={inputStyles.iconContainer}>
                  <Icon 
                    name="mail" 
                    size={20} 
                    color={focusedField === 'email' ? colors.primary : colors.textLight} 
                  />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    focusedField === 'email' && inputStyles.inputFocused
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
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
                    color={focusedField === 'password' ? colors.primary : colors.textLight} 
                  />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    focusedField === 'password' && inputStyles.inputFocused,
                    { paddingRight: 48 }
                  ]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
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
                  <Icon 
                    name="lock-closed" 
                    size={20} 
                    color={focusedField === 'confirmPassword' ? colors.primary : colors.textLight} 
                  />
                </View>
                <TextInput
                  style={[
                    inputStyles.input,
                    inputStyles.inputWithIcon,
                    focusedField === 'confirmPassword' && inputStyles.inputFocused,
                    { paddingRight: 48 }
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
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

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                buttonStyles.primary,
                { marginTop: spacing.md },
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
