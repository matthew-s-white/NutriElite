import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const HomeScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>This is the home screen</Text>
      </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })