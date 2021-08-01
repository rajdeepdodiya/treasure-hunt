import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View} from 'react-native';
import Styles from './Styles';
import { db } from './FirebaseManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation, route}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginPressed = () => {

        db.collection("users").get()
            .then((querySnapshot) => {
                    
                    querySnapshot.forEach((snapshot) => {
                       
                        console.log(snapshot.data().username +"==="+ username);
                        if(snapshot.data().username === username){

                           if(snapshot.data().password === password){

                            AsyncStorage.setItem("username", username)
                            .then(() => {
                                navigation.replace("Treasure Hunt");
                                return;
                            })
                            .catch((error) => {

                                console.log();("Error while saving user to local storage "+error);
                            })

                           }
                           else{
                               alert("Incorrect credentials entered. Please re-try with the correct credentials");
                           }
                        }
                       
                        
                    });

                    })

        
            .catch( (error) => {
                alert("Error while getting users: "+error);
            })
    }

    const signUpPressed = () => {

        navigation.navigate("Signup");

    }

    return(

        <SafeAreaView style={Styles.container}>

            <Text style={Styles.largeTitle}> Welcome to the Toronto Geocaching Club</Text>

            <View style={Styles.horizontal_align}>
                <Text>Email: </Text>
                <TextInput style={Styles.input} placeholder="enter your email address" value={username} onChangeText={setUsername} textContentType="emailAddress"></TextInput>
            </View>

            <View style={Styles.horizontal_align}>
                <Text>Password: </Text>
                <TextInput style={Styles.input} placeholder="enter your password" value={password} onChangeText={setPassword} textContentType="password" secureTextEntry={true}></TextInput>
            </View>

            <Button title="Login" onPress={loginPressed}/>

            <View style={Styles.horizontal_align}>
                <Text>Not registered yet? </Text>
                <Button title=" Sign Up" onPress={signUpPressed}/>
            </View>

           
        </SafeAreaView>
    )
}

export default Login;