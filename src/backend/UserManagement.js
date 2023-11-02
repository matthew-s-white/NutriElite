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
        return false;
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
            return true;
        }
    } catch (e){
        console.log(e);
        return false;
    }
}

async function getUsers() {
    try {
        const username = await getItem("username");
        const record = await client.collection('users').getFullList({
            filter: `username != "${username}"`
        });
        if (record.length == 0){
            return false;
        } else {
            return record;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getUserId(username) {
    try {
        const record = await client.collection('users').getFullList({
            filter: `username = "${username}"`
        });
        if (record.length == 0){
            return false;
        } else {
            return record[0]['id'];
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getFriendStatus(senderId, recipientId) {
    try {
        // check if user has sent a request
        const record = await client.collection('friends').getFullList({
            filter: `sender = "${senderId}" && recipient = "${recipientId}"`
        });

        // check if user has an incoming request
        const record2 = await client.collection('friends').getFullList({
            filter: `sender = "${recipientId}" && recipient = "${senderId}"`
        });

        //console.log(record);
        //console.log(record2);

        // not friends
        if (record.length == 0 && record2.length == 0){
            return 1;
        }

        if(record.length == 1 && record2.length == 0) {
            // user has sent a request that has not been accepted
            if(record[0]['accepted'] == false) {
                return 2;
            }
            // user is friends
            return 4;
        }

        if(record.length == 0 && record2.length == 1) {
            // user is receiving a request that has not been accepted
            if(record2[0]['accepted'] == false) {
                return 3;
            }
            // user is friends
            return 4;
        }


    } catch (e) {
        console.log(e);
        return null;
    }
}

async function sendFriendRequest(senderId, recipientId) {
    try {
        const data = {
            "sender": senderId,
            "recipient": recipientId,
            "accepted": false
        };

        const record = await client.collection('friends').create(data);
        //console.log(record);
        
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function acceptFriendRequest(senderId, recipientId) {
    try {
        const request = await client.collection('friends').getFullList({
            filter: `sender = "${senderId}" && recipient = "${recipientId}"`
        })

        const requestId = request[0]['id']
        //console.log(requestId);

        const data = {
            "sender": senderId,
            "recipient": recipientId,
            "accepted": true
        };
        
        const record = await client.collection('friends').update(requestId, data);
        return true;

    } catch(e) {
        console.log(e);
        return false;
    }
}

async function declineFriendRequest(senderId, recipientId) {
    try {
        const request = await client.collection('friends').getFullList({
            filter: `sender = "${senderId}" && recipient = "${recipientId}"`
        })

        const requestId = request[0]['id']
        //console.log(requestId);

        await client.collection('friends').delete(requestId);
    } catch(e) {
        console.log(e);
        return false;
    }
}

async function getFriendRequests() {
    try {
        const userId = await getItem('userId');
        const request = await client.collection('friends').getFullList({
            filter: `recipient = "${userId}" && accepted = false`,
            expand: "sender"
        })

        console.log(request);
        return request;

    } catch(e) {
        console.log(e);
        return null;
    }

}

export {createNewUser, checkUserExists, verifyPassword, getWeight, updateWeight, updateUsername, getUsers, getUserId, getFriendStatus, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests};