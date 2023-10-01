import * as React from 'react';
import {Theme, Button, Form, YStack, SizableText} from 'tamagui';
import {TextInput} from 'react-native';


const SignUpScreen = ({ navigation }) => {
    return (
        <YStack backgroundColor="#CEFF8F" fullscreen>
        <Form backgroundColor="#A7D36F" marginTop={100} marginBottom={100} marginLeft={30} marginRight={30} padding={30} borderRadius={20}>
            {
                <YStack space marginBottom={50} alignSelf="center">
                    <SizableText size="$5" color="#123911">Email</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200}></TextInput>   

                    <SizableText size="$5" color="#123911">Username</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200}></TextInput> 

                    <SizableText size="$5" color="#123911">Password</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200}></TextInput>

                    <SizableText size="$5" color="#123911">Current Weight</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200}></TextInput>    
                </YStack>}
            <Form.Trigger asChild>
                <Theme name = "dark_green">
                    <Button onPress={() => navigation.navigate('SignUp')} fontSize={20}>Sign Up</Button>
                </Theme>
            </Form.Trigger>
        </Form>
        </YStack>
    );
}

export default SignUpScreen;
