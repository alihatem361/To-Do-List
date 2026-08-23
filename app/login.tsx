import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    router.replace("/home");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>
        TO-DO
      </Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to manage your tasks
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          LOGIN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.signupText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F7F8FC",
  },

  logo: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
    color: "#4A6CF7",
    marginBottom: 15,
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 8,
    marginBottom: 35,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  button: {
    height: 52,
    backgroundColor: "#4A6CF7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  signupText: {
    textAlign: "center",
    color: "#4A6CF7",
    marginTop: 20,
  },
});