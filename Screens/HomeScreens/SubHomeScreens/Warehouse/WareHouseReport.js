import React, { Component } from 'react';
import { Text, View, Alert, BackHandler, Picker, TextInput, ScrollView, Image, ViewPagerAndroidBase } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../../AppSRC/Components/DoneIndicator';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class WareHouseReport extends Component {
  
    constructor(props){
        super(props)
        this.state = {
          pageloading: true,
          loading: false,
          doneAnimating: false,
          success_handle: false,
          displayAlertloading: false,
          orderAskingLoading: false,
          Base_url: Base_url,

          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,

          branchList: [
            {brandName: 'Hàng xách tay ADMLB', brandCode: 'ADMLB'}, 
            {brandName: 'Nước Hoa Xách tay', brandCode: 'DFFGG'},
            {brandName: 'Son Hàn Quốc', brandCode: 'HQDFĐF'},
            {brandName: 'Áo khoác Quảng Châu', brandCode: 'QCADFD'},
            {brandName: 'Điện thoại VN', brandCode: 'VNMD'},
          ],
          brandCode: null,
          itemList: [
            {name: 'nước hoa', price: 100000, number: 0, minimum: 2, itemCode: 'xbcd98', origin: 'Việt Nam',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 20},
            {name: 'áo phông', price: 2000, number: 0, minimum: 3,  itemCode: 'xbcd098', origin: 'Nga',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 10},
            {name: 'Áo trắng AlMlB', price: 25000, number: 0, minimum: 1,  itemCode: 'xddd98', origin: 'Úc',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 0},
            {name: 'quần đũng', price: 4000, number: 0, minimum: 4,  itemCode: 'errdd98', origin: 'Mỹ',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: ''},
            {name: 'áo ba lỗ', price: 27500, number: 0, minimum: 0, itemCode: 'xyj01298', origin: 'Việt Nam',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 0},
            {name: 'áo 4 lỗ', price: 27500, number: 0, minimum: 0, itemCode: 'xyj03298', origin: 'Hàn Quốc',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 0},
            {name: 'áo ADmlb', price: 27500, number: 0, minimum: 0, itemCode: 'xyj048', origin: 'Hàn Quốc',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 25},
            {name: 'áo ba lỗ xanh', price: 25500, number: 0, minimum: 0, itemCode: 'xyj4338', origin: 'Hàn Quốc',
            description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h", link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', sale: 15},
          ],
          orderItemList: [],
          Storename: 'Onbird.vn',
          ShoppingCartCode: 'BE9860',
          TotalBill: 0
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});

    // Update Totall Bill in case for setup requiring munimum purchases
    this.updateTotalBill()
   // this.brandListGet()
  //  this.getAuthInfo();
  }

  brandListGet = () =>{
    const authToken = this.state.authToken;

    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + '/brandListGet';
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
        
          if(responseJson.status != '200'){
            Alert.alert("Oh! đã có lỗi xảy ra rồi!");
          }
          if(responseJson.status == '200'){
            this.setState({ branchList: responseJson.branchList });
            this.setState({ brandCode: responseJson.branchList[0].brandCode})
            // Set item list with brandCode
            this.setItemList(responseJson.branchList[0].brandCode)
            Alert.alert(this.state.brandCode);
          }
          }).catch((error) => {
            console.error(error);
        });
    });
    
    }

  setItemList = (brandcode) => {
    // Trigger off loading icon
   // this.setState({loading: true})

    const auth_token = this.state.userIdToken;
    const brandCode = brandcode;

    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + '/wholesaleitemListGet';
    this.setState({ loading: true }, () => {
      fetch(serviceUrl, {
        method: 'POST',
        headers: {
          'Authorization': `token ${auth_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       //   'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          brandCode: brandCode
          
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
        
          if(responseJson.status != '200'){
            Alert.alert("Oh! đã có lỗi xảy ra rồi!");
          }
          if(responseJson.status == '200'){
            this.setState({ itemList: responseJson.itemList });
            Alert.alert('item list done');
            
          }
          }).catch((error) => {
            console.error(error);
        });
    });
    
    }
  test(){
    //alert('abc')
    this.setState({displayAlertloading: true})
  }
  

  updateTotalBill = () =>{
    let newBill = 0
    this.state.itemList.map((item)=>
      newBill = ((item.price-item.price*item.sale/100)*item.number) + newBill
    )
    //alert(newBill)
    this.setState({TotalBill: newBill})
  }

  orderReset = () =>{
    let objects = this.state.itemList.filter(obj => obj.number != 0)
    if(objects){
      // Set number of child-object to 0
      objects.map(obj => obj.number=0) 
      // Reset total bill
      this.setState({TotalBill: 0})
      // Remove pending items from orderItemlist
      this.setState({orderItemList: []})
    }
  }

  itemListUpdate = (itemCode, number, name, minimum, price, sale) =>{
    let updateItem = this.state.orderItemList.find(obj => obj.itemCode === itemCode)
    if (updateItem){
      if(number > 0 && number > minimum){
        updateItem.number = number
      }else{
        if(number > 0 && number < minimum){
          updateItem.number = minimum
        }else{
          // Remove item from list as user set number = 0
          const objects = this.state.orderItemList.filter(obj => obj.itemCode !== itemCode);
          this.setState({ orderItemList: objects });
        }  
      }
    }else{
        this.state.orderItemList.push({'itemCode': itemCode, 'number': number, 'name': name, 'minimum': minimum, 'price': price, 'sale': sale})
    }
   
  //  alert(JSON.stringify(this.state.orderItemList))

  }

  orderCreate = () => {
    // this.updateTotalBill()
     if(this.state.TotalBill == 0){
       alert('Mời chọn số lượng sản phẩm để đặt hàng')
     }else{
         this.props.navigation.navigate('SaleOrderScreen', {OrderItemList: this.state.orderItemList, totalBill: this.state.TotalBill})
      
     }
 }
  
  //orderCreate(){
     // this.updateTotalBill()
   //   if(this.state.TotalBill == 0){
    //    alert('Oh! Bạn quên chọn sản phẩm à?')
   ///   }else{
    //    let findNumberZero = this.state.orderItemList.find(obj => obj.number == 0)
    ///    let findItemList = this.state.itemList.find(obj => obj.number != 0)
        
  //      let findNumberGreaterThanZero = this.state.orderItemList.find(obj => obj.number != 0)
    //    if(findNumberGreaterThanZero){
      //    if(findNumberZero){
            // Remove item from list as user set number = 0
        //    const orderItemobjects = this.state.orderItemList.filter(obj => obj.number !== 0);
       //     this.setState({ orderItemList: orderItemobjects});
       //     this.props.navigation.navigate('SaleOrderScreen', {OrderItemList: orderItemobjects, totalBill: this.state.TotalBill})
       //   }else{
         //   this.props.navigation.navigate('SaleOrderScreen', {OrderItemList: this.state.orderItemList})
          //}
   //     }else{
     //     let ChoosenitemList = this.state.itemList.find(obj => obj.number != 0)
       //   for(i=0; i< ChoosenitemList.length; i++){

         //   this.state.orderItemList.push({'itemCode': i.itemCode, 'number': i.number, 'name': i.name, 'minimum': i.minimum, 'price': i.price})
          //}
        //  this.props.navigation.navigate('SaleOrderScreen', {OrderItemList: this.state.orderItemList})

        //  this.setState({ orderItemList: orderItemobjects});
        ///  alert('Oh! Bạn quên chọn sản phẩm à?')
         
       // }
        
       // this.setState({orderAskingLoading: true}) }  }

    
    render() {
        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
            <Loader
              loading={this.state.loading} />
            <DoneIndicator
              loading={this.state.doneAnimating} />
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.Container}>
                  <Picker
                      style={styles.PickerBox}
                      selectedValue={this.state.branchName}
                      mode="dialog"
                      onValueChange={(value) =>
                        {this.setState({brandCode: value}), this.setItemList(value)}
                      }> 
                      {this.state.branchList.map((member, key)=>
                        <Picker.Item label={member.brandName} value={member.brandCode} key={key}/>)
                      }  
                  </Picker>  
                {/** New block */}

                <ScrollView vertical={true} style={styles.ScrollViewContainer}
         //         showsVerticalScrollIndicator={false}
                  >

                  {this.state.itemList.map((item, i)=>
                    <View style={styles.ItemBox} key={i}>
                      <TouchableHighlight style={styles.ItemImgBlock}
                      onPress={()=> 
                        this.props.navigation.navigate('SaleItemDetailScreen', 
                        {itemDetail: item})}> 
                        <Image
                          source={{
                            uri: item.link,
                            cache: 'only-if-cached',
                          }}
                          style={styles.imgStyle}/>
                      </TouchableHighlight>     
                      <View style={styles.ItemInfoBlock}>
                        {item.sale != 0 &&
                          <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemTextTitleSale}
                              color='red'
                              onPress={()=> 
                                this.props.navigation.navigate('SaleItemDetailScreen', 
                                {itemDetail: item})}>{item.name.toUpperCase()+ ' -- Sale ' + item.sale + '%'}</Text>
                        }
                        {item.sale == 0 &&
                          <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemTextTitle}
                              color='green'
                              onPress={()=> 
                                this.props.navigation.navigate('SaleItemDetailScreen', 
                                {itemDetail: item})}>{item.name.toUpperCase()}</Text>
                        }
                        <View style={styles.InputBoxEdit}>

                          <NumberFormat
                            value={item.price - item.price*item.sale/100}
                            displayType={'text'}
                            thousandSeparator={true}
                          //   suffix={' Vnd'}
                            renderText={value => (
                              <TextInput
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.PriceItemText}
                                value={'Giá: ' + value} /> )} />  
                          <Picker
                            key={i}
                            selectedValue={item.number.toString()}
                            style={styles.ItemPickerBox}
                            mode="dropdown"
                            onValueChange={(value) =>
                              this.setState(
                                  this.state.itemList.map(
                                  obj => (obj.itemCode === item.itemCode && value >= item.minimum ? Object.assign(obj, { number: value }) : obj,
                                  obj.itemCode === item.itemCode 
                                  && value < item.minimum ? Object.assign(obj, { number: item.minimum }) && alert('Số lượng tối thiểu của sản phẩm để nhận miễn phí vận chuyển là: '+ item.minimum + ' /Sản phẩm'): obj,
                                  obj.itemCode === item.itemCode && value < item.minimum && value == 0 ? Object.assign(obj, { number: 0 }) : obj),
                                ), this.updateTotalBill(), this.itemListUpdate(item.itemCode, value, item.name, item.minimum, item.price, item.sale)
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
                        </View>
                        <View  style={styles.InputBoxEdit}>        
                          <NumberFormat
                            value={(item.price- item.price*item.sale/100)*item.number}
                            displayType={'text'}
                            thousandSeparator={true}                     
                            renderText={value => (
                            <TextInput
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.CostItemText}
                              value={'Tổng: ' +value} /> )} />  
                        </View>
                      </View>
                    </View>
                    )}
                      
                  </ScrollView>
                  <View styles={styles.ChecksumBlock}>
                    <NumberFormat
                      value={this.state.TotalBill}
                      displayType={'text'}
                      thousandSeparator={true}
                      //decimalSeparator=","
                      //thousandSeparator="."
                      //isNumericString={true}
                      // allowNegative={false}
                    //  fixedDecimalScale={true}
                      //format="#.##"
                      suffix={' VND'}
                      renderText={value => (
                        <TextInput
                          underlineColorAndroid="transparent"
                          editable={false}
                          style={styles.TotalBill}
                          value={'Tổng tiền: ' + value} /> )} />  
                  </View>
                </View>
            </View>
           
            <View style={[styles.overlay, styles.bottomOverlay]}>
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={()=> this.orderCreate()}>   Đặt hàng   </Text>
                </View>  
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={()=> this.orderReset()}>   Làm mới  </Text>
                </View>  
              </View>    
          </View>
        );
      }
    }
    
const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  ScrollViewContainer:{
    height: '40%',
    marginBottom: 10,
    top: 5
  },
  Container: {
    width: '95%',
  },
  pickerBox:{
    width: 60,
    height: 30,
    fontWeight: 'bold',
    color: 'green',
  },
  ItemBox:{
    flexDirection: 'row',
    width: '100%',
    height: 100,
    marginBottom: 5,
  //  backgroundColor: '#CCFFFF',
    borderRadius: 5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  imgStyle:{
    height: 90,
    width: 90,
    borderRadius: 5,
    backgroundColor: 'green'
  },
  ItemInfoBlock:{
   // backgroundColor: 'red',
    height: '100%',
    flex: 1,
    paddingLeft: 5
  },
  ItemPickerBox:{
    width: 60,
    fontWeight: 'bold',
    color: 'green',
    height: 25,
   // backgroundColor: 'yellow'
  },
  
  InputBoxEdit:{
    flexDirection: 'row',
    height: 30,
   // backgroundColor: 'green'
  },
  ItemTextTitleSale:{
    fontSize: 16,
    color: 'red',
    lineHeight: 30,
  },
  ItemTextTitle:{
    fontSize: 16,
    color: 'green',
    lineHeight: 30,
  },
  InputTextField:{
    fontSize: 16,
    color: 'black',
    width: '80%',
    paddingLeft: 10,
  },
  PriceItemText:{
    width: '60%',
    color: 'green',
//height: 30,
   // backgroundColor: 'yellow'
  },
  CostItemText:{
  //  width: '40%',
    textAlign: 'right',
    color: 'green',

  },
  ChecksumBlock:{
    backgroundColor: 'green',
    width: '100%',
  },
  TotalBill:{
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'green',
    color: 'green',
    fontSize: 16,
    height: 40,
  },
  bottomOverlay: {
    bottom: 0,
    height: 70,
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
    lineHeight: 40,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    backgroundColor: "green",
    borderRadius:16,
  },
} 