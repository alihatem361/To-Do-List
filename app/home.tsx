import { router } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const tasks = [
  {
    id: "1",
    title: "Complete React Native project",
    completed: false,
  },
  {
    id: "2",
    title: "Study Digital Logic",
    completed: true,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello! 👋
          </Text>

          <Text style={styles.title}>
            My Tasks
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/task")}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>

            <TouchableOpacity style={styles.checkbox}>
              {item.completed && (
                <Text>✓</Text>
              )}
            </TouchableOpacity>

            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completed,
                ]}
              >
                {item.title}
              </Text>

              <Text style={styles.status}>
                {item.completed
                  ? "Completed"
                  : "Pending"}
              </Text>
            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 25,
  },

  greeting: {
    fontSize: 15,
    color: "#777",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginTop: 5,
  },

  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "300",
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  completed: {
    textDecorationLine: "line-through",
    color: "#999",
  },

  status: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});