import React from 'react';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const Styles = StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',  // align items horizontally centered
      justifyContent: 'center', // align items vertically centered
      margin: 10,
    
    },

    boldText25:{
        fontWeight: 'bold',
        
    }, 
    horizontal_align:{
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 10,
        marginBottom: 10,
    },

    text: {
      height: 40,
      fontSize: 25,
      textAlign: 'left',
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5, 
    },

    smalltext: {
      fontSize: 18,
      textAlign: 'left',
      marginTop: 10,
      height: 20,
     
    },

    largeTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'red',
    },

    input: {
      borderWidth: 1,
      borderColor: '#777',
      borderRadius: 5, 
      padding: 8,
      marginLeft: 5,
      marginRight: 5, 
      width: '100%',
    },

    switch: {
      marginTop: 10, 
      marginLeft: 5,
      marginRight: 5, 
    },

    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10
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