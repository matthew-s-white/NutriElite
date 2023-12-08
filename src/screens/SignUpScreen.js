import * as React from 'react';
import {Theme, Button, Form, YStack, SizableText} from 'tamagui';
import {TextInput, ToastAndroid} from 'react-native';
import { checkUserExists, createNewUser, sendVerification } from '../backend/UserManagement';
import { useEffect } from 'react';
import { getUserId, addWeight } from '../backend/UserManagement';


const SignUpScreen = ({ navigation }) => {

    const [email, onChangeEmail] = React.useState('');
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    const emailErrorMsg = "Please enter a valid email address."

    const [username, onChangeUsername] = React.useState('');
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    const usernameErrorMsg = "Username must be 5-15 alphanumeric characters."

    const [password, onChangePassword] = React.useState('');
    const passwordErrorMsg = "Password must be 8-25 characters."

    const [weight, onChangeWeight] = React.useState('');
    const weightRegex = /^(?:0|[1-9]\d+|)?(?:.?\d{0,1})?$/;
    const weightErrorMsg = "Weight must be a number rounded to one decimal place."

    const [submitted, setSubmitted] = React.useState(false);

    const showToast = (msg) => {
        ToastAndroid.show(`Error: ${msg}`, ToastAndroid.LONG);
    };

    const submitInfo = () => {
        if(email === '' || !email.match(emailRegex)){
            console.log("email is invalid");
            showToast(emailErrorMsg);
            return;
        }
        if(username === '' || !username.match(usernameRegex)){
            console.log("username is invalid");
            showToast(usernameErrorMsg);
            return;
        }
        if(password.length < 8 || password.length > 25){
            console.log("password is invalid");
            showToast(passwordErrorMsg);
            return;
        }
        if(weight === '' || !weight.match(weightRegex)){
            console.log("weight is invalid");
            showToast(weightErrorMsg);
            return;
        }
        setSubmitted(true);
    }

    useEffect(() => {
        async function submitToPB(){
            //add in call to backend
            if (!submitted){
                return;
            }
            const userAlreadyExists = await checkUserExists(email, username);
            if(userAlreadyExists){
                showToast("email or username already exists");
                setSubmitted(false);
                return;
            }
            console.log("before");
            const userCreated = await createNewUser(email, username, password, weight);
            const idUser = await getUserId(username)
            const weightrecord = await addWeight(idUser, weight);

            if(!userCreated || !weightrecord){
                console.log("in here");
                showToast("server error");
                setSubmitted(false);
                return;
            }
            console.log("before navigation");
            const verify = await sendVerification(email);
            showToast("Verification email sent... Redirecting to login");
            navigation.navigate('Login');
        }
        submitToPB();
    }, [submitted]);

    return (
        <YStack backgroundColor="#CEFF8F" fullscreen>
        <Form backgroundColor="#A7D36F" marginTop={20} marginLeft={30} marginRight={30} padding={30} borderRadius={20}>
            {
                <YStack space marginBottom={50} alignSelf="center">
                    <SizableText size="$5" color="#123911">Email</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200} value={email} onChangeText={onChangeEmail}></TextInput>   

                    <SizableText size="$5" color="#123911">Username</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200} value={username} onChangeText={onChangeUsername}></TextInput> 

                    <SizableText size="$5" color="#123911">Password</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200} value={password} onChangeText={onChangePassword}></TextInput>

                    <SizableText size="$5" color="#123911">Current Weight</SizableText>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200} value={weight} onChangeText={onChangeWeight} keyboardType="numeric"></TextInput>    
                </YStack>}
            <Form.Trigger asChild>
                <Theme name = "dark_green">
                    <Button onPress={submitInfo} fontSize={20}>Sign Up</Button>
                </Theme>
            </Form.Trigger>
        </Form>




        </YStack>
        
    );
}

export default SignUpScreen;
