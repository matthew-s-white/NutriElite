const welcomeMealMessage = 
`Hey, I'm Saturn a nutrition chatbot tool!\n
Try messaging me with one of the following prompts:\n
\t-"Generate a meal plan..."\n
\t-"Search for a recipe..."\n
\t-"Calculate the nutrition\n\t of..."`;

const welcomeWorkoutMessage = 
`Hey, I'm Saturn a nutrition chatbot tool!\n
Try messaging me with one of the following prompts:\n
\t-"Generate a workout\n\t for..."\n
\t-"What is a (beginner/\n\tintermediate/expert)\n\t exercise for..."`

function nutritionAnalysisPrintable(nutritionInfo){
    let nutrients = "\n";
    for(item in nutritionInfo.totalNutrients){
        nutrients += ("\t" + nutritionInfo.totalNutrients[item].label + ": " + Math.round(nutritionInfo.totalNutrients[item].quantity) + nutritionInfo.totalNutrients[item].unit + "\n");
    }
    return nutrients;
}

async function fetchMealResponse(msgType, mealMessage) {
    try {
        const reqBody = 
        {
            "options": {
                "calls": [
                msgType
                ]
            },
            "exchange": [
                {
                "query": mealMessage
                }
            ]
        };
        let app_id;
        let app_key;
        if(msgType == "calculate_nutrients" || msgType == "calculate_meal_plan"){
            app_id = "5335ef9f";
            app_key = "5c158cc1bc71ea2cbb8744b483d588d2";
        } else if(msgType == "search"){
            app_id = "9184cc32";
            app_key = "e0a8c77234a6cd616a507048dc3f5a96";
        }
        const res = await fetch(`https://api.edamam.com/api/assistant/v1/query?app_id=${app_id}&app_key=${app_key}`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(reqBody)
        });
        if(res.status == 200){
            const response = await res.json();
            const responseInfo = response.request;
            console.log(responseInfo);
            const res2 = await fetch("https://api.edamam.com" + responseInfo.uri + `&app_id=${app_id}&app_key=${app_key}`, {
                "method": responseInfo.method,
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify({"ingr": responseInfo.body.ingr})
            });

            const nutritionInfo = await res2.json();
            console.log(nutritionInfo);
            
            console.log("Here's what I found for the nutrition analysis of " + responseInfo.body.ingr.join(", ") + ":\n" + nutritionAnalysisPrintable(nutritionInfo));
            return ("Here's what I found for the nutrition analysis of " + responseInfo.body.ingr.join(", ") + ":\n" + nutritionAnalysisPrintable(nutritionInfo));
        } else {
            console.log(res);
            if(res.status == 400 || res.status == 502){
                return ("Apologies, but I couldn't provide a sure answer to your query.")
            }
            return ("Unfortunately our meal chatbot is experiencing some issues at the moment, please try again later.");
        }
    } catch (e) {
        console.log(e);
        return ("Fatal error.");
    }
}

export {fetchMealResponse, welcomeMealMessage, welcomeWorkoutMessage};