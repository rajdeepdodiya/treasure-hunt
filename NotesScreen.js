import React , {useEffect, useState} from 'react';
import { Text,Button,TextInput,View } from 'react-native';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import { not } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from './FirebaseManager';

const NotesScreen = ({navigation,route}) => {

    const location=route.params.location;
    const [editVar,setEditVar] = useState(false);
    const [iconname,setIconname] = useState("create");
    const [iconcolor,setIconcolor] = useState('#0000FF');
    let userObj={};
    let notesObj={};
    let notesFromDb=[];
    let notesToUpdate=[];
    let found=false;
  const user=route.params.user;

  const [input,setInput] = useState("");

  useEffect(() => {

    db.collection('users').where("username","==",user).get()
    .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
            userObj=doc;
        });

        if("notes" in userObj.data()){
            notesFromDb = userObj.data().notes;

            notesFromDb.forEach((note) => {

                if(location === Object.keys(note)[0]){
                    setInput(Object.values(note)[0]);
                
                }
              
                
                });

        }


        
    })
    .catch((err) => {
        console.log(err);
    });




  },[]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight : () => ( 
            <Ionicons
            style={{marginRight:30}}
              name={iconname}
              size={40}
              color={iconcolor}
              onPress={() => {editPressed();}}
            />
      )
        })
      }, [navigation,{}]);
    
    const editPressed = () => {
        if(iconname === "create"){
            setIconname("checkmark");
            setIconcolor('#00A300');
            setEditVar(true);
        }else{
            setIconname("create");
            setIconcolor('#0000FF');
            setEditVar(false);
            saveNotesToDatabase();
        }
  
    }

    const saveNotesToDatabase = () => {


        db.collection("users").where("username","==",user).get()
        .then(
            (querySnapShot) => {
                querySnapShot.forEach((doc) => {
                    userObj=doc;
                });

                if("notes" in userObj.data()){
                    notesFromDb = userObj.data().notes;
                    notesFromDb.forEach((note) => {

                    if(location === Object.keys(note)[0]){
                        console.log("true");
                        found = true;
                        console.log("current input");
                        console.log(input);
                        note[location] =input;
                    
                    }
                    notesToUpdate.push(note);
                    
                    });

                    if(found === false){
                        notesObj = {[location] : input}
                        console.log("found === false");
                        console.log(notesObj);
                        notesToUpdate.push(notesObj);
                    }

                    // console.log("updated notes db array");
                    // console.log(notesFromdb);

                }else{
                    notesObj={[location]:input}
                    notesToUpdate.push(notesObj);
                }

               //update db

               db.collection("users").doc(userObj.id).update({
                   notes:notesToUpdate
               })
               .then(console.log("successfully updated notes"))
               .catch((err) => {console.log("error while updating notes");console.log(err);});
            }
        )
        .catch((err) => {
            console.log(err);
        });

    }

return(
    <View>
        

       

        <TextInput
        editable={editVar}
        multiline
        numberOfLines={10}
        value={input}
        onChangeText={setInput}
      style={{ height: '90%', borderColor: 'gray', borderWidth: 1 , margin:15}}
    />
    </View>
);
}

export default NotesScreen;