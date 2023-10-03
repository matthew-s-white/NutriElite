import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import FriendRequestScreen from './src/screens/FriendRequestScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { TamaguiProvider, Tabs, Separator, SizableText, TabsContentProps, H5 } from 'tamagui';

import config from './tamagui.config';

const Stack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

// screenOptions={{headerShown: false}} 

function Feed() {
  return (
    <FeedStack.Navigator initialRouteName='Posts' screenOptions={{headerShown: false}}>
      <FeedStack.Screen name="Posts" component={HomeScreen}/>
      <FeedStack.Screen name="CreatePost" component={CreatePostScreen}/>
    </FeedStack.Navigator>
  )
}

function HomeNonTamagui() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarInactiveBackgroundColor: '#658141', tabBarActiveBackgroundColor: '#7FA351', tabBarActiveTintColor: '#2A6329', tabBarInactiveTintColor: '#123911', tabBarLabelStyle: {fontSize: 13}}} >
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="home-outline" size={24} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Feed" component={Feed} tabBarLabel="Home"/>
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="person-circle" size={30} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Profile" component={ProfileScreen} tabBarLabel="Profile"/>
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="person-add" size={24} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Friends" component={FriendRequestScreen} tabBarLabel="Friends"/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <TamaguiProvider config={config}>
      {<NavigationContainer>
      <Stack.Navigator initialRouteName = "Login" screenOptions={{headerShown: false}}> 
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="Home" component={HomeNonTamagui}/>
      </Stack.Navigator>
    </NavigationContainer>}
    </TamaguiProvider>
  );
}