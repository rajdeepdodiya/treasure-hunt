import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View} from 'react-native';
import Styles from './Styles';
import { db } from './FirebaseManager';


const Login = () => {

    const {email, setEmail} = useState("");
    const {password, setPassword} = useState("");

    const loginPressed = () => {
        
    }

    const signUpPressed = () => {

    }

    return(
        <SafeAreaView style={Styles.container}>

            <Text style={Styles.largeTitle}> Welcome to the Toronto Geocaching Club</Text>

            <View style={Styles.horizontal_align}>
                <Text>Email: </Text>
                <TextInput style={Styles.input} placeholder="enter your email address" value={email} onChangeText={setEmail} textContentType="emailAddress"></TextInput>
            </View>

            <View style={Styles.horizontal_align}>
                <Text>Password: </Text>
                <TextInput style={Styles.input} placeholder="enter your password" value={password} onChangeText={setPassword} textContentType="password"></TextInput>
            </View>

            <Button title="Login" onPress={loginPressed}/>

            <Button title="Not registered yet? Sign Up" onPress={signUpPressed}/>
        </SafeAreaView>
    )
}

export default Login;