import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { updateTask } from '../redux/tasksSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateTask } from '../utils/validation';
import { notify } from '../utils/dialog';
import colors from '../constants/colors';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { loading } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [completed, setCompleted] = useState(task.completed || false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const validationErrors = validateTask({ title, description });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await dispatch(
      updateTask({
        id: task.id,
        title: title.trim(),
        description: description.trim(),
        completed,
      })
    );

    if (updateTask.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      notify('Error', result.payload || 'Failed to update task. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Edit Task</Text>
          <Text style={styles.subtitle}>Update your task details</Text>
        </View>

        <CustomInput
          label="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          error={errors.title}
        />

        <CustomInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description"
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Completed</Text>
          <Switch
            value={completed}
            onValueChange={setCompleted}
            trackColor={{ false: '#D6DCE1', true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.buttonGroup}>
          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
          <CustomButton
            title="Save Changes"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  back: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.heading,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.appBg,
    borderRadius: 8,
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});

export default EditTaskScreen;
