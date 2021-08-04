import React ,{useEffect,useState} from 'react';
import { View, Text, Dimensions, Button, Switch, Alert,TextInput} from 'react-native';
import { db } from './FirebaseManager';
import * as location from 'expo-location';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton, Provider } from 'react-native-paper';

//import RadioButtonRN from 'radio-buttons-react-native';

const CacheDetailsScreen = ({navigation,route}) => {
   
    const locationInfo = route.params.locationInfo;
   let user=route.params.user;
   
    
    let userObj={};
    let userFavArray=[];
    
    const [isEnabledFav,setEnabledFav]=useState(false);
    const [isEnabledCompleted,setEnabledCompleted]=useState(false);
    const [completeDisabled,setCompleteDisabled]=useState(false);
    const [currRegion,setCurrRegion]=React.useState({
      //latitude:43.656290660189946,
      latitude:locationInfo.location.latitude,
      longitude:locationInfo.location.longitude,
      latitudeDelta:0.005,
      longitudeDelta:0.005 
    });



    useEffect(() => {   
      console.log("user from route useeffect"+user);
     AsyncStorage.getItem("username").then((data) => {user=data;console.log("async useeffect"+user);
      
        db.collection("users").where("username","==",user).get()
        .then((querySnapShot) => {
          if(querySnapShot.size === 0 ){
            console.log("useeffect");
            console.log("couldnt find user");
          }else{
            querySnapShot.forEach((doc) => {
              userObj=doc;
            });//forEach
  
            if("favourites" in userObj.data()){
              userFavArray=userObj.data().favourites;
               if(userObj.data().favourites.includes(locationInfo.id)){
                  setEnabledFav(true);
               }else{
                  setEnabledFav(false);
               }
              }
  
          }//else
        })
        .catch();


      
     }).catch();
      
      
    },[]);


    const addOrDelete = (value) =>{
      setEnabledFav(value);
      console.log(" add or delete user"+user);
      if(value === true){
          addToFavourites();
      }else{
          deleteFromFavourites();
      }
    }

    const didComplete = (val) => {
      if(val === true){
        Alert.alert("Confirmation","Did you complete finding the cache?",

        [
          {
            text: "Yes",
            onPress: () => addCacheAsCompleted()
          },
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
        );
        setEnabledCompleted(true);
        
      }else{
        setEnabledCompleted(false);
      }
    }

    const addCacheAsCompleted = () => {
      setCompleteDisabled(true);
      db.collection("users").where("username","==",user).get()
      .then((querySnapShot) => {
        console.log("addcachecompleted");
        querySnapShot.forEach((doc) =>{
          userObj=doc.data();
        }
        );

        
      })
      .catch((err) => {console.log(err);});

    }
    const deleteFromFavourites = () => {
      db.collection("users").where("username","==",user).get()
      .then((querySnapShot) => {
        console.log("user" + user);
        if(querySnapShot.size === 0 ){
          console.log("couldnt find user");
        }else{
          querySnapShot.forEach((doc) => {
            userObj=doc;
          });//forEach


          if("favourites" in userObj.data()){
            userFavArray=userObj.data().favourites;
             if(userObj.data().favourites.includes(locationInfo.id)){
              const index = userObj.data().favourites.indexOf(locationInfo.id);
              if (index > -1) {
                  userFavArray.splice(index, 1);
              }
              }else{
                console.log("doesnt exist to delete");
              }
          }


          //update db
          db.collection("users").doc(userObj.id).update({
            favourites:userFavArray
       })
       .then(() => {console.log("successfully finished update process = delete");})
       .catch((err)=>{
         console.log("error while updating delete");
         console.log(err);
       });



        }//else
      })
      .catch((err) => {console.log(err);});
    }
    const addToFavourites = () => {
       db.collection("users").where("username","==",user).get()
        .then((querySnapShot) => {
          if(querySnapShot.size === 0 ){
            console.log("couldnt find user");
          }else{
            querySnapShot.forEach((doc) => {
              userObj=doc;
            });//forEach
            
            if("favourites" in userObj.data()){
              userFavArray=userObj.data().favourites;
               if(!userObj.data().favourites.includes(locationInfo.id)){
                  userFavArray.push(locationInfo.id);
                }else{
                  console.log("already added to favourites");
                }
            }else{
              userFavArray.push(locationInfo.id);
            }
            
           
            //update db
           db.collection("users").doc(userObj.id).update({
                favourites:userFavArray
           })
           .then(() => {
             console.log("successfully finished update process");
            //  Alert.alert();
          })
           .catch((err)=>{
             console.log("error while updating");
             console.log(err);
           });
          }//else
            
        })//then
        .catch((err) => {console.log("error in adding to favourites");console.log(err);});
    }

    const mapMoved = (data) => {
      // setCurrRegion(data)
     }

     const addOrViewNotes=()=>{
       console.log("user from to notes"+user);
       console.log("location from to notes"+locationInfo.id);
       navigation.navigate("notes",{user:user,location:locationInfo.id});
     }




   
   

    return (
        <View>
             <MapView 
                style={{width:Dimensions.get("window").width, height:Dimensions.get("window").height/3}}
                initialRegion={currRegion}
                onRegionChangeComplete={mapMoved} >
      
                <Marker coordinate={{latitude:currRegion.latitude,
                longitude:currRegion.longitude}} title={locationInfo.title} description=""></Marker>

            </MapView>
            <View style={{flexDirection:'row'}}>
             <Text style={{marginStart:'45%'}}>Add to favourites</Text>
              <Switch 
              style={{marginStart:20}}
               trackColor={{ false: "#767577", true: "#40E0D0" }}
               thumbColor={isEnabledFav ? "#008080" : "#f4f3f4"}
               ios_backgroundColor="#3e3e3e"
               onValueChange={addOrDelete}
               value={isEnabledFav}/>

            </View>
            <View style={{flexDirection:'row'}}>
             <Text style={{marginStart:'45%'}}>Completed?</Text>
              <Switch 
              disabled={completeDisabled}
              style={{marginStart:30}}
               trackColor={{ false: "#FFFFAA", true: "#00FF00" }}
               thumbColor={isEnabledCompleted ? "#00A300": "#FF0000"}
               ios_backgroundColor="#3e3e3e"
               onValueChange={didComplete}
               value={isEnabledCompleted}/>

            </View>
           
              <Button
               onPress={addOrViewNotes}
             title="notes"
              />
            
        </View>
    );
}

export default CacheDetailsScreen;