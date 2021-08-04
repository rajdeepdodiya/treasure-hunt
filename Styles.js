import React from 'react';
import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // alignItems: 'center',  // align itme horizontally centered
      justifyContent: 'center', // align items vertically centered
      margin: 5,
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
      fontSize: 25,
      textAlign: 'left',
    },

    largeTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'red',
    },

    input: {
      borderWidth: 1,
      borderColor: '#777',
      padding: 8,
      margin: 10,
      width: '100%',
    },
    

    // input: {
    //   height: 40,
    //   fontSize: 20,
    //   width: '100%',
    //   borderTopWidth: 1,
    //   borderBottomWidth: 2,
    // }

  });

  export default Styles;