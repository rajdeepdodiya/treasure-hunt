import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapScreen from './MapScreen';
import ListScreen from './ListScreen';

const Tab = createBottomTabNavigator();

const TabContainer = () => {

    return(
        <Tab.Navigator
        screenOptions={ ({route}) => ({tabBarIcon: (focused, color, size) => {
                let iconName;

                if(route.name === "ListScreen"){
                    iconName = focused ? 'list' : 'list-outline';
                }
                else if(route.name === "MapScreen"){
                    iconName = focused ? 'heart' : 'heart-outline';
                }
                return <Ionicons name={iconName} size={size} color={color}/>
            }})}
        tabOptions={{
            activeTintColor : "red",
            inactieTintColor: "grey"
        }}
        >
            <Tab.Screen name="MapScreen" component={MapScreen}/>
            <Tab.Screen name="ListScreen" component={ListScreen}/>
            
        </Tab.Navigator>
    )
}

export default TabContainer;