import * as React from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, SizableText, XStack, YStack} from 'tamagui';


const ProfileScreen = ({ navigation }) => {
  //get global variable for users weight and kcal
  const cal = 0
  const [userWeight, setUserWeight] = React.useState("0");
  const weightRegex = /^(?:0|[1-9]\d+|)?(?:.?\d{0,1})?$/;
  const weightErrorMsg = "Weight must be a number rounded to one decimal place."
  const [isEditable, setIsEditable] = React.useState(false)


  const submitInfo = () => {
    setIsEditable(!isEditable)
    if(userWeight === '' || !userWeight.match(weightRegex)){
      console.log("weight is invalid");
      showToast(weightErrorMsg);
      return;
    }
    //add call to backend to update weight
  }


    return (
      
      <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen space>
        <Icon  style={{ alignSelf: 'flex-end', padding: 10}} onPress={() => navigation.navigate('Settings')} name="settings-sharp" size={30} color="#2A6329"/>
        <Icon name="person-circle-outline" size={200} color={"#2A6329"} />
        <SizableText size="$6" color="#123911">Username</SizableText>
        <XStack space>
          <YStack marginRight={20} padding={5}>
            <SizableText size="$6" color="#123911" font-weight="bold">WEIGHT</SizableText>
            <XStack>
              {isEditable ? <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={50} keyboardType='numeric' value={userWeight} onChangeText={setUserWeight}></TextInput> : <SizableText size="$5" color="#123911">{userWeight} lbs.</SizableText>}
              <Icon onPress={submitInfo} name="create" size={30} color={"#2A6329"} />
            </XStack>
          </YStack>
          <YStack marginLeft={20} padding={5}>
            <SizableText size="$6" color="#123911" font-weight="bold">AVG CAL/DAY</SizableText>
            <SizableText size="$5" color="#123911">{cal} kcal</SizableText>
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