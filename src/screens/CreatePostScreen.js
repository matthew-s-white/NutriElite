import * as React from 'react';
import { useState } from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Card, CardProps, H4, H3, H6, H5, H2, H1, H7, Image, Paragraph, Switch, Select, Adapt, Sheet, View } from 'tamagui';
import { TextInput, SafeAreaView, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Icon from 'react-native-vector-icons/Ionicons';
import ExerciseCard from './ExerciseCard';
import MealCard from './MealCard';

const CreatePostScreen = ({ navigation }) => {

  const workoutMeasures = [
    { key: '1', value: 'reps', },
    { key: '2', value: 'seconds' },
  ]

  const weightMeasures = [
    { key: '1', value: 'lbs', },
    { key: '2', value: 'kg' },
  ]

  const foodMeasures = [
    { key: '1', value: 'cups', },
    { key: '2', value: 'oz' },
    { key: '3', value: 'lbs' },
    { key: '4', value: 'grams', },
    { key: '5', value: 'servings' },
  ]

  const [postType, setPostType] = useState('Workout')
  const [count, setCount] = useState(1);

  const [postInfo, setPostInfo] = useState([{ "numSets": "", "exerciseName": "", "numReps": "", "repMeasure": "", "weightNum": "", "weightType": "" }])

  const handleSlider = (checked) => {
    if (checked) {
      setPostType("Meal");
      setPostInfo([{ 'mealName': "", 'mealAmount': "", "mealMeasure": "" }]);
    }
    else {
      setPostType("Workout");
      setPostInfo([{ "numSets": "", "exerciseName": "", "numReps": "", "repMeasure": "", "weightNum": "", "weightType": "" }]);
    }
  }
  const handlePlus = () => {
    if (postType == "Workout") {
      setPostInfo([...postInfo, { "numSets": "", "exerciseName": "", "numReps": "", "repMeasure": "", "weightNum": "", "weightType": "" }]);
    }
    else {
      setPostInfo([...postInfo, { 'mealName': "", 'mealAmount': "", "mealMeasure": "" }]);
    }
    setCount(count + 1);
  }

  const handleChange = (index, inputName, text) => {
    const updatedInfo = [...postInfo];
    updatedInfo[index][inputName] = text;
    setPostInfo(updatedInfo);
  }

  const handlePost = () => {
    navigation.navigate('Posts');
    console.log(postInfo);
  }


  return (
    <YStack backgroundColor="#CEFF8F" alignItems="center" fullscreen={true} space>

      <SafeAreaView>
        <ScrollView>

          <XStack marginTop={30} alignSelf='center' flex={1}>
            {postType == "Workout" ?
              <H4 paddingLeft={40} paddingRight={40} style={{ fontWeight: "bold" }}>WORKOUT</H4>
              :
              <H4 paddingLeft={40} paddingRight={40}>WORKOUT</H4>}

            <Switch backgroundColor="#A7D36F" size="$5" width={100} onCheckedChange={(checked) => handleSlider(checked)}>
              <Switch.Thumb backgroundColor="#123911" animation="lazy" />
            </Switch>
            {postType == "Meal" ?
              <H4 paddingLeft={40} paddingRight={40} style={{ fontWeight: "bold" }}>MEAL</H4>
              :
              <H4 paddingLeft={40} paddingRight={40}>MEAL</H4>}
          </XStack>

          {postInfo.map((card, index) => {
            return (<YStack key={index} flex={1}>
              {postType == "Workout" ?

                <Card elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} padding={20} marginTop={20} marginBottom={20}>
                  <H5 alignSelf='center' marginBottom={15}>- Exercise -</H5>
                  <Card.Footer>
                  </Card.Footer>
                  <Card.Background>
                  </Card.Background>

                  <XStack>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='# Sets' value={card.numSets} onChangeText={(text) => handleChange(index, 'numSets', text)} keyboardType="numeric" placeholderTextColor="#123911" marginRight={10} flex={2}></TextInput>
                    <H6 marginTop={10} marginRight={10}>sets of</H6>
                    <TextInput backgroundColor="#FFFFFF" borderRadius={10} placeholder='Exercise Name' placeholderTextColor="#000000" flex={5} value={card.exerciseName} onChangeText={(text) => handleChange(index, 'exerciseName', text)}></TextInput>
                  </XStack>

                  <XStack marginTop={15} alignSelf='center'>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='Amount' value={card.numReps} onChangeText={(text) => handleChange(index, 'numReps', text)} keyboardType="numeric" placeholderTextColor="#123911" marginRight={5} flex={4}></TextInput>
                    <View flex={7}>
                      <SelectList
                        setSelected={(val) => handleChange(index, 'repMeasure', val)}
                        data={workoutMeasures}
                        save="value"
                        value={card.repMeasure}
                        placeholder="Select"
                        search={false} />
                    </View>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='Weight' keyboardType="numeric" onChangeText={(val) => handleChange(index, 'weightNum', val)} placeholderTextColor="#123911" marginLeft={10} marginRight={5} flex={3}></TextInput>
                    <View flex={6}>
                      <SelectList
                        setSelected={(val) => handleChange(index, 'weightType', val)}
                        data={weightMeasures}
                        save="value"
                        value={card.weightType}
                        placeholder="Select"
                        search={false} />
                    </View>
                  </XStack>


                </Card>

                :

                <Card elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} padding={20} marginTop={20} marginBottom={20}>

                  <H5 alignSelf='center' marginBottom={15}>- Meal Item -</H5>
                  <Card.Footer>
                  </Card.Footer>
                  <Card.Background>
                  </Card.Background>

                  <TextInput backgroundColor="#FFFFFF" borderRadius={10} placeholder='Meal Item Name' placeholderTextColor="#000000" value={card.mealName} onChangeText={(val) => handleChange(index, "mealName", val)}></TextInput>
                  <XStack marginTop={10} alignSelf='center'>
                    <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='Amount' keyboardType="numeric" placeholderTextColor="#123911" value={card.mealAmount} onChangeText={(val) => handleChange(index, "mealAmount", val)} marginRight={10} flex={3}></TextInput>

                    <View flex={3}>
                      <SelectList
                        setSelected={(val) => handleChange(index, "mealMeasure", val)}
                        data={foodMeasures}
                        save="value"
                        value={card.mealMeasure}
                        placeholder="Select"
                        search={false} />
                    </View>
                  </XStack>

                </Card>
              }
            </YStack>)
          })}

          <XStack alignSelf='center' marginBottom={20} space>
            <Button onPress={handlePlus} circular={true} theme='dark_green' backgroundColor='transparent' icon={<Icon elevate name="add-circle" color="#123911" size={45} />}></Button>
            <Theme name="dark_green">
              <Button backgroundColor="#123911" fontColor="#000000" onPress={handlePost}>POST</Button>
            </Theme>
          </XStack>




        </ScrollView>
      </SafeAreaView>


    </YStack>

  );
}

export default CreatePostScreen;