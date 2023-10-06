import { client } from './pocketbase';
import { getItem } from './localStorage';


async function fetchMyPosts(){
    try {
        const emailOrUsername = await getItem("username");
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

async function likePost(userId, postId){
    try{
        const updatedRecord = await client.collection('posts').update(`${postId}`, {
            "likes+": `${userId}`  // This is a made-up function; replace with whatever Pocketbase provides, if it provides a method like this
        });

        const post = await client.collection('posts').getOne(postId);

        // Check if post was found and has a 'likes' field
        if (!post || !post.likes) {
            return false;
        }

        // Append userId to likes array
        const likesCount = post.likes.length;
        

        const updatedCount = await client.collection('posts').update(`${postId}`, {
            "likeCount": likesCount  // This is a made-up function; replace with whatever Pocketbase provides, if it provides a method like this
        });
        //console.log(updatedRecord);

        if (!updatedRecord || Object.keys(updatedRecord).length == 0) {
            return false;
        } else {
            return true;
        }

    } catch (e){
        console.log(e);
        return false;
    }
}

async function unlikePost(userId, postId){
    try{
        const updatedRecord = await client.collection('posts').update(`${postId}`, {
            "likes-": `${userId}`  // This is a made-up function; replace with whatever Pocketbase provides, if it provides a method like this
        });

        const post = await client.collection('posts').getOne(postId);

        // Check if post was found and has a 'likes' field
        if (!post || !post.likes) {
            return false;
        }

        // Append userId to likes array
        const likesCount = post.likes.length;

        const updatedCount = await client.collection('posts').update(`${postId}`, {
            "likeCount": likesCount  // This is a made-up function; replace with whatever Pocketbase provides, if it provides a method like this
        });
        //console.log(updatedRecord);

        if (!updatedRecord || Object.keys(updatedRecord).length == 0) {
            return false;
        } else {
            return true;
        }

    } catch (e){
        console.log(e);
        return false;
    }
}


export {createNewPost, fetchMyPosts, likePost, unlikePost};
