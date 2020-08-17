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
        this.onPressItemRemovePositiveButton = this.onPressItemRemovePositiveButton.bind(this);
        this.onPressItemRemoveNegativeButton = this.onPressItemRemoveNegativeButton.bind(this);
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

          ItemInfo: props.route.params.ItemInfo,
          InCartItemList: props.route.params.CartItemList,
        
          orderItemsList: [
            {itemCode: 'bg993', name: 'bột giặt', number: 2, itemDetailCode: 'xkj993', des: 'Hương hoa nhài', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Vietnam', 
            price: 1200, 'sale': 10, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", itemSKUCode: '989ujkj'},
            {itemCode: 'bg993', name: 'bột giặt', number: 1, itemDetailCode: 'bck8993', des: 'Hương hoa cúc', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Hàn Quốc', 
            price: 1250, 'sale': 0, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", itemSKUCode: '549ujkj'},
            {itemCode: 'nkk890', name: 'áo phông ALV', number: 1, itemDetailCode: 'b1kjfd2f', des: 'Size 89', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Nhật Bản', 
            price: 2400, 'sale': 20, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", itemSKUCode: '976ujkj'}],
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
   
      // Trigger function as screen is changed (back or next) - an alternative to willmount
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

getItemDetailInfo = (itemDetailCode, itemSKUCode) =>{
  const authToken = this.state.authToken;

  //const { navigate } = this.props.navigation;
  const serviceUrl = this.state.Base_url + '/itemDetailCode=' + itemDetailCode;
  this.setState({ loading: true }, () => {
    fetch(serviceUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
     //   'X-CSRF-TOKEN': token
      },
    })
    .then((response) => response.text())
    .then((responseJson) => {
      
        if(responseJson.status != 200){
          Alert.alert("Oh! đã có lỗi xảy ra rồi!");
        }
        if(responseJson.status == 200){
          this.state.InCartItemList.push(
            {'itemCode': responseJson.Data.itemCode, 'itemDetailCode': itemDetailCode, 'itemSKUCode': itemSKUCode, 'name': responseJson.Data.name, 'number': responseJson.Data.number, 
            'des': responseJson.Data.des, 'link': responseJson.Data.link, 'origin': responseJson.Data.origin, 
            'price': responseJson.Data.price, 'sale': responseJson.Data.sale, 'description': responseJson.Data.description},)
          // Set item list with brandCode
        }
        }).catch((error) => {
          console.error(error);
      });
  });
  
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
    const objInItemList = this.state.InCartItemList
    this.setState({ItemNumber: objInItemList.length})
   // alert(JSON.stringify(objInItemList))
  }

  ItemRemove = (itemSKUCode) =>{
    this.setState({removeSKUCode: itemSKUCode, itemRemoveAsking: true})
  }

  ItemDetail = () =>{
    
    this.props.navigation.navigate('ItemDetailScreen',  {
      itemDetail: this.state.ItemInfo
    })
  }

  TakePicture = (SKUCode) =>{
    this.props.navigation.navigate('TakePictureScreen', 
      {SKUCode: SKUCode, NeedToScanNumber: 3})
  }

  HomeNavi = () =>{
    this.props.navigation.navigate('WareHouseHomeScreen')
  }

  InHouse = () =>{
      if(this.state.ItemNumber == 0){
        alert('Oh! Bạn chưa có đơn hàng nào!')
      }else{
        this.setState({OrderConfirmAksing: true})
      }
    }
  
  // Item Remove Buttons
  onPressItemRemovePositiveButton = () => {
    
    // Remove item from list as user set number = 0 filter ones different from the given code then reset list
    const CodeObjects = this.state.InCartItemList.filter(obj => obj.itemSKUCode !== this.state.removeSKUCode);
    const objects = this.state.InCartItemList.filter(obj => obj.itemSKUCode !== this.state.removeSKUCode);

    // alert(JSON.stringify(objects)) 
    this.setState({ InCartItemList: objects, InCartItemList: CodeObjects });
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

    this.InHouse()
       alert('Nhap')
   };
 
   onPressOrderConfirmNegativeButton = () => {
   //  alert('Negative Button Clicked');
     this.setState({OrderConfirmAksing: false})
   };

   InHouse = () => {

    const authToken = this.state.authToken;
    const authEmail = this.state.authEmail;
    const itemList = this.state.InCartItemList;

    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + '/InHouseRequest';
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
          itemList: itemList,
         // ({'itemSKUCode': splitedCode[2], 
         //'itemDetailCode': splitedCode[1], 
  
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
          if(responseJson.status == 403){
            this.Alert('Toàn bộ hàng này không được xuất về không của bạn')
          }
          if(responseJson.status == 203){
            this.Alert('Sản phẩm đã được nhập kho')
          }
          if(responseJson.status == 201){
        
            this.props.navigation.navigate('WareHouseInFailedScreen', {ReturnedItems: responseJson.Data.ReturnedItems})

          }
          if(responseJson.status == 200){
            this.setState({ loading: false });
            this.setState({ doneAnimating: true });
            Alert.alert("Nhập hàng thành công");
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
                  <TouchableHighlight onPress={this.ItemDetail}> 
                    <Image
                      source={{
                        uri: this.state.ItemInfo.link,
                        cache: 'only-if-cached',
                      }}
                      style={styles.imgStyle}/>
                  </TouchableHighlight>  
                  <View style={styles.ItemInfoBlock}>
                    <View style={styles.ItemTitleBlock}>
                      <Icon
                          style={styles.InputIcon}
                          name="barcode"
                          size={(20)}/>  
                      <Text
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={styles.ItemCodeText}>  {this.state.ItemInfo.orderCode.toUpperCase()}</Text>
                    </View>
                 
                    <View style={styles.InputBoxEdit}>
                      <Icon
                          style={styles.InputIcon}
                          name="gift"
                          size={(20)}/>  
                      <Text
                          underlineColorAndroid="transparent"
                          editable={false}
                          style={styles.ItemAddressText}> {this.state.ItemInfo.name.toUpperCase()}: </Text>
                      <Text
                          underlineColorAndroid="transparent"
                          editable={false}
                          style={styles.ItemAddressText}> {this.state.ItemInfo.des.toUpperCase()}</Text>    
                    </View>  
                                      
                  </View>
                
                </View>

                <ScrollView vertical={true} style={styles.ScrollViewContainer}>
                
                  {this.state.InCartItemList.map((item, i)=>

                    <View style={styles.ItemEditBox} key={i}>
                      
                      <View style={styles.ItemEl}>
                        <View style={styles.ItemInfoEl}>
                         
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}>Mã sản phẩm: {item.itemDetailCode.toUpperCase()}  </Text>  
                
                        </View>    
                         
                        <View style={styles.InputBoxEdit}>
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}>Mã SKU: {item.itemSKUCode.toUpperCase()}</Text>
                        </View>
               
                      </View>
                      <View style={styles.IconEl}>
                        <Icon
                            style={styles.Icon}
                            name="camera"
                            color='#FFFFFF'
                            size={20} 
                            onPress={this.TakePicture.bind(this, item.SKUCode)}/>
                        <Icon
                          style={styles.Icon}
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
                        onPress={this.InHouse}>   Nhập kho   </Text>
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
  imgStyle:{
    height: 70,
    width: 70,
    borderRadius: 5,
  },
  ItemEl:{
    width: '70%',
    borderRadius: 10,
  },
  ItemInfoEl:{
    flexDirection: 'row'
  },
  IconEl:{
    flexDirection: 'row',
  },
  Icon:{
    width: '15%',
    margin: 10,
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
  ItemTitleBlock:{
    flexDirection: 'row',
    width: '100%',
    height: 30,
    fontSize: 10,
    alignItems: 'center',
  },
  InputIcon:{
    color: '#006600',
    paddingLeft: 10
  },
  ItemCodeText:{
    fontSize: 10,
    color: '#009900',
    width: '50%',
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