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

function Home() {
  return (
    <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
        fullscreen
      >
        <TabsContent value="tab1">
          <FeedStack.Navigator initialRouteName='Posts'>
            <FeedStack.Screen name="Posts" component={HomeScreen}/>
            <FeedStack.Screen name="CreatePost" component={CreatePostScreen}/>
          </FeedStack.Navigator>
        </TabsContent>

        <TabsContent value="tab2">
          <FriendRequestScreen/>
        </TabsContent>

        <TabsContent value="tab3">
          <ProfileScreen/>
        </TabsContent>
        <Separator />
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText fontFamily="$body">Home</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText fontFamily="$body">Friends</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab3">
            <SizableText fontFamily="$body">Profile</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
  );
}

const TabsContent = (props) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
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