import React from 'react';
import { View, Text } from 'react-native';

function ListScreen(navigation, route){

    const {searchQuery} = route.params;
    return(
        <View>
            <Text>ListScreen</Text>
        </View>
    );
}

export default ListScreen;