import * as React from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack} from 'tamagui';
import { TextInput } from 'react-native';


const HomeScreen = ({ navigation }) => {
  return (
    <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen>
      <Button minWidth={200} padding={30} marginTop="$5" color="#123911" onPress={() => navigation.navigate('CreatePost')} size="$6">+</Button>
    </YStack>
  );
}

export default HomeScreen;
