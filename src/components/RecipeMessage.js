import * as React from 'react';
import { Text, Card } from 'tamagui';
import { Linking, View } from 'react-native';


const RecipeMessage = ({author, content, recipes}) => {

    return(
        <Card width="70%" elevate backgroundColor="#FFFFFF" marginLeft={author === "Saturn" ? 10 : 105} marginRight={author === "Saturn" ? 100 : 10} paddingLeft={25} paddingRight={50} paddingVertical={10} marginBottom={20}>
            <Text fontSize={17} padding={2} style={{ fontWeight: "bold" }} color="#123911">@{author}</Text>
            <Text fontSize={17} padding={2} color="#123911">{content}</Text>
            {recipes ? recipes.map((recipe, index) => {
                return ( 
                <View>
                    <Text fontSize={17} padding={2} style={{color: 'blue'}} onPress={() => Linking.openURL(recipe.url)}>
                        {recipe.title}
                    </Text>
                    <Text fontSize={17} padding={2} color="#123911">{recipe.content}</Text>
                </View>);
                
            }): null}
        </Card>
    )
}

export default RecipeMessage;