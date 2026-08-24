import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask } from '../redux/taskSlice';
import { Feather, Ionicons } from '@expo/vector-icons'; 


const sideMenuItems = [
  { id: 'search', title: 'Search', iconName: 'search' },
  { id: 'my_day', title: 'My Day', iconName: 'sun' },
  { id: 'important', title: 'Important', iconName: 'star' },
  { id: 'planned', title: 'Planned', icon: 'calendar' },
  { id: 'assigned', title: 'Assigned to me', iconName: 'user' },
  { id: 'flagged', title: 'Flagged email', iconName: 'flag' },
  { id: 'tasks', title: 'Tasks', iconName: 'check-square' },
];

export default function ToDoList({ user }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [activeMenu, setActiveMenu] = useState('tasks'); 
  const [completedTasks, setCompletedTasks] = useState({}); 
  const [starredTasks, setStarredTasks] = useState({}); 

  const dispatch = useDispatch();
  const { items: tasks, status } = useSelector((state) => state.tasks || { items: [], status: 'idle' });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = async () => {
    if (taskTitle.trim() === '') return;

    const newTitle = taskTitle;
    setTaskTitle('');

    try {
      await dispatch(addTask({ title: newTitle })).unwrap();
    } catch (error) {
      console.log('API call error/fallback, adding locally:', error);
      dispatch({
        type: 'tasks/addTask/fulfilled',
        payload: { id: Date.now().toString(), title: newTitle }
      });
    }
  };

  const toggleCheck = (id) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStar = (id) => {
    setStarredTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* 1. Side Menu */}
      <View style={styles.sideMenu}>
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Feather name="user" size={20} color="#aaaaaa" />
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
          </View>
        </View>

        <FlatList
          data={sideMenuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.sideMenuItem, activeMenu === item.id && styles.activeSideItem]}
              onPress={() => setActiveMenu(item.id)}
            >
              <Feather 
                name={item.iconName} 
                size={18} 
                color={activeMenu === item.id ? '#ffffff' : '#a1a1aa'} 
                style={styles.sideMenuIcon} 
              />
              <Text style={[styles.sideMenuText, activeMenu === item.id && styles.activeSideText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.sideMenuFooter}>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="plus" size={18} color="#a1a1aa" style={{ marginRight: 8 }} />
            <Text style={styles.footerText}>New List</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.contentArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hi!</Text>
        </View>

        {status === 'loading' && tasks.length === 0 ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={({ item, index }) => {
              const itemId = item.id || index;
              const isDone = completedTasks[itemId];
              const isStarred = starredTasks[itemId];

              return (
                <View style={styles.taskCard}>
                  <TouchableOpacity
                    style={[styles.checkCircle, isDone && styles.checkCircleActive]}
                    onPress={() => toggleCheck(itemId)}
                  >
                    {isDone && <Feather name="check" size={12} color="#ffffff" />}
                  </TouchableOpacity>

                  <Text style={[styles.taskText, isDone && styles.taskTextDone]}>
                    {item.title || item.name || item.task}
                  </Text>

                  <TouchableOpacity style={styles.starIcon} onPress={() => toggleStar(itemId)}>
                    <Ionicons 
                      name={isStarred ? "star" : "star-outline"} 
                      size={18} 
                      color={isStarred ? "#eab308" : "#52525b"} 
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No tasks yet! Add one below.</Text>
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.addButtonIcon} onPress={handleAddTask}>
            <Feather name="plus" size={22} color="#818cf8" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Add a Task"
            placeholderTextColor="#888"
            value={taskTitle}
            onChangeText={setTaskTitle}
            onSubmitEditing={handleAddTask}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000000',
  },
  sideMenu: {
    width: 240,
    backgroundColor: '#0f0f0f',
    paddingTop: 20,
    borderRightWidth: 1,
    borderColor: '#1f1f1f',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  profileEmail: {
    color: '#71717a',
    fontSize: 11,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 8,
    marginBottom: 2,
  },
  activeSideItem: {
    backgroundColor: '#1e1e24',
  },
  sideMenuIcon: {
    marginRight: 12,
  },
  sideMenuText: {
    color: '#a1a1aa',
    fontSize: 13,
  },
  activeSideText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sideMenuFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#1f1f1f',
    marginTop: 'auto',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#a1a1aa',
    fontSize: 13,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize:30,
    fontWeight: 'bold',
    color: '#d7d8de',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#52525b',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  taskText: {
    flex: 1,
    color: '#f4f4f5',
    fontSize: 14,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#71717a',
  },
  starIcon: {
    paddingLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#52525b',
    marginTop: 40,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  addButtonIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#ffffff',
    fontSize: 14,
  },
});