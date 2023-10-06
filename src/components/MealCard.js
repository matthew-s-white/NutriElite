import * as React from 'react';
import { useState } from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Card, CardProps, H4, H3, H6, H5, H2, H1, H7, Image, Paragraph, Switch, Select, Adapt, Sheet, View } from 'tamagui';
import { TextInput } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

const MealCard = () => {
  const foodMeasures = [
    { key: '1', value: 'cups', },
    { key: '2', value: 'oz' },
    { key: '3', value: 'lbs' },
    { key: '4', value: 'grams', },
    { key: '5', value: 'servings' },
  ]

  const [mealName, setMealName] = useState("");
  const [amount, setAmount] = useState("");
  const [measure, setMeasure] = useState("")


  return (
    <Card elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} padding={20} marginTop={20} marginBottom={20}>

      <H5 alignSelf='center' marginBottom={15}>- Meal Item -</H5>
      <Card.Footer>
      </Card.Footer>
      <Card.Background>
      </Card.Background>

      <TextInput backgroundColor="#FFFFFF" borderRadius={10} placeholder='Meal Item Name' placeholderTextColor="#000000" onChangeText={(val) => setMealName(val)}></TextInput>
      <XStack marginTop={10} alignSelf='center'>
        <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='Amount' keyboardType="numeric" placeholderTextColor="#123911" onChangeText={(val) => setAmount(val)}marginRight={10} flex={3}></TextInput>

        <View flex={3}>
          <SelectList
            setSelected={(val) => setMeasure(val)}
            data={foodMeasures}
            save="value"
            placeholder="Select"
            search={false} />
        </View>
      </XStack>

    </Card>
  );


}

export default MealCard;