import * as React from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme, Button, SizableText, XStack, YStack } from 'tamagui';
import { getItem } from '../backend/localStorage';
import { checkUserExists, verifyPassword, getWeight, updateWeight, getUserId, getFriendStatus, sendFriendRequest } from '../backend/UserManagement';
import { useIsFocused } from "@react-navigation/native";
import { getFriendPosts } from '../backend/PostManagement';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../components/Post';
import { acceptFriendRequest, declineFriendRequest } from '../backend/UserManagement';


const FriendProfileScreen = ({ navigation, route }) => {
    //get global variable for users weight and kcal
    const cal = 0;
    const friendUsername = route.params.username;
    const [friendWeight, setFriendWeight] = React.useState();
    const isFocused = useIsFocused();
    const [status, setStatus] = React.useState('');
    const [friendPosts, setFriendPosts] = React.useState([]);

    const [userId, setUserId] = React.useState('');
    const [friendId, setFriendId] = React.useState('');
    const [accepted, setAccepted] = React.useState(false);
    // 1 = not friends, 2 = user has sent a pending request, 3 = user has incoming request, 4 = friends

    React.useEffect(() => {
        async function fetchData() {
            //console.log("ive been triggered")
            const weight = await getWeight(friendUsername);
            setFriendWeight(weight);

            const id1 = await getItem('userId');
            setUserId(id1);
            const id2 = await getUserId(friendUsername);
            setFriendId(id2);

            const requestStatus = await getFriendStatus(id1, id2);
            console.log(requestStatus);
            setStatus(requestStatus);

            if (requestStatus == 4) {
                const posts = await getFriendPosts(id2);
                setFriendPosts(posts);
            }
        }
        fetchData();
    }, [isFocused, accepted])

    const showToast = (msg) => {
        ToastAndroid.show(`Error: ${msg}`, ToastAndroid.LONG);
    };

    const handleAddFriend = () => {
        setStatus(2);
    }

    const acceptRequest = () => {
        setStatus(4);
    }

    const declineRequest = () => {
        setStatus(1);
    }

    React.useEffect(() => {
        async function updateDatabase() {

            if(status == 2) {
                // check what current status is (if a request has already been sent)
                const currStatus = await getFriendStatus(userId, friendId);

                if(currStatus == 1) {
                    await sendFriendRequest(userId, friendId);
                }  
            }
            else if(status == 4) {
                const currStatus = await getFriendStatus(userId, friendId);

                if(currStatus == 3) {
                    await acceptFriendRequest(friendId, userId);
                    setAccepted(true);
                }
                
            }
            else if(status == 1) {
                const currStatus = await getFriendStatus(userId, friendId);

                if(currStatus == 3) {
                    await declineFriendRequest(friendId, userId);
                }
            }
        }
        updateDatabase();
    }, [status]);



    return (

        <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen space>
            <SafeAreaView width="100%">
                <ScrollView width="100%">
                    <Icon style={{ alignSelf: 'flex-start', padding: 10 }} onPress={() => navigation.navigate('FriendRequests')} name="arrow-back" size={30} color="#2A6329" />
                    <Icon style={{ alignSelf: 'center' }} name="person-circle-outline" size={200} color={"#2A6329"} />
                    <SizableText alignSelf='center' size="$6" color="#123911">{friendUsername}</SizableText>
                    <XStack style={{ alignSelf: 'center' }} space padding={10}>
                        <YStack marginRight={20} padding={5} alignItems='center'>
                            <SizableText alignSelf='center' size="$6" color="#123911" font-weight="bold">WEIGHT</SizableText>
                            <SizableText alignSelf='center' size="$5" color="#123911">{friendWeight} lbs.</SizableText>
                        </YStack>
                        <YStack marginLeft={20} padding={5} alignItems='center'>
                            <SizableText size="$6" color="#123911" font-weight="bold">AVG CAL/DAY</SizableText>
                            <SizableText size="$5" color="#123911">{cal} kcal</SizableText>
                        </YStack>
                    </XStack>

                    {status == 1 ?
                        <Theme name="dark_green">
                            <Button style={{ alignSelf: 'center' }} onPress={handleAddFriend} fontSize={18} iconAfter={<Icon elevate name="people-outline" color="white" size={25} />}>Add Friend</Button>
                        </Theme> : null}

                    {status == 2 ?
                        <Theme name="dark_green">
                            <Button disabled style={{ alignSelf: 'center' }} fontSize={18} color="#ABF7B1" iconAfter={<Icon elevate name="send-outline" color="#ABF7B1" size={25} />}>Request Sent!</Button>
                        </Theme> : null}

                    {status == 3 ?
                        <Theme name="dark_green">
                            <XStack style={{ alignSelf: 'center' }} space>
                                <Button onPress={acceptRequest} fontSize={18} iconAfter={<Icon elevate name="checkmark-outline" color="white" size={25} />}>Accept</Button>
                                <Button onPress={declineRequest} fontSize={18} iconAfter={<Icon elevate name="close-outline" color="white" size={25} />}>Decline</Button>
                            </XStack>
                        </Theme> : null}

                    {status == 4 ?
                        friendPosts.map((post, index) => {
                            return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} navigation={navigation} />
                        }) : null}

                </ScrollView>

            </SafeAreaView>

        </YStack>
    );
}

export default FriendProfileScreen;
