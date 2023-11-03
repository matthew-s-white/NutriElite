import { YStack } from '@tamagui/stacks';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { getUsers, getFriendRequests } from '../backend/UserManagement'
import { useIsFocused } from '@react-navigation/native';
import { H1, H5 } from 'tamagui';
import Request from '../components/Request';


const FriendRequestScreen = ({ navigation }) => {

  const [selected, setSelected] = React.useState("");
  const [data, setData] = React.useState([]);
  const isFocused = useIsFocused();
  const [requests, setRequests] = React.useState([]);
  const [dummy, setDummy] = React.useState(0);

  React.useEffect(() => {
    async function fetchData() {
      const records = await getUsers();

      var users = [];
      for (var i = 0; i < records.length; i++) {
        item = { key: '' + i, value: records[i]['username'] }
        users.push(item);
      }
      setData(users);
      setSelected('');
      //console.log(selected);

      const requestsdb = await getFriendRequests();
      var pending = []
      for (var i = 0; i < requestsdb.length; i++) {
        pending.push(requestsdb[i].expand.sender.username);
      }

      console.log(pending);

      setRequests(pending);


    }
    fetchData();
  }, [isFocused, dummy])


  const handleUserClicked = () => {
    navigation.navigate('FriendProfile', { username: selected });
  }

  const increment = () => {
    setDummy(dummy + 1);
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
        /> : null}

      {requests.length == 0 ? 
      <H5 margin={15} alignSelf='center'>No pending friend requests.</H5> :
      requests.map((request, index) => {
        return <Request key={index} username={request} func={increment} />
      })}

    </YStack>
  );
}

export default FriendRequestScreen;
