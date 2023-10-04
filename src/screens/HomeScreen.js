import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack} from 'tamagui';
import { ScrollView, TextInput } from 'react-native';
import { fetchMyPosts } from '../backend/PostManagement';
import { useEffect } from 'react';
import Post from '../components/Post';

const HomeScreen = ({ navigation }) => {

  const [posts, setPosts] = React.useState([]);

  useEffect(() => {
      async function getPosts(){
        const data = await fetchMyPosts();
        setPosts(data);
      }
      getPosts();
  }, []);


  return (
    <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen>
      <ScrollView>
      <Button minWidth={200} padding={30} marginTop="$5" color="#123911" onPress={() => navigation.navigate('CreatePost')} size="$6">+</Button>
      {posts.map((post) => {return <Post id={post.id} author={post.expand.author.username} content={post.content} likeCount={post.likeCount} />})}
      </ScrollView>
    </YStack>
  );
}

export default HomeScreen;
