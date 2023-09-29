import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


const SignUpScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>This is the signup screen</Text>
        <Button
            title="Finish Signing Up"
            onPress={() => navigation.navigate('Home')}
        />
      </View>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })