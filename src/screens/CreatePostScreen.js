import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const CreatePostScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>This is the createpost screen</Text>
      </View>
    );
}

export default CreatePostScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })