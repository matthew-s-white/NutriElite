import { client } from './pocketbase';
import { getItem } from './localStorage';


async function fetchMyPosts(){
    try {
        const emailOrUsername = await getItem("emailOrUsername");
        console.log(`Fetching posts for ${emailOrUsername} ...`);
        const posts = await client.collection("posts").getFullList({
            filter: `author.email = "${emailOrUsername}" || author.username = "${emailOrUsername}"`,
            expand: "author",
            sort: "-created"
        });
        return posts;
    } catch(e){
        console.log(e);
        return [];
    }
}


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
export {createNewPost, fetchMyPosts};
