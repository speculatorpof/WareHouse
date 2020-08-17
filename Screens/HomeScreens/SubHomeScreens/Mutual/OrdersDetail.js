import React, { Component } from 'react';
import { Text, View, Alert, BackHandler, Picker, TextInput, ScrollView, Image, ViewPagerAndroidBase } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../../AppSRC/Components/DoneIndicator';
import TextAlertComponent from '../../../../AppSRC/Components/TextAlertComponent';
import ConfirmAlertComponent from '../../../../AppSRC/Components/ConfirmAlertComponent';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class OrdersDetail extends Component {
  
    constructor(props){
        super(props);        
        this.onPressConfirmPositiveButton = this.onPressConfirmPositiveButton.bind(this);
        this.onPressConfirmNegativeButton = this.onPressConfirmNegativeButton.bind(this);
        this.state = {
          pageloading: true,
          loading: false,
          doneAnimating: false,
          ConfirmAksing: false,

          success_handle: false,
          Base_url: Base_url,

          Alert: false,
          AlertText: null,

          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,
          authType: props.route.params.authType,
 
          OrderDetail: props.route.params.OrderDetail,
          orderItemsList: [
            {itemCode: 'bg993', name: 'bột giặt', number: 2, itemDetailCode: 'xkj993', des: 'Hương hoa nhài', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Vietnam', 
            price: 1200, sale: 10, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
            {itemCode: 'bg993', name: 'bột giặt', number: 1, itemDetailCode: 'bck8993', des: 'Hương hoa cúc', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Hàn Quốc', 
            price: 1250, sale: 0, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
            {itemCode: 'nkk890', name: 'áo phông ALV', number: 1, itemDetailCode: 'b1kjfd2f', des: 'Size 89', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Nhật Bản', 
            price: 2400, sale: 20, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
          ],
          InHouseItemsList: [
            {itemCode: 'bg993', name: 'bột giặt', inhouseNumber: 3, number: 5, itemDetailCode: 'xkj993', des: 'Hương hoa nhài', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Vietnam', 
            price: 1200, sale: 10, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
            {itemCode: 'bg993', name: 'bột giặt', inhouseNumber: 3, number: 4, itemDetailCode: 'bck8993', des: 'Hương hoa cúc', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Hàn Quốc', 
            price: 1250, sale: 0, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
            {itemCode: 'nkk890', name: 'áo phông ALV', inhouseNumber: 1, number: 1, itemDetailCode: 'b1kjfd2f', des: 'Size 89', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Nhật Bản', 
            price: 2400, sale: 20, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
          ],
          NeedToScanNumber: 0,
          OrderType: props.route.params.OrderType,
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});

    // Update Totall Bill in case for setup requiring munimum purchases
   // this.brandListGet()
  //  this.getAuthInfo();
    this.NeedToScanNumberUpdate()
  }

  NeedToScanNumberUpdate = async () => {
   
    let objects = this.state.orderItemsList

    // Foreach through array 
    for (let item of objects) {
      const needToScanNumber = this.state.NeedToScanNumber
      await this.setState({NeedToScanNumber: needToScanNumber + item.number})
    }
  }

  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false} )
    }, 1500); // setState will be called after 1,5s
  }


  getItemsInOrder = async () =>{
    const authToken = this.state.authToken;
    const orderCode = this.state.OrderDetail.orderCode

    const serviceUrl = this.state.Base_url + '/OrderDetail' + '?orderCode=' + orderCode;
    this.setState({ loading: true }, () => {
      fetch(serviceUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
          this.setState({ orderItemsList: responseJson.orderDetailList });
          Alert.alert('item list done');
          
        }
        }).catch((error) => {
          console.error(error);
      });
    });
  }

    // For Sale to cancel order
    CancelOrder = async () => {
      // Trigger off loading icon
     // this.setState({loading: true})
  
      const authToken = this.state.authToken;
      const authEmail = this.state.authEmail
      const orderCode = this.state.OrderDetail.orderCode;
  
      //const { navigate } = this.props.navigation;
      const serviceUrl = this.state.Base_url + '/OrderCancel';
      await this.setState({ loading: true }, () => {
        fetch(serviceUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         //   'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            authEmail: authEmail,
            orderCode: orderCode

          })
        })
        .then((response) => response.text())
        .then((responseJson) => {
          
            if(responseJson.status != 200){
              this.Alert('Đã xảy ra lỗi')
            }
            if(responseJson.status == 200){
              alert('Hủy đơn thành công')
              this.props.navigation.navigate('OrdersListScreen')
            }
            }).catch((error) => {
              console.error(error);
          });
        });
      }
    
    
    CancelOrderAsking = () => {
      this.setState({ConfirmAksing: true})
    }
    
    // Order Asking Buttons
    onPressConfirmPositiveButton = () => {  
      this.CancelOrder()
      this.setState({ConfirmAksing: false})
    };
  
    onPressConfirmNegativeButton = () => {
    //  alert('Negative Button Clicked');
      this.setState({ConfirmAksing: false})
    };

    // For WareHouse to Scan
    QRScanNavi = () => {
      this.props.navigation.navigate('WareHouseScanScreen', 
      {CodeToScanList: this.state.orderItemsList, ScanStatus: 'Out',
      NeedToScanNumber: this.state.NeedToScanNumber})
    }
    // InHouse scan navigator
    InHouseQRScanNavi = (item) => {
      const orderCode = this.state.OrderDetail.orderCode;
      const CodeToScanList = []
      CodeToScanList.push({'orderCode': orderCode, 'itemCode': item.itemCode, 'itemDetailCode': item.itemDetailCode, 
      'des': item.des, 'name': item.name, 'link': item.link, 'origin': item.origin,
      'description': item.description, 'price': item.price, 'sale': item.sale
      })
      this.props.navigation.navigate('WareHouseScanScreen', 
      {CodeToScanList: CodeToScanList, ScanStatus: 'In',
      NeedToScanNumber: item.number - item.inhouseNumber})
    }

    ItemDetail = (item) => {
      this.props.navigation.navigate('ItemDetailScreen', {itemDetail: item})
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
            <ConfirmAlertComponent
              displayAlert={this.state.ConfirmAksing}
              displayAlertIcon={true}
              alertTitleText={'Mời xác nhận!'}
              alertMessageText={'Bạn muốn hủy đơn hàng này?'}
              displayPositiveButton={true}
              positiveButtonText={'Xác nhận'}
              displayNegativeButton={true}
              negativeButtonText={'Để sau'}
              onPressPositiveButton={this.onPressConfirmPositiveButton}
              onPressNegativeButton={this.onPressConfirmNegativeButton}
            />     
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.Container}>
                      <View style={styles.ItemBox}>

                        <View style={styles.ItemInfoBlock}>
                          <View style={styles.ItemTitleBlock}>
                            <Icon
                                style={styles.InputIcon}
                                name="barcode"
                                size={(20)}/>  
                            <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemCodeText}
                              color='red'>   {this.state.OrderDetail.orderCode.toUpperCase()}</Text>
  
                              <View style={styles.ItemStatusBlock}>
                                {this.state.OrderDetail.status === 'done' &&
                                <Icon
                                  style={styles.InputIcon}
                                  name="gift-outline"
                                  size={(20)}/> 
                                }
                                {this.state.OrderDetail.status === 'cancel' &&
                                <Icon
                                  style={styles.InputCancelIcon}
                                  name="bell-cancel"
                                  size={(20)}/> 
                                }
                                {this.state.OrderDetail.status === 'process' &&
                                <Icon
                                  style={styles.InputProcessIcon}
                                  name="truck-delivery"
                                  size={(20)}/> 
                                }
                                {this.state.OrderDetail.status === 'done' &&
                                  <Text
                                    underlineColorAndroid="transparent"
                                    editable={false}
                                    style={styles.ItemSuccessText}> Thành công</Text>  
                                }
                                {this.state.OrderDetail.status === 'cancel' &&
                                  <Text
                                    underlineColorAndroid="transparent"
                                    editable={false}
                                    style={styles.ItemCancelText}> Hủy</Text>  
                                }
                                {this.state.OrderDetail.status === 'process' &&
                                  <Text
                                    underlineColorAndroid="transparent"
                                    editable={false}
                                    style={styles.ItemCancelText}> Đang xử lý</Text>  
                                }
                              </View>
                          </View>
                          {this.state.OrderType === 'OutHouse' &&

                          <View style={styles.InputBoxEdit}>

                            <Icon
                              style={styles.InputIcon}
                              name="cash"
                              size={(25)}/>  
                            <NumberFormat
                              value={this.state.OrderDetail.totalBill}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix={' Vnd'}
                              renderText={value => (
                                <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemNumberText}> {value}</Text>)}/>  
                           
                            <Icon
                                style={styles.InputIcon}
                                name="gift"
                                size={(20)}/>  
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemAddressText}> {this.state.NeedToScanNumber}</Text>         
                          </View>
                          }
                          {this.state.OrderType === 'OutHouse' &&
                          <View style={styles.InputBoxEdit}>
                            <Icon
                                style={styles.InputIcon}
                                name="map-marker"
                                size={(25)}/>  
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemAddressText}> {this.state.OrderDetail.deliveryAddress}</Text>
                          </View>
                          }
                          {this.state.OrderType === 'OutHouse' &&
                          <View style={styles.InputBoxEdit}>
                            <Icon
                                style={styles.InputIcon}
                                name="account"
                                size={(25)}/>  
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemAddressText}> {this.state.OrderDetail.name}      </Text>
                            <Icon
                                style={styles.InputIcon}
                                name="phone"
                                size={(25)}/>  
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemAddressText}> {this.state.OrderDetail.phone}</Text>    
                          </View>  
                          }      
                          {/**In House part */}
                          {this.state.OrderType === 'InHouse' &&
                          <View style={styles.InputBoxEdit}>
                            <Icon
                                style={styles.InputIcon}
                                name="calendar"
                                size={(25)}/>  
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemNumberText}> {this.state.OrderDetail.date}      </Text>
                            <Icon
                                style={styles.InputIcon}
                                name="gift"
                                size={(25)}/>  
                            {this.state.OrderDetail.status === 'process' &&     
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ProcessItemAddressText}> {this.state.OrderDetail.inhouseNumber}/{this.state.OrderDetail.number}</Text>    
                            }  
                            {this.state.OrderDetail.status === 'done' &&     
                            <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemAddressText}> {this.state.OrderDetail.inhouseNumber}/{this.state.OrderDetail.number}</Text>    
                            }      
                          </View>  
                          }      
                        </View>
                        
                        {/**Check to render OutHouse for WareHouse or Sale */}
                        {this.state.OrderType === 'OutHouse' && this.state.OrderDetail.status === 'process' && this.state.authType === 'WareHouse' && 
                        <TouchableHighlight style={styles.ItemNaviBlock}
                          onPress={this.QRScanNavi}>
                            <Icon
                                style={styles.InputIcon}
                                name="qrcode-scan"
                                size={(25)}/>
                        </TouchableHighlight>
                        }
                        {this.state.OrderDetail.status === 'process' && this.state.authType === 'Sale' &&
                        <TouchableHighlight style={styles.ItemNaviBlock}
                          onPress={this.CancelOrderAsking}>
                            <Icon
                                style={styles.CancelIcon}
                                name="cancel"
                                size={(25)}/>
                        </TouchableHighlight>
                        }
                      </View>

                <ScrollView vertical={true} style={styles.ScrollViewContainer}
         //         showsVerticalScrollIndicator={false}
                  >
                  {this.state.InHouseItemsList.map((item, i)=>
                    <View style={styles.ItemListBox} key={i}>
                      <TouchableHighlight style={styles.ItemImgBlock} onPress={this.ItemDetail.bind(this, item)}> 
                        <Image
                          source={{
                            uri: item.link,
                            cache: 'only-if-cached',
                          }}
                          style={styles.imgStyle}/>
                      </TouchableHighlight>
     
                      <View style={styles.ItemInfoBlock}>
                        <View style={styles.ItemInfoTitle}>
                            <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemTextTitle}>{item.name.toUpperCase()} :   </Text>
                            <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemTextDes}>{item.des.toUpperCase()}</Text>
                        </View>
                        <View  style={styles.InputBoxEdit}>        
                        {this.state.OrderType === 'OutHouse' &&
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}
                            color='red'>Số lượng: {item.number}</Text>
                        }  
                        {this.state.OrderType === 'InHouse' &&
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTitle}
                            color='red'>Số lượng: {item.inhouseNumber}/{item.number}</Text>
                        }  
                        </View>
                      </View>
                      {this.state.OrderDetail.status === 'process' && this.state.OrderType === 'InHouse' && item.inhouseNumber < item.number &&
                      <View>
                        <TouchableHighlight style={styles.ItemNaviBlock}
                          onPress={this.InHouseQRScanNavi.bind(this, item)}>
                            <Icon
                                style={styles.InputIcon}
                                name="qrcode-scan"
                                size={(25)}/>
                        </TouchableHighlight>
                      </View>
                      }
                    </View>
                    
                    )}
                      
                  </ScrollView>
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
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    height: '90%',
    alignItems: 'center',
  },
  ScrollViewContainer:{
    height: '90%',
    marginBottom: 10,
  },
  Container: {
    width: '95%',
  },
  ItemBox:{
    flexDirection: 'row',
    width: '100%',
    height: 120,
  //  backgroundColor: '#CCFFFF',
    borderRadius: 5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  ItemListBox:{
    flexDirection: 'row',
    width: '100%',
    height: 90,
    marginBottom: 5,
  //  backgroundColor: '#CCFFFF',
    borderRadius: 5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  ItemInfoBlock:{
    height: '100%',
    flex: 1,
    paddingLeft: 5,
  },
  ItemInfoTitle:{
    flexDirection: 'row'
  },
  ItemNaviBlock:{
    borderColor:'#00CC66',
    justifyContent:'center',
    borderRadius:50,
    margin: 10
  },
  ItemTitleBlock:{
    flexDirection: 'row',
    width: '100%',
    height: 30,
    fontSize: 10,
    alignItems: 'center',
  },
  ItemTextDes:{
    fontSize: 10,
    color: '#770000',
    lineHeight: 30,
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
  ItemStatusBlock:{
    flexDirection: 'row',
    height: 30,
    fontSize: 10,
    alignItems: 'center',
  },
  ItemCodeText:{
    fontSize: 10,
    color: '#EE0000',
    width: '50%',
  },
  ItemSuccessText:{
    color: '#009900',
    fontSize: 10
  },
  ItemCancelText:{
    color: '#EE0000',
    fontSize: 10
  },
  ItemNumberText:{
    width: '48%',
    fontSize: 10,
    color: '#009900',
    lineHeight: 30,
  },
  ItemAddressText:{
    fontSize: 10,
    lineHeight: 30,
    color: '#009900',
    alignItems: 'center'
  },
  ProcessItemAddressText:{
    fontSize: 10,
    lineHeight: 30,
    color: '#EE0000',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  imgStyle:{
    height: 80,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#009900'
  },
  OrderInfo:{
    width: '80%',
    paddingLeft: 5,
  },
  OrderInfoEl:{
    flexDirection: 'row',
  },
  InputIcon:{
    color: '#006600'
  },

  InputCancelIcon:{
    color: '#EE0000',
  },
  InputProcessIcon:{
    color: '#FF00FF',
  },
  CancelIcon:{
    color: '#EE0000'
  },
  ItemInfoBlock:{
    flex: 1,
    paddingLeft: 5,
  },
  InputBoxEdit:{
    flexDirection: 'row',
    height: 30,
  },
  ItemTextTitle:{
    fontSize: 10,
    color: '#009900',
    lineHeight: 30,
  },
} 