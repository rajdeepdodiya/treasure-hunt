import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Button, TextInput } from 'react-native';
import { db } from './FirebaseManager';

const AddNewCache = () => {

    let [cacheNameInput, setCacheNameInput] = useState("");
    let [latitudeInput, setLatitudeInput] = useState("");
    let [longitudeInput, setLongitudeInput] = useState("");

    let [currentUsername, setCurrentUserName] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("username").then((dataFromStorage) => {
            console.log(dataFromStorage);
            setCurrentUserName(dataFromStorage);
        })
        .catch((error) => {
            console.log("Error getting dataFromStorage:"+error);
        })
    }, [])
    

    const addPressed = () => {

        let newCache = {
            cacheName: cacheNameInput,
            latitude: latitudeInput,
            longitude: longitudeInput,
            postedBy: currentUsername
        }

        db.collection("caches").add(newCache)
        .then(
            (docRef) => {
                alert("Cache added with id: \n"+docRef.id);
            }
        )
        .catch(
            (error) => {
                alert("Error adding Cache: "+error);
            }
        )
    }

    return(
        <SafeAreaView>
            <Text> Name of cache: </Text>
            <TextInput placeholder="enter the name of the cache" value={cacheNameInput} onChangeText={setCacheNameInput}></TextInput>
            <Text> Latitude: </Text>
            <TextInput placeholder="enter the Latitude" value={latitudeInput} onChangeText={setLatitudeInput}></TextInput>
            <Text> Longitude: </Text>
            <TextInput placeholder="enter the Longitude" value={longitudeInput} onChangeText={setLongitudeInput}></TextInput>

            <Button title="Add" onPress={addPressed}/>

        </SafeAreaView>
    )
}

export default AddNewCache;