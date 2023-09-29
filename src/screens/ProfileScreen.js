import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const ProfileScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>This is the profile screen</Text>
      </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })