import * as React from 'react';
import {Theme, Button, Form, YStack, Text} from 'tamagui';


const LoginScreen = ({ navigation }) => {
    return (
      <Theme name = "light_green">
        <YStack alignSelf = "center" space margin={100}>
        <Form>
            {
                <YStack space marginBottom={50}>
                    <Text>This is the login screen</Text>    
                </YStack>}
            <Form.Trigger asChild>
                <Theme name = "dark_green">
                    <Button onPress={() => navigation.navigate('Home')}>Login</Button>
                </Theme>
            </Form.Trigger>
        </Form>
        </YStack>
      </Theme>
    );
}

export default LoginScreen;