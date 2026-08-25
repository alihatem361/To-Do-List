import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { signUp, clearAuthError } from '../redux/authSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Checkbox from '../components/Checkbox';
import { validateSignUp } from '../utils/validation';
import colors from '../constants/colors';

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Drop any stale auth error when the screen mounts so a previous failed login
  // doesn't leak onto this form. The error is rendered inline below — Alert is a
  // no-op on web, so it would otherwise fail silently there.
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSignUp = async () => {
    const validationErrors = validateSignUp({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await dispatch(
      signUp({ fullName: fullName.trim(), email: email.trim(), password })
    );

    // If the API returns a token the navigator swaps to the tasks stack on its
    // own; otherwise fall back to sending the user to the login screen.
    if (signUp.fulfilled.match(result) && !result.payload?.token) {
      navigation.navigate('Login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Full Name:"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            autoCapitalize="words"
            error={errors.fullName}
          />

          <CustomInput
            label="Email:"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />

          <CustomInput
            label="Password:"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password:"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            error={errors.confirmPassword}
          />

          <Checkbox
            label="Show Password"
            value={showPassword}
            onValueChange={setShowPassword}
            style={styles.showPassword}
          />

          <CustomButton
            title="SIGN UP"
            onPress={handleSignUp}
            loading={loading}
            style={styles.submit}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>
                Already have an account? <Text style={styles.linkStrong}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.heading,
    textAlign: 'center',
    marginBottom: 28,
  },
  errorBanner: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
  },
  showPassword: {
    marginBottom: 22,
    marginTop: -2,
  },
  submit: {
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  linkStrong: {
    color: colors.link,
    fontWeight: '700',
  },
});

export default SignUpScreen;
