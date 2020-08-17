import * as React from 'react';
import { Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Base_url } from '../AppSRC/Data/Base_url';
import Loader from '../AppSRC/Components/loader.js';
import { AuthContext } from '../AppNavigator'
import auth from '@react-native-firebase/auth';


const Auth_token = 'auth_token';
const Auth_email = 'auth_email';
const Auth_type = 'auth_type';



export const SignUp = ({ navigation }) => {
  // Declare dispatch as a function
  const { dispatch }   = React.useContext(AuthContext);
  const [Email, setEmail] = React.useState(null);
  const [Password, setPassword] = React.useState(null);
  const [RePassword, setRePassword] = React.useState(null);

  const initialState = {
    //pageloading: true,
    isSignout: true,
   // userInfo: null,
    userToken: null,
    Email: null,
    Password: null,
    RePassword: null,
    pageloading: true,
  };


  // useEffect equivalents to ComponentDidmount in class-based component
  React.useEffect(() => {
      //this.setState({pageloading: false})
      const fetchData = async () => {

      }
      fetchData();
      console.log('updated2')

 },[] );



  const _signUp = async () => {

 //   const Email = Email

    const serviceUrl = 'http://dev.api.anista.vn/api/auth/login';
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

        email: Email,
        password: Password,
      
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

      console.log(responseJson)
      if(responseJson.code == 200){
          Alert.alert(JSON.stringify(responseJson.data.user.roles_name));
         
         // dispatch to Sign_In with variable for auth_info storage
            dispatch({type: 'SIGN_IN', userToken: responseJson.data.access_token, 
                                       userEmail:responseJson.data.user.email, 
                                       userType: 'WareHouse'})

          }
      if(responseJson.code == 404){
        Alert.alert('Thông tin đăng nhập không chính xác'); 
      }}).catch((error) => {
          Alert.alert('Not Found'); 

          console.error(error);
      });
  };

  const TextValidateFunction = () =>{

    var EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 

    if(Email == null || Password == null || RePassword == null){
      Alert.alert('Mời điền thông tin đăng ký'); 

    }else{
      if(Email =='' || Password == '' || RePassword == ''){
        Alert.alert('Mời điền thông tin đăng ký'); 

      }else{
          if (Email.match(EmailRegex)){
            if(Password.length < 8 || RePassword.length < 8){
              Alert.alert('Mật khẩu không đủ 8 ký tự'); 
            }else{
              if(Password !== RePassword){
                Alert.alert('Nhập lại mật khẩu không chính xác'); 
              }else{
                Alert.alert('hợp lệ'); 
              }
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
        <View style={styles.LoginBlockEl}>
          <Icon
            style={styles.LoginIconBtn}
            name="key"
            color='#006600'
            backgroundColor='#CCFFCC'
            size={30}/>
          <TextInput 
            style={styles.InputTextField}
            secureTextEntry={true}
            placeholder={'Nhập lại mật khẩu'}
            placeholderTextColor = "#666666"
            onChangeText={(RePassword) => {setRePassword(RePassword)}}
            keyboardType={'default'}/>  
        </View>
        <TouchableOpacity style={styles.LoginButton} onPress={TextValidateFunction}>
          <Text style={styles.btnlogin}>Đăng Ký</Text>
        </TouchableOpacity >
        <View style={styles.btnNotice}>
          <Text style={styles.NoticeText}>Đăng ký và đồng ý với các <Text style={styles.btnExtend} onPress={()=> navigation.navigate('TermsScreen')}>Điều khoản sử dụng</Text>
          </Text>
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
    height: 40,
    alignItems: 'center',
    justifyContent: 'center', 
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
  LoginButton:{
    width: '75%',
    height: 35,
    margin: 20,
    backgroundColor: '#009900',
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius:10,
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

export default SignUp;
