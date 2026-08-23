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

export default function TaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const saveTask = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title.");
      return;
    }

    Alert.alert("Success", "Task saved successfully.");

    router.back();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Add Task
      </Text>

      <Text style={styles.label}>
        Task Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Enter task description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveTask}
      >
        <Text style={styles.buttonText}>
          SAVE TASK
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#F7F8FC",
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  description: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    height: 52,
    backgroundColor: "#4A6CF7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});