import React ,{useEffect,useState} from 'react';
import { View, Text, Dimensions, Button, Switch, Alert,TextInput,StyleSheet} from 'react-native';
import { db } from './FirebaseManager';
import * as location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton, Provider } from 'react-native-paper';
import Styles from './Styles';

//import RadioButtonRN from 'radio-buttons-react-native';

const CacheDetailsScreen = ({navigation,route}) => {
   
    const locationInfo = route.params.locationInfo;
   let user=route.params.user;
   
    
    let userObj={};
    const [userToDisplay,setUserToDisplay]=React.useState({});
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
            console.log("couldnt find user");
          }else{
            querySnapShot.forEach((doc) => {
              userObj=doc;
            
            });//forEach
  
            //load if favourites or  not
            if("favourites" in userObj.data()){
              userFavArray=userObj.data().favourites;
               if(userObj.data().favourites.includes(locationInfo.id)){
                  setEnabledFav(true);
               }else{
                  setEnabledFav(false);
               }
              }


            //load if completed or not
            if("completion" in userObj.data()){
                console.log("completion present");
                if(userObj.data().completion.includes(locationInfo.id)){
                  setEnabledCompleted(true);
                    setCompleteDisabled(true);
                }
                
            }else{
                console.log("no such attribute completion in userObj");

            } //else completion 
  
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
            onPress: () => {didComplete(false)},
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
        querySnapShot.forEach((doc) =>{
          userObj=doc
        }
        );

        let completionsFromDb = [];
        let isCompletionpresent =false;
        Object.keys(userObj.data()).forEach((item) => {
          if(item === "completion"){
              isCompletionpresent = true;
          }
        });
        if(isCompletionpresent){
            completionsFromDb=userObj.data().completion;
        }else{
          console.log("completion not in keys");
        }
        completionsFromDb.push(locationInfo.id);
        //update user obj
        db.collection("users").doc(userObj.id).update({
          completion:completionsFromDb
        }
        ).then(() => {console.log("successfully updated with completion true")})
        .catch((err) => {console.log(err)});
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
           
              <Text style={styles.title}>{locationInfo.title}</Text>
             <MapView 
                style={{width:Dimensions.get("window").width, height:Dimensions.get("window").height/3,padding:10,borderColor:"#efefff",borderWidth:2}}
                initialRegion={currRegion}
                onRegionChangeComplete={mapMoved} >
      
                <Marker coordinate={{latitude:currRegion.latitude,
                longitude:currRegion.longitude}} title={locationInfo.title} description=""></Marker>

            </MapView>
            <View style={{height:15}}></View>

            <View style={{ borderRadius:10,height: '50%', borderColor: 'gray', borderWidth: 1 , padding:15,marginStart:10,marginEnd:10}}>
            <Text style={styles.about}>About:</Text>
            <Text style={styles.desc}>{locationInfo.desc}</Text>


            <Text style={styles.latnlng} >({locationInfo.location.latitude}, {locationInfo.location.longitude})</Text>
            <View style={styles.seperator}></View>
            <View style={{flexDirection:'row'}}>

             <Text style={styles.textsFav}>Add to Favourites</Text>
              <Switch 
              style={{marginStart:20}}
               trackColor={{ false: "#FFFFFF", true: "#40E0D0" }}
               thumbColor={isEnabledFav ? "#FFFFFF" : "#FFFFFF"}
               ios_backgroundColor="#3e3e3e"
               onValueChange={addOrDelete}
               value={isEnabledFav}/>

            </View>
            <View style={{height:10}}></View>
            <View style={{flexDirection:'row'}}>
             <Text style={styles.textsComplete}>Completed?</Text>
              <Switch 
              disabled={completeDisabled}
              style={{marginStart:38}}
               trackColor={{ false: "#FFFFAA", true: "#00FF00" }}
               thumbColor={isEnabledCompleted ? "#FFFFFF": "#FFFFFF"}
               ios_backgroundColor="#3e3e3e"
               onValueChange={didComplete}
               value={isEnabledCompleted}/>

            </View>
                <View style={{height:10}}></View>
              <Button
               onPress={addOrViewNotes}
             title="Notes"
              />

            </View>
           
         
            
            
        </View>
    );
}

const styles = StyleSheet.create({
  title:{
    color:'#191970',
    textAlign:'center',
    fontSize:25,
    margin:10,
    fontWeight:'bold'
  },
  about:{
    color:"#000080",
    fontSize:21,
    margin:10,
    fontWeight:'bold'
  },
  desc:{
    color:"#1F51FF",
    fontSize:18,
    marginStart:10,

  },
  latnlng:{
    color:"#696969",
    fontSize:16,
    marginBottom:10,
    marginStart:10,
    marginTop:10,
    
  },
  seperator:{
    height:50
  },
  textsComplete:{
    fontSize:20,
    color:"#696969",
    marginStart:'33%'
  },
  textsFav:{
    fontSize:20,
    color:"#696969",
    marginStart:'25%'
  }
}
);

export default CacheDetailsScreen;