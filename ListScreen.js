import React ,{useEffect,useState} from 'react';
import { View, Text ,ActivityIndicator,FlatList} from 'react-native';
import { db } from './FirebaseManager';
import {getDistance} from 'geolib';
import * as location from 'expo-location';

function ListScreen({navigation, route}){
    const [cachesArray,setCachesArray]=useState([]);
    const [isLoading,setLoading]=useState(true);
    const [msg,setMsg]=useState("");

    let LocationCoords = [];
    let nearestLocations=[];
    // const user=route.params.user;
    const user="123";

    useEffect(() => {
        setCachesArray([]);
        //43.789634649203784, -79.24426781584285 - 8 mass
        //43.656290660189946, -79.38017140235499 - young/dund
       getCurrentLocation();
        
    },[]);

    const getCurrentLocation= () =>{

        location.requestForegroundPermissionsAsync()
          .then(
            (result) => {
              console.log("got reslut from ");
              console.log(result);
      
              if(result.status === "granted"){
                console.log("user gave permission");
      
                return location.getCurrentPositionAsync({});
              }else{
                console.log("permission denied");
                throw new Error("user didnt grant permission");
              }
            }
          )
          .then(
            (loc) => {
      console.log("got the location");
      console.log(loc);
     
      
      const coordinates={
        lat:loc.coords.latitude,
        lng:loc.coords.longitude
      }
      showCaches(coordinates);
     
            }
          )
          .catch(
            (err) =>{
              console.log(err);
              console.log("Couldnt fetch location");
            }
          );
        
       
      }

    const showCaches = (coordinates) => {
        
        db.collection("caches").where("postedBy","!=",user).get().then((querySnapshot) => {
            if(querySnapshot.size === 0){
                setMsg("You do not have any caches to find yet");
            }else{
                
                setMsg("");
                 LocationCoords=[];
                 nearestLocations=[];

                querySnapshot.forEach((doc) => {
                    
                  LocationCoords.push({latitude:parseFloat(doc.data().latitude), longitude:parseFloat(doc.data().longitude),title:doc.data().cacheName,id:doc.id});
                });
                
                for(let i=0;i<LocationCoords.length;i++){
                   // const dist=getDistance({latitude:43.656290660189946,longitude:-79.38017140235499},{latitude:LocationCoords[i].latitude,longitude:LocationCoords[i].longitude}) * 0.000621371;
                 const dist=getDistance({latitude:coordinates.lat,longitude:coordinates.lng},{latitude:LocationCoords[i].latitude,longitude:LocationCoords[i].longitude}) * 0.000621371;
                    if(!isNaN(dist)){
                            const locationInfo = {
                                location:{
                                    latitude:LocationCoords[i].latitude,
                                    longitude:LocationCoords[i].longitude
                                },
                               distance:dist,
                               title:LocationCoords[i].title,
                               id:LocationCoords[i].id
                            }
                            nearestLocations.push(locationInfo);
                        
                    }   
                    nearestLocations.sort(function (a, b) {
                        return a.distance - b.distance;
                      }); 
                }
                setCachesArray(nearestLocations);
                 setLoading(false);
                
               }
            }
          );      
    }
    
    return(
        <View>
            <Text>Caches Available</Text>
         
            <View>
                  {isLoading ? (<ActivityIndicator animating={true} size="large"/>) : (
                <FlatList
                data={cachesArray}
                keyExtractor = {(item,index) => {return item.id}}
                renderItem={({item,index}) => (
                <View>
                   
                    <Text>{item.title}</Text>
                    <Text>{item.location.latitude}</Text>
                    <Text>{item.location.longitude}</Text>  
                    <Text>{item.distance}</Text>
                    
                </View>
                
                )}

                />
            )}
            </View>
                
            <Text>{msg}</Text>
        </View>
    );
}

export default ListScreen;