import React, { Component } from 'react';
import { Text, View, Alert, BackHandler, Image, TouchableHighlight, TextInput, ScrollView } from 'react-native';
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
const Auth_email = 'auth_email';

export default class WareHouseIn extends Component {
  
    constructor(props){
        super(props)
        this.onPressOrderConfirmPositiveButton = this.onPressOrderConfirmPositiveButton.bind(this);
        this.onPressOrderConfirmNegativeButton = this.onPressOrderConfirmNegativeButton.bind(this);
        this.state = {
          pageloading: true,
          loading: false,
          doneAnimating: false,
          success_handle: false,
          Alert: false,
          AlertText: null,
          displayAlertloading: false,
          itemRemoveAsking: false,
          removeSKUCode: null,
          ConfirmAksing: false,
          Base_url: Base_url,
          authToken: null,
          authEmail: null,

          //ReturnedItems: props.route.params.ReturnedItems,
        
          orderItemsList: [
            {name: 'bột giặt', des: 'Hương hoa nhài', itemSKUCode: '989ujkj'},
            {name: 'bột giặt', des: 'Hương hoa cúc', itemSKUCode: '549ujkj'},
            {name: 'áo phông ALV', des: 'Size 89', itemSKUCode: '976ujkj'}],
          TotalBill: props.route.params.totalBill,
          ItemNumber: 0,
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){

    this.setState({pageloading: false});
    this.initialItemNumberCheck()
    this.getAuthInfo()
    //this.getItemInfo()
   
  }



Alert = async (Alert) => {

  await this.setState({ Alert: true, AlertText: Alert} )
  setTimeout(() => {
    this.setState({ Alert: false} )
  }, 1500); // setState will be called after 1,5s
}


getItemInfo = async() => {
  const InCartItemList = this.state.InCartItemList;
  for(let item in InCartItemList){
    this.getItemDetailInfo(item.itemDetailCode, item.itemSKUCode)
  }
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


  initialItemNumberCheck(){
    const objInItemList = this.state.orderItemsList
    this.setState({ItemNumber: objInItemList.length})
   // alert(JSON.stringify(objInItemList))
  }


  ReturnOrderList = () =>{
    this.props.navigation.navigate('WareHouseReturnOrdersScreen')
  }

  HomeNavi = () =>{
    this.props.navigation.navigate('WareHouseHomeScreen')
  }

  
 
 
  // Order Asking Buttons
  onPressOrderConfirmPositiveButton = () => {

    this.InHouse()
       alert('Nhap')
   };
 
   onPressOrderConfirmNegativeButton = () => {
   //  alert('Negative Button Clicked');
     this.setState({OrderConfirmAksing: false})
   };

   

    
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
              alertMessageText={'Bạn muốn bỏ phẩm này khỏi rỏ hàng'}
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
              alertTitleText={'Mời xác nhận!'}
              alertMessageText={'Số lượng sản phẩm:\n' + 
              '\n -' + this.state.ItemNumber + ' sản phẩm'}
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
                <View style={styles.ItemBox}>
                  
                <Text
                  underlineColorAndroid="transparent"
                  editable={false}
                  style={styles.AlertText}>Sản phẩm không được xuất/nhập từ kho này</Text>  
               
                </View>

                <ScrollView vertical={true} style={styles.ScrollViewContainer}>
                
                  {this.state.orderItemsList.map((item, i)=>

                    <View style={styles.ItemEditBox} key={i}>
                    
                      <View style={styles.ItemEl}>
                        <View style={styles.ItemInfoEl}>
                         
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}>{item.name.toUpperCase()} : {item.des.toUpperCase()}</Text>  
                
                        </View>    
                         
                        <View style={styles.InputBoxEdit}>
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}>Mã SKU: {item.itemSKUCode.toUpperCase()}</Text>
          
                        </View>
                  
                      </View>
                    
                        
                    </View>
                    )}
                  </ScrollView>
                </View>
            </View>
           
            <View style={[styles.overlay, styles.bottomOverlay]}>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.ReturnOrderList}>   Hàng trả về   </Text>
                </View>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.HomeNavi}>   Trang chủ   </Text>
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
  ItemBox:{
    flexDirection: 'row',
    top: 10
  },
  ScrollViewContainer:{
    flex: 1,
    height: '100%',
    top: 15,
  },
  InputBoxEdit:{
    flexDirection: 'row',
    height: 30,
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
  AlertText:{
    lineHeight: 30,
    paddingLeft: 10,
    color: '#EE0000',
    fontSize: 14,
    alignItems: 'center'
  },
  ItemTextTitle:{
    lineHeight: 30,
    paddingLeft: 10,
    color: '#006600',
    fontSize: 10,
    fontWeight: 'bold',
    alignItems: 'center'
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