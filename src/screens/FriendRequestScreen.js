import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const FriendRequestScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>This is the friendrequest screen</Text>
      </View>
    );
}

export default FriendRequestScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })