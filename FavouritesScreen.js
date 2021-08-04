import React ,{useEffect,useState} from 'react';
import { View, Text ,ActivityIndicator,FlatList, SafeAreaView, Pressable,Alert,StyleSheet,AsyncStorage} from 'react-native';
import { db } from './FirebaseManager';


const FavouritesScreen = ({navigation,route}) => {
  let user="";
   let userObj={};
   let userFavArray=[];
   let matchedFavsArray=[];
   const [favouritesArrayToDisplay,setfavouritesArrayToDisplay] = useState([]);
   const [isLoading,setLoading]=useState(true);
   const [msg,setMsg] = useState("");

const showFavourites = () =>{
   
    db.collection("users").where("username","==",user).get()
    .then((querySnapShot) => {
        if(querySnapShot.size === 0 ){
            console.log("cloulndt find matching  user");
            setLoading(false);

        }else{
            querySnapShot.forEach((doc) => {
                userObj=doc;
            });

            if("favourites" in userObj.data()){
              if(userObj.data().favourites.length === 0){
                setMsg("You have not added any items to favourites yet");
                setLoading(false);
              }
                userFavArray=userObj.data().favourites;
                db.collection("caches").get()
                .then((querySnapShot) =>{
                    if(querySnapShot.size === 0){
                        console.log("no caches available");
                        setMsg("You have not added any items to favourites yet");
                        setLoading(false);
                    }else{
                        querySnapShot.forEach((doc) => {
                       //  matchedFavsArray.push(doc)  
                         if(userFavArray.includes(doc.id)){
                                matchedFavsArray.push(doc);
                         }
                        });
                        setfavouritesArrayToDisplay(matchedFavsArray);
                        setLoading(false);
                        
                    }
                }
                )
                .catch();

                 
              }else{
                setMsg("You have not added any items to favourites yet");
                setLoading(false);
                console.log("u have not added anything to favourites");
              }
        }


        
    })
    .catch((err) => {
        console.log(err);
    });
}

const goToDetailsScreen = (item) => {
    AsyncStorage.getItem("username")
    .then((data) => {console.log(data);
      user=data; 
      navigation.navigate("CacheDetails",{locationInfo:item,user:user});
    })
    .catch((err)=>{console.log(err)});
    
   
  }
    useEffect(() => { 
      console.log("reached fav screen useefect");
       AsyncStorage.getItem("username").then((data)=> {
         user=data;
         console.log("fav user effect");
         console.log(user);
        showFavourites();
       }).catch((err) => console.log(err));
         
        },[]);
    return(
        <View>
            {/* <Text style={styles.page_title}>Favourites</Text> */}
            {isLoading ? (<ActivityIndicator animating={true} size="large"/>) : (
                <FlatList
                data={favouritesArrayToDisplay}
                keyExtractor = {(item,index) => {return item.id}}
                renderItem={({item,index}) => ( <Pressable  onPress={() => goToDetailsScreen({id:item.id,location:{latitude:parseFloat(item.data().latitude),longitude:parseFloat(item.data().longitude)},title:item.data().cacheName,desc:item.data().cacheDescription})}  >
                <View style={styles.list_item}>
                   <View style={styles.flex}>
                   <Text  style={styles.cache_title}>{item.data().cacheName}</Text>
                   </View>
                    
                    {/* <Text style={styles.latnlong}>{parseFloat( item.data().latitude).toFixed(3)}</Text>
                    <Text style={styles.latnlong}>{parseFloat( item.data().longitude).toFixed(3)}</Text>   */}
                    
                    <View style={styles.seperator}/> 
                </View>
               
                </Pressable>
                )}

                />
                
            )}
             <Text>{msg}</Text>
           
        </View>
    );
}




const styles=StyleSheet.create({
  list_item:{

    borderColor:'black',
    borderBottomWidth: 2,
    marginTop: 5,
    padding: 15,
    flex: 1,
},
    seperator:{
      height:5,
      backgroundColor:'white'
  },
  cache_title:{
    color:'black',
    fontSize:25,
    fontWeight:'bold',
    flex: 3,
  },

  flex:{
    flexDirection:'row'
  },
  page_title:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:30,
    color:'#009200',
    margin:10
  },
  latnlong:{
    fontSize:15,
    color:'yellow',
    paddingStart:10
  }
});

export default FavouritesScreen;