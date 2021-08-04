import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Button, TextInput } from 'react-native';
import { db } from './FirebaseManager';
import * as Location from 'expo-location';

const AddNewCache = ({navigation, route}) => {

    let [cacheNameInput, setCacheNameInput] = useState("");
    let [descriptionInput, setDescriptionInput] = useState("");
    let [latitudeInput, setLatitudeInput] = useState("");
    let [longitudeInput, setLongitudeInput] = useState("");

    let [currentUsername, setCurrentUserName] = useState("");
    const [currentCoordinates, setCurrentCoordinates] = useState({});

    useEffect(() => {

        AsyncStorage.getItem("username").then((dataFromStorage) => {
            console.log(dataFromStorage);
            setCurrentUserName(dataFromStorage);
        })
        .catch((error) => {
            console.log("Error getting dataFromStorage:"+error);
        })
        
    }, [])

    const useCurrentLocationPressed = () => {
        
        Location.requestForegroundPermissionsAsync()
    .then( (result) => {
   
     if(result.status === "granted"){
      return Location.getCurrentPositionAsync({})

     }
  
     else{
       setMsg("Permission "+result.status);
     }
  
    })
    .then( (location) => {
      console.log("location received");
      console.log(location);

      const coordinates = {
        lat: location.coords.latitude,
        long: location.coords.longitude
      }
      console.log(coordinates);

      setLatitudeInput(String(location.coords.latitude));
      setLongitudeInput(String(coordinates.long));
      setCurrentCoordinates(coordinates);

    })
    .catch((error) => {
      alert("Error while requesting location / granting permission: "+error);
    });

    }
    

    const addPressed = () => {

        if(!cacheNameInput.trim()){
            alert("Please enter the name of the geocache cache");
        }
        else if(!descriptionInput.trim()){
            alert("Please enter a description of the cache");
        }
        else if(!latitudeInput.trim()) {
            alert("Please enter the latitude");
        }

        else if (!longitudeInput.trim()){
            alert("Please enter the longitude");
        }

        else {

            let newCache = {

                cacheName: cacheNameInput,
                cacheDescription: descriptionInput,
                latitude: latitudeInput,
                longitude: longitudeInput,
                postedBy: currentUsername
            }
    
            db.collection("caches").add(newCache)
            .then(
                (docRef) => {
                    alert("Cache added with id: \n"+docRef.id);
                    navigation.pop();

                }
            )
            .catch(
                (error) => {
                    alert("Error adding Cache: "+error);
                }
            )

        }
       
    }

    return(
        <SafeAreaView>
            <Text>Name of cache: </Text>
            <TextInput placeholder="enter the name of the cache" value={cacheNameInput} onChangeText={setCacheNameInput}></TextInput>

            <Text>Description: </Text>
            <TextInput placeholder="enter a description of the cache" value={descriptionInput} onChangeText={setDescriptionInput}></TextInput>

            <Text>Latitude: </Text>
            <TextInput placeholder="enter the Latitude" value={latitudeInput} onChangeText={setLatitudeInput} keyboardType="decimal-pad"></TextInput>

            <Text>Longitude: </Text>
            <TextInput placeholder="enter the Longitude" value={longitudeInput} onChangeText={setLongitudeInput} keyboardType="decimal-pad"></TextInput>

            <Button title="Use Current Location" onPress={useCurrentLocationPressed}/>

            <Button title="Add" onPress={addPressed}/>

        </SafeAreaView>
    )
}

export default AddNewCache;