import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Text, Card } from 'tamagui';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { likePost, unlikePost, checkIfUserLiked } from '../backend/PostManagement';
import { getItem } from '../backend/localStorage';
import { useIsFocused } from "@react-navigation/native";

const Post = ({ navigation, id, author, content, likeCount, postType, calories, protein, carbs, fat, image }) => {
    const [liked, setLiked] = React.useState(false); // need to load in whether post is liked by current user
    const [likeCou, setLikedCou] = React.useState(likeCount);

    const isFocused = useIsFocused();

    React.useEffect(() => {
        async function fetchData() {
          //console.log("ive been triggered")
          const idUser = await getItem("userId");
          const like = await checkIfUserLiked(idUser, id);
          setLiked(like);
        }
        fetchData();
      },[])

    const handleLiked = async () => {
        setLiked(!liked);
        const idUser = await getItem("userId");

        if(!liked){
            setLikedCou(likeCou + 1);
            await likePost(idUser, id);
        } else {
            setLikedCou(likeCou - 1);
            await unlikePost(idUser, id);
        }

        
    }

    const handlePress = () => {
        navigation.navigate("PostDetails", {id: id, author: author, content: content, likeCount: likeCount, postType: postType, calories: calories, protein: protein, carbs: carbs, fat: fat, image: image});
    }
    return (
        <Card onPress={handlePress} width="95%" elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} paddingLeft={25} paddingRight={50} paddingVertical={10} marginBottom={20}>
            <Text fontSize={20} padding={2} style={{ fontWeight: "bold" }} color="#123911">@{author}</Text>
            <View
                style={{
                    borderBottomColor: color="#5B9A4C",
                    borderBottomWidth: 1,
                }}
            />
            <Text fontSize={16} padding={2} color="#123911">{content}</Text>
            <XStack>
                {liked ? 
                <Icon onPress={handleLiked} elevate name="heart" color="#123911" size={25} />
                :
                <Icon onPress={handleLiked} elevate name="heart-outline" color="#123911" size={25} />
                }
                
                <Text color="#123911"  fontSize={18}>{likeCou}</Text>
            </XStack>

        </Card>
    )
}

export default Post;