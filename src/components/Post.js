import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, View, Text} from 'tamagui';

const Post = ({id, author, content, likeCount}) => {
    return(
        <View marginTop={20} width="90%" height={200} borderRadius={10} backgroundColor="#A7D36F" padding={10}>
            <Text color="#123911">
            Author: {author}
            </Text>
            <Text color="#123911">
            Content: {content}
            </Text>
            <Text color="#123911">
            likeCount: {likeCount}
            </Text>
            
        </View>
    )
}

export default Post;