import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Switch, Text, TextInput, View} from 'react-native';
import Styles from './Styles';
import { db } from './FirebaseManager';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({navigation, route}) => {

    useEffect(() => {
        AsyncStorage.getItem("isRemembered")
        .then(
            (datafromStorage) => {
                if(datafromStorage === "true"){
                    navigation.replace("Treasure Hunt")
                }

                else{
                    console.log("User does not want to be remembered. "+datafromStorage);
                }
                
            }
        )
        .catch((error) => {
            console.log("ERROR: "+error);
        })
    })

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false)

    const loginPressed = () => {

        if(!username.trim()) {
            
            alert("Please enter your username");
        }

        else if (!password.trim()){
            alert("Please enter your password");
        }

        else {
            db.collection("users").where("username","==",username)
            .get()
            .then((querySnapshot) => {

                if(querySnapshot.size === 0 ){
                    alert("No such user exists. You might want to try signing up.");
                }
                else {
                   
                    let docValue = "";
                    querySnapshot.forEach((doc) => {
                        docValue = doc.data();
                    });

                    console.log(docValue);
                    console.log(docValue.username +"==="+ username);
                    if(docValue.password === password){

                     if(rememberMe){

                         AsyncStorage.setItem("isRemembered", "true")
                         .then(() => {
                             console.log("Saved rememberence preference to local storage");
                             
                         })
                         .catch((error) => {

                             console.log("Error while saving user to local storage "+error);
                         })
                     }

                     AsyncStorage.setItem("username", username)
                         .then(() => {
                             console.log("Saved username to local storage");
                             navigation.replace("Treasure Hunt");
                         })
                         .catch((error) => {

                             console.log("Error while saving user to local storage "+error);
                         })
                    

                    }
                    else{
                        alert("Incorrect credentials entered. Please re-try with the correct credentials.");
                    }
                }
                    
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

            <Text style={Styles.text}>Username: </Text>
            <TextInput style={Styles.input} autoCapitalize="none" placeholder="enter your email address" value={username} onChangeText={setUsername} textContentType="emailAddress"></TextInput>

            <Text style={Styles.text}>Password: </Text>
            <TextInput style={Styles.input} autoCapitalize="none" placeholder="enter your password" value={password} onChangeText={setPassword} textContentType="password" secureTextEntry={true}></TextInput>

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