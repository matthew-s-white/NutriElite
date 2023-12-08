import * as React from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, Modal, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme, Button, SizableText, XStack, YStack, H4, H5, Switch } from 'tamagui';
import { getItem } from '../backend/localStorage';
import { checkUserExists, verifyPassword, getWeight, getUserId, getFriendStatus, sendFriendRequest, deleteFriend, getFriendWeights } from '../backend/UserManagement';
import { useIsFocused } from "@react-navigation/native";
import { getFriendPosts } from '../backend/PostManagement';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../components/Post';
import { acceptFriendRequest, declineFriendRequest } from '../backend/UserManagement';
import { LineChart } from 'react-native-chart-kit';


const FriendProfileScreen = ({ navigation, route }) => {
    //get global variable for users weight and kcal
    const [profileCals, setProfileCals] = React.useState(0);
    const friendUsername = route.params.username;
    const [friendWeight, setFriendWeight] = React.useState();
    const isFocused = useIsFocused();
    const [status, setStatus] = React.useState('');
    const [friendPosts, setFriendPosts] = React.useState([]);

    const [userId, setUserId] = React.useState('');
    const [friendId, setFriendId] = React.useState('');
    const [accepted, setAccepted] = React.useState(false);
    // 1 = not friends, 2 = user has sent a pending request, 3 = user has incoming request, 4 = friends

    const [deleteFriendModal, setDeleteFriendModal] = React.useState(false); // state var gto determine whether to put the pop-up or not

    const [weights, setWeights] = React.useState([]);
    const [calorieIntake, setCalorieIntake] = React.useState([]);
    const [proteinIntake, setProteinIntake] = React.useState([]);
    const [carbIntake, setCarbIntake] = React.useState([]);
    const [fatIntake, setFatIntake] = React.useState([]);

    const [content, setContent] = React.useState('posts');

    const [chartConfig, setChartConfig] = React.useState({
        backgroundColor: '#2A6329',
        backgroundGradientFrom: '#2A6329',
        backgroundGradientTo: '#2A6329',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    });

    React.useEffect(() => {
        async function fetchData() {
            //console.log("ive been triggered")
            const weight = await getWeight(friendUsername);
            setFriendWeight(weight);

            const weightProgress = await getFriendWeights(friendUsername);
            //console.log(weightProgress);
            if (weightProgress == false) {
                console.log("weights not retrieved");
            } else {

                const chartData = {
                    labels: weightProgress.map(item => formatDate(item.created)), // Map 'created' for labels
                    datasets: [{
                        data: weightProgress.map(item => item.weight) // Map 'weight' for dataset data
                    }]
                };
                setWeights(chartData);
            }



            const id1 = await getItem('userId');
            setUserId(id1);
            const id2 = await getUserId(friendUsername);
            setFriendId(id2);

            let requestStatus;
            if (id1 === id2) {
                requestStatus = 4;
                setStatus(requestStatus);
            } else {
                requestStatus = await getFriendStatus(id1, id2);
                console.log(requestStatus);
                setStatus(requestStatus);
            }

            if (requestStatus == 4) {
                const posts = await getFriendPosts(id2);
                setFriendPosts(posts);

                var i;
                var dates = [];
                var dailyCalories = [];
                var dailyProtein = [];
                var dailyCarbs = [];
                var dailyFat = [];

                var prevDate = null;
                var calories = 0;
                var protein = 0;
                var carbs = 0;
                var fat = 0;

                for (i = posts.length - 1; i >= 0; i--) {
                    var curr = posts[i];
                    if (curr['postType'] == 'meal') {
                        // first day
                        if (prevDate == null) {

                            prevDate = formatDate(curr['created']);
                            calories = curr['calories'];
                            protein = curr['protein'];
                            carbs = curr['carbs'];
                            fat = curr['fat'];
                        }
                        else {
                            // start new day
                            if (prevDate != formatDate(curr['created'])) {
                                dates.push(prevDate);
                                dailyCalories.push(calories);
                                dailyProtein.push(protein);
                                dailyCarbs.push(carbs);
                                dailyFat.push(fat);

                                prevDate = formatDate(curr['created']);
                                calories = curr['calories']
                                protein = curr['protein'];
                                carbs = curr['carbs'];
                                fat = curr['fat'];
                            }
                            else { // add to same day
                                calories += curr['calories']
                                protein += curr['protein'];
                                carbs += curr['carbs'];
                                fat += curr['fat'];
                            }
                        }
                    }
                }
                // log last date
                dates.push(prevDate);
                dailyCalories.push(calories);
                dailyProtein.push(protein);
                dailyCarbs.push(carbs);
                dailyFat.push(fat);

                //console.log(dates);
                //console.log(dailyCalories);


                const calorieData = {
                    labels: dates,
                    datasets: [{
                        data: dailyCalories
                    }]
                };

                const proteinData = {
                    labels: dates,
                    datasets: [{
                        data: dailyProtein
                    }]
                };

                const carbsData = {
                    labels: dates,
                    datasets: [{
                        data: dailyCarbs
                    }]
                };

                const fatData = {
                    labels: dates,
                    datasets: [{
                        data: dailyFat
                    }]
                };

                setCalorieIntake(calorieData);
                setProteinIntake(proteinData);
                setCarbIntake(carbsData);
                setFatIntake(fatData);
                //console.log(calorieIntake);

                var j;
                var total = 0;
                for (j = 0; j < dailyCalories.length; j++) {
                    total += dailyCalories[j];
                }

                //console.log(Math.round(total / dates.length))
                setProfileCals(Math.round(total / dates.length))
            }
        }
        fetchData();
    }, [isFocused, accepted])

    const showToast = (msg) => {
        ToastAndroid.show(`Error: ${msg}`, ToastAndroid.LONG);
    };

    const handleAddFriend = () => {
        setStatus(2);
    }

    const acceptRequest = () => {
        setStatus(4);
    }

    const declineRequest = () => {
        setStatus(1);
    }

    const removeFriend = () => {
        setStatus(1);
        setDeleteFriendModal(false);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`; // Converts to MM/DD format
    }

    React.useEffect(() => {
        async function updateDatabase() {

            if (status == 2) {
                // check what current status is (if a request has already been sent)
                const currStatus = await getFriendStatus(userId, friendId);

                if (currStatus == 1) {
                    await sendFriendRequest(userId, friendId);
                }
            }
            else if (status == 4) {
                const currStatus = await getFriendStatus(userId, friendId);

                if (currStatus == 3) {
                    await acceptFriendRequest(friendId, userId);
                    setAccepted(true);
                }

            }
            else if (status == 1) {
                const currStatus = await getFriendStatus(userId, friendId);

                if (currStatus == 3) {
                    await declineFriendRequest(friendId, userId);
                }

                // remove friend
                if (currStatus == 4) {
                    await deleteFriend(userId, friendId);
                }
            }
        }
        updateDatabase();
    }, [status]);

    const handleSwitch = (checked) => {
        if (checked) {
            setContent("graphs");
        }
        else {
            setContent("posts");
        }
    }



    return (

        <YStack alignItems='center' backgroundColor="#CEFF8F" fullscreen space>
            <SafeAreaView width="100%">
                <ScrollView width="100%">
                    <Icon style={{ alignSelf: 'flex-start', padding: 10 }} onPress={() => navigation.goBack(null)} name="arrow-back" size={30} color="#2A6329" />

                    <XStack style={{ alignSelf: 'center' }} marginBottom={15} space>
                        <YStack>
                            <Icon style={{ alignSelf: 'center', paddingLeft: 0 }} name="person-circle-outline" size={150} color={"#2A6329"} />
                            <SizableText size="$6" color="#123911" paddingLeft="$10">{friendUsername}</SizableText>
                        </YStack>
                        <YStack style={{ alignSelf: 'center' }} padding={10}>
                            <YStack style={{ alignSelf: 'center' }} paddingBottom={15}>
                                <SizableText size="$6" color="#123911" font-weight="bold">WEIGHT</SizableText>
                                <SizableText alignSelf='center' size="$5" color="#123911">{friendWeight} lbs.</SizableText>
                            </YStack>
                            <SizableText style={{ alignSelf: 'center' }} size="$6" color="#123911" font-weight="bold">AVG CAL/DAY</SizableText>
                            <SizableText style={{ alignSelf: 'center' }} size="$5" color="#123911">{profileCals} kcal</SizableText>
                        </YStack>
                    </XStack>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={deleteFriendModal}
                        onRequestClose={() => {
                            setDeleteFriendModal(!deleteFriendModal);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.label}>Are you sure you want to remove this user as a friend?</Text>

                                <Button style={styles.button} onPress={removeFriend}>Remove Friend</Button>
                                <Button style={styles.button} onPress={() => setDeleteFriendModal(false)}>Cancel</Button>
                            </View>
                        </View>
                    </Modal>

                    {status == 1 ?
                        <Theme name="dark_green">
                            <Button style={{ alignSelf: 'center' }} onPress={handleAddFriend} fontSize={18} iconAfter={<Icon elevate name="people-outline" color="white" size={25} />}>Add Friend</Button>
                        </Theme> : null}

                    {status == 2 ?
                        <Theme name="dark_green">
                            <Button disabled style={{ alignSelf: 'center' }} fontSize={18} color="#ABF7B1" iconAfter={<Icon elevate name="send-outline" color="#ABF7B1" size={25} />}>Request Sent!</Button>
                        </Theme> : null}

                    {status == 3 ?
                        <Theme name="dark_green">
                            <XStack style={{ alignSelf: 'center' }} space>
                                <Button onPress={acceptRequest} fontSize={18} iconAfter={<Icon elevate name="checkmark-outline" color="white" size={25} />}>Accept</Button>
                                <Button onPress={declineRequest} fontSize={18} iconAfter={<Icon elevate name="close-outline" color="white" size={25} />}>Decline</Button>
                            </XStack>
                        </Theme> : null}


                    {status == 4 ?
                        <Theme name="dark_green" >
                            <Button style={{ alignSelf: 'center', margin: 15 }} onPress={() => setDeleteFriendModal(true)} fontSize={18} iconAfter={<Icon elevate name="person-remove-outline" color="white" size={25} />}>Remove Friend</Button>
                        </Theme>
                        : null}

                    {status == 4 ?
                        <XStack alignSelf='center' flex={1} marginVertical={15}>
                            {content == "posts" ?
                                <H4 paddingLeft={20} paddingRight={20} style={{ fontWeight: "bold" }}>POSTS</H4>
                                :
                                <H4 paddingLeft={20} paddingRight={20}>POSTS</H4>}

                            <Switch backgroundColor="#A7D36F" size="$5" width={125} onCheckedChange={(checked) => handleSwitch(checked)}>
                                <Switch.Thumb backgroundColor="#123911" animation="lazy" />
                            </Switch>
                            {content == "graphs" ?
                                <H4 paddingLeft={20} paddingRight={20} style={{ fontWeight: "bold" }}>STATS</H4>
                                :
                                <H4 paddingLeft={20} paddingRight={20}>STATS</H4>}
                        </XStack>
                        : null}




                    {status == 4 && content == "posts" ?
                        friendPosts.map((post, index) => {
                            return <Post key={index} image={post.image} id={post.id} author={post.expand.author.username} content={post.content} postType={post.postType} likeCount={post.likeCount} calories={post.calories} protein={post.protein} carbs={post.carbs} fat={post.fat} navigation={navigation} />
                        }) : null}

                    {status == 4 && content == "graphs" ?
                        <YStack space>
                            {weights.datasets && weights.datasets.length > 0 && (
                                    <YStack alignItems='center'>
                                        <H5 style={{ fontWeight: "bold" }}>WEIGHT TRACKER</H5>
                                        <View marginVertical={5} style={{
                                            borderRadius: 20, // Adjust the value as needed
                                            overflow: 'hidden', // This is important to make borderRadius work
                                            backgroundColor: 'white' // Set the background color as needed
                                        }}>
                                            <LineChart
                                                data={weights}
                                                width={350}
                                                height={300}
                                                verticalLabelRotation={30}
                                                chartConfig={chartConfig}
                                                bezier
                                            />
                                        </View>
                                    </YStack>
                                )
                            }


                            {calorieIntake.datasets && calorieIntake.datasets.length > 0 && (
                                <YStack alignItems='center'>
                                    <H5 style={{ fontWeight: "bold" }}>CALORIE TRACKER</H5>
                                    <View marginVertical={5} style={{
                                        borderRadius: 20, // Adjust the value as needed
                                        overflow: 'hidden', // This is important to make borderRadius work
                                        backgroundColor: 'white' // Set the background color as needed
                                    }}>
                                        <LineChart
                                            data={calorieIntake}
                                            width={350}
                                            height={300}
                                            verticalLabelRotation={30}
                                            chartConfig={chartConfig}
                                            bezier
                                        />
                                    </View>
                                </YStack>
                            )}

                            {proteinIntake.datasets && proteinIntake.datasets.length > 0 && (
                                <YStack alignItems='center'>
                                    <H5 style={{ fontWeight: "bold" }}>PROTEIN TRACKER</H5>
                                    <View marginVertical={5} style={{
                                        borderRadius: 20, // Adjust the value as needed
                                        overflow: 'hidden', // This is important to make borderRadius work
                                        backgroundColor: 'white' // Set the background color as needed
                                    }}>
                                        <LineChart
                                            data={proteinIntake}
                                            width={350}
                                            height={300}
                                            verticalLabelRotation={30}
                                            chartConfig={chartConfig}
                                            bezier
                                        />
                                    </View>
                                </YStack>
                            )}

                            {carbIntake.datasets && carbIntake.datasets.length > 0 && (
                                <YStack alignItems='center'>
                                    <H5 style={{ fontWeight: "bold" }}>CARB TRACKER</H5>
                                    <View marginVertical={5} style={{
                                        borderRadius: 20, // Adjust the value as needed
                                        overflow: 'hidden', // This is important to make borderRadius work
                                        backgroundColor: 'white' // Set the background color as needed
                                    }}>
                                        <LineChart
                                            data={carbIntake}
                                            width={350}
                                            height={300}
                                            verticalLabelRotation={30}
                                            chartConfig={chartConfig}
                                            bezier
                                        />
                                    </View>
                                </YStack>
                            )}

                            {fatIntake.datasets && fatIntake.datasets.length > 0 && (
                                <YStack alignItems='center'>
                                    <H5 style={{ fontWeight: "bold" }}>FAT TRACKER</H5>
                                    <View marginVertical={5} style={{
                                        borderRadius: 20, // Adjust the value as needed
                                        overflow: 'hidden', // This is important to make borderRadius work
                                        backgroundColor: 'white' // Set the background color as needed
                                    }}>
                                        <LineChart
                                            data={fatIntake}
                                            width={350}
                                            height={300}
                                            verticalLabelRotation={30}
                                            chartConfig={chartConfig}
                                            bezier
                                        />
                                    </View>
                                </YStack>
                            )} 
                            </YStack> : null}


                </ScrollView>

            </SafeAreaView>

        </YStack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
    },
    button: {
        marginBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'stretch',
        elevation: 5,
    },
});

export default FriendProfileScreen;
