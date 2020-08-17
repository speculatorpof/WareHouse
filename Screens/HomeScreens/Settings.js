import React, { Component } from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../AppSRC/Components/loader.js';
import { AuthContext } from '../../AppNavigator';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

import CustomAlertComponent from '../../AppSRC/Components/CustomAlertComponent';
import { Base_url } from '../../AppSRC/Data/Base_url';

const Auth_token = 'auth_token';
const Auth_email = 'auth_email';

export const Settings = ({ navigation, route }) => {

  // Declare dispatch as a function
  const { dispatch }   = React.useContext(AuthContext);
  // const Base_Url = Base_Url;
  
  const [displayAlertloading, SetRequestHandle] = React.useState(false)
  const [userToken, SetUserToken] = React.useState('1234') //add value to force logging out
  const [userType, SetUserType] = React.useState('2') //add value to force logging out
  //const [ authToken, GetAuthTokenParam ] = React.useParams();
  //const [ authEmail, GetAuthEmailParam ] = React.useParams();
  const { authToken } = route.params;
  const { authEmail } = route.params;


  const initialState = {
    displayAlertloading: false,
    isSignout: true,
    pageloading: true,
  };


  // useEffect is similiar to ComponentDidmount
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      

     // let userToken;

 //     try {
    //    userToken = await AsyncStorage.getItem(Auth_token);
     //   console.log( JSON.parse(AsyncStorage.getItem(Auth_token)))
      //  SetUserToken(userToken)
      //} catch (e) {
        // Restoring token failed
     // }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
     // dispatch({ type: 'RESTORE_TOKEN', userToken: userToken, userType: userType });
    };

    bootstrapAsync();
  }, []);

  const SignOutAsking = () => {
      SetRequestHandle(true)
  }

  const onPressAlertPositiveButton = () => {
    // alert('Positive Button Clicked');
      dispatch({type: 'SIGN_OUT', userToken: null, userEmail:null, userType: null})

      //signOut()
      SetRequestHandle(false)
   };
 
  const onPressAlertNegativeButton = () => {
   //  alert('Negative Button Clicked');
      SetRequestHandle(false)
   };

//  const signOut2 = async() => {
  //  await AsyncStorage.removeItem(Auth_token).then(() => console.log('item removed...'))
  //  .catch((err) => console.log('err: ', err))

  //}
  const GooglesignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };
  const signOut = async () => {
   // AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys))

   // const auth_token = await AsyncStorage.getItem(Auth_token) //'123432423423dfasdafadsaf1432143';
   // const user_email = await AsyncStorage.getItem(Auth_email)

    //const { navigate } = this.props.navigation;
    const serviceUrl = Base_url + 'user/signout/';
    // Remove UserToken from server

    fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
     //   'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({

        Email: authEmail,
        AutHT0kenReturn3d: authToken,
       
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

        if(responseJson.status == 200){
          try {
            AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys))

            } catch (error) {
            console.error(error);
          }
            // Log user out from Google
            //GoogleSignin.revokeAccess();
          //  GoogleSignin.signOut();
            dispatch({type: 'SIGN_OUT', userToken: null, userEmail:null, userType: null})
          }
        }).catch((error) => {
          console.error(error);
      });
   
  };

  const Address = () =>{
    navigation.navigate('AddressScreen')
  }

  const Feedback = () =>{
    navigation.navigate('FeedbackScreen')
  }

  const AboutUs = () =>{
    navigation.navigate('AboutScreen')
  }

    return (
      <View style={styles.container}>
        <CustomAlertComponent
              displayAlert={displayAlertloading}
              displayAlertIcon={true}
              displayAddressIcon={false}
              alertTitleText={' Quay về ví'}
              alertMessageText={'Bạn muốn quay về ví?'}
              displayPositiveButton={true}
              positiveButtonText={'Quay về'}
              displayNegativeButton={true}
              negativeButtonText={'Để sau'}
              onPressPositiveButton={onPressAlertPositiveButton}
              onPressNegativeButton={onPressAlertNegativeButton}
            />  
        <ScrollView vertical={true}>
          <View style={styles.topContainer}>
            <Text style={styles.titleTopText}>Quản lý thông tin</Text>
          </View>
          <View style={[styles.bodyContainer]}>
            <View style={styles.btnSettings}>
              <Icon
                    style={styles.iconStyle}
                    name="email"
                    size={25}/>
              <Text style={styles.displayText}>{authEmail}</Text>    
            </View>  
          </View>
          <View style={[styles.bodyContainer]}>
            <View style={styles.btnSettings}>
              <Icon
                    style={styles.iconStyle}
                    name="cellphone"
                    size={25}/>
              <Text style={styles.displayText}>0396526078</Text>
            </View>  
          </View>
          <View style={[styles.bodyContainer]}>
            <View style={styles.btnSettings}>
              <Icon
                    style={styles.iconStyle}
                    name="home-map-marker"
                    size={25}/>
              <Text style={styles.buttonText} 
                onPress={Address}>Thông tin cá nhân</Text>
            </View>  
          </View>
          <View style={styles.ContainerBoder}></View>
          <View style={styles.topContainer}>
            <Text style={styles.titleTopText}>Cài đặt chung</Text>
          </View>
          <View style={[styles.bodyContainer]}>
            <View style={styles.btnSettings}>
              <Icon
                    style={styles.iconStyle}
                    name="comment-question"
                    size={25}/>
              <Text style={styles.buttonText} 
                  onPress={Feedback}>Phản hồi dịch vụ</Text>
            </View>    
          </View>  
          <View style={[styles.bodyContainer]}>
            <View style={styles.btnSettings}>
              <Icon
                    style={styles.iconStyle}
                    name="information"
                    size={25}/>
              <Text style={styles.buttonText} 
                  onPress={AboutUs}>Về chúng tôi</Text>
            </View>    
          </View>    
          <View style={[styles.bodyContainer]}>  
            <View style={styles.btnSettings}>
              <Icon
                    style={styles.iconStyle}
                    name="power-off"
                    size={25}/>
              <Text style={[ styles.buttonText, styles.btnLogout]} 
                  onPress={SignOutAsking}>Đăng xuất</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      
    );
  };


const styles = ({  
  container: {  
    flex: 1, 
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
},
  topContainer:{
    height: 40,
    width: '95%',
    marginLeft: 10,
    justifyContent: 'center'
  },
  titleTopText:{
    fontSize: 12,
    color: '#009900'
  },
  bodyContainer:{
    width: '95%',
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
  },
  ContainerBoder:{
    height: 1,
    width: '95%',
    marginLeft: 10,
    marginBottom: 25,
    color: '#CCFFFF',
    backgroundColor: '#fff'
  },
  btnSettings:{
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  iconStyle:{
    color: '#009900',
  },
  titleText:{
    color: '#009900',
  },
  buttonText:{
    paddingLeft: 15,
    lineHeight: 40,
    color: '#111111',
    fontSize: 10,
  },
  displayText:{
    paddingLeft: 15,
    lineHeight: 40,
    color: '#009900',
    fontSize: 10
  },
  ArrowIcon:{
    lineHeight: 35,
    width: '20%',
    textAlign: 'center',
  },
  btnLogout:{
    color: '#009900',
    fontWeight: 'bold',
    fontSize: 10
  },
});  

export default Settings;
