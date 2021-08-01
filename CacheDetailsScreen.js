import React ,{useEffect,useState} from 'react';
import { View, Text, Dimensions} from 'react-native';
import { db } from './FirebaseManager';
import * as location from 'expo-location';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CacheDetailsScreen = ({navigation,route}) => {
   
    const locationInfo = route.params.locationInfo;

    const addToFavourites = () =>{

      {navigation.navigate("Favourites",{location:{locationInfo}})}
    }

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight : () => ( 
          <Ionicons
          style={{marginRight:30}}
            name="heart"
            size={30}
            color="#FF0000"
            onPress={addToFavourites}
          />
    )
      })
    }, [navigation,{}]);


    const [currRegion,setCurrRegion]=React.useState({
      //latitude:43.656290660189946,
      latitude:locationInfo.location.latitude,
      longitude:locationInfo.location.longitude,
      latitudeDelta:0.005,
      longitudeDelta:0.005 
    });
    const [location,setLocation]=useState();
        const mapMoved = (data) => {
         // setCurrRegion(data)
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
            
        </View>
    );
}

export default CacheDetailsScreen;