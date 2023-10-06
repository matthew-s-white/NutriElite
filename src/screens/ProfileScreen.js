import * as React from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, SizableText, XStack, YStack} from 'tamagui';
import { getItem } from '../backend/localStorage';
import { checkUserExists, verifyPassword, getWeight, updateWeight } from '../backend/UserManagement';
import { useIsFocused } from "@react-navigation/native";





const ProfileScreen = ({ navigation }) => {
  //get global variable for users weight and kcal
  const cal = 0
  const [userWeight, setUserWeight] = React.useState();
  const weightRegex = /^(?:0|[1-9]\d+|)?(?:.?\d{0,1})?$/;
  const weightErrorMsg = "Weight must be a number rounded to one decimal place."
  const [isEditable, setIsEditable] = React.useState(false)
  const [username, setUsername] = React.useState("")
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
    fetchData();
  },[isFocused])


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
        <Icon name="person-circle-outline" size={200} color={"#2A6329"} />
        <SizableText size="$6" color="#123911">{username}</SizableText>
        <XStack space>
          <YStack marginRight={20} padding={5}>
            <SizableText size="$6" color="#123911" font-weight="bold">WEIGHT</SizableText>
            <XStack>
              {isEditable ? <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} height={40} width={50} keyboardType='numeric' onChangeText={setUserWeight}></TextInput> : <SizableText size="$5" color="#123911">{userWeight} lbs.</SizableText>}
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