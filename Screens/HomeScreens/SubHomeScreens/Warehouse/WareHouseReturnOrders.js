import React, { Component } from 'react';
import { Text, View, Alert, Picker , FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class WareHouseReturnOrders extends Component {
  
    constructor(props){
        super(props)
        this.offset = 1;
        this.state = {
          pageloading: true,
          Base_url: Base_url,

          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,
          authType: props.route.params.authType,
          
          ItemsList: [
            {itemCode: 'bg993', name: 'bột giặt', orderCode:'ABC898', number: 1, SKUCode: 'ewr2d983', itemDetailCode: 'xkj993', des: 'Hương hoa nhài', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Vietnam', 
            price: 1200, 'sale': 10, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
            {itemCode: 'bg993', name: 'bột giặt', orderCode:'ABC898', number: 1, SKUCode: 'xkj993', itemDetailCode: 'bck8993', des: 'Hương hoa cúc', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Hàn Quốc', 
            price: 1250, 'sale': 0, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
            {itemCode: 'nkk890', name: 'áo phông ALV', orderCode:'jkj98', number: 1, SKUCode: 'xkwe993', itemDetailCode: 'b1kjfd2f', des: 'Size 89', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg', origin: 'Nhật Bản', 
            price: 2400, 'sale': 20, description: "Nước hoa thảo dược ABC nhập khẩu Pháp thành phần: abdc (98%)," +
            "chất độc (50%). Mùi thơm nhẹ nhàng, hương hoa cứt lợn." +
            "Hương thơm lưu giữ lâu khoảng 5-6h" },
           

         //   {name: 'áo phông', number: 5, brandCode: 'xtj993', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg'},
       //     {name: 'Áo trắng AlMlB', number: 1, brandCode: 'xbj993', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg'},
        //    {name: 'quần đũng',  number: 4, brandCode: 'bck89393', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg'},
         //   {name: 'áo ba lỗ xanh', number: 10, brandCode: 'xqj993', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg'},
         //   {name: 'áo ba lỗ xanh', number: 4, brandCode: '', link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg'},
          ],
          CodeToScanList: [],
          itemListNumber: 0,
          TotalBill: 0,
          fetching_from_server: false,
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});

    // Update Totall Bill in case for setup requiring munimum purchases
   // this.getOrderList()
   // Remove flag to turn Scanning on
   this.itemNumberCheck()

  }

  itemNumberCheck = async() => {
    const objInItemList = this.state.ItemsList;
    await this.setState({itemListNumber: objInItemList.length})
  }
  
  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false} )
    }, 1500); // setState will be called after 1,5s
  }

  getReturningItemsList = () => {
    const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + '/Orders' + '?email=' + this.state.authEmail + '?type=in' + '?status=returning' + '?offset=' + 0;
    this.setState({ pageloading: true }, () => {
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
            this.setState({ ItemsList: responseJson.ReturnItemsList , pageloading: false});
            this.offset = 1;
          }
          }).catch((error) => {
            console.error(error);
        });
    });
  }

    loadMoreData = () => {
      const authToken = this.state.authToken;

      //On click of Load More button We will call the web API again
      const serviceUrl = this.state.Base_url + '/Orders' + '?email=' + this.state.authEmail + '?type=in' + '?status=returning' + '?offset=' + 0;

        this.setState({ fetching_from_server: true }, () => {
          fetch(serviceUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
           //   'X-CSRF-TOKEN': token
            },
          })
          //Sending the currect offset with get request
              .then(response => response.json())
              .then(responseJson => {
              //Successful response from the API Call 
                this.offset = this.offset + 1;
                //After the response increasing the offset for the next API call.
                this.setState({
                  ItemsList: [...this.state.ItemsList, ...responseJson.ReturnItemsList],
                  //adding the new data with old one available in Data Source of the List
                  fetching_from_server: false,
                  //updating the loading state to false
                });
              })
              .catch(error => {
                console.error(error);
              });
        });
      };

      ItemDetail = (item) => {
          this.props.navigation.navigate('ItemDetailScreen', {itemDetail: item})
        }

        // For WareHouse to Scan
      QRScanNavi = async (item) => {
          await this.setState({CodeToScanList: []}) // Clear CodeToScanList in case of going back
          this.state.CodeToScanList.push({'itemCode': item.itemCode,'itemSKUCode': item.SKUCode, 'itemDetailCode': item.itemDetailCode, 'orderCode': item.orderCode, 'name': item.name, 
          'des': item.des, 'description': item.description, 'link': item.link, 'origin': item.origin, 'price': item.price, 'sale': item.sale})
          this.props.navigation.navigate('WareHouseScanScreen', 
          {CodeToScanList: this.state.CodeToScanList, ScanStatus: 'Return',
          NeedToScanNumber: item.number}) //number = 1 as default for returning items
        }  
      
      
    renderFooter() {
      return (
      //Footer View with Load More button
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.loadMoreData}
            //On Click of button calling loadMoreData function to load more data
            style={styles.loadMoreBtn}>
            <Text style={styles.btnText}>Xem thêm</Text>
            {this.state.fetching_from_server ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    }

    


    render() {
        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
         
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.Container}>
                  <Text style={styles.DisplayText}>Số sản phẩm trả về: {this.state.itemListNumber}</Text>  
                {/** New block */}
                {this.state.ItemsList == [] ? (
                <ActivityIndicator size="large" />
                  ) : (
                    <FlatList
                      style={styles.ScrollViewContainer}
                      keyExtractor={(item, index) => index.toString()}
                      data={this.state.ItemsList}
                      renderItem={({ item, index }) => (
                        <View style={styles.ItemListBox} key={index}>
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
                            
                          <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemTextTitle}
                                color='red'>Mã đơn hàng: {item.orderCode.toUpperCase()}</Text>
                          <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemTextTitle}
                                color='red'>Mã sản phẩm: {item.SKUCode.toUpperCase()}</Text>   
                          </View>
                        </View>
                        <View>
                          <TouchableHighlight style={styles.ItemNaviBlock}
                            onPress={this.QRScanNavi.bind(this, item)}>
                              <Icon
                                  style={styles.InputIcon}
                                  name="qrcode-scan"
                                  size={(25)}/>
                          </TouchableHighlight>   
                        </View>
                      </View>
                      )}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                      ListFooterComponent={this.renderFooter.bind(this)}
                      //Adding Load More button as footer component
                    />
                  )}
             
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
    flex: 1,
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
    height: '100%',
  },
  DisplayText:{
    top:5,
    fontSize: 10
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
    color: 'red',
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
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
} 