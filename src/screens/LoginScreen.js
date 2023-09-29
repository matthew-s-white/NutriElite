import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


const LoginScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>This is the login screen</Text>
        <Button
            title="Login"
            onPress={() => navigation.navigate('Home')}
        />
        <Button
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })