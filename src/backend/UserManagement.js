import { client } from './pocketbase';
import { setItem, getItem } from './localStorage';

async function checkUserExists(email, username){
    try {
        const record = await client.collection('users').getFullList({
            filter: `email = "${email}" || username = "${username}"`
        });
        if (record.length == 0){
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e);
        return true;
    }
}

async function createNewUser(email, username, password, weight){
    try {
        const userData = {
            "username": username,
            "email": email,
            "password": password,
            "weight": weight
        }
        const record = await client.collection('users').create(userData);
        await setItem("emailOrUsername", username);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}

async function verifyPassword(emailOrUsername, password){
    try {
        const record = await client.collection('users').getFullList({
            filter: `(email = "${emailOrUsername}" || username = "${emailOrUsername}") && password = "${password}"`
        })
        if (record.length == 0){
            return false;
        } else {
            await setItem('emailOrUsername', emailOrUsername);
            return true;
        }
    } catch (e){
        console.log(e);
        return false;
    }
}

export {createNewUser, checkUserExists, verifyPassword};