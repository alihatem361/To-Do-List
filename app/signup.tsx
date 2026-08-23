import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.");
      return;
    }

    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>TO-DO</Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Start organizing your tasks today
          </Text>
        </View>

        <View style={styles.form}>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              CREATE ACCOUNT
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.accountText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4A6CF7",
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 18,
  },

  button: {
    height: 54,
    backgroundColor: "#4A6CF7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  accountText: {
    color: "#777",
    fontSize: 14,
  },

  loginText: {
    color: "#4A6CF7",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },
});