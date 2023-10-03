import * as React from 'react';
import { Image, Button, FlatList, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userWeight, setUserWeight] = useState(0);

  useEffect(() => {
    axios.get('API')
      .then(response => setUserWeight(response.data))
      .catch(error => console.error(error));
  }, []);


    return (
      <View style={styles.container}>
         <TouchableOpacity onPress={chooseImage}>
        <Image
          source={profilePhoto || {uri: 'DEFAULT_IMAGE_URL'}}
          style={{width: 100, height: 100, borderRadius: 50}}
        />
      </TouchableOpacity>
      <Text>Username</Text>

      </View>
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