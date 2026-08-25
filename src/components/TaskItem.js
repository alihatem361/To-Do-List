import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => (
  <View style={[styles.container, task.completed && styles.completedContainer]}>
    <TouchableOpacity
      style={styles.checkbox}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!task.completed }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={[styles.checkCircle, task.completed && styles.checkCircleCompleted]}>
        {task.completed && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.content} onPress={onEdit} activeOpacity={0.7}>
      <Text
        style={[styles.title, task.completed && styles.titleCompleted]}
        numberOfLines={1}
      >
        {task.title}
      </Text>
      {task.description ? (
        <Text
          style={[styles.description, task.completed && styles.descriptionCompleted]}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      ) : null}
      {task.createdAt ? (
        <Text style={styles.date}>{new Date(task.createdAt).toLocaleDateString()}</Text>
      ) : null}
    </TouchableOpacity>

    <View style={styles.actions}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  completedContainer: {
    opacity: 0.65,
    backgroundColor: '#F6F8F9',
  },
  checkbox: {
    marginRight: 12,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  date: {
    fontSize: 11,
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.primaryTint,
    borderRadius: 6,
    marginRight: 6,
  },
  editText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.errorBg,
    borderRadius: 6,
  },
  deleteText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TaskItem;
