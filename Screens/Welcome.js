import * as React from 'react';
import { Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Base_url } from '../AppSRC/Data/Base_url';
import Loader from '../AppSRC/Components/loader.js';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { AuthContext } from '../AppNavigator'
import auth from '@react-native-firebase/auth';


const Auth_token = 'auth_token';
const Auth_email = 'auth_email';
const Auth_type = 'auth_type';



export const Welcome = ({ navigation }) => {
  // Declare dispatch as a function
  const { dispatch }   = React.useContext(AuthContext);
  const [Email, setEmail] = React.useState(null);
  const [Password, setPassword] = React.useState(null);
  const [userInfo, setuserInfo] = React.useState([]);

  const initialState = {
    //pageloading: true,
    isSignout: true,
   // userInfo: null,
    userToken: null,
    pageloading: true,
    Email: null,
    Password: null,
  };


  // useEffect equivalents to ComponentDidmount in class-based component
  React.useEffect(() => {
      //this.setState({pageloading: false})
      
      const fetchData = async () => {

        GoogleSignin.configure({
          scopes: ['email'], 
          webClientId: '649054220524-2ue6iaqv49hslf09f63f6f3r94b97qrb.apps.googleusercontent.com', 
          offlineAccess: true, 
          hostedDomain: '', 
          loginHint: '', 
          forceConsentPrompt: true, 
          accountName: '',
          iosClientId: 'XXXXXX-krv1hjXXXXXXp51pisuc1104q5XXXXXXe.apps.googleusercontent.com',
        });}
        fetchData();
   //   console.log('updated2')
      // Check if user is logged in
  //    _isSignedIn();
   // _getCurrentUserInfo()
 },[] );

 async function onGoogleButtonPress() {
  // Get the users ID token
  //const { idToken } = await GoogleSignin.signIn();
  try {
    await GoogleSignin.hasPlayServices();
    const {accessToken, idToken} = await GoogleSignin.signIn();
    _getCurrentUserInfo();
    //setloggedIn(true);
    const credential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );
    await auth().signInWithCredential(credential);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      alert('Cancel');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      alert('Signin in progress');
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      alert('PLAY_SERVICES_NOT_AVAILABLE');
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }

}


/*-------Example userInfo which is returned after successful sign in.
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
  const _isSignedIn = async () => {

  const isSignedIn = await GoogleSignin.isSignedIn();

  if (isSignedIn) {
    alert('User is already signed in');
    //Get the User details as user is already signed in
    _getCurrentUserInfo();
  } else {
    //alert("Please Login");
    console.log('Please Login');
  }
};

// If user is already logged in and has a valid session,
    // the user will silently login. You can call this method as well in componentDidMount
  const  _getCurrentUserInfo = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        dispatch({type: 'SIGN_IN', userToken: userInfo.idToken, userEmail: userInfo.idToken.user.email, userType: 'WareHouse'})

      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          // user has not signed in yet
          alert('Not signin')
          this.setState({ loggedIn: false });
        } else {
          // some other error
          alert('Not signin')
         // this.setState({ loggedIn: false });
        }
      }
    };

    const submitUserToken = async(userIdToken)=>{

      //const auth_token = userIdToken //'123432423423dfasdafadsaf1432143';
      //const { navigate } = this.props.navigation;
      const serviceUrl = Base_url + 'api/dashboard/auth/firebase-login';
      
      fetch(serviceUrl, {
        method: 'POST',
        headers: {
  
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       //   'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
  
          token: userIdToken,
         
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
  
          if(responseJson.status == '200'){
          //  Alert.alert("ID Token was saved successfully"); 
  
            // Store user_phone number into AsyncStorage via variable Auth_phone
            AsyncStorage.setItem(Auth_phone, responseJson.User_phone)
            dispatch({type: 'SIGN_IN', userToken: userInfo.idToken, userEmail: userInfo.idToken.user.email, userType: responseJson.data.user.roles_name})

          }
          }).catch((error) => {
            console.error(error);
        });
    }  

  const _signIn1 = async () => {

    //AsyncStorage.setItem({Auth_phone: '12321938', Auth_Type:1})
    dispatch({type: 'SIGN_IN', userToken: '999999', userEmail:'sale@gmail.com', userType: 'Sale'})

  }
  const _signIn2 = async () => {
    //AsyncStorage.setItem({Auth_phone: '12321938', Auth_Type:1})
    dispatch({type: 'SIGN_IN', userToken: '999999', userEmail:'warehouse@gmail.com', userType: 'WareHouse'})

  }
  const _signIn3 = async () => {
    //AsyncStorage.setItem({Auth_phone: '12321938', Auth_Type:1})
    dispatch({type: 'SIGN_IN', userToken: '999999', userEmail:'coordinator@gmail.com', userType: 'Coordinator'})

  }

  

  const _signIn = async () => {
 //   alert('login')
 //   const Email = Email

    const serviceUrl = 'https://dev-api.anista.vn/api/dashboard/auth/login';
  //  const gguser_email = gg_userInfo.user.email
  //  const gguser_token = gg_userInfo.idToken
    
    fetch(serviceUrl, {
      method: 'POST',
      headers: {
     //   "Authorization": "Bearer {token}",
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    //   'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({

        email: 'duongtuananh68@gmail.com',
        password: '12345678',
      
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

     // console.log(responseJson)
      if(responseJson.code == 200){
        //  console.log(JSON.stringify(responseJson.data.user.roles_name));
        // alert(JSON.stringify(responseJson.data.user.roles_name))

        dispatch({type: 'SIGN_IN', userToken: responseJson.data.access_token, 
         userEmail: responseJson.data.user.email, 
         userType: JSON.stringify(['Admin', 'WareHouse', 'Sale'])})
        // if(roles_name.includes('Logistic')){

        
         // dispatch to Sign_In with variable for auth_info storage
           
        }
         // }
      if(responseJson.code == 404){
        Alert.alert('Thông tin đăng nhập không chính xác'); 
      }
      if(responseJson.code == 401){
        Alert.alert('Thông tin đăng nhập không chính xác'); 
      }}).catch((error) => {
      //    Alert.alert('Not Found'); 

          console.error(error);
      });
  };
  
  function PhoneSignIn() {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);
  
    const [code, setCode] = useState('');
  
    // Handle the button press
    async function signInWithPhoneNumber(phoneNumber) {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    }
  
    const confirmCode = async () => {
      try {
        await confirm.confirm(code);
      } catch (error) {
        console.log('Invalid code.');
      }
    }
  
    if (!confirm) {
      return (
        <Button
          title="Phone Number Sign In"
          onPress={() => signInWithPhoneNumber('+84 396-526-078')}
        />
      );
    }
  
    return (
      <>
        <TextInput value={code} onChangeText={text => setCode(text)} />
        <Button title="Confirm Code" onPress={() => confirmCode()} />
      </>
    );
  }
  
  const login = () => {
    const usertoken = '1232323';
    AsyncStorage.setItem(Auth_token, usertoken)
    dispatch({type: 'SIGN_IN', userToken: usertoken})
   // alert(JSON.parse(data))
  }

  const _signUp = ()=>{
    navigation.navigate('SignUpScreen')
  }

  const TextValidateFunction = () =>{

    var EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 

    if(Email == null || Password == null){
      Alert.alert('Mời điền thông tin đăng ký'); 

    }else{
      if(Email =='' || Password == ''){
        Alert.alert('Mời điền thông tin đăng ký'); 

      }else{
          if (Email.match(EmailRegex)){
            if(Password.length < 8){
              Alert.alert('Mật khẩu không chính xác'); 
            }else{
              Alert.alert('hợp lệ'); 
            }
              // Loading icon
          }else{
            Alert.alert('Địa chỉ thư điện tử không hợp lệ'); 
          }
        }  
      } 
    }

    return (
      <View style={styles.container}>
        <View style={styles.LogoBlock}>
          <Icon
            style={styles.WelcomeLogo}
            name="contactless-payment"
            size={80}/>
          <Text style={styles.Slogan}>Crossborder Micro-Payment Handler</Text>
        </View>
        <View style={styles.LoginBlockEl}>
          <Icon
            style={styles.LoginIconBtn}
            name="account"
            size={30}/>
          <TextInput 
            style={styles.InputTextField}
            placeholder={'Địa chỉ Email'}
            placeholderTextColor = "#666666"
            onChangeText={(Email) => {setEmail(Email)}}
            keyboardType={'default'}/>  
        </View> 
        <View style={styles.LoginBlockEl}>
          <Icon
            style={styles.LoginIconBtn}
            name="key"
            size={30}/>
          <TextInput 
            style={styles.InputTextField}
            secureTextEntry={true}
            placeholder={'Mật khẩu'}
            placeholderTextColor = "#666666"
            onChangeText={(Password) => {setPassword(Password)}}
            keyboardType={'default'}/>  
        </View>
        <View style={styles.LoginButtonEl}>
          <TouchableOpacity style={styles.LoginButton} onPress={_signIn}>
            <Text style={styles.btnlogin}>Đăng Nhập</Text>
          </TouchableOpacity >
          <TouchableOpacity style={styles.LoginButtonIcon} onPress={onGoogleButtonPress}>
            <Icon
              style={styles.LoginIcon}
              name="google"
              size={30}/>
            <Text style={styles.btnlogin}>Đăng Nhập bằng Gmail</Text>
          </TouchableOpacity >
          <TouchableOpacity style={styles.LoginButtonIcon} onPress={_signUp}>
            <Icon
              style={styles.LoginIcon}
              name="apple"
              size={30}/>
            <Text style={styles.btnlogin}>Đăng Nhập bằng Apple ID</Text>
          </TouchableOpacity >
        </View>
        
        <View style={styles.LoginBlockEl}>
          
                <Text style={styles.btnlogin1}
                    onPress={_signIn1}>Sale</Text>
                
                  <Text style={styles.btnlogin1}
                    onPress={_signIn2}>Warehouse</Text>
                  <Text style={styles.btnlogin1}
                    onPress={_signIn3}>Coordinator</Text>    
        </View> 
        <View style={styles.LoginBlockEl}>
          <Text style={styles.btnSignup} onPress={_signUp}>Đăng ký</Text>
        </View> 
      </View>
    );
  }


const styles = ({  
  container: {  
    flex: 1, 
    backgroundColor: '#CCFFCC',
    alignItems: 'center',
    justifyContent: 'center', 
},
  LogoBlock:{
    bottom: '10%'
  },
  WelcomeLogo:{
    textAlign: 'center',
    color: '#00CC00'
  },
  Slogan:{
    justifyContent: 'center', 
  },
  LoginBlockEl:{
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center', 
    height: 40,
  },
  LoginIconBtn:{
    paddingRight: 10,
    width: '20%',
    color: '#006600'
  },
  InputTextField:{
    width: '70%',
    fontSize: 15,
    borderBottomWidth: 0.3
  },
  LoginButtonEl:{
    width: '75%',
    top: 10
  },
  LoginButton:{
    width: '100%',
    height: 35,
    margin: 4,
    backgroundColor: '#009900',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
  },
  LoginButtonIcon:{
    flexDirection: 'row',
    width: '100%',
    height: 35,
    margin: 5,
    backgroundColor: '#009900',
    alignItems: 'center',
    borderRadius:10,
  },
  LoginIcon:{
    color: '#fff',
    width: '20%',
    paddingLeft: 10
  },
  btnlogin:{
    color: '#fff',
    fontSize: 16,
  },
  btnSignup:{
    color: '#00FFFF',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
});  

export default Welcome;
