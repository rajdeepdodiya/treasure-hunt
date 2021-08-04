import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapScreen from './MapScreen';
import ListScreen from './ListScreen';
import FavouritesScreen from './FavouritesScreen';

const Tab = createBottomTabNavigator();

const TabContainer = () => {

    return(
        <Tab.Navigator
        screenOptions={ ({route}) => ({tabBarIcon: (focused, color, size) => {
                let iconName;

                if(route.name === "List View"){
                    iconName = focused ? 'list' : 'list-outline';
                }
                else if(route.name === "Map View"){
                    iconName = focused ? 'map' : 'map-outline';
                }else if(route.name === "favourites"){
                    iconName = focused ? 'heart' :'heart-outline';
                }
                return <Ionicons name={iconName} size={size} color={color}/>
            }})}
        tabOptions={{
            activeTintColor : "red",
            inactieTintColor: "grey"
        }}
        >
            <Tab.Screen name="List View" component={ListScreen}/>
            <Tab.Screen name="Map View" component={MapScreen}/>
            <Tab.Screen name="favourites" component={FavouritesScreen}/>
            
        </Tab.Navigator>
    )
}

export default TabContainer;