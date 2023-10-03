import * as React from 'react';
import { useState } from 'react';
import { Theme, Button, Form, YStack, SizableText, XStack, Card, CardProps, H4, H3, H6, H5, H2, H1, H7, Image, Paragraph, Switch, Select, Adapt, Sheet, View } from 'tamagui';
import { TextInput } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

const ExerciseCard = () => {
    const workoutMeasures = [
        { key: '1', value: 'reps', },
        { key: '2', value: 'seconds' },
    ]

    const weightMeasures = [
        { key: '1', value: 'lbs', },
        { key: '2', value: 'kg' },
    ]

    const [setNum, setSetNum] = useState('');
    const [exerciseName, setExerciseName] = useState('');
    const [repsNum, setRepsNum] = useState('');
    const [measure, setMeasure] = useState('');
    const [weightNum, setWeightNum] = useState('');
    const [weightType, setWeightType] = useState('');

    return (
        <Card elevate backgroundColor="#A7D36F" marginLeft={10} marginRight={10} padding={20} marginTop={20} marginBottom={20}>
            <H5 alignSelf='center' marginBottom={15}>- Exercise -</H5>
            <Card.Footer>
            </Card.Footer>
            <Card.Background>
            </Card.Background>

            <XStack>
                <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='# Sets' keyboardType="numeric" placeholderTextColor="#123911" marginRight={10} flex={2} onChangeText={(val) => setSetNum(val)}></TextInput>
                <H6 marginTop={10} marginRight={10}>sets of</H6>
                <TextInput backgroundColor="#FFFFFF" borderRadius={10} placeholder='Exercise Name' placeholderTextColor="#000000" flex={5} onChangeText={(val) => setExerciseName(val)}></TextInput>
            </XStack>

            <XStack marginTop={15} alignSelf='center'>
                <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='Amount' onChangeText={(val) => setRepsNum(val)} keyboardType="numeric" placeholderTextColor="#123911" marginRight={5} flex={4}></TextInput>
                <View flex={7}>
                    <SelectList
                        setSelected={(val) => setMeasure(val)}
                        data={workoutMeasures}
                        save="value"
                        placeholder="Select"
                        search={false} />
                </View>
                <TextInput backgroundColor="#FFFFFF" color="#000000" borderRadius={10} placeholder='Weight' keyboardType="numeric" onChangeText={(val) => setWeightNum(val)}placeholderTextColor="#123911" marginLeft={10} marginRight={5} flex={3}></TextInput>
                <View flex={6}>
                    <SelectList
                        setSelected={(val) => setWeightType(val)}
                        data={weightMeasures}
                        save="value"
                        placeholder="Select"
                        search={false} />
                </View>
            </XStack>


        </Card>
    )
}

export default ExerciseCard;