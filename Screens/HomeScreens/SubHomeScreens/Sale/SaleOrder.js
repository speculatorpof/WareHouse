import React, { Component } from 'react';
import { Text, View, Alert, BackHandler, Picker, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../../AppSRC/Components/DoneIndicator';
import OrderConfirmAlertComponent from '../../../../AppSRC/Components/OrderConfirmAlertComponent';
import ItemRemoveAlertComponent from '../../../../AppSRC/Components/ItemRemoveAlertComponent';
import TextAlertComponent from '../../../../AppSRC/Components/TextAlertComponent';

import { CityList } from '../../../../AppSRC/Data/CityList';
import { DistrictLists } from '../../../../AppSRC/Data/DistrictList';
import { EmtyList } from '../../../../AppSRC/Data/District_Lists/1_None';

import NumberFormat from 'react-number-format';


export default class SaleOrder extends Component {
  
    constructor(props){
        super(props);
        this.OrderConfirmAksing = this.OrderConfirmAksing.bind(this);
        this.BackToHome = this.BackToHome.bind(this);
        this.backfunction = this.backfunction.bind(this);
        this.onPressOrderConfirmPositiveButton = this.onPressOrderConfirmPositiveButton.bind(this);
        this.onPressOrderConfirmNegativeButton = this.onPressOrderConfirmNegativeButton.bind(this);
        this.onPressItemRemovePositiveButton = this.onPressItemRemovePositiveButton.bind(this);
        this.onPressItemRemoveNegativeButton = this.onPressItemRemoveNegativeButton.bind(this);
        this.state = {
          pageloading: true,

          loading: false,
          doneAnimating: false,
          success_handle: false,
          itemRemoveAsking: false,
          displayAlertloading: false,
          orderAskingLoading: false,
          Alert: false,
          AlertText: null,

          Base_url: Base_url,
          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,

          City: null,
          District: null,
          Address: null,
          Name: null,
          EmtyList: EmtyList,
          CityList: CityList,
          DistrictList: DistrictLists, 

          removeCode: null,
          removeCodeList: [],
          orderItemList: props.route.params.OrderItemList,
          orderedItemSubmitList: [],
          TotalBill: 0,
          ItemNumber: 0,
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});

    // Trigger function as screen is changed (back or next)
    this.props.navigation.addListener('blur', () => {
      this.backfunction()
    });
    
  }


  backfunction(){
    // Reset number = 0
    //let UpdatedItems = this.state.orderItemList.filter(obj => obj.items.map(subObj => subObj.itemDetailCode == 0))
    //alert(JSON.stringify(UpdatedItems))
     
    this.state.orderItemList.map(obj => 
      obj.items.map(subobj => subobj.number !== 0 ? Object.assign(subobj, { number: 0 }): subobj ))
    

    const { params } = this.props.route;
  
    // Call back function in the previous component with newly updated list
    params.OnBack(this.state.orderItemList, this.state.removeCodeList)
  }


  BackToHome = () => {
    // Reset number = 0    
    this.state.orderItemList.map(obj => 
      obj.items.map(subobj => subobj.number !== 0 ? Object.assign(subobj, { number: 0 }): subobj ))

    this.props.navigation.navigate('SaleHomeScreen')
  }

  updateTotalBill = () =>{
    let newBill = 0
    this.state.orderedItemSubmitList.map((item)=>
      newBill = ((item.price-item.price*item.sale/100)*item.number) + newBill
    )
    //alert(newBill)
    this.setState({TotalBill: newBill})
  }

  itemNumberCheck = async() => {
    const orderedItemSubmitList = this.state.orderedItemSubmitList
    await this.setState({ItemNumber: orderedItemSubmitList.length})
  }
  
  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false} )
    }, 1500); // setState will be called after 1,5s
  }


  ItemRemove = (removeCode) =>{
    this.setState({removeCode: removeCode, itemRemoveAsking: true})
  }
   // Item Remove Buttons

  onPressItemRemovePositiveButton = () => {
    
      // Remove item from list as user set number = 0 filter ones different from the given code then reset list
      const objects = this.state.orderItemList.filter(obj => obj.itemCode !== this.state.removeCode);
    // alert(JSON.stringify(objects))
      this.setState({ orderItemList: objects });
      //alert(JSON.stringify(this.state.InCartItemList))
      this.setState({itemRemoveAsking: false})

      this.state.removeCodeList.push({'removedCode': this.state.removeCode})
      // Re-count numbers of itemrs
      this.setState({ItemNumber: objects.length})
  };
 
  onPressItemRemoveNegativeButton = () => {
   //  alert('Negative Button Clicked');
      this.setState({removeCode: null})
      this.setState({itemRemoveAsking: false})
   };


  itemListUpdate = (itemCode, itemDetailCode, number, minimum, price, sale) =>{
      let updateItem = this.state.orderedItemSubmitList.find(obj => obj.itemDetailCode === itemDetailCode)

      if (updateItem){
        if(number > 0 && number > updateItem.minimum){
          updateItem.number = number
          
        }else{
          if(number > 0 && number < updateItem.minimum){
            updateItem.number = minimum
          }else{
            // Remove item from list as user set number = 0
            const objects = this.state.orderedItemSubmitList.filter(obj => obj.itemCode !== itemCode);
            this.setState({ orderedItemSubmitList: objects });
          }  
        }
      }else{
        this.state.orderedItemSubmitList.push({'itemCode':itemCode,'itemDetailCode': itemDetailCode, 'number': number, 'minimum': minimum, 'price': price, 'sale': sale})
      }
      this.itemNumberCheck()
  }
  
  
  TextValidateFunction = () =>{

    // This assgins 2 variable to 2 equivalent local Textinput variables 
    const city = this.state.City;
    const district = this.state.District;
    const address = this.state.Address;
    const phone = this.state.Phone;
    const name = this.state.Name
    
    var PhoneRegex10digit = /^[0]\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var PhoneRegex11digit = /^[0]\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{5})$/;

    if(city == null || district == null || address == null || phone == null, name == null){
        this.Alert('Aha! Bạn chưa nhập đủ thông tin giao hàng')
        this.setState({orderAskingLoading: false})

    }else{
      if(city =='0' || district =='0' || address =='' || phone == '' || name == ''){
        this.Alert('Aha! Bạn chưa nhập đủ thông tin giao hàng')
        this.setState({orderAskingLoading: false})

      }else{
          if (phone.match(PhoneRegex10digit) || phone.match(PhoneRegex11digit)){
              // Loading icon
              this.itemOrderREQUEST(city, district, address, phone, name)
          }else{
            this.Alert('Số điện thoại không hợp lệ')

            this.setState({orderAskingLoading: false})

          }
        }  
      } 
    }

  orderReset = () =>{
      let objects = this.state.orderItemList.filter(obj => obj.number != 0)
      if(objects){
        // Set number of child-object to 0
        objects.map(obj => obj.number=0) 
        // Reset total bill
        this.setState({TotalBill: 0})
        // Remove pending items from orderItemlist
        this.setState({orderItemList: []})
      }
    }

  OrderConfirmAksing = () => {
      if(this.state.TotalBill == 0){
        this.Alert('Oh! Bạn chưa có đơn hàng nào!')
      }else{
        this.setState({orderAskingLoading: true})
      }
    }


  onPressOrderConfirmPositiveButton = () => {
    // this.PaymentHandleRequest(payment_amt, payment_reason)
     //this.setState({ loading: true });
     this.TextValidateFunction()
   };
 
   onPressOrderConfirmNegativeButton = () => {
   //  alert('Negative Button Clicked');
     this.setState({orderAskingLoading: false})
   };

   itemOrderREQUEST = (city, district, address, name) => {
    // Trigger off loading icon
   // this.setState({loading: true})

    const authToken = this.state.authToken;
    const authEmail = this.state.authEmail;

    const itemList = this.state.orderedItemSubmitList;

    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + '/OrderCreate';
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
          itemList: itemList,
          authEmail: authEmail,

          city: city,
          district: district,
          address: address,
          phone: phone,
          name: name
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
        
          if(responseJson.status != 200){
            this.Alert('Oh! đã có lỗi xảy ra rồi!')
          }
          if(responseJson.status == 200){
            this.setState({ loading: false });
            this.setState({ doneAnimating: true });
            Alert.alert("Đặt hàng thành công");

            // Back to ItemList
            this.props.navigation.goBack(null);
          }
          }).catch((error) => {
            console.error(error);
        });
      });
    }

    
    render() {
        const city = this.state.DistrictList

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
            <OrderConfirmAlertComponent
              displayAlert={this.state.orderAskingLoading}
              displayAlertIcon={true}
              alertTitleText={'Mời xác nhận đơn hàng'}
              alertMessageText={'Bạn xác nhận đặt đơn hàng này?\n' + 
              '\n- Tổng thanh toán: ' + this.state.TotalBill + ' VND'}
              displayPositiveButton={true}
              positiveButtonText={'Xác nhận'}
              displayNegativeButton={true}
              negativeButtonText={'Để sau'}
              onPressPositiveButton={this.onPressOrderConfirmPositiveButton}
              onPressNegativeButton={this.onPressOrderConfirmNegativeButton}
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
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.bodyContainer}>
                {/** New block */}
                
                  <View style={styles.selectBox}>
                    <Icon
                        style={styles.InputIcon}
                        name="bank"
                        size={(20)}/>
                    <Picker
                        style={styles.PickerBox}
                        selectedValue={this.state.City}
                        mode="dialog"
                        onValueChange={(value) =>
                          this.setState({City: value})
                        }>
                        {
                        this.state.CityList.map((member, key)=>
                          <Picker.Item label={member.listlabel} value={member.listvalue} key={key}/>)
                        }
                    </Picker>    
                  </View>
                  <View style={styles.InputBox}>
                    <Icon
                        style={styles.InputIcon}
                        name="road-variant"
                        size={(20)}/>
                    <Picker
                        style={styles.PickerBox}
                        selectedValue={this.state.District}
                        mode="dialog"
                        onValueChange={(value) =>
                          this.setState({District: value})
                        }>
                        {this.state.City != null && 
                        city[this.state.City].map((member, key)=>
                          <Picker.Item label={member.listlabel} value={member.listvalue} key={key}/>)
                        }  
                        {this.state.City == null && 
                          this.state.EmtyList.map((member, key) => 
                            <Picker.Item label={member.listlabel} value={member.listvalue} key={key}/>)
                        }    
                    </Picker>       
                  </View>
                  <View style={styles.InputBox}>
                    <Icon
                          style={styles.InputIcon}
                          name='account'
                          size={20}/>
                    <TextInput 
                        style={styles.InputTextField}
                        placeholder={'Tên người mua'}
                        placeholderTextColor = "#666666"
                        onChangeText={(Name) => this.setState({Name})}
                        keyboardType={'default'}/>
                  </View>
                  <View style={styles.InputBox}>
                    <Icon
                          style={styles.InputIcon}
                          name='home'
                          size={20}/>
                    <TextInput 
                        style={styles.InputTextField}
                        placeholder={'Địa chỉ nhà'}
                        placeholderTextColor = "#666666"
                        onChangeText={(Address) => this.setState({Address})}
                        keyboardType={'default'}/>
                  </View>
                  <View style={styles.InputBox}>
                    <Icon
                          style={styles.InputIcon}
                          name='phone'
                          size={20}/>
                    <TextInput 
                        style={styles.InputTextField}
                        placeholder={'Số điện thoại người mua'}
                        placeholderTextColor = "#666666"
                        onChangeText={(Phone) => this.setState({Phone})}
                        keyboardType={'default'}/>
                  </View>
                  <View styles={styles.ChecksumBlock}>
                    <NumberFormat
                      value={this.state.TotalBill}
                      displayType={'text'}
                      thousandSeparator={true}
                      suffix={' VND'}
                      renderText={value => (
                        <TextInput
                          underlineColorAndroid="transparent"
                          editable={false}
                          style={styles.TotalBill}
                          value={'Tổng: ' + value + ' --- ' + this.state.ItemNumber + ' SP'} /> )} />  
                  </View>
                <ScrollView vertical={true} style={styles.ScrollViewContainer}>
                  {this.state.orderItemList.map((item, i)=>

                    <View style={styles.ItemEditBox} key={i}>
                      <View>
                        
                        {item.items.map((itemdetails, index) => 
                          <View key={index}>
                            <View style={styles.InputTitleBox}>
                              <Text
                              style={styles.ItemTextTitle}
                              underlineColorAndroid="transparent"
                              editable={false}>{item.name.toUpperCase()}: </Text>
                              <Text
                              style={styles.ItemTextDes}
                              underlineColorAndroid="transparent"
                              editable={false}> {itemdetails.des.toUpperCase()}</Text>
                              
                            </View>
                            <View style={styles.InputBoxEdit}>
                                <NumberFormat
                                    value={(item.price- item.price*item.sale/100)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                //   suffix={' Vnd'}
                                    renderText={value => (
                                      <TextInput
                                        underlineColorAndroid="transparent"
                                        editable={false}
                                        style={styles.PriceItemText}
                                        value={value} /> )} />  
                                <Picker
                                  key={index}
                                  selectedValue={itemdetails.number.toString()}
                                  style={styles.ItemPickerBox}
                                  mode="dropdown"
                                  onValueChange={(value) =>
                                  this.setState(
                                      item.items.map(
                                      obj => (obj.itemDetailCode === itemdetails.itemDetailCode && value >= itemdetails.minimum ? Object.assign(obj, { number: value }) : obj,
                                      obj.itemDetailCode === itemdetails.itemDetailCode 
                                      && value < itemdetails.minimum ? Object.assign(obj, { number: itemdetails.minimum }) && alert('Số lượng tối thiểu của sản phẩm để nhận miễn phí vận chuyển là: '+ itemdetails.minimum + ' /Sản phẩm'): obj,
                                      obj.itemDetailCode === itemdetails.itemDetailCode && value < itemdetails.minimum && value == 0 ? Object.assign(obj, { number: 0 }) : obj),
                                    ), this.updateTotalBill, this.itemListUpdate(item.itemCode, itemdetails.itemDetailCode, value, itemdetails.minimum, item.price, item.sale, i)
                                  )}>
                                  <Picker.Item label="0" value="0"/>
                                  <Picker.Item label="1" value="1" />
                                  <Picker.Item label="2" value="2" />
                                  <Picker.Item label="3" value="3" />
                                  <Picker.Item label="4" value="4" />
                                  <Picker.Item label="5" value="5" />
                                  <Picker.Item label="6" value="6" />
                                  <Picker.Item label="7" value="7" />
                                  <Picker.Item label="8" value="8" />
                                  <Picker.Item label="9" value="9" />
                                  <Picker.Item label="10" value="10" />
                                  <Picker.Item label="11" value="11" />
                                  <Picker.Item label="12" value="12" />
                                  <Picker.Item label="13" value="13" />
                                  <Picker.Item label="14" value="14" />
                                  <Picker.Item label="15" value="15" />
                                  <Picker.Item label="16" value="16" />
                                  <Picker.Item label="17" value="17" />
                                  <Picker.Item label="18" value="18" />
                                  <Picker.Item label="19" value="19" />
                                  <Picker.Item label="20" value="20" />
                                  <Picker.Item label="21" value="21" />
                                  <Picker.Item label="22" value="22" />
                                  <Picker.Item label="23" value="23" />
                                  <Picker.Item label="24" value="24" />
                                  <Picker.Item label="25" value="25" />
                                  <Picker.Item label="26" value="26" />
                                  <Picker.Item label="27" value="27" />
                                  <Picker.Item label="28" value="28" />
                                  <Picker.Item label="29" value="29" />
                                  <Picker.Item label="30" value="30" />
                                  <Picker.Item label="31" value="31" />
                                  <Picker.Item label="32" value="32" />
                                  <Picker.Item label="33" value="33" />
                                  <Picker.Item label="34" value="34" />
                                  <Picker.Item label="35" value="35" />
                                  <Picker.Item label="36" value="36" />
                                  <Picker.Item label="37" value="37" />
                                  <Picker.Item label="38" value="38" />
                                  <Picker.Item label="39" value="39" />
                                  <Picker.Item label="40" value="40" />
                                  <Picker.Item label="41" value="41" />
                                  <Picker.Item label="42" value="42" />
                                  <Picker.Item label="34" value="43" />
                                  <Picker.Item label="44" value="44" />
                                  <Picker.Item label="45" value="45" />
                                  <Picker.Item label="46" value="46" />
                                  <Picker.Item label="47" value="47" />
                                  <Picker.Item label="48" value="48" />
                                  <Picker.Item label="49" value="49" />
                                  <Picker.Item label="50" value="50" />
                                  <Picker.Item label="61" value="61" />
                                  <Picker.Item label="62" value="62" />
                                  <Picker.Item label="63" value="63" />
                                  <Picker.Item label="64" value="64" />
                                  <Picker.Item label="65" value="65" />
                                  <Picker.Item label="66" value="66" />
                                  <Picker.Item label="67" value="67" />
                                  <Picker.Item label="68" value="68" />
                                  <Picker.Item label="69" value="69" />
                                  <Picker.Item label="70" value="70" />
                                  <Picker.Item label="71" value="71" />
                                  <Picker.Item label="72" value="72" />
                                  <Picker.Item label="73" value="73" />
                                  <Picker.Item label="74" value="74" />
                                  <Picker.Item label="75" value="75" />
                                  <Picker.Item label="76" value="76" />
                                  <Picker.Item label="77" value="77" />
                                  <Picker.Item label="78" value="78" />
                                  <Picker.Item label="79" value="79" />
                                  <Picker.Item label="80" value="80" />
                                  <Picker.Item label="81" value="81" />
                                  <Picker.Item label="82" value="82" />
                                  <Picker.Item label="83" value="83" />
                                  <Picker.Item label="84" value="84" />
                                  <Picker.Item label="85" value="85" />
                                  <Picker.Item label="86" value="86" />
                                  <Picker.Item label="87" value="87" />
                                  <Picker.Item label="88" value="88" />
                                  <Picker.Item label="89" value="89" />
                                  <Picker.Item label="90" value="90" />
                                  <Picker.Item label="91" value="91" />
                                  <Picker.Item label="92" value="92" />
                                  <Picker.Item label="93" value="93" />
                                  <Picker.Item label="94" value="94" />
                                  <Picker.Item label="95" value="95" />
                                  <Picker.Item label="96" value="96" />
                                  <Picker.Item label="97" value="97" />
                                  <Picker.Item label="98" value="98" />
                                  <Picker.Item label="99" value="99" />
                                  <Picker.Item label="100" value="100" />
                              </Picker> 
                              <NumberFormat
                                value={(item.price- item.price*item.sale/100)*itemdetails.number}
                                displayType={'text'}
                                thousandSeparator={true}                     
                                renderText={value => (
                                <TextInput
                                  underlineColorAndroid="transparent"
                                  editable={false}
                                  style={styles.CostItemText}
                                  value={value} /> )} />  
                            </View>  
                          </View>
                        )}      
                         
                      </View>
                      <View>
                        <TouchableOpacity style={styles.closeBtn} onPress={this.ItemRemove.bind(this, item.itemCode)}>
                          <Icon
                            style={styles.iconStyle}
                            name="close"
                            size={20}/> 
                        </TouchableOpacity>    
                      </View>
                    </View>
                    )}
                  </ScrollView>
                  
                </View>
            </View>
           
            <View style={[styles.overlay, styles.bottomOverlay]}>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.OrderConfirmAksing}>   Xác nhận   </Text>
                </View>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.BackToHome}>   Trang chủ   </Text>
                </View>    
            </View>    
          </View>
        );
      }
    }
    
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
    height: '100%',
  },
  PickerBox:{
    height: 30,
    width: '90%',
    fontSize: 8,
  },
  ScrollViewContainer:{
    height: '55%',
    top: 6,
  },
  bodyContainer: {
    width: '95%',
  },
  InputBox:{
    flexDirection: 'row',
    height: 30,
    width: '100%',
    borderBottomColor:'#CCCCCC',
    borderBottomWidth: 0.5, 
  },
  InputIcon:{
    lineHeight: 30,
    paddingLeft: 5,
    color: '#009900'
  },
  InputTitleBox:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  InputBoxEdit:{
    flexDirection: 'row',
    width: '100%',
  },
  ItemEditBox:{
    flexDirection: 'row',
    width: '100%',
    marginBottom: 2.5,
    backgroundColor: '#CCFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ItemTextTitle:{
    color: '#009900',
    fontSize: 10,   
  },
  ItemTextDes:{
    color: '#EE0000',
    fontSize: 10,   
    fontWeight: 'bold'
  },
  InputTextField:{
    fontSize: 8,
    color: '#111111',
    width: '90%',
    paddingLeft: 10,
  },
  PriceItemText:{
    width: '30%',
    color: '#009900',
  },
  CostItemText:{
    width: '30%',
    color: '#009900',
  },
  closeBtn:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemPickerBox:{
    width: 100,
    color: '#009900',
  },
  TotalBill:{
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#009900',
    color: '#009900',
    fontSize: 10,
    top: 4,
  },
  selectBox:{
    flexDirection: 'row',
    height: 30,
    fontSize: 8,
    borderBottomColor:'#CCCCCC',
    borderBottomWidth: 0.5, 
  },
  bottomOverlay: {
    bottom: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  InputDisplay:{
    color: '#009900'
  },
  btnSettings:{
    justifyContent: 'center',
    padding: 5,
  },
  titleText: {
    lineHeight: 25,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    backgroundColor: "#009900",
    borderRadius:16,
  },
} 