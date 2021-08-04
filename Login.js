import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Switch, Text, TextInput, View} from 'react-native';
import Styles from './Styles';
import { db } from './FirebaseManager';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({navigation, route}) => {

    useEffect(() => {
        AsyncStorage.getItem("username")
        .then(
            (datafromStorage) => {
                if(datafromStorage !== null){
                    navigation.replace("Treasure Hunt")
                }
                
            }
        )
        .catch(() => {

        })
    })

    const [username, setUsername] = useState("1");
    const [password, setPassword] = useState("1");
    const [rememberMe, setRememberMe] = useState(false)

    const loginPressed = () => {

        if(!username.trim()) {
            alert("Please enter your username");
        }

        else if (!password.trim()){
            alert("Please enter your password");
        }

        else {
            db.collection("users").get()
            .then((querySnapshot) => {
                    
                    querySnapshot.forEach((snapshot) => {
                       
                        console.log(snapshot.data().username +"==="+ username);
                        if(snapshot.data().username === username){

                           if(snapshot.data().password === password){

                            if(rememberMe){

                                AsyncStorage.setItem("username", username)
                                .then(() => {
                                    console.log("Saved username to local storage");
                                    
                                })
                                .catch((error) => {
    
                                    console.log();("Error while saving user to local storage "+error);
                                })
                            }
                            navigation.replace("Treasure Hunt");

                           }
                           else{
                               alert("Incorrect credentials entered. Please re-try with the correct credentials.");
                           }
                        }
                       
                        
                    });

                    })

        
            .catch( (error) => {
                alert("Error while getting users: "+error);
            })
        }

       
    }

    const signUpPressed = () => {

        navigation.navigate("Signup");

    }

    return(

        <SafeAreaView style={Styles.container}>

            <Text style={Styles.largeTitle}>Welcome to the Toronto Geocaching Club</Text>

            <Text style={Styles.text}>Email: </Text>
            <TextInput style={Styles.input} placeholder="enter your email address" value={username} onChangeText={setUsername} textContentType="emailAddress"></TextInput>

            <Text style={Styles.text}>Password: </Text>
            <TextInput style={Styles.input} placeholder="enter your password" value={password} onChangeText={setPassword} textContentType="password" secureTextEntry={true}></TextInput>

            <Switch
             trackColor={{ false: "#767577", true: "#81b0ff" }}
            
             ios_backgroundColor= "#3e3e3e"
             value={rememberMe}
             onValueChange={setRememberMe}
            ></Switch>



            <Button title="Login" onPress={loginPressed}/>

            <View style={Styles.horizontal_align}>
                <Text>Not registered yet? </Text>
                <Button title=" Sign Up" onPress={signUpPressed}/>
            </View>

           
        </SafeAreaView>
    )
}

export default Login;