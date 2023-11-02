import * as React from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, SizableText, XStack, YStack, Slider} from 'tamagui';
import { getItem } from '../backend/localStorage';
import { checkUserExists, verifyPassword, getWeight, updateWeight } from '../backend/UserManagement';
import { fetchMyPosts } from '../backend/PostManagement';
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Post from '../components/Post';








const ProfileScreen = ({ navigation }) => {
  //get global variable for users weight and kcal
  const cal = 0
  const [userWeight, setUserWeight] = React.useState();
  const weightRegex = /^(?:0|[1-9]\d+|)?(?:.?\d{0,1})?$/;
  const weightErrorMsg = "Weight must be a number rounded to one decimal place."
  const [isEditable, setIsEditable] = React.useState(false)
  const [username, setUsername] = React.useState("")
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState("");
  const isFocused = useIsFocused();


  React.useEffect(() => {
    async function fetchData() {
      //console.log("ive been triggered")
      const user = await getItem("username");
      setUsername(user);
      const weight = await getWeight(user);
      if (weight == false){
        console.log("weight not retrieved");
        setUserWeight(0);
      } else {
        setUserWeight(weight);
      }
    }

    async function getPosts() {
      const data = await fetchMyPosts();
      setPosts(data);
    }

    fetchData();
    getPosts();
  },[isFocused, feedType])

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


  const submitInfo = async () => {
      setIsEditable(!isEditable)
      if(userWeight === ''){
        console.log("weight is invalid");
        showToast(weightErrorMsg);
        return;
      } else {
        const Id = await getItem("userId");
        //console.log(userWeight);
        //console.log(Id);
        await updateWeight(Id, userWeight);
        //add call to backend to update weight
      }
  }


    return (
      
      <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen space>
        <Icon  style={{ alignSelf: 'flex-end', padding: 10}} onPress={() => navigation.navigate('Settings')} name="settings-sharp" size={30} color="#2A6329"/>
        <XStack space>
          <YStack>
            <Icon style={{ paddingLeft: 0}} name="person-circle-outline" size={150} color={"#2A6329"} />
            <SizableText size="$6" color="#123911" paddingLeft="$10">{username}</SizableText>
          </YStack>
          <YStack padding={10}>
            <YStack paddingBottom={15}>
              <SizableText size="$6" color="#123911" font-weight="bold">WEIGHT</SizableText>
              <XStack>
                {isEditable ? <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={50} keyboardType='numeric' onChangeText={setUserWeight}></TextInput> : <SizableText size="$5" color="#123911">{userWeight} lbs.</SizableText>}
                <Icon onPress={submitInfo} name="create" size={30} color={"#2A6329"} /> 
              </XStack>
            </YStack>
            <SizableText size="$6" color="#123911" font-weight="bold">AVG CAL/DAY</SizableText>
            <SizableText size="$5" color="#123911">{cal} kcal</SizableText>
          </YStack>
        </XStack>

        <YStack space marginTop={30}>

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

        <SafeAreaView width="100%" marginBottom={40}>
        <ScrollView >
          
          {feedType === "meal" ? posts.map((post, index) => {
            if(post.postType === "meal"){
              return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} navigation={navigation}/>
            }
          }) : null}

          {feedType === "workout" ? posts.map((post, index) => {
            if(post.postType === "workout"){
              return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={0} protein={0} carbs={0} fat={0} navigation={navigation}/>
            }
          }) : null}

          {feedType === "" ? posts.map((post, index) => {
            return <Post key={index} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} navigation={navigation}/>
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

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })