import AsyncStorage from '@react-native-community/async-storage';

async function setItem(key, value){
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {console.log(error);}
}

async function getItem(key){
    try {
        const item = await AsyncStorage.getItem(key);
        return item;
    } catch (error) {console.log(error);}
}

async function removeItem(key){
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {console.log(error);}
}


export {setItem, getItem, removeItem};