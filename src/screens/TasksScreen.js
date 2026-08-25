import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchTasks,
  deleteTask,
  toggleTaskStatus,
  clearTasks,
} from '../redux/tasksSlice';
import { logout } from '../redux/authSlice';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import { confirm } from '../utils/dialog';
import colors from '../constants/colors';

const TasksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [refreshing, setRefreshing] = useState(false);

  // Pull tasks from the backend as soon as we land on the screen.
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchTasks());
    setRefreshing(false);
  }, [dispatch]);

  const handleDelete = async (task) => {
    const confirmed = await confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      confirmText: 'Delete',
      destructive: true,
    });
    if (confirmed) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Logout',
      destructive: true,
    });
    if (confirmed) {
      dispatch(clearTasks());
      dispatch(logout());
    }
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  const renderItem = ({ item }) => (
    <TaskItem
      task={item}
      onToggle={() => dispatch(toggleTaskStatus(item.id))}
      onEdit={() => navigation.navigate('EditTask', { task: item })}
      onDelete={() => handleDelete(item)}
    />
  );

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.count}>
            {remaining} of {tasks.length} remaining
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          tasks.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No tasks yet"
              subtitle="Tap “Add a Task” below to create your first one."
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      <TouchableOpacity
        style={[styles.addBar, { paddingBottom: insets.bottom + 14 }]}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <View style={styles.addPlus}>
          <Text style={styles.addPlusText}>+</Text>
        </View>
        <Text style={styles.addBarText}>Add a Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.appBg,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  count: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.errorBg,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: colors.errorBg,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 96,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  addBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 22,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addPlusText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '400',
    marginTop: -2,
  },
  addBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default TasksScreen;
