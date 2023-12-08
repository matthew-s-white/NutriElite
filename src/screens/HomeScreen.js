import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Slider, Text } from 'tamagui';
import { ScrollView, TextInput } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { fetchMyPosts } from '../backend/PostManagement';
import { useEffect, useState } from 'react';
import Post from '../components/Post';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchHomePosts } from '../backend/PostManagement';

const HomeScreen = ({ navigation }) => {

  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState("");
  const isFocused = useIsFocused();
  const [dummy, setDummy] = React.useState(0);

  useEffect(() => {
    async function getPosts() {
      const data = await fetchHomePosts();
      setPosts(data);
    }
    getPosts();
  }, [isFocused, feedType]);

  const handleSlider = (value) => {
    if(value == 0) {
      setFeedType('workout');
    }
    else if(value == 50) {
      setFeedType('');
    }
    else if(value == 100){
      setFeedType('meal');
    }
    
    console.log(value, feedType);
  }

  const increment  = () => {
    setDummy(dummy + 1);
  }

  // {posts.filter( function (post) { 
  //   return (post.postType.search(feedType) != -1);
  // }).map((post, index) => {
  //   return (
      
  //     <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} />
  //   );
  // })}


  return (
    <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen={true} space>

      <XStack space alignItems='center'>
        <Icon style={{ alignSelf: 'flex-start', margin: 5 }} onPress={() => navigation.navigate('CreatePost')} elevate name="add-circle" color="#123911" size={50} />

        <YStack space marginTop={20}>

          <Slider defaultValue={[50]} max={100} width={175} step={50} onValueChange={(value) => handleSlider(value[0])}>
            <Slider.Track backgroundColor='#658141'>
              <Slider.TrackActive backgroundColor='#7FA351' />
            </Slider.Track>
            <Slider.Thumb backgroundColor="#123911" index={0} circular elevate />
          </Slider>

          <XStack space>
              <Text color="#123911" fontSize={11}>WORKOUTS</Text>
              <Text color="#123911"  marginRight={15} fontSize={11}>ALL</Text>
              <Text color="#123911" fontSize={11}>MEALS</Text>
          </XStack>

        </YStack>

      </XStack>


      <SafeAreaView width="100%">
        <ScrollView >
          
          {feedType === "meal" ? posts.map((post, index) => {
            if(post.postType === "meal"){
              return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} image={post.image} navigation={navigation}/>
            }
          }) : null}

          {feedType === "workout" ? posts.map((post, index) => {
            if(post.postType === "workout"){
              return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={0} protein={0} carbs={0} fat={0}  image={post.image} navigation={navigation}/>
            }
          }) : null}

          {feedType === "" ? posts.map((post, index) => {
            return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein}  carbs={post.carbs} fat={post.fat} image={post.image} navigation={navigation}/>
          }) : null}

          <XStack alignSelf='center' marginBottom={25} space>
            <View style={{
              borderBottomColor: color = "#CEFF8F",
              borderBottomWidth: 1,
            }}></View>
          </XStack>

        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}

export default HomeScreen;