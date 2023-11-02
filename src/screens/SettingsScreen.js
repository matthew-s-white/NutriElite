import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Button, SizableText, XStack, YStack, Theme} from 'tamagui';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './ProfileScreen';
import LoginScreen from './LoginScreen';
import { getItem, setItem, removeItem} from '../backend/localStorage';
import { checkUserExists, verifyPassword, getWeight, setWeight, updateUsername, updatePassword, deleteAccount } from '../backend/UserManagement';


const SettingsScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);



  
  const showToast = (msg) => {
    ToastAndroid.show(`Error: ${msg}`, ToastAndroid.LONG);
  };

  const handleUsernameSave = async () => {
    // Validate that currentUsername and password are correct
    const verify = await verifyPassword(username, password);
    if (verify){
        if(await checkUserExists(newUsername, newUsername)){
            showToast("username already exists");
            return;
        } else {
            const Id = await getItem("userId");
            //console.log(Id);
            const tryUpdate = await updateUsername(Id, newUsername);
            if(tryUpdate){
                await setItem('username', newUsername);
            }
        }
    } else {
        showToast("username or password is invalid");
        return;
    }
    // Typically this involves calling an API to validate the information
    // If valid, then allow to change the username

    //console.log("Settings saved:", { newUsername });
    alert('Settings saved!');
    setUsernameModalVisible(false);
  };


  const handlePasswordSave = async () => {
    // Validate that currentUsername and password are correct
    const verify = await verifyPassword(username, password);
    if (verify){
          const Id = await getItem("userId");
          //console.log(Id);
          const tryUpdate = await updatePassword(Id, newPassword);
          if(tryUpdate){
              await setItem('password', newPassword);
          }
    } else {
        showToast("username or password is invalid");
        return;
    }
    // Typically this involves calling an API to validate the information
    // If valid, then allow to change the username

    //console.log("Settings saved:", { newUsername });
    alert('Settings saved!');
    setPasswordModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    // Validate that currentUsername and password are correct
    const verify = await verifyPassword(username, password);
    if (verify){
          const Id = await getItem("userId");
          //console.log(Id);
          const tryDelete = await deleteAccount(Id);
          if(tryDelete){
            await removeItem(Id);
          }
    } else {
        showToast("username or password is invalid");
        return;
    }
    // Typically this involves calling an API to validate the information
    // If valid, then allow to change the username

    setDeleteModalVisible(false);
    navigation.navigate("Login");
  };

  const handleLogout = async () => {
    setPasswordModalVisible(false);
    navigation.navigate("Login");
  };


  return (
    <YStack alignItems="center" backgroundColor="#CEFF8F" fullscreen space>
      <XStack alignSelf='flex-start'>
        <Icon style={{ alignSelf: 'flex-start', padding: 10}} onPress={() => navigation.navigate("MyProfile")} name="arrow-back" size={30} marginTop={10} marginRight={250} color="#2A6329"/>
        <Text style={{marginLeft: 90, marginTop: 20, fontSize: 30, color: "#2A6329"}}>Settings</Text>
      </XStack>
      <Modal
        animationType="slide"
        transparent={true}
        visible={usernameModalVisible}
        onRequestClose={() => {
          setUsernameModalVisible(!usernameModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Current Username:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your current username"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
            <Text style={styles.label}>New Username:</Text>
            <TextInput
              style={styles.input}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter your new username"
            />

            <Button style={styles.button} onPress={handleUsernameSave}>Submit</Button>
            <Button style={styles.button} onPress={() => setUsernameModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => {
          setPasswordModalVisible(!passwordModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Current Username:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your current username"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
            <Text style={styles.label}>New Password:</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter your new password"
            />

            <Button style={styles.button} onPress={handlePasswordSave}>Submit</Button>
            <Button style={styles.button} onPress={() => setPasswordModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => {
          setLogoutModalVisible(!logoutModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Are you sure you want to logout?</Text>

            <Button style={styles.button} onPress={handleLogout}>Yes</Button>
            <Button style={styles.button} onPress={() => setLogoutModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!DeleteModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your current username"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <Button style={styles.button} onPress={handleDeleteAccount}>Delete Account</Button>
            <Button style={styles.button} onPress={() => setDeleteModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>


      <Theme name="dark_green">
        <Button style={{marginBottom: 15}} title="Change Username" onPress={() => setUsernameModalVisible(true)}>Change Username</Button>
        <Button style={{marginBottom: 15}} title="Change Password" onPress={() => setPasswordModalVisible(true)}>Change Password</Button>
        <Button style={{marginBottom: 15, width: 150}} title="Logout" onPress={() => setLogoutModalVisible(true)}>Logout</Button>
        <Button style={{marginBottom: 15, width: 150}} title="Delete Account" onPress={() => setDeleteModalVisible(true)}>Delete Account</Button>
      </Theme>
    </YStack>
  );
};

// Styles remain the same...

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 20,
    },
    button: {
        marginBottom: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'stretch',
      elevation: 5,
    },
  });
  
  export default SettingsScreen;