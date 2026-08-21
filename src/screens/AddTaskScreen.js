import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../redux/tasksSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateTask } from '../utils/validation';
import { notify } from '../utils/dialog';

const AddTaskScreen = ({ navigation }) => {
  const dispatch = useDispatch();
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
    const result = await dispatch(createTask({ title: title.trim(), description: description.trim() }));

    if (createTask.fulfilled.match(result)) {
      navigation.goBack();
    } else {
      notify('Error', result.payload || 'Failed to create task. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>What do you need to do?</Text>
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

          <View style={styles.buttonGroup}>
            <CustomButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelButton}
            />
            <CustomButton
              title="Add Task"
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

export default AddTaskScreen;
