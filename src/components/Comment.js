 
import * as React from 'react';
import { Text, Card } from 'tamagui';


const Comment = ({author, content, navigation}) => {

    const handleAuthorClicked = () => {
        navigation.navigate('FriendProfile', {username: author });
    }

    return(
        <Card width="95%" elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} paddingLeft={25} paddingRight={50} paddingVertical={10} marginBottom={20}>
            <Text onPress={handleAuthorClicked} fontSize={17} padding={2} style={{ fontWeight: "bold" }} color="#123911">@{author}</Text>
            <Text fontSize={17} padding={2} color="#123911">{content}</Text>
        </Card>
    )
}

export default Comment;