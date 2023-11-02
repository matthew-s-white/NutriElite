import { YStack } from '@tamagui/stacks';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { getUsers, getFriendRequests } from '../backend/UserManagement'
import { useIsFocused } from '@react-navigation/native';


const FriendRequestScreen = ({ navigation }) => {

  const [selected, setSelected] = React.useState("");
  const [data, setData] = React.useState([]);
  const isFocused = useIsFocused();
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const records = await getUsers();
      
      var users = [];
      for(var i=0; i < records.length; i++) {
        item = {key: '' + i, value: records[i]['username']}
        users.push(item);
      }
      setData(users);
      setSelected('');
      console.log(selected);

      const requests = await getFriendRequests();
      var pending = []
      for(var i=0; i < requests.length; i++) {
          pending.push(requests[i].expand.sender.username);
      }

      console.log(pending);

      
    }
    fetchData();
  }, [isFocused])


  const handleUserClicked = () => {
    navigation.navigate('FriendProfile', {username: selected });
  }

  return (
    <YStack alignItems='center' backgroundColor="#CEFF8F" flex={1} padding={20} fullscreen space>
      {isFocused ?
      <SelectList
        data={data}
        save="value"
        placeholder="Search for users"
        search={true}
        boxStyles={{ borderRadius: 20, width: 300 }}
        maxHeight={130}
        onSelect={handleUserClicked}
        setSelected={setSelected}
      />: null}
    </YStack>
  );
}

export default FriendRequestScreen;
