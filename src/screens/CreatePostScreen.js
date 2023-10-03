import * as React from 'react';
import { useState } from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Card, CardProps, H4, H3, H6, H5, H2, H1, H7, Image, Paragraph, Switch, Select, Adapt, Sheet, View } from 'tamagui';
import { TextInput, SafeAreaView, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Icon from 'react-native-vector-icons/Ionicons';
import ExerciseCard from './ExerciseCard';
import MealCard from './MealCard';

const CreatePostScreen = ({ navigation }) => {

  const [postType, setPostType] = useState('Workout')
  const [selected, setSelected] = useState("");

  const [count, setCount] = useState(1);

  const foodMeasures = [
    { key: '1', value: 'cups', },
    { key: '2', value: 'oz' },
    { key: '3', value: 'lbs' },
    { key: '4', value: 'grams', },
    { key: '5', value: 'servings' },
  ]

  const workoutMeasures = [
    { key: '1', value: 'reps', },
    { key: '2', value: 'seconds' },
  ]

  const weightMeasures = [
    { key: '1', value: 'lbs', },
    { key: '2', value: 'kg' },
  ]

  const plusButton = () => {
    setCount(count + 1);
  }

  const handlePost = () => {
    navigation.navigate('Posts');
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

            <Switch backgroundColor="#A7D36F" size="$5" width={100} onCheckedChange={(checked) => (checked) ? (setPostType("Meal"), setCount(1)) : (setPostType("Workout"), setCount(1))}>
              <Switch.Thumb backgroundColor="#123911" animation="lazy" />
            </Switch>
            {postType == "Meal" ?
              <H4 paddingLeft={40} paddingRight={40} style={{ fontWeight: "bold" }}>MEAL</H4>
              :
              <H4 paddingLeft={40} paddingRight={40}>MEAL</H4>}
          </XStack>

          {Array.from(Array(count)).map((c, index) => {
            return (<YStack key={index} flex={1}>
              {postType == "Workout" ?
                <ExerciseCard />
                :
                <MealCard />
              }
            </YStack>)
          })}

          <XStack  alignSelf='center' marginBottom={20} space>
            <Button  onPress={plusButton} circular={true} theme='dark_green' backgroundColor='transparent' icon={<Icon elevate name="add-circle" color="#123911" size={45} />}></Button>
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