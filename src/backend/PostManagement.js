import { client } from './pocketbase';

async function createNewPost(content, author, postType){
    try {

        const postData = {
            "content": content,
            "author": author,
            "postType": postType,
            "likeCount": 0
        }
    
        const record = await client.collection('posts').create(postData);
    
        console.log(record);
        return true;
    } catch(e) {
        console.log(e)
        return false;
    }
}
export {createNewPost};