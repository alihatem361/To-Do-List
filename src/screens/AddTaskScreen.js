import React, { useState } from 'react';
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

import { createTask } from '../redux/tasksSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateTask } from '../utils/validation';
import { notify } from '../utils/dialog';
import colors from '../constants/colors';

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { loading } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const validationErrors = validateTask({ title, description });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await dispatch(
      createTask({ title: title.trim(), description: description.trim() })
    );

    if (createTask.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      notify('Error', result.payload || 'Failed to create task. Please try again.');
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
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>What do you need to do?</Text>
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

        <View style={styles.buttonGroup}>
          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
          <CustomButton
            title="Add Task"
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});

export default AddTaskScreen;
