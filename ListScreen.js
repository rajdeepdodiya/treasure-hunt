import React ,{useEffect,useState} from 'react';
import { View, Text ,ActivityIndicator,FlatList, SafeAreaView, Pressable, ScrollView} from 'react-native';
import { db } from './FirebaseManager';
import {getDistance} from 'geolib';
import * as location from 'expo-location';
//import Styles from './Styles';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ListScreen({navigation, route}){
    const [cachesArray,setCachesArray]=useState([]);
    const [isLoading,setLoading]=useState(true);
    const [msg,setMsg]=useState("");

    let LocationCoords = [];
    let nearestLocations=[];
    // const user=route.params.user;
   let user="";

    useEffect(() => {
      AsyncStorage.getItem("username")
      .then((data) => {console.log(data);user=data})
      .catch((err)=>{console.log(err)});
      
      setCachesArray([]);
        //43.789634649203784, -79.24426781584285 - 8 mass
        //43.656290660189946, -79.38017140235499 - young/dund
       getCurrentLocation();
        
    },[]);

    const getCurrentLocation= () =>{
      console.log(user);

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
        console.log("user");
        console.log(user);
        db.collection("caches").where("postedBy","!=",user).get().then((querySnapshot) => {
            if(querySnapshot.size === 0){
                setMsg("You do not have any caches to find yet");
                setLoading(false);
            }else{
                
                setMsg("");
                 LocationCoords=[];
                 nearestLocations=[];

                querySnapshot.forEach((doc) => {
                 
                  LocationCoords.push({latitude:parseFloat(doc.data().latitude), longitude:parseFloat(doc.data().longitude),title:doc.data().cacheName,id:doc.id,desc:doc.data().cacheDescription});
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
                               distance:dist.toFixed(1),
                               title:LocationCoords[i].title,
                               id:LocationCoords[i].id,
                                desc:LocationCoords[i].desc
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
    

    const goToDetailsScreen = (item) => {
      AsyncStorage.getItem("username")
      .then((data) => {console.log(data);
        user=data; 
        navigation.navigate("CacheDetails",{locationInfo:item,user:user});
      })
      .catch((err)=>{console.log(err)});
      
     
    }
    return(
        <SafeAreaView style={{backgroundColor:'#dfdfdf'},{margin:10}}> 
            <Text style={styles.page_title}>Available Geocaches</Text>
         
         <View>
                  {isLoading ? (<ActivityIndicator animating={true} size="large"/>) : (
                <FlatList
                data={cachesArray}
                keyExtractor = {(item,index) => {return item.id}}
                renderItem={({item,index}) => ( <Pressable  onPress={() => goToDetailsScreen(item)}  >
                <View style={styles.list_item}>
                   <View style={styles.flex}>
                   <Text  style={styles.cache1_title}>{item.title}</Text>
                    <Text  style={styles.cache2_title}>{item.distance} miles</Text>
                    
                   </View>
                    
                    {/* <Text style={styles.latnlong}>{item.desc}</Text> */}
                    
                    {/* <View style={styles.seperator}/>  */}
                </View>
               
                </Pressable>
                )}

                />
            )}
            </View>    
            <Text>{msg}</Text>

        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    list_item:{

        borderColor:'black',
        borderBottomWidth: 2,
        marginTop: 5,
        padding: 15,
        flex: 1,
    },

    seperator:{

      height:5,
      backgroundColor:'white'
  },

  cache1_title:{
    color:'black',
    fontSize:25,
    fontWeight:'bold',
    flex: 4,
  },

  cache2_title:{
    color:'#a9a9a9',
    fontSize:15,
    textAlign:"right",
    flex: 1,
    
  },

  flex:{
    flexDirection:'row'
  },

  page_title:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:30,
    color:'#009200',
    margin:10
  },
  latnlong:{
    fontSize:15,
    color:'yellow',
    paddingStart:10
  }
});
export default ListScreen;