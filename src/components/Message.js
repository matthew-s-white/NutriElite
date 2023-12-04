import * as React from 'react';
import { Text, Card } from 'tamagui';


const Message = ({author, content}) => {

    return(
        <Card width="70%" elevate backgroundColor="#FFFFFF" marginLeft={author === "Saturn" ? 10 : 105} marginRight={author === "Saturn" ? 100 : 10} paddingLeft={25} paddingRight={50} paddingVertical={10} marginBottom={20}>
            <Text fontSize={17} padding={2} style={{ fontWeight: "bold" }} color="#123911">@{author}</Text>
            <Text fontSize={17} padding={2} color="#123911">{content}</Text>
        </Card>
    )
}

export default Message;