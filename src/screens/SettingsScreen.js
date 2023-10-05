import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Button, SizableText, XStack, YStack} from 'tamagui';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './ProfileScreen';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  const handleSave = () => {
    // Validate that currentUsername and password are correct
    // Typically this involves calling an API to validate the information
    // If valid, then allow to change the username

    console.log("Settings saved:", { newUsername });
    alert('Settings saved!');
    setModalVisible(false);
  };

  return (
    <YStack alignItems="center" backgroundColor="#CEFF8F" fullscreen space>
      <Icon style={{ alignSelf: 'flex-start', padding: 10}} onPress={() => navigation.goBack()} name="arrow-back" size={30} marginTop={10} marginRight={250} color="#2A6329"/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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

            <Button style={styles.button} onPress={handleSave}>Submit</Button>
            <Button style={styles.button} onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      <Button title="Change Username" onPress={() => setModalVisible(true)}>Change Username</Button>
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