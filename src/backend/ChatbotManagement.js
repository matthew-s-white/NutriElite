const welcomeMealMessage = 
`Hey, I'm Saturn a nutrition chatbot tool!\n
Try messaging me with one of the following prompts:\n
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

function mealPrintable(meal){
    let result = "";
    if(meal.sections){
        const keys = Object.keys(meal.sections);
        let courseIter = 0;
        result += "\n";
        for(course in meal.sections){
            result += (keys[courseIter] + ": " + meal.sections[course].assigned + "\n");
            courseIter++;
        }
    } else {
        result += (meal.assigned + "\n");
    }
    return result;
}

function mealPlanPrintable(mealPlan){
    let response = "\n";
    let dayCount = 1;
    for(item in mealPlan.selections){
        response += `Day ${dayCount}:\n`;
        dayCount++;

        const keys = Object.keys(mealPlan.selecitons[item].sections);
        let mealIter = 0;
        for(meal in mealPlan.selections[item].sections){
            console.log(keys[mealIter] + ": " + mealPrintable(mealPlan.selections[item].sections[meal]));
            mealIter++;
        }
        response += "\n";
    }
    return response;
}

function recipesPrintable(recipes){
    console.log("we doing something");
    let response = [];
    let recipeCount = 0;
    for(recipe in recipes.hits){
        response[recipeCount] = {
            title: `Recipe #${recipeCount + 1}: ${recipes.hits[recipe].recipe.label}`,
            url: recipes.hits[recipe].recipe.shareAs,
            content: `Servings: ${recipes.hits[recipe].recipe.yield}\nCalories: ${Math.round(recipes.hits[recipe].recipe.calories)}\nProtein: ${Math.round(recipes.hits[recipe].recipe.totalNutrients.PROCNT.quantity)}\n`
        };
        recipeCount++;
        if(recipeCount > 3){
            break;
        }
    }
    return response;
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
        if(msgType == "calculate_nutrients"){
            app_id = "5335ef9f";
            app_key = "5c158cc1bc71ea2cbb8744b483d588d2";
        } else if(msgType == "search"){
            app_id = "9184cc32";
            app_key = "e0a8c77234a6cd616a507048dc3f5a96";
        } else if(msgType == "calculate_meal_plan"){
            app_id = "940ca3cf";
            app_key = "61a320447d86a65ce597c2aa04cd1af3";
        }
        const res = await fetch(`https://api.edamam.com/api/assistant/v1/query?app_id=${app_id}&app_key=${app_key}`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Edamam-Account-User": msgType == "calculate_meal_plan" ? "white753": undefined,
            },
            "body": JSON.stringify(reqBody)
        });
        if(res.status == 200){
            const response = await res.json();
            const responseInfo = response.request;
            if(msgType == "search"){
                responseInfo.uri = responseInfo.uri.substring(0, responseInfo.uri.indexOf("q=")) + "type=public&" + responseInfo.uri.substring(responseInfo.uri.indexOf("q="));
            }
            console.log(responseInfo);
            console.log(JSON.stringify(responseInfo.body));
            let apiFetch = "https://api.edamam.com" + responseInfo.uri + `&app_id=${app_id}&app_key=${app_key}`;
            if(msgType == "calculate_meal_plan"){
                apiFetch = "https://api.edamam.com/api" + responseInfo.uri;
            }
            const res2 = await fetch(apiFetch, {
                "method": responseInfo.method,
                "headers": {
                    "Content-Type": "application/json",
                    "Edamam-Account-User": msgType == "calculate_meal_plan" ? "white753": undefined,
                },
                "body": responseInfo.body ? JSON.stringify(responseInfo.body) : undefined
            });

            const nutritionInfo = await res2.json();
            console.log(nutritionInfo);
            if(msgType == "calculate_nutrients"){
                return ("Here's what I found for the nutrition analysis of " + responseInfo.body.ingr.join(", ") + ":\n" + nutritionAnalysisPrintable(nutritionInfo));
            } else if(msgType == "calculate_meal_plan"){
                return ("Here's a potential meal plan I've generated that fits your criteria:\n" + mealPlanPrintable(nutritionInfo));
            } else if(msgType == "search"){
                return (["Here's a few recipes I found:\n", recipesPrintable(nutritionInfo)]);
            }
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

function workoutPrintable(allExers){
    let res = "";
    let randLength = Math.round((Math.random() * 2) + 4);
    if(randLength > allExers.length){
        randLength = allExers.length;
    }
    const arr = [];
    while(arr.length < randLength){
        var candidateInt = Math.floor(Math.random() * (allExers.length - 1)) + 1;
        if(arr.indexOf(candidateInt) === -1) arr.push(candidateInt);
    }

    let iter =0;
    while(iter < arr.length){
        const myExer = allExers[arr[iter]];
        const setNum = Math.round((Math.random() * 2) + 3);
        const repNum = Math.round((Math.random() * 4) + 3.5) * 2;
        res += ("\n" + myExer.name + "\n\t\tDifficulty: " + myExer.difficulty + "\n\t\tSets: " + setNum + " Reps: " + repNum);
        iter++;
    }

    return res;
}

function exercisePrintable(allExers){
    const loc = Math.floor(Math.random() * (allExers.length - 1)) + 1;
    const myExer = allExers[loc];
    return ("\n" + myExer.name + "\n\nEquipment: " + myExer.equipment + "\n\nInstructions:\n\t" + myExer.instructions);
}

async function fetchWorkoutResponse(msg, msgType){
    const api_key = "oNkdXbrkSASPsc+LjbMpjA==ww3FadU4J5k2EZ2p";
    let res;
    let msg2;
    if(msg == "lower back"){
        msg2 = "lower_back";
    } else if(msg == "middle back"){
        msg2 = "middle_back";
    } else {
        msg2 = msg;
    }

    if(msgType == ""){
        res = await fetch('https://api.api-ninjas.com/v1/exercises?muscle=' + msg2, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                'X-Api-Key': api_key,
            },
        });
    } else {
        res = await fetch('https://api.api-ninjas.com/v1/exercises?muscle=' + msg2 + "&difficulty=" + msgType, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                'X-Api-Key': api_key,
            },
        });
    }
    console.log(res);
    const exerInfo = await res.json();
    console.log(exerInfo);
    if(exerInfo.length == 0){
        return ("Unfortunately, I am not familiar with the muscle group you provided.");
    } else if(msgType == ""){
        return (`Here's a workout I generated for ${msg}:\n` + workoutPrintable(exerInfo));
    } else {
        return (`Here's a ${msgType} exercise I found for ${msg}:\n` + exercisePrintable(exerInfo));
    }
}

export {fetchMealResponse, fetchWorkoutResponse, welcomeMealMessage, welcomeWorkoutMessage};