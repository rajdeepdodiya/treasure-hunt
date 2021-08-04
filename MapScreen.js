import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Dimensions } from 'react-native';
import {getDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './FirebaseManager';

function MapScreen(){

    const mapRef = useRef(null);
    const [currentCoordinates, setCurrentCoordinates] = useState({});
    const [currentUser, setCurrentUser] = useState("");
    
    const [allGeoCaches, setAllGeoCaches] = useState([]);
    const [nearbyGeoCaches, setNearybyGeoCaches] = useState([]);

    const [currRegion, setCurrRegion] = useState({
        latitude: 43.25359093653678,
        longitude: -79.86577030001203,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      });

    useEffect(() =>{

        console.log("---------------------------");
        console.log("Getting current user from async storage");

        AsyncStorage.getItem("username").then((dataFromStorage) => {
            setCurrentUser(dataFromStorage);
        })
        .catch((error) => {
            console.log("Error getting username from storage:"+error);
        });

        console.log("Current User : "+currentUser);
        console.log("---------------------------");
        
        getCurrentLocation();
        getAllCachesFromFirebase();


    }, [])

    const getCurrentLocation = () => {

        console.log("---------------------------");
        console.log("Getting current location");

        Location.requestForegroundPermissionsAsync()
        .then(
            (result) => {
                if(result.status === "granted"){
                    return Location.getCurrentPositionAsync({});
                }
                else{
                    alert("You have not granted location permission. Please grant location permission from your device's Settings menu.")
                }
            }
        )
        .then(
            (location) => {
                
                console.log("Location received: ");
                console.log(location);

                console.log("Extracting coordinates from received location");

                const coordinates = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }

                console.log(coordinates);
                console.log("Done extracting coordinates from received location");
               
                setCurrentCoordinates(coordinates);
                setCurrRegion({
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                  });
                

                mapRef.current.animateCamera(
                    {center: coordinates}, 2000
                  );

                  showNearbyGeoCaches(coordinates);
        
            }
        )
        .catch(
            (error) => {

                console.log("Error while granting permission or while accessing current location: "+error);
            }

            
        )
        console.log("---------------------------");

    }

    const showNearbyGeoCaches = (newCoordinates) => {

        console.log("---------------------------");
        console.log("Showing nearby GeoCaches");
       
        setNearybyGeoCaches([]);

        let loc = [];
        
        for(let i=0;i<allGeoCaches.length;i++){

          const dist = getDistance({latitude:newCoordinates.latitude, longitude:newCoordinates.longitude}, {latitude:allGeoCaches[i].latitude, longitude:allGeoCaches[i].longitude}) * 0.000621371;
          const distFromCurrentLocation = getDistance({latitude:currentCoordinates.latitude, longitude:currentCoordinates.longitude}, {latitude:allGeoCaches[i].latitude, longitude:allGeoCaches[i].longitude}) * 0.000621371;
          
          if(!isNaN(dist)){

             const distance = dist.toFixed(1);
             if (distance <= 5){

                 const locationInfo = {
                    latitude: allGeoCaches[i].latitude,
                    longitude: allGeoCaches[i].longitude,
                     distance: distance,
                     distFromCurrentLocation: distFromCurrentLocation.toFixed(1),
                     title: allGeoCaches[i].title,
                     description: allGeoCaches[i].description,
                     id: allGeoCaches[i].id
                 }
                 loc.push(locationInfo);
             }
                 
             }  

         }

         setNearybyGeoCaches(loc);

         console.log("NEARBY LOCATIONS: "+loc.length);
         console.log(loc);
         console.log("------------------------");

    }

    const getAllCachesFromFirebase = () => {

        console.log("---------------------------");
        console.log("Getting all GeoCaches from firebase");

        db.collection("caches").where("postedBy","!=", currentUser).get().then((querySnapshot) => {
            
            if(querySnapshot.size === 0){
                console.log("No GeoCaches available for current user");
            }else{
                
                const caches = [];

                querySnapshot.forEach((doc) => {
                    
                    caches.push(
                      { latitude: parseFloat(doc.data().latitude),
                        longitude: parseFloat(doc.data().longitude),
                        title: doc.data().cacheName, 
                        description: doc.data().cacheDescription,
                        id: doc.id,
                        postedBy: doc.data().postedBy
                    });

                });
                console.log("caches");
                console.log(caches);
                setAllGeoCaches(caches);
               
               }
            }
          )
          .catch((error) => {
              console.log("Error getting all caches from firebase: "+error);
          });      
          console.log("---------------------------");
    }

    const mapMoved = (data) => {
        console.log("---------------------------");
        console.log("Map Moved");
        console.log(data);
        console.log("---------------------------");
        setCurrRegion(data);

        const coordinates = {
            latitude: data.latitude,
            longitude: data.longitude
        }

        showNearbyGeoCaches(coordinates);
    }

    return(
        <SafeAreaView>
            
        <MapView
        style={{width:Dimensions.get("window").width, height:Dimensions.get("window").height}}
        ref={mapRef}
        initialRegion={currRegion}
        onRegionChangeComplete={mapMoved}
        showsUserLocation={true}
        showsMyLocationButton={true}
        
        >
            {
                nearbyGeoCaches.map((location, index) => {
                    console.log(location);

                    return(

                    <Marker coordinate={{latitude:location.latitude, longitude: location.longitude}}
                    title={location.title+" - ("+location.distFromCurrentLocation+") miles away"}
                    description={location.description}
                    key={index}></Marker>

                    )
                    

                    

                })
            }
       

        </MapView>
     
     <Button title="Current"></Button>
        </SafeAreaView>
    );
}

export default MapScreen;