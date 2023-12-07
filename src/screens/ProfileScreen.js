import * as React from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, ScrollView, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, SizableText, Separator, XStack, YStack, Slider, H4, H5, Switch } from 'tamagui';
import { getItem } from '../backend/localStorage';
import { checkUserExists, verifyPassword, getWeight, updateWeight, addWeight, getWeights, getCalories } from '../backend/UserManagement';
import { fetchMyPosts } from '../backend/PostManagement';
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Post from '../components/Post';
import { fetchFriendIds } from '../backend/PostManagement';
import { LineChart } from 'react-native-chart-kit';



const ProfileScreen = ({ navigation }) => {
  //get global variable for users weight and kcal
  const [profileCals, setProfileCals] = useState(0);
  const [userWeight, setUserWeight] = React.useState();
  const weightRegex = /^(?:0|[1-9]\d+|)?(?:.?\d{0,1})?$/;
  const weightErrorMsg = "Weight must be a number rounded to one decimal place."
  const [isEditable, setIsEditable] = React.useState(false)
  const [username, setUsername] = React.useState("")
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState("");
  const [weights, setWeights] = useState([]);
  const [calorieIntake, setCalorieIntake] = useState([]);
  const [content, setContent] = useState('posts');
  const [chartConfig, setChartConfig] = useState({
    backgroundColor: '#2A6329',
    backgroundGradientFrom: '#2A6329',
    backgroundGradientTo: '#2A6329',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  });

  const isFocused = useIsFocused();




  React.useEffect(() => {
    async function fetchData() {
      //console.log("ive been triggered")
      const user = await getItem("username");
      setUsername(user);
      const weight = await getWeight(user);
      if (weight == false) {
        console.log("weight not retrieved");
        setUserWeight(0);
      } else {
        setUserWeight(weight);
        const weightProgress = await getWeights();
        //console.log(weightProgress);
        if (weightProgress == false) {
          console.log("weights not retrieved");
        } else {

          const chartData = {
            labels: weightProgress.map(item => formatDate(item.created)), // Map 'created' for labels
            datasets: [{
              data: weightProgress.map(item => item.weight) // Map 'weight' for dataset data
            }]
          };
          setWeights(chartData);
        }

      }


    }
    async function getPosts() {
      const data = await fetchMyPosts();
      setPosts(data);

      var i;
      var dates = []
      var dailyCalories = []
      var prevDate = null;
      var calories = 0
      for (i = data.length - 1; i >= 0; i--) {
        var curr = data[i];
        if (curr['postType'] == 'meal') {
          // first day
          if (prevDate == null) {

            prevDate = formatDate(curr['created']);
            calories = curr['calories']
          }
          else {
            // start new day
            if (prevDate != formatDate(curr['created'])) {
              dates.push(prevDate);
              dailyCalories.push(calories);
              prevDate = formatDate(curr['created']);
              calories = curr['calories']
            }
            else { // add to same day
              calories += curr['calories']
            }
          }
        }
      }
      // log last date
      dates.push(prevDate);
      dailyCalories.push(calories);

      //console.log(dates);
      //console.log(dailyCalories);


      const chartData = {
        labels: dates,
        datasets: [{
          data: dailyCalories
        }]
      };
      setCalorieIntake(chartData);
      console.log(calorieIntake);

      var j;
      var total = 0;
      for(j=0; j<dailyCalories.length; j++) {
        total += dailyCalories[j];
      }

      //console.log(Math.round(total / dates.length))
      setProfileCals(Math.round(total / dates.length))

    }

    fetchData();
    getPosts();
  }, [isFocused, feedType, isEditable])

  React.useEffect(() => {
    console.log('Weights State:', weights);
    if (weights.datasets && weights.datasets.length > 0) {
      console.log('Data Array:', weights.datasets[0].data);
    }
  }, [weights]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`; // Converts to MM/DD format
  }

  const handleSlider = (value) => {
    if (value == 0) {
      setFeedType('workout');
    }
    else if (value == 50) {
      setFeedType('');
    }
    else if (value == 100) {
      setFeedType('meal');
    }

    console.log(value, feedType);
  }

  const handleSwitch = (checked) => {
    if (checked) {
      setContent("graphs");
    }
    else {
      setContent("posts");
    }
  }


  const submitInfo = async () => {
    if (!isEditable) {
      console.log("in here");
      setIsEditable(!isEditable);
      return;
    }
    setIsEditable(!isEditable);
    if (userWeight === '') {
      console.log("weight is invalid");
      showToast(weightErrorMsg);
      return;
    } else {
      const Id = await getItem("userId");
      //console.log(userWeight);
      //console.log(Id);
      await updateWeight(Id, userWeight);
      await addWeight(Id, userWeight);
      //add call to backend to update weight
    }
  }


  return (

    <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen space>
      <SafeAreaView width="100%">
        <ScrollView width="100%">
          <Icon style={{ alignSelf: 'flex-end', padding: 10 }} onPress={() => navigation.navigate('Settings')} name="settings-sharp" size={30} color="#2A6329" />
          <XStack style={{ alignSelf: 'center' }} space>
            <YStack>
              <Icon style={{ alignSelf: 'center', paddingLeft: 0 }} name="person-circle-outline" size={150} color={"#2A6329"} />
              <SizableText size="$6" color="#123911" paddingLeft="$10">{username}</SizableText>
            </YStack>
            <YStack style={{ alignSelf: 'center' }} padding={10}>
              <YStack style={{ alignSelf: 'center' }} paddingBottom={15}>
                <SizableText size="$6" color="#123911" font-weight="bold">WEIGHT</SizableText>
                <XStack>
                  {isEditable ? <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={50} keyboardType='numeric' value={userWeight} onChangeText={setUserWeight}></TextInput> : <SizableText size="$5" color="#123911">{userWeight} lbs.</SizableText>}
                  <Icon onPress={submitInfo} name="create" size={30} color={"#2A6329"} />
                </XStack>
              </YStack>
              <SizableText style={{ alignSelf: 'center' }} size="$6" color="#123911" font-weight="bold">AVG CAL/DAY</SizableText>
              <SizableText style={{ alignSelf: 'center' }} size="$5" color="#123911">{profileCals} kcal</SizableText>
            </YStack>
          </XStack>


          <XStack alignSelf='center' flex={1} marginVertical={15}>
            {content == "posts" ?
              <H4 paddingLeft={20} paddingRight={20} style={{ fontWeight: "bold" }}>POSTS</H4>
              :
              <H4 paddingLeft={20} paddingRight={20}>POSTS</H4>}

            <Switch backgroundColor="#A7D36F" size="$5" width={125} onCheckedChange={(checked) => handleSwitch(checked)}>
              <Switch.Thumb backgroundColor="#123911" animation="lazy" />
            </Switch>
            {content == "graphs" ?
              <H4 paddingLeft={20} paddingRight={20} style={{ fontWeight: "bold" }}>STATS</H4>
              :
              <H4 paddingLeft={20} paddingRight={20}>STATS</H4>}
          </XStack>

          {content == "graphs" ?
            <YStack space style={{ alignSelf: 'center' }} >

              {weights.datasets && weights.datasets.length > 0 && (
                <YStack alignItems='center'>
                  <H5 style={{ fontWeight: "bold" }}>WEIGHT TRACKER</H5>
                  <View marginVertical={5} style={{
                    borderRadius: 20, // Adjust the value as needed
                    overflow: 'hidden', // This is important to make borderRadius work
                    backgroundColor: 'white' // Set the background color as needed
                  }}>
                    <LineChart
                      data={weights}
                      width={350}
                      height={300}
                      verticalLabelRotation={30}
                      chartConfig={chartConfig}
                      bezier
                    />
                  </View>
                </YStack>
              )
              }


              {calorieIntake.datasets && calorieIntake.datasets.length > 0 && (
                <YStack alignItems='center'>
                  <H5 style={{ fontWeight: "bold" }}>CALORIE TRACKER</H5>
                  <View marginVertical={5} style={{
                    borderRadius: 20, // Adjust the value as needed
                    overflow: 'hidden', // This is important to make borderRadius work
                    backgroundColor: 'white' // Set the background color as needed
                  }}>
                    <LineChart
                      data={calorieIntake}
                      width={350}
                      height={300}
                      verticalLabelRotation={30}
                      chartConfig={chartConfig}
                      bezier
                    />
                  </View>
                </YStack>
              )}
            </YStack>
            :
            <YStack>
              <YStack space alignItems="center" marginVertical={10}>
                <View style={styles.sliderContainer}>
                  <Slider defaultValue={[50]} max={100} width={280} step={50} onValueChange={(value) => handleSlider(value[0])}>
                    <Slider.Track backgroundColor='#658141'>
                      <Slider.TrackActive backgroundColor='#7FA351' />
                    </Slider.Track>
                    <Slider.Thumb backgroundColor="#123911" index={0} circular elevate />
                  </Slider>
                </View>

                <XStack style={{ alignSelf: 'center' }}>
                  <SizableText color="#123911" paddingRight={60} fontSize={13}>WORKOUTS</SizableText>
                  <SizableText color="#123911" marginLeft={30} paddingRight={65} fontSize={13}>ALL</SizableText>
                  <SizableText color="#123911" paddingLeft={25} fontSize={13} marginRight={30}>MEALS</SizableText>
                </XStack>
              </YStack>


              {feedType === "meal" ? posts.map((post, index) => {
                if (post.postType === "meal") {
                  return <Post key={index} image={post.image} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} navigation={navigation} />
                }
              }) : null}

              {feedType === "workout" ? posts.map((post, index) => {
                if (post.postType === "workout") {
                  return <Post key={index} image={post.image} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={0} protein={0} carbs={0} fat={0} navigation={navigation} />
                }
              }) : null}

              {feedType === "" ? posts.map((post, index) => {
                return <Post key={index} image={post.image} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} navigation={navigation} />
              }) : null}


            </YStack>
          }

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
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
})