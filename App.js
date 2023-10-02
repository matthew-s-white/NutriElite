import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import FriendRequestScreen from './src/screens/FriendRequestScreen';

import { TamaguiProvider } from 'tamagui';

import config from './tamagui.config';

const Stack = createNativeStackNavigator();

// screenOptions={{headerShown: false}} 

export default function App() {
  return (
    <TamaguiProvider config={config}>
      {<NavigationContainer>
      <Stack.Navigator initialRouteName = "Login"> 
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="CreatePost" component={CreatePostScreen}/>
        <Stack.Screen name="FriendRequest" component={FriendRequestScreen}/>
      </Stack.Navigator>
    </NavigationContainer>}
    </TamaguiProvider>
  );
}