import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack} from 'tamagui';
import { TextInput, ToastAndroid } from 'react-native';
import { checkUserExists, verifyPassword } from '../backend/UserManagement';

const LoginScreen = ({ navigation }) => {
    const [emailOrUsername, setEmailOrUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const showToast = (msg) => {
        ToastAndroid.show(`Error: ${msg}`, ToastAndroid.LONG);
    };

    async function submitLogin(){
        const emailOrUsernameExists = await checkUserExists(emailOrUsername, emailOrUsername);
        if(!emailOrUsernameExists){
            showToast("username/email doesn't exist");
            return;
        }

        const passwordIsCorrect = await verifyPassword(emailOrUsername, password);
        if(!passwordIsCorrect){
            showToast("password is incorrect");
            return;
        }

        navigation.navigate('Home');
    }
    return (
        <YStack backgroundColor="#CEFF8F" fullscreen>
            <SizableText size="$10" color="#123911" marginTop={100} padding={20}>Welcome Back!</SizableText>
            <SizableText size="$5" color="#123911" marginBottom={10} marginLeft={30}>Enter your Username (or Email) & Password</SizableText>
            <Form backgroundColor="#A7D36F" marginTop={25} marginBottom={50} marginLeft={30} marginRight={30} padding={30} borderRadius={20}>
                {
                    <YStack space marginBottom={30} alignSelf="center">
                        <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={55} width={300} placeholder='Username/Email' placeholderTextColor="#123911" onChangeText={setEmailOrUsername}></TextInput>
                        <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={55} width={300} placeholder='Password'placeholderTextColor="#123911" onChangeText={setPassword}></TextInput>

                    </YStack>}
                <Form.Trigger asChild>
                    <Theme name="dark_green">
                        <Button onPress={submitLogin} fontSize={20}>Log in</Button>
                    </Theme>
                </Form.Trigger>
                <XStack space alignSelf='center' padding={10}>
                    <SizableText size="$4" color="#123911">Don't have any account? <SizableText size="$4" color="#123911" style={{fontWeight: "bold", textDecorationLine: 'underline'}} onPress={() => navigation.navigate('SignUp')}>Sign up</SizableText> </SizableText>
                </XStack>
            </Form>
        </YStack>
    );
}

export default LoginScreen;