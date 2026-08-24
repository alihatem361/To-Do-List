import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import ToDoList from './src/screens/ToDoList';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('signup'); 
  const [userData, setUserData] = useState({ name: '', email: '' });
  const handleSignUpComplete = (userInfo) => {
    if (userInfo) setUserData(userInfo);
    setCurrentScreen('signin');
 };

  
  const handleSignInComplete = (userInfo) => {
    if (userInfo) setUserData(userInfo);
    setCurrentScreen('tasks');
  };

  return (
    <Provider store={store}>
      {currentScreen === 'signup' && (
        <SignUp onNavigate={handleSignUpComplete} />
      )}
      {currentScreen === 'signin' && (
        <SignIn onNavigate={handleSignInComplete} registeredUser={userData} />
      )}
      {currentScreen === 'tasks' && (
        <ToDoList user={userData} />
      )}
    </Provider>
  );
}