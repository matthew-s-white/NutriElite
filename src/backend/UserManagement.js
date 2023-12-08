import { client } from './pocketbase';
import { setItem, getItem } from './localStorage';

async function checkUserExists(email, username) {
    try {
        const record = await client.collection('users2').getFullList({
            filter: `email = "${email}" || username = "${username}"`
        });
        if (record.length == 0) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}


async function createNewUser(email, username, password, weight) {
    try {
        const userData = {
            "username": username,
            "email": email,
            "password": password,
            "passwordConfirm": password,
            "weight": weight
        }
        const record = await client.collection('users2').create(userData);

        console.log(record);
        await setItem('username', username);
        await setItem('userId', record.id);
        await setItem('password', password);

        await addWeight(record.id, weight);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}

async function isVerified(id) {
    try {
        const record = await client.collection('users2').getOne(id);

        //console.log(record[0].weight)
        if (record.length == 0) {
            return false;
        } else {
            console.log(record);
            return record.verified;
        }
    } catch (e) {
        return false;
    }
}

async function sendVerification(email) {
    try {
        const record = await client.collection('users2').requestVerification(email);

        //console.log(record[0].weight)
        if (record.length == 0) {
            return false;
        } else {

            return true;
        }
    } catch (e) {
        return false;
    }
}

async function getWeight(username) {
    try {
        const record = await client.collection('users2').getFullList({
            filter: `username = "${username}"`
        });
        //console.log(record[0].weight)
        if (record.length == 0) {
            return false;
        } else {

            return record[0].weight;
        }
    } catch (e) {
        return false;
    }
}

async function updateWeight(userId, weight) {
    try {
        const record = await client.collection('users2').update(`${userId}`, {
            "weight": `${weight}`
        });
        if (record.length == 0) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function addWeight(userId, weight) {
    try {
        const userData = {
            "user": userId,
            "weight": weight
        }
        const record = await client.collection('weightrecords').create(userData);
        //console.log(record);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getWeights() {
    try {
        const emailOrUsername = await getItem("username");
        const weights = await client.collection("weightrecords").getFullList({
            filter: `user.email = "${emailOrUsername}" || user.username = "${emailOrUsername}"`,
            sort: "+created"
        });
        return weights;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function updateUsername(userId, username) {
    try {
        const record = await client.collection('users2').update(`${userId}`, {
            "username": `${username}`
        });
        if (record.length == 0) {
            return false;
        } else {
            await setItem('username', username);
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function updatePasswordWithEmail() {
    try {
        const username = await getItem("username");
        const email = await getUserEmail(username);
        const record = await client.collection('users2').requestPasswordReset(email);

        if (record.length == 0) {
            return false;
        } else {
            await setItem('username', username);
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function updatePassword(userId, password) {
    try {
        const record = await client.collection('users2').update(`${userId}`, {
            "password": `${password}`
        });
        if (record.length == 0) {
            return false;
        } else {
            await setItem('password', password);
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}


async function verifyPassword(emailOrUsername, password) {
    try {
        // const record = await client.collection('users').getFullList({
        //     filter: `(email = "${emailOrUsername}" || username = "${emailOrUsername}") && password = "${password}"`
        // })
        const record = await client.collection('users2').authWithPassword(
            emailOrUsername,
            password,
        );

        console.log("in verify password")
        console.log(record);
        if (record.length == 0) {
            return false;
        }
        await setItem('username', record.record.username);
        await setItem('userId', record.record.id);
        await setItem('password', password);
        console.log(await getItem('username'));
        console.log(await getItem('userId'));
        console.log(await getItem('password'));


        return true;

    } catch (e) {
        console.log(e);
        return false;
    }
}


async function deleteAccount(userId) {
    try {
        const record = await client.collection('users2').delete(`${userId}`);
        if (record.length == 0) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}


async function getUsers() {
    try {
        const username = await getItem("username");
        const record = await client.collection('users2').getFullList({
            filter: `username != "${username}"`
        });
        if (record.length == 0) {
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
        const record = await client.collection('users2').getFullList({
            filter: `username = "${username}"`
        });

        if (record.length == 0){
            return null;
        } else {
            return record[0]['id'];
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function getUserEmail(username) {
    try {
        const record = await client.collection('users2').getFullList({
            filter: `username = "${username}"`
        });
        if (record.length == 0) {
            return false;
        } else {
            return record[0]['email'];
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
        if (record.length == 0 && record2.length == 0) {
            return 1;
        }

        if (record.length == 1 && record2.length == 0) {
            // user has sent a request that has not been accepted
            if (record[0]['accepted'] == false) {
                return 2;
            }
            // user is friends
            return 4;
        }

        if (record.length == 0 && record2.length == 1) {
            // user is receiving a request that has not been accepted
            if (record2[0]['accepted'] == false) {
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

    } catch (e) {
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
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteFriend(userId, friendId) {
    try {
        const record = await client.collection('friends').getFullList({
            filter: `sender = "${userId}" && recipient = "${friendId}"`
        });

        // check if user has an incoming request
        const record2 = await client.collection('friends').getFullList({
            filter: `sender = "${friendId}" && recipient = "${userId}"`
        });

        if (record.length == 0) {
            const request = await client.collection('friends').getFullList({
                filter: `sender = "${friendId}" && recipient = "${userId}"`
            })

            const requestId = request[0]['id']
            //console.log(requestId);

            await client.collection('friends').delete(requestId);
        }
        else {
            const request = await client.collection('friends').getFullList({
                filter: `sender = "${userId}" && recipient = "${friendId}"`
            })

            const requestId = request[0]['id']
            //console.log(requestId);

            await client.collection('friends').delete(requestId);
        }


    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getFriendRequests() {
    try {
        const userId = await getItem('userId');
        const request = await client.collection('friends').getFullList({
            filter: `recipient = "${userId}" && accepted = false`,
            expand: "sender",
            sort: "-created"
        })

        console.log(request);
        return request;

    } catch (e) {
        console.log(e);
        return null;
    }

}

export { createNewUser, updatePasswordWithEmail, getUserEmail, checkUserExists, verifyPassword, sendVerification, isVerified, getWeight, updateWeight, addWeight, getWeights, updateUsername, updatePassword, deleteAccount, getUsers, getUserId, getFriendStatus, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests, deleteFriend };
