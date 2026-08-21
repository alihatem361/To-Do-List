import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../redux/tasksSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateTask } from '../utils/validation';
import { notify } from '../utils/dialog';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const dispatch = useDispatch();
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Edit Task</Text>
          <Text style={styles.subtitle}>Update your task details</Text>
        </View>

        <View style={styles.form}>
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
              trackColor={{ false: '#ddd', true: '#4A90D9' }}
              thumbColor={completed ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.buttonGroup}>
            <CustomButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelButton}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
  },
  form: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

export default EditTaskScreen;
