import React ,{useEffect,useState} from 'react';
import { View, Text ,ActivityIndicator,FlatList, SafeAreaView, Pressable,Alert} from 'react-native';


const FavouritesScreen = ({navigation,route}) => {
    const location=route.params.location;

   const addToFavourites = () => {
    console.log("reacged");
       
    showFavourites();
   } 
 
const showFavourites = () =>{
    
}
    useEffect(() => {
        Alert.alert(
            //title
            'Add to Favourites',
            //body
            'Do you want to add ' + `${location.locationInfo.title}` + " to favourite list?",
            [
              {
                text: 'Yes',
                onPress: addToFavourites
               
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'), style: 'cancel'
              },
            ],
            {cancelable: false},
            //clicking out side of alert will not cancel
          ); 
          
          showFavourites();
        },[]
        
        );
    return(
        <View>

        </View>
    );
}

export default FavouritesScreen;