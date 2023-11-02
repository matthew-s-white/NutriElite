import { client } from './pocketbase';
import { setItem } from './localStorage';

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
        //console.log(record);
        await setItem('username', username);
        await setItem('userId',  record.id);
        await setItem('password', record[0].password);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}

async function getWeight(username){
    try{
        const record = await client.collection('users').getFullList({
            filter: `username = "${username}"`
        });
        //console.log(record[0].weight)
        if (record.length == 0){
            return false;
        } else {

            return record[0].weight;
        }
    } catch (e){
        return false;
    }
}

async function updateWeight(userId, weight){
    try{
        const record = await client.collection('users').update(`${userId}`, {
            "weight": `${weight}`
        });
        if (record.length == 0){
            return false;
        } else {
            return true;
        }
    } catch (e){
        console.log(e);
        return false;
    }
}

async function updateUsername(userId, username){
    try{
        const record = await client.collection('users').update(`${userId}`, {
            "username": `${username}`
        });
        if (record.length == 0){
            return false;
        } else {
            await setItem('username', username);
            return true;
        }
    } catch (e){
        console.log(e);
        return false;
    }
}

async function updatePassword(userId, password){
    try{
        const record = await client.collection('users').update(`${userId}`, {
            "password": `${password}`
        });
        if (record.length == 0){
            return false;
        } else {
            await setItem('password', password);
            return true;
        }
    } catch (e){
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
            await setItem('username', record[0].username);
            await setItem('userId',  record[0].id);
            await setItem('password', record[0].password);
            return true;
        }
    } catch (e){
        console.log(e);
        return false;
    }
}

export {createNewUser, checkUserExists, verifyPassword, getWeight, updateWeight, updateUsername, updatePassword};