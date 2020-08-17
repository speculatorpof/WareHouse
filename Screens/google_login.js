import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Base_url } from '../AppSRC/Data/Base_url';
import Loader from '../AppSRC/Components/loader.js';



const Auth_token = 'auth_token';
const Auth_email = 'auth_email';
const Auth_phone = 'auth_phonenumber';
const User_finance_balance = 'user_finance_balance'
const Scanned_Payment_Data = 'Scanned_Payment_Data'

export default class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageloading: true,
      Base_Url: Base_url,
      userInfo: null,
      loggedIn: false,
    }
  }
  

  // Before calling signIn method, we need to call Configure Method, which sets the parameters for Google Auth.
  componentDidMount() {
      this.setState({pageloading: false})
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
        webClientId: '193730604335-vkk04o1c4d6dlrrh4dmhcgu70h7t1lf4.apps.googleusercontent.com', 
        offlineAccess: true, 
        hostedDomain: '', 
        loginHint: '', 
        forceConsentPrompt: true, 
        accountName: '',
        iosClientId: 'XXXXXX-krv1hjXXXXXXp51pisuc1104q5XXXXXXe.apps.googleusercontent.com'
      });
      
      //Check if user is already signed in
      this._isSignedIn();

      //  if(this.state.loggedIn === false){
      // this.props.navigation.navigate('HomeScreen')
     // } 
  }
  

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
    this.setState({ loggedIn: false });
  };

  // If user is already logged in and has a valid session,
      // the user will silently login. You can call this method as well in componentDidMount
      getCurrentUserInfo = async () => {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          this.setState({ userInfo });
          this.props.navigation.navigate('HomeScreen')
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            // user has not signed in yet
            this.setState({ loggedIn: false });
          } else {
            // some other error
            this.setState({ loggedIn: false });
          }
        }
      };
  /*
  -------Example userInfo which is returned after successful sign in.
userInfo
  {
  idToken: string,
  serverAuthCode: string,
  scopes: Array<string>, // on iOS this is empty array if no additional scopes are defined
  user: {
    email: string,
    id: string,
    givenName: string,
    familyName: string,
    photo: string, // url
    name: string // full name
  }
}
  */

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Set state after logged In
     // this.setState({ userInfo: userInfo, loggedIn: true });
     // this.storeLoginInfo(this.state.userInfo.idToken, this.state.userInfo.user.email, 'none')

      // Call Backend API to save idToken into server
      this.submitUserToken(this.state.userInfo.idToken)

      // Storage User_id_token and user_email and scanned_payment_data into AsyncStorage
      //this.props.navigation.navigate('HomeScreen')

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  
  submitUserToken(userIdToken){

    //const auth_token = userIdToken //'123432423423dfasdafadsaf1432143';
    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + 'user/bank_info_register_api/';
    const user_email = this.state.email
    
    fetch(serviceUrl, {
      method: 'POST',
      headers: {

        'Accept': 'application/json',
        'Content-Type': 'application/json',
     //   'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({

        Email: user_email,
        AutHT0kenReturn3d: userIdToken,
       
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

        if(responseJson.status == '200'){
        //  Alert.alert("ID Token was saved successfully"); 

          // Store user_phone number into AsyncStorage via variable Auth_phone
          AsyncStorage.setItem(Auth_phone, responseJson.User_phone)

        }
        }).catch((error) => {
          console.error(error);
      });
  }

  // User asyncstorage to store user info for usages later
  async storeLoginInfo(auth_token, auth_email, scanned_payment_data){
    
    let setItems = [
      [Auth_token, auth_token], 
      [Auth_email, auth_email], 
      [Scanned_Payment_Data, scanned_payment_data]
    ]
    try{
      // Async data returned after logging in 
      await AsyncStorage.multiSet(setItems)

      //console.log(AsyncStorage.getItem(Auth_token))
    }catch(error){

      //Alert.alert("storeToken went wrong")
      console.log(error)
    }
  }


  async getToken(){
    try{
      let token = await AsyncStorage.getItem(Auth_token);
      Alert.alert("Token:" + token)
      if(token){
        this.verifyToken(token)
      }
    }catch(error){

      Alert.alert("something went wrong")
      //console.log("somethng went wrong")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.pageloading} />
        <View style={styles.LogoBlock}>
          <Icon
            style={styles.WelcomeLogo}
            name="contactless-payment"
            color='#00CC00'
            backgroundColor='#CCFFCC'
            size={130}
            onPress={() => this.props.navigation.navigate('SettingScreen')}/>
          <Text style={styles.Slogan}>Crossborder Micro-Payment Handler</Text>
        </View>
        <View style={styles.LoginButton}>
          <Icon
            style={styles.LoginIconBtn}
            name="google"
            color='#006600'
            backgroundColor='#CCFFCC'
            size={50}/>
          <Text style={styles.btnlogin}
            onPress={this._signIn}>Login with Gmail</Text>
        </View>   
        <View style={styles.SecureButton}>
          <Icon
            style={styles.SecureIconBtn}
            name="lock-alert"
            color='#00CC99'
            backgroundColor='#CCFFCC'
            size={30}
            onPress={() => this.props.navigation.navigate('SecurityScreen')}/>
          <Text style={styles.btnSecure}
            onPress={()=> this.props.navigation.navigate('SecurityScreen')}>
              Lock-up my account
          </Text>
        </View>   
        <View style={styles.btnNotice}>
          <Text style={styles.NoticeText}>By clicking Login you agree to <Text style={styles.btnExtend} onPress={()=> this.props.navigation.navigate('TermsScreen')}>Terms of use</Text>
          </Text>
        </View>   
      </View>
    );
  }
}

const styles = ({  
  container: {  
    flex: 1, 
    backgroundColor: '#CCFFCC',
    alignItems: 'center',
    justifyContent: 'center', 
},
  LogoBlock:{
    bottom: 100
  },
  WelcomeLogo:{
    textAlign: 'center',
  },
  Slogan:{
    justifyContent: 'center', 
  },
  LoginButton:{
    flexDirection: 'row',
    height: 60,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnlogin:{
    fontSize: 20, 
    lineHeight: 60,
    textAlign: 'center',
    justifyContent: 'center', 
  },
  LoginIconBtn:{
    paddingRight: 10
  },
  SecureButton:{
    flexDirection: 'row',
    height: 40,
    width: '90%',
    top: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecure:{
    fontSize: 15, 
    textAlign: 'center',
    justifyContent: 'center', 
    color: '#444444',
    paddingLeft: 10
  },
  btnNotice:{
    top: 160,
  },
  NoticeText:{
    color: '#555555',
  },
  btnExtend:{
    color: '#00CC99',
    textDecorationLine: "underline",
  },
});  