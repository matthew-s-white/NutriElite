import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import FriendRequestScreen from './src/screens/FriendRequestScreen';
import FriendProfileScreen from './src/screens/FriendProfileScreen';
import PostDetailsScreen from './src/screens/PostDetailsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Dimensions } from 'react-native';

import { TamaguiProvider, Tabs, Separator, SizableText, TabsContentProps, H5 } from 'tamagui';

import config from './tamagui.config';
import SettingsScreen from './src/screens/SettingsScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

const Stack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const FriendStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get("window");

// screenOptions={{headerShown: false}} 
function FriendRequests() {
  return (
    <FeedStack.Navigator initialRouteName='FriendRequests' screenOptions={{headerShown:false}}>
      <FeedStack.Screen name="FriendRequests" component={FriendRequestScreen}/>
      <FeedStack.Screen name="FriendProfile" component={FriendProfileScreen}/>
    </FeedStack.Navigator>
  )
}
function Feed() {
  return (
    <FeedStack.Navigator initialRouteName='Posts' screenOptions={{headerShown: false}}>
      <FeedStack.Screen name="Posts" component={HomeScreen}/>
      <FeedStack.Screen name="CreatePost" component={CreatePostScreen}/>
      <FeedStack.Screen name="PostDetails" component={PostDetailsScreen}/>
      <FeedStack.Screen name="FriendProfile" component={FriendProfileScreen}/>
    </FeedStack.Navigator>
  )
}

function ProfileAndSettings() {
  return (
    <ProfileStack.Navigator initialRouteName='MyProfile' screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyProfile" component={ProfileScreen}/>
      <Stack.Screen name="Settings" component={SettingsScreen}/>
    </ProfileStack.Navigator>
  )
}


function HomeNonTamagui() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarInactiveBackgroundColor: '#658141', tabBarActiveBackgroundColor: '#7FA351', tabBarActiveTintColor: '#2A6329', tabBarInactiveTintColor: '#123911', tabBarLabelStyle: {fontSize: 13}, tabBarHideOnKeyboard: true}} >
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="planet" size={24} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Saturn" component={ChatbotScreen} tabBarLabel="Saturn"/>
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="home" size={24} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Feed" component={Feed} tabBarLabel="Home"/>
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="person-circle" size={30} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Profile" component={ProfileAndSettings} tabBarLabel="Profile"/>
      <Tab.Screen options={{tabBarIcon: (tabInfo) => {return (<Icon name="person-add" size={24} color={tabInfo.focused ? "#2A6329" : "#123911"} />);},}} name="Friends" component={FriendRequests} tabBarLabel="Friends"/>
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