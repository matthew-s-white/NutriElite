import { client } from './pocketbase';

async function createNewUser(email, username, password, weight){
    const userData = {
        "username": username,
        "email": email,
        "password": password,
        "weight": weight
    }

    console.log(userData);
    const record = await client.collection('users').create(userData);

    console.log(record);
}

export default createNewUser;