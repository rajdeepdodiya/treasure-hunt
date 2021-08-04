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

const showFavourites = () =>{
   
    db.collection("users").where("username","==",user).get()
    .then((querySnapShot) => {
        if(querySnapShot.size === 0 ){
            console.log("cloulndt find matching  user");
        }else{
            querySnapShot.forEach((doc) => {
                userObj=doc;
            });
            
            if("favourites" in userObj.data()){
                userFavArray=userObj.data().favourites;
                db.collection("caches").get()
                .then((querySnapShot) =>{
                    if(querySnapShot.size === 0){
                        console.log("no caches available");
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
       AsyncStorage.getItem("username").then((data)=> {
         user=data;
        showFavourites();
       }).catch((err) => console.log(err));
         
        },[]);
    return(
        <View>
            <Text style={styles.page_title}>Favourites</Text>
            {isLoading ? (<ActivityIndicator animating={true} size="large"/>) : (
                <FlatList
                data={favouritesArrayToDisplay}
                keyExtractor = {(item,index) => {return item.id}}
                renderItem={({item,index}) => ( <Pressable  onPress={() => goToDetailsScreen({id:item.id,location:{latitude:item.data().latitude,longitude:item.data().longitude},title:item.data().cacheName})}  >
                <View style={styles.list_item}>
                   <View style={styles.flex}>
                   <Text  style={styles.cache_title}>{item.data().cacheName}</Text>
                   </View>
                    
                    <Text style={styles.latnlong}>{parseFloat( item.data().latitude).toFixed(3)}</Text>
                    <Text style={styles.latnlong}>{parseFloat( item.data().longitude).toFixed(3)}</Text>  
                    
                    <View style={styles.seperator}/> 
                </View>
               
                </Pressable>
                )}

                />
            )}

        </View>
    );
}



const styles=StyleSheet.create({
    list_item:{
        backgroundColor:'#009A00',
        borderRadius:15,
        marginBottom:10,
        marginStart:15,
        marginEnd:15
    },
    seperator:{
      height:5,
      backgroundColor:'white'
  },
  cache_title:{
    color:'white',
    fontSize:25,
    fontWeight:'bold',
    paddingBottom:10,
    paddingStart:15
   
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