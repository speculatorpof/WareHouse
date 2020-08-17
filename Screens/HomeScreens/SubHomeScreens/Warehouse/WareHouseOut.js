import React, { Component } from 'react';
import { Text, View, Alert, BackHandler, Picker, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../../AppSRC/Components/DoneIndicator';
import ConfirmAlertComponent from '../../../../AppSRC/Components/ConfirmAlertComponent';
import ItemRemoveAlertComponent from '../../../../AppSRC/Components/ItemRemoveAlertComponent';
import TextAlertComponent from '../../../../AppSRC/Components/TextAlertComponent';

import { CityList } from '../../../../AppSRC/Data/CityList';
import { DistrictLists } from '../../../../AppSRC/Data/DistrictList';
import { EmtyList } from '../../../../AppSRC/Data/District_Lists/1_None';

import NumberFormat from 'react-number-format';


const Auth_token = 'auth_token';
const Auth_email = 'auth_code';

export default class WareHouseOut extends Component {
  
    constructor(props){
        super(props)
        this.WareHouseHome = this.WareHouseHome.bind(this)
        this.OutHouse = this.OutHouse.bind(this);
        this.onPressOrderConfirmPositiveButton = this.onPressOrderConfirmPositiveButton.bind(this);
        this.onPressOrderConfirmNegativeButton = this.onPressOrderConfirmNegativeButton.bind(this);
        this.onPressItemRemovePositiveButton = this.onPressItemRemovePositiveButton.bind(this);
        this.onPressItemRemoveNegativeButton = this.onPressItemRemoveNegativeButton.bind(this);
        this.ShipperScan = this.ShipperScan.bind(this);
        this.state = {
          pageloading: true,
          loading: false,
          doneAnimating: false,
          success_handle: false,
          displayAlertloading: false,
          Alert: false,
          AlertText: null,
          itemRemoveAsking: false,
          removeSKUCode: null,
          ConfirmAksing: false,
          Base_url: Base_url,

          authToken: null,
          authEmail: null,
          
          Phone: null,
          shipperCode: null,
          InCartItemList: props.route.params.CartItemList,
          shipingUnitCode: null,
          ShipUnitList: [{name: 'Giao hàng nhanh', code: 'GHN'},
                          {name: 'Giao hàng tiết kiệm', code: 'GHTK'},
                          {name: 'Giao hàng Grab', code: 'GRAB'},
                          {name: 'Giao hàng AHAMOVE', code: 'AHAMOVE'},
                          {name: 'Fini', code: 'FINI'}
                        ],
          NeedToScanNumber: props.route.params.NeedToScanNumber,
          TotalBill: props.route.params.totalBill,
          ItemNumber: 0,
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){

    this.setState({pageloading: false});
    this.initialItemNumberCheck()
    this.getAuthInfo()

    // Trigger function as screen is changed (back or next)
    this.props.navigation.addListener('blur', () => {
      this.backfunction()
    });
  }



  // Back function to reset Items in cart
  backfunction(){
    const { params } = this.props.route;

    // Call back function in the previous component with newly updated list
    params.onCartBack(this.state.InCartItemList)
  }



getAuthInfo = async () => {

  let getItems = [Auth_token, Auth_email];
  
  try{
    let User_info = await AsyncStorage.multiGet(getItems);

    if(User_info){
      //console.log(token[1][1])
      // Get scanned Data
      this.setState({authToken: User_info[0][1], authEmail: User_info[1][1]})
     // Alert.alert(User_info[1][1])
    }
  }catch(error){

    //Alert.alert("something went wrong")
    console.log(error)
  }
}
  
// 4. Create componentWillUnmount() function and again remove event listener with 
// BackHandler component. It will remove the event listener on back button press event.

  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false} )
    }, 1500); // setState will be called after 1,5s
  }

  initialItemNumberCheck(){
    const objInItemList = this.state.InCartItemList
    this.setState({ItemNumber: objInItemList.length})
   // alert(JSON.stringify(objInItemList))
  }

  ShipperScan = () =>{
   this.props.navigation.navigate('WareHouseShipScanScreen', { onShipBack: this.ShipperUpdate.bind(this)})
  }
  
  async ShipperUpdate(ShipperCode){
    // Update ShipperCode
    await this.setState({shipperCode: ShipperCode})
  }

  ItemRemove = (itemSKUCode) =>{
    this.setState({removeSKUCode: itemSKUCode, itemRemoveAsking: true})
  }

  OutHouse = () => {
    if(this.state.ItemNumber == 0){
      this.Alert('Oh! Bạn chưa có đơn hàng nào!')
    }else{
      this.setState({ConfirmAksing: true})
    }
  }

  
  // Item Remove Buttons
  onPressItemRemovePositiveButton = () => {
    
    // Remove item from list as user set number = 0 filter ones different from the given code then reset list
    const objects = this.state.InCartItemList.filter(obj => obj.itemSKUCode !== this.state.removeSKUCode);
   // alert(JSON.stringify(objects))
    this.setState({ InCartItemList: objects });
    //alert(JSON.stringify(this.state.InCartItemList))
    this.setState({itemRemoveAsking: false})

    // Re-count numbers of itemrs
    this.setState({ItemNumber: objects.length})
  };
 
   onPressItemRemoveNegativeButton = () => {
   //  alert('Negative Button Clicked');
      this.setState({itemRemoveAsking: false})
   };

  // Order Asking Buttons
  onPressOrderConfirmPositiveButton = () => {  
    this.setState({ConfirmAksing: false})
    const NeedToScanNumber = this.state.NeedToScanNumber;
    const CurrentItemNumber = this.state.ItemNumber;
    if(CurrentItemNumber < NeedToScanNumber){
      this.Alert('Chưa đủ số sản phẩm cho đơn hàng')
    }else{
      this.TextValidateFunction()
    }
   };
 
  onPressOrderConfirmNegativeButton = () => {
   //  alert('Negative Button Clicked');
     this.setState({ConfirmAksing: false})
  };

  WareHouseHome = () => {
    this.props.navigation.navigate('WareHouseHomeScreen')
  }
  
  TextValidateFunction = () =>{

    // This assgins 2 variable to 2 equivalent local Textinput variables 
    const phone = this.state.Phone;
    alert(phone)
    var PhoneRegex10digit = /^[0]\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var PhoneRegex11digit = /^[0]\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{5})$/;

    if(phone == null){
        this.Alert('Mời nhập số điện thoại của người vận chuyển')
        this.setState({orderAskingLoading: false})

    }else{
      if(phone === ''){
        this.Alert('Mời nhập số điện thoại của người vận chuyển')
        this.setState({orderAskingLoading: false})

      }else{
          if (phone.match(PhoneRegex10digit) || phone.match(PhoneRegex11digit)){
              // Loading icon
              this.OutHouseREQUEST()
              alert(' Thanh cong')
          }else{
            this.Alert('Số điện thoại không hợp lệ')
            this.setState({orderAskingLoading: false})

          }
        }  
      } 
    }

  OutHouseREQUEST = () => {
    // Trigger off loading icon
   // this.setState({loading: true})

    const authToken = this.state.authToken;
    const OutHouseItemList = this.state.InCartItemList;
    const authEmail = this.state.authEmail;
    const shipUnitCode = this.state.shipingUnitCode;
    const shipperCode = this.state.shipperCode;
    const shipperPhone = this.state.Phone;

    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + '/OutHouseRequest';
    this.setState({ loading: true }, () => {
      fetch(serviceUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       //   'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          WareHouseEmail: authEmail,
          itemList: OutHouseItemList,
          shipperPhone: shipperPhone,
       //   shipperCode: shipperCode,
          shipUnitCode: shipUnitCode,
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
        
          if(responseJson.status == 403){
            this.Alert('Tất cả sản phẩm vừa được quét không phải từ kho của bạn')
          }
          if(responseJson.status == 201){
               this.props.navigation.navigate('WareHouseInFailedScreen', {ReturnedItems: responseJson.Data.ReturnedItems})
   
             }
          if(responseJson.status == 200){
            this.setState({ loading: false });
            this.setState({ doneAnimating: true });
            Alert.alert("Xuất hàng thành công");
            // Reset Scanned Payment Data
            // Back to Home
            this.props.navigation.navigate('WareHouseHomeScreen')
          }
          }).catch((error) => {
            console.error(error);
        });
    });  
  }

    
    render() {

        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
            <Loader
              loading={this.state.loading} />
            <DoneIndicator
              loading={this.state.doneAnimating} />
            <TextAlertComponent 
              displayAlert={this.state.Alert}
              alertMessageText={this.state.AlertText}
            />    
            <ItemRemoveAlertComponent
              displayAlert={this.state.itemRemoveAsking}
              displayAlertIcon={true}
              alertTitleText={'Cảnh báo!'}
              alertMessageText={'Bạn muốn bỏ sản phẩm này khỏi rỏ hàng'}
              displayPositiveButton={true}
              positiveButtonText={'Bỏ'}
              displayNegativeButton={true}
              negativeButtonText={'Không'}
              onPressPositiveButton={this.onPressItemRemovePositiveButton}
              onPressNegativeButton={this.onPressItemRemoveNegativeButton}
            />  
            <ConfirmAlertComponent
              displayAlert={this.state.ConfirmAksing}
              displayAlertIcon={true}
              alertTitleText={'Mời xác nhận xuất kho'}
              alertMessageText={'Số lượng sản phẩm:\n' +  '\n - ' + this.state.ItemNumber + ' sản phẩm'}
              displayPositiveButton={true}
              positiveButtonText={'Xác nhận'}
              displayNegativeButton={true}
              negativeButtonText={'Để sau'}
              onPressPositiveButton={this.onPressOrderConfirmPositiveButton}
              onPressNegativeButton={this.onPressOrderConfirmNegativeButton}
            />  
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.bodyContainer}>
                {/** New block */}               
                  
                  <View styles={styles.ChecksumBlock}>
                    <NumberFormat
                      value={this.state.ItemNumber}
                      displayType={'text'}
                      thousandSeparator={true}
                     // suffix={' Sản phẩm'}
                      renderText={value => (
                        <TextInput
                          underlineColorAndroid="transparent"
                          editable={false}
                          style={styles.TotalBill}
                          value={'Tổng sản phẩm: ' + value + '/' + this.state.NeedToScanNumber} /> )} />  
                  </View>
                  <View>
                    <Picker
                        style={styles.PickerBox}
                        selectedValue={this.state.shippingUnitCode}
                        mode="dialog"
                        onValueChange={(value) =>
                          {this.setState({shippingUnitCode: value})}
                        }> 
                        {this.state.ShipUnitList.map((member, key)=>
                          <Picker.Item label={member.name} value={member.code} key={key}/>)
                        }  
                    </Picker>
                  </View>
                  <View>
                    <TextInput 
                        style={styles.InputTextField}
                        placeholder={'Số điện thoại người vận chuyển'}
                        placeholderTextColor = "#666666"
                        onChangeText={(Phone) => this.setState({Phone})}
                        keyboardType={'numeric'}/>
                  </View>
                <ScrollView vertical={true} style={styles.ScrollViewContainer}>
                  {this.state.InCartItemList.map((item, i)=>

                    <View style={styles.ItemEditBox} key={i}>
                      <View style={styles.ItemEl}>
                        <View style={styles.ItemInfoEl}>
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}>{item.itemName.toUpperCase()} :   </Text>  
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextDes}>{item.itemDes.toUpperCase()}</Text>   
                        </View>    
                         
                        <View style={styles.InputBoxEdit}>
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}>Mã: {item.itemSKUCode.toUpperCase()}</Text>
                        </View>
                      </View>
                      <View style={styles.IconEl}>
                        <Icon
                          name="close"
                          color='#FFFFFF'
                          size={20}
                          onPress={this.ItemRemove.bind(this, item.itemSKUCode)} />
                      </View>
                        
                    </View>
                    )}
                  </ScrollView>
                  
                </View>
            </View>
           
            <View style={[styles.overlay, styles.bottomOverlay]}>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.OutHouse}>   Xuất kho   </Text>
                </View>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.WareHouseHome}>   Trang chủ   </Text>
                </View>    
            </View>    
          </View>
        );
      }
    }
    
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  bodyContainer: {
    width: '95%',
    height: 480
  },
  ShipperBox:{
    flexDirection: 'row',
    backgroundColor: 'green',
    top: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ShipperTextItem:{
    color: '#fff'
  },
  ScrollViewContainer:{
    flex: 1,
    height: '100%',
    top: 15,
  },
  InputBoxEdit:{
    flexDirection: 'row',
  },
  ItemEditBox:{
    flexDirection: 'row',
    width: '100%',
    height: 70,
    marginBottom: 5,
    backgroundColor: '#CCFFCC',
    borderRadius: 10,
    alignItems: 'center',
  },
  ItemEl:{
    width: '90%',
    borderRadius: 10,
  },
  ItemInfoEl:{
    flexDirection: 'row'
  },
  IconEl:{
    borderRadius: 5,
    backgroundColor: '#009900',
  },
  ItemTextTitle:{
    lineHeight: 30,
    paddingLeft: 10,
    color: '#006600',
    fontSize: 10,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  ItemTextDes:{
    lineHeight: 30,
    paddingLeft: 10,
    color: 'red',
    fontSize: 10,
    alignItems: 'center'
  },
  TotalBill:{
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#006600',
    color: '#006600',
    fontSize: 10,
    height: 40,
    top: 8
  },
  bottomOverlay: {
    bottom: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  InputDisplay:{
    color: 'green'
  },
  SubmitBtn:{
    top: 60,
    color: '#00CC33'
  },
  btnSettings:{
    justifyContent: 'center',
    padding: 5,
  },
  titleText: {
    lineHeight: 25,
    textAlign: 'center',
    color: '#fff',
    fontSize: 10,
    backgroundColor: "#006600",
    borderRadius:16,
  },
} 