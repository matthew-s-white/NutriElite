import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Slider, Text } from 'tamagui';
import { ScrollView, TextInput, Keyboard } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { fetchMymessages } from '../backend/PostManagement';
import { useEffect, useState } from 'react';
import Message from '../components/Message';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { getItem } from '../backend/localStorage';
import { fetchMealResponse, welcomeMealMessage, welcomeWorkoutMessage } from '../backend/ChatbotManagement';


const ChatbotScreen = ({ navigation }) => {

    const [workoutMessages, setWorkoutMessages] = useState([]);
    const [mealMessages, setMealMessages] = useState([]);
    const [chatType, setChatType] = useState("workout");
    const isFocused = useIsFocused();
    const [myMessage, setMyMessage] = useState('');

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setKeyboardVisible(true); // or some other action
        }
        );
        const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setKeyboardVisible(false); // or some other action
        }
        );

        return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
        };
    }, []);

    const handleMessageSent = async () => {
        const myUsername = await getItem("username");
        if(chatType === "workout"){
            setWorkoutMessages([...workoutMessages, {content: myMessage, author: myUsername}]);
            setMyMessage("");
        } else {
            setMealMessages([...mealMessages, {content: myMessage, author: myUsername}]);
            setMyMessage("");
        }
        
    }

    const handleSlider = (value) => {
        if (value == 0) {
            setChatType('workout');
        }
        else if (value == 100) {
            setChatType('meal');
        }
    }


    useEffect(() => {
        async function getWorkoutResponse(msg) {
            // const data = await fetchHomePosts();
            // setPosts(data);
        }
        if(workoutMessages.length != 0 && workoutMessages[workoutMessages.length - 1].author !== "Saturn"){
            getWorkoutResponse(workoutMessages[workoutMessages.length - 1]);
        }
        if(workoutMessages.length == 0){
            setWorkoutMessages([...workoutMessages, {content: welcomeWorkoutMessage, author: "Saturn"}]);
        }
    }, [workoutMessages]);

    useEffect(() => {
        async function getMealResponse(msg) {
            let ans;
            if(msg.contains("Generate") || msg.contains("generate")){
                ans = await fetchMealResponse("calculate_meal_plan", msg);
            } else if(msg.contains("Search") || msg.contains("search")){
                ans = await fetchMealResponse("search", msg);
            } else if(msg.contains("Calculate") || msg.contains("calculate")){
                ans = await fetchMealResponse("calculate_nutrients", msg);
            } else {
                ans = "Sorry, I didn't understand your message. Try using one of the prompts.";
            }
            
            setMealMessages([...mealMessages, {content: ans, author: "Saturn"}]);
        }
        if(mealMessages.length != 0 && mealMessages[mealMessages.length - 1].author !== "Saturn"){
            getMealResponse(mealMessages[mealMessages.length - 1]);
        }
        if(mealMessages.length == 0){
            setMealMessages([...mealMessages, {content: welcomeMealMessage, author: "Saturn"}]);
        }
    }, [mealMessages]);


    return (
        <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen={true} space>

            <XStack space alignItems='center'>
                <YStack space marginTop={20}>

                    <Slider defaultValue={[0]} max={100} width={100} step={100} onValueChange={(value) => handleSlider(value[0])}>
                        <Slider.Track backgroundColor='#658141'>
                            <Slider.TrackActive backgroundColor='#7FA351' />
                        </Slider.Track>
                        <Slider.Thumb backgroundColor="#123911" index={0} circular elevate />
                    </Slider>

                    <XStack space>
                        <Text color="#123911" fontSize={11}>WORKOUTS</Text>
                        <Text color="#123911" fontSize={11}>MEALS</Text>
                    </XStack>

                </YStack>

            </XStack>


            <SafeAreaView width="100%">
                <ScrollView height={isKeyboardVisible ? "65%": "75%"}>

                    {chatType === "meal" ? mealMessages.map((message, index) => {
                        return <Message key={index} author={message.author} content={message.content} />
                    }) : null}

                    {chatType === "workout" ? workoutMessages.map((message, index) => {
                        return <Message key={index} author={message.author} content={message.content} />
                    }) : null}



                    <XStack alignSelf='center' marginBottom={25} space>
                        <View style={{
                            borderBottomColor: color = "#CEFF8F",
                            borderBottomWidth: 1,
                        }}></View>
                    </XStack>

                </ScrollView>
                    <XStack space elevate borderRadius={10} backgroundColor="#A7D36F" width="95%" padding={10} alignSelf='center' marginTop={5}>
                        <TextInput alignSelf='center' backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={55} width={300} placeholder='Comment here' placeholderTextColor="#123911" onChangeText={setMyMessage}>{myMessage}</TextInput>
                        <Icon alignSelf='center' padding={5} onPress={handleMessageSent} name="chatbubble-ellipses" size={40} color={"#2A6329"} />
                    </XStack>
            </SafeAreaView>
        </YStack>
    );
}

export default ChatbotScreen;