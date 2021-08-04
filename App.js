import { StatusBar } from 'expo-status-bar';
import React ,{useEffect}from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Styles from './Styles';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Login';
import Signup from './Signup';
import AddNewCache from './AddNewCache';
import TabContainer from './TabContainer';
import CacheDetailsScreen from './CacheDetailsScreen';
import NotesScreen from './NotesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FavouritesScreen from './FavouritesScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Signup" component={Signup} /> 
      <Stack.Screen name="Login" component={Login} 
      initialParams={{userEmail: "initialParams@initialParams.com"}}
      options={({route}) => ({userEmail: route.params.userEmail})}
      /> 
      <Stack.Screen name="favourites" component={FavouritesScreen}/>
      <Stack.Screen name="Treasure Hunt" component={TabContainer}
      
     
      options={({navigation}) => ({ headerLeft : () => (
        <Button title="Logout" color="#D35400" onPress={() => { 
          AsyncStorage.removeItem("isRemembered").then(
            () => {
              navigation.replace("Login")
            }
          )
          .catch(
            (error) => {
              console.log("Error removing user from local storage:"+error);
            }
          )
          
         }}/>
      ), headerRight : () => (
        <View style={{flexDirection:'row'}}>
             <Button title="Add" color="#6495ED" onPress={() => navigation.navigate("AddNewCache")}/>
        <Ionicons
        style={{marginRight:30}}
          name='heart'
          size={35}
          color="#FF0000"
          onPress={() => {navigation.navigate("favourites")}}
        />
        </View>
       
       
      )})
      
    }/>
    <Stack.Screen name="AddNewCache" component={AddNewCache} /> 
    <Stack.Screen name="CacheDetails" component={CacheDetailsScreen}  options={({route}) => ({username: route.params.userEmail})}/>
    <Stack.Screen name="notes" component={NotesScreen} /> 
        </Stack.Navigator>
        

  </NavigationContainer>
  );
}


