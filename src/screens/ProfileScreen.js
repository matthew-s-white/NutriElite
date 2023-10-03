import * as React from 'react';
import { Image, Button, YStack, StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { XStack, YStack } from '@tamagui/stacks';
import { SizableText } from '@tamagui/text';

const ProfileScreen = ({ navigation }) => {
  //get global variable for users weight and kcal
  const weight = 0
  const cal = 0
  const [userWeight, setUserWeight] = React.useState(weight);
  const weightRegex = /^(?:0|[1-9]\d+|)?(?:.?\d{0,1})?$/;
  const weightErrorMsg = "Weight must be a number rounded to one decimal place."
  const [isEditable, setIsEditable] = React.useState(false)

  useEffect(() => {
    axios.get('API')
      .then(response => setUserWeight(response.data))
      .catch(error => console.error(error));
  }, []);

  const submitInfo = () => {
    setIsEditable(!isEditable)
    if(weight === '' || !weight.match(weightRegex)){
      console.log("weight is invalid");
      showToast(weightErrorMsg);
      return;
    }
    //add call to backend to update weight
  }


    return (
      <YStack backgroundColor="#CEFF8F">
        <Image
          source={{uri: 'DEFAULT_IMAGE_URL'}}
          style={{width: 100, height: 100, borderRadius: 50}}
        />
      <Text>Username</Text>
      <XStack>
        <YStack>
          <SizableText size="$5" color="#123911">Weight</SizableText>
          <XStack>
            {isEditable ? <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={200} value={userWeight} onChangeText={setUserWeight}></TextInput> : <Text>{userWeight} lbs.</Text>}
            <Button onPress={submitInfo} fontSize={20}>Edit Weight</Button>
          </XStack>
        </YStack>
        <YStack>
          <SizableText size="$5" color="#123911">AVG CAL/DAY</SizableText>
          <Text>{cal}</Text>
        </YStack>
      </XStack>



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