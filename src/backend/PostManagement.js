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

async function fetchNutritionInfo(foodText){
    try {
        const foods = {"ingr": foodText.split("\n")};
        const res = await fetch("https://api.edamam.com/api/nutrition-details?app_id=5335ef9f&app_key=5c158cc1bc71ea2cbb8744b483d588d2", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(foods)
        });
        if(res.status === 555){
            return 5;
        }
        const nutritionInfo = await res.json();
        const retInfo = {
            "calories": Math.round(nutritionInfo.totalNutrients.ENERC_KCAL.quantity),
            "protein": Math.round(nutritionInfo.totalNutrients.PROCNT.quantity),
            "carbs": Math.round(nutritionInfo.totalNutrients.CHOCDF.quantity),
            "fat": Math.round(nutritionInfo.totalNutrients.FAT.quantity)
        }
        return retInfo;
    } catch (e) {
        console.log(e);
        return 2;
    }
}


async function createNewPost(content, author, postType, nutritionFacts){
    try {
        let postData = {
            "content": content,
            "author": author,
            "postType": postType
        };
        if (nutritionFacts.calories !== "0"){
            postData = {
                "content": content,
                "author": author,
                "postType": postType,
                "calories": nutritionFacts.calories,
                "protein": nutritionFacts.protein,
                "carbs": nutritionFacts.carbs,
                "fat": nutritionFacts.fat
            }
        }
    
        const record = await client.collection('posts').create(postData);
    
        console.log(record);
        return true;
    } catch(e) {
        console.log(e)
        return false;
    }
}
export {createNewPost, fetchMyPosts, fetchNutritionInfo};
