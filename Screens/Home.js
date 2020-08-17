import React, { Component } from 'react';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../AppSRC/Data/Base_url';
import Loader from '../AppSRC/Components/loader.js';
import DoneIndicator from '../AppSRC/Components/DoneIndicator';
import CustomAlertComponent from '../AppSRC/Components/CustomAlertComponent';


const Auth_token = 'auth_token';
const Auth_email = 'auth_email';
const Auth_type = 'auth_type';

export default class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
        pageloading: true,
        loading: true,
        doneAnimating: false,
        Base_url: Base_url,

        authToken: null,
        authEmail: null,
        authType: null,
    }
  }

 //Don't use var anymore
  //Use const most of the time (as often as possible)
  //Use let if the value will be changing
  componentDidMount () {

    // Page is loaded completely
    this.setState({pageloading: false})
    this.getAuthInfo()  
   // AsyncStorage.removeItem('isBarcodeScannerEnabled')
  }



  getAuthInfo = async () => {

    let getItems = [Auth_token, Auth_email, Auth_type];
    try{
      let User_info = await AsyncStorage.multiGet(getItems);

      if(User_info){
        console.log(User_info[0][1], User_info[1][1])
        // Get Finance Balance
     //   AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys))

        await this.setState({authToken: User_info[0][1], authEmail: User_info[1][1], authType: User_info[2][1]})
     //   this.getFinance_Balance(User_info[0][1], User_info[1][1])
      }
    }catch(error){

     // Alert.alert("something went wrong")
      console.log(error)
    }
  }

  ABC =() =>{
    alert('click')
  }
  ItemList = () =>{
    this.props.navigation.navigate('SaleItemListScreen', { authToken: this.state.authToken, authEmail: this.state.authEmail})

  }

  Orders = () =>{
    this.props.navigation.navigate('OrdersListScreen', { authToken: this.state.authToken, authEmail: this.state.authEmail, authType: this.state.authType})
  }

  InHouse = () => {
    this.props.navigation.navigate('WareHouseInOrdersScreen',  {authToken: this.state.authToken, authEmail: this.state.authEmail, authType: this.state.authType})
    //{CodeToScanList: null, ScanStatus: 'In', NeedToScanNumber: null})
  }

  Orders = () => {
    this.props.navigation.navigate('OrdersListScreen', {authToken: this.state.authToken, authEmail: this.state.authEmail, authType: this.state.authType})
  }

  ReturningOrders = () => {
    this.props.navigation.navigate('WareHouseReturnOrdersScreen', {authToken: this.state.authToken, authEmail: this.state.authEmail})
  }

  GoodsOrder = () => {
     this.props.navigation.navigate('WareHouseInFailedScreen', {authToken: this.state.authToken, authEmail: this.state.authEmail})
  }

  
  Report = () =>{
    this.props.navigation.navigate('ReportScreen', { authToken: this.state.authToken, authEmail: this.state.authEmail, authType: this.state.authType})
  }

  Settings = () => {
    this.props.navigation.navigate('SettingScreen', { authToken: this.state.authToken, authEmail: this.state.authEmail})
  }

  render(){
    // Set loading icon if state is in loading status
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/> 
        </View>
      )
    }}
    
  render() {
    return (
      <View style={styles.container}>
        <Loader loading={this.state.pageloading}/>
        <View style={styles.topContainer}>
          <Icon
            style={styles.Logo}
            name="contactless-payment"
            size={30}/>
        </View>
        <View> 
            <View style={styles.bodyContainerHeader}>
              <Text style={styles.WelcomeText}>Welcome {this.state.authEmail}</Text>  
            </View>
          
          <View style={styles.bodyContainerBorder}></View>
          
          <View style={styles.bodyContainer}>
            {JSON.stringify(this.state.authType).includes('Sale') &&
            <View style={styles.bodyElement}>
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.ItemList}>
                    <Icon
                      style={styles.iconStyle}
                      name="cart"
                      size={24}/>
                  </TouchableOpacity>
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Sản phẩm</Text>         
                  </View>    
              </View>
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.Orders}>
                    <Icon
                      style={styles.iconStyle}
                      name="calendar-edit"
                      size={24}/>
                  </TouchableOpacity>
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Đơn hàng</Text>         
                  </View>    
              </View>
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.Report}>
                    <Icon
                      style={styles.iconStyle}
                      name="chart-bar"
                      size={24}/>
                  </TouchableOpacity>
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Báo cáo</Text>         
                  </View>    
              </View> 
            </View>
            }
            {JSON.stringify(this.state.authType).includes('WareHouse') &&
            <View style={styles.bodyElement}>
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.InHouse}>
                    <Icon
                      style={styles.iconStyle}
                      name="home-import-outline"
                      size={24}/>
                  </TouchableOpacity>
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Nhập kho</Text>         
                  </View>    
              </View>
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.Orders}>
                    <Icon
                      style={styles.iconStyle}
                      name="calendar-edit"
                      size={24}/>  
                  </TouchableOpacity> 
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Đơn hàng</Text>         
                  </View>         
              </View>    

              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.ReturningOrders}>
                    <Icon
                      style={styles.iconStyle}
                      name="backup-restore"
                      size={24}/> 
                  </TouchableOpacity> 
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Hàng hoàn</Text>         
                  </View>
              </View>
            </View>
            }
            <View style={styles.bodyElement}>
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle}>
                    <Icon
                      style={styles.iconStyleV2}
                      name="storefront"
                      size={24}/> 
                  </TouchableOpacity> 
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Đặt hàng</Text>         
                  </View>
              </View>
              <View> 
                  <TouchableOpacity style={styles.BodyContainerEle}>
                    <Icon
                      style={styles.iconStyleV2}
                      name="chart-bar"
                      size={24}/>
                  </TouchableOpacity>
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Báo cáo</Text>         
                  </View>    
              </View>
              
              <View>
                  <TouchableOpacity style={styles.BodyContainerEle} onPress={this.Settings}>
                    <Icon 
                      style={styles.iconStyle}
                      name="account-settings"
                      size={24}/>    
                  </TouchableOpacity> 
                  <View style={styles.iconTextBlock}>
                    <Text style={styles.iconText}>Tài khoản</Text>         
                  </View>
              </View>   
            </View>
         
          </View>
        </View>
      </View>
    );
  }
}

const styles = ({  
  container: {  
    flex: 1,  
    backgroundColor: '#fff',
},
  topContainer:{
    flexDirection: 'row',
  },
  Logo:{
    lineHeight: 60,
    width: '100%',
    backgroundColor: '#F0F8FF',
    color:'#00CC00',
    textAlign: 'center',
    justifyContent: 'center', 
  },
  bodyContainerHeader:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    width: '100%',
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  WelcomeText:{
    fontSize: 12,
    color: '#111111'
  },
  BodyHeaderEle:{
    backgroundColor: "#EEEEEE",
    justifyContent: 'center',
    height: 80,
  },
  bodyContainerBorder:{
    height: 1,
    backgroundColor: "#DDDDDD",
  },
  bodyContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  bodyElement:{
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius:50,
    width: '90%',
    height: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  BodyContainerEle:{
    borderWidth:1,
    borderColor:'#98FB98',
    alignItems:'center',
    justifyContent:'center',
    width:60,
    height:60,
    backgroundColor:'#98FB98',
    borderRadius:50,
    margin: 15
  },
  BodyContainerEleV2:{
    borderWidth:1,
    borderColor:'gray',
    alignItems:'center',
    justifyContent:'center',
    width:60,
    height:60,
    backgroundColor:'gray',
    borderRadius:50,
    margin: 15
  },
  iconStyle:{
    color: '#FFFF99'
  },
  iconTextBlock:{
    alignItems:'center',
  },
  iconText:{
    fontWeight: 'bold',
    color: '#6633FF',
    fontSize: 10,
  },
  NoticeDisplay:{
    justifyContent: 'center',
    width: '90%',
  },
});  