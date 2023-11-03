import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Text, Card, H1, H5, H4 } from 'tamagui';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getItem } from '../backend/localStorage';
import { acceptFriendRequest, declineFriendRequest, getUserId } from '../backend/UserManagement';

const Request = ({ username, func }) => {

    const [accepted, setAccepted] = React.useState(false);
    const [declined, setDeclined] = React.useState(false);

    const acceptRequest = () => {
        setAccepted(true);

    }

    const declineRequest = () => {
        setDeclined(true);
    }


    React.useEffect(() => {
        async function updateRequest() {
            if(accepted == true) {
                const id1 = await getItem('userId'); // user 
                const id2 = await getUserId(username); // friend who sent request
                
                await acceptFriendRequest(id2, id1);
                func();
            }
        }
        updateRequest();

    }, [accepted])

    React.useEffect(() => {
        async function deleteRequest() {
            if(declined == true) {
                const id1 = await getItem('userId'); // user 
                const id2 = await getUserId(username); // friend who sent request
                
                await declineFriendRequest(id2, id1);
                func();
            }
        }
        deleteRequest();

    }, [declined])

    return (
        <Card width="95%" elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} paddingLeft={25} paddingVertical={10}>
            <XStack space>
                <H4 width="35%" marginTop={3} color="#123911">{username}</H4>
            
                <XStack width="40%" space>
                    <Button hoverStyle={{}} onPress={acceptRequest} borderColor="#123911" borderWidth={3} backgroundColor="#A7D36F" icon={<Icon elevate name="checkmark-outline" color="#123911" size={30} />}></Button>
                    <Button onPress={declineRequest} borderColor="#FF5757" borderWidth={3} backgroundColor="#A7D36F" icon={<Icon elevate name="close-outline" color="#FF5757" size={30} />}></Button>
                </XStack>
            </XStack>

        </Card>)

}
export default Request;