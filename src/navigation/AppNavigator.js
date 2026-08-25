import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import TasksScreen from '../screens/TasksScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';

const Stack = createNativeStackNavigator();

const screenOptions = { headerShown: false };

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const TasksStack = () => (
  <Stack.Navigator initialRouteName="TasksList" screenOptions={screenOptions}>
    <Stack.Screen name="TasksList" component={TasksScreen} />
    <Stack.Screen name="AddTask" component={AddTaskScreen} />
    <Stack.Screen name="EditTask" component={EditTaskScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  // A token in the store is what gates access to the app. When it appears (after
  // login/sign-up) or clears (logout), the navigator swaps stacks automatically.
  const token = useSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {token ? (
          <Stack.Screen name="Tasks" component={TasksStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
