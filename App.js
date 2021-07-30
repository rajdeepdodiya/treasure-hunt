import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Styles from './Styles';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Login';
import Signup from './Signup';
import AddNewCache from './AddNewCache';
import TabContainer from './TabContainer';

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
      <Stack.Screen name="Treasure Hunt" component={TabContainer}
      initialParams={{userEmail: "rajdodiya216@gmail.com"}} 
      options={({navigation}) => ({ headerRight : () => (
        <Button title="+" color="#000000" onPress={() => navigation.navigate("AddNewCache")}/>
      )})
      
    }/>
    <Stack.Screen name="AddNewCache" component={AddNewCache} /> 
    </Stack.Navigator>
  </NavigationContainer>
  );
}


