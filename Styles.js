import React from 'react';
import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    boldText25:{
        fontWeight: 'bold',
        
    }, 
    horizontal_align:{
        flexDirection: 'row',
        alignItems:'center'
    },
    text: {
      height: 40,
    },

    largeTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'red',
    },
    input: {
      height: 40,
      width: 200,
      margin: 12,
      borderWidth: 1,
    }

  });

  export default Styles;