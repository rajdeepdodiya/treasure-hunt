import React, { useState }  from 'react';
import { SafeAreaView, Text, View , TextInput, Button} from 'react-native';
import Styles from './Styles';
import { db } from './FirebaseManager';

const Signup = ({navigation, route}) => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const signUpPressed = () => {

        if(!name.trim()){
            alert("Please enter your name");
        }
        else if(!username.trim()) {
            alert("Please enter your username");
        }

        else if (!password.trim()){
            alert("Please enter your password");
        }

        else{
            
            db.collection("users").get()
            .then((querySnapshot) => {
                    
                    var doesUserExist = false;
                    querySnapshot.forEach((snapshot) => {
                       
                        if(snapshot.data().username === username){
                            doesUserExist = true;
                        }
                        
                    });
                    if(doesUserExist){
                        alert(username+" already has an account. Please log in.");
                        
                    }
                    else{

                        let newUser = {
                            name: name,
                            username: username,
                            password: password
                        }

                        return db.collection("users").add(newUser);
                        
                    }

                    })
            .then(() => {
                alert("sign up successful");
                // navigation.popToTop();
            })
            .catch( (error) => {
                alert("Error while adding / getting user: "+error);
            })
        }
    }

    return(
        <SafeAreaView style={Styles.container}>

        <Text style={Styles.text}>Name: </Text>
        <TextInput style={Styles.input} placeholder="enter your name" value={name} onChangeText={setName} textContentType="name"></TextInput>

        <Text style={Styles.text}>Email: </Text>
        <TextInput style={Styles.input} placeholder="enter your email address" value={username} onChangeText={setUsername} textContentType="emailAddress"></TextInput>
       
        <Text style={Styles.text}>Password: </Text>
        <TextInput style={Styles.input} placeholder="enter your password" value={password} onChangeText={setPassword} textContentType="password"></TextInput>

        <Button title="Sign Up" onPress={signUpPressed}/>

        
    </SafeAreaView>
    )
}

export default Signup;
