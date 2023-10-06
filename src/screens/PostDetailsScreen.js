import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, Theme, Button, Form, YStack, SizableText, XStack, Card, CardProps, H4, H3, H6, H5, H2, H1, H7, Image, Paragraph, Switch, Select, Adapt, Sheet, View } from 'tamagui';
import { TextInput, SafeAreaView, ScrollView, ToastAndroid } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchCommentsForPost, checkIfUserLiked, likePost, unlikePost, commentOnPost } from '../backend/PostManagement';
import { getItem } from '../backend/localStorage';
import Comment from '../components/Comment';

const PostDetailsScreen = ({ route, navigation }) => {
    const postInfo = route.params;
    console.log(postInfo);

    const [liked, setLiked] = React.useState(false); // need to load in whether post is liked by current user
    const [likeCou, setLikedCou] = React.useState(postInfo.likeCount);

    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState('');

    const [commentSent, setCommentSent] = useState(false);


    React.useEffect(() => {
        async function fetchData() {
            //console.log("ive been triggered")
            const comms = await fetchCommentsForPost(postInfo.id);
            setComments(comms);
            const idUser = await getItem("userId");
            const like = await checkIfUserLiked(idUser, postInfo.id);
            setLiked(like);
        }
        fetchData();
    }, [commentSent])

    const handleLiked = async () => {
        setLiked(!liked);
        const idUser = await getItem("userId");

        if (!liked) {
            setLikedCou(likeCou + 1);
            await likePost(idUser, postInfo.id);
        } else {
            setLikedCou(likeCou - 1);
            await unlikePost(idUser, postInfo.id);
        }

    }

    const handlePostComment = async () => {
        const record = await commentOnPost(postInfo.id, comment);
        setCommentSent(!commentSent);
        setComment("");
    }

    return (
        <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen={true} space>
            <SafeAreaView width="100%">
                <ScrollView height="88%">
                    <Icon style={{ alignSelf: 'flex-start', padding: 10 }} onPress={() => navigation.navigate("Posts")} name="arrow-back" size={30} marginTop={10} marginRight={250} color="#2A6329" />

                    <Card width="95%" elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} paddingLeft={25} paddingRight={50} paddingVertical={10} marginVertical={20}>
                        <Text fontSize={25} padding={2} style={{ fontWeight: "bold" }} color="#123911">@{postInfo.author}</Text>
                        <View
                            style={{
                                borderBottomColor: color = "#5B9A4C",
                                borderBottomWidth: 1,
                            }}
                        />
                        <Text fontSize={20} padding={2} color="#123911">{postInfo.content}</Text>
                        {postInfo.postType == "meal" ?
                            <View paddingBottom={10}>
                                <Text fontSize={18} padding={2} color="#123911">{postInfo.calories} calories</Text>
                                <Text fontSize={18} padding={2} color="#123911">{postInfo.protein} grams of protein</Text>
                                <Text fontSize={18} padding={2} color="#123911">{postInfo.carbs} grams of carbs</Text>
                                <Text fontSize={18} padding={2} color="#123911">{postInfo.fat} grams of fat</Text>
                            </View>
                            :
                            null
                        }
                        <XStack>
                            {liked ?
                                <Icon onPress={handleLiked} elevate name="heart" color="#123911" size={25} />
                                :
                                <Icon onPress={handleLiked} elevate name="heart-outline" color="#123911" size={25} />
                            }

                            <Text color="#123911" fontSize={18}>{likeCou}</Text>
                        </XStack>

                    </Card>

                    {comments.map((comment, index) => {
                        return <Comment key={index} author={comment.expand.author.username} content={comment.content} />
                    })}

                    <XStack alignSelf='center' marginBottom={25} space>
                        <View style={{
                            borderBottomColor: color = "#CEFF8F",
                            borderBottomWidth: 1,
                        }}></View>
                    </XStack>


                </ScrollView>

                <XStack space elevate borderRadius={10} backgroundColor="#A7D36F" width="95%" padding={10} alignSelf='center'>
                    <TextInput alignSelf='center' backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={55} width={300} placeholder='Comment here' placeholderTextColor="#123911" onChangeText={setComment}>{comment}</TextInput>
                    <Icon alignSelf='center' padding={5} onPress={handlePostComment} name="chatbubble-ellipses" size={40} color={"#2A6329"} />
                </XStack>


            </SafeAreaView>
        </YStack>
    );
}
export default PostDetailsScreen;