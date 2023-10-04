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

export {fetchMyPosts};