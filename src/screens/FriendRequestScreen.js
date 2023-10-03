import { YStack } from '@tamagui/stacks';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'



const FriendRequestScreen = ({ navigation }) => {

  const [selected, setSelected] = React.useState("");
  const [data,setData] = React.useState([]);
  
  /*React.useEffect(() => 
    //Get Values from database
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        // Store Values in Temporary Array
        let newArray = response.data.map((item) => {
          return {key: item.id, value: item.name}
        })
        //Set Data Variable
        setData(newArray)
      })
      .catch((e) => {
        console.log(e)
      })
  ,[])*/

    return (
      <YStack alignItems='center' backgroundColor="#CEFF8F" flex={1} padding={20} fullscreen space> 
        <SelectList
          setSelected={(val) => setSelected(val)} 
          data={data} 
          save="value"
          placeholder="Search for users"
          search={true}
          boxStyles={{borderRadius:10}}
        />
        <Text>This is the friendrequest screen</Text>
      </YStack>
    );
}

export default FriendRequestScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })