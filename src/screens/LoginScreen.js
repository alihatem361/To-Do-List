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

import { login, clearAuthError } from '../redux/authSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Checkbox from '../components/Checkbox';
import { validateLogin } from '../utils/validation';
import { notify } from '../utils/dialog';
import colors from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleLogin = async () => {
    const validationErrors = validateLogin({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await dispatch(login({ email: email.trim(), password }));
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
          <Text style={styles.title}>Login</Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

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

          <Checkbox
            label="Show Password"
            value={showPassword}
            onValueChange={setShowPassword}
            style={styles.showPassword}
          />

          <CustomButton
            title="SIGN IN"
            onPress={handleLogin}
            loading={loading}
            style={styles.submit}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() =>
                notify(
                  'Reset password',
                  'Password recovery is not available in this demo yet.'
                )
              }
            >
              <Text style={styles.footerMuted}>Forgot Username / Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupRow}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.footerMuted}>
                Don't have an account? <Text style={styles.linkStrong}>Sign up</Text>
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
  footerMuted: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  signupRow: {
    marginTop: 10,
  },
  linkStrong: {
    color: colors.link,
    fontWeight: '700',
  },
});

export default LoginScreen;
