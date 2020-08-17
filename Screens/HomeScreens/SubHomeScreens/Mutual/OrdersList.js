import React, { Component } from 'react';
import { Text, View, Alert, Picker , FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class OrdersList extends Component {
  
    constructor(props){
        super(props)
        this.offset = 1;
        this.orderListRender = this.orderListRender.bind(this);
        this.state = {
          pageloading: true,
          Base_url: Base_url,
          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,
          authType: props.route.params.authType,

          ordersList: [
            {totalBill: 540000, itemNumber: 5, orderCode: 'xbcd98', date:'13/07/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'done', name: 'Nguyen Van B', phone: '0384575845'},
            {totalBill: 540000, itemNumber: 10, orderCode: 'xbcd98', date:'26/05/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'cancel', name: 'Nguyen Van B', phone: '0384575845'},
            {totalBill: 540000, itemNumber: 7, orderCode: 'xbcd98', date:'23/05/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'done', name: 'Nguyen Van B', phone: '0384575845'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', date:'14/03/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'process', name: 'Nguyen Van B', phone: '0384575845'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', date:'13/02/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'done', name: 'Nguyen Van B', phone: '0384575845'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', date:'23/01/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'cancel', name: 'Nguyen Van B', phone: '0384575845'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', date:'12/01/2020', deliveryAddress:'54 Ha Dong, Ha Noi', status: 'done', name: 'Nguyen Van B', phone: '0384575845'},
          ],
          orderFilter: [
            {label: 'Đơn chờ xuất', value: 'process'},
            {label: 'Đơn đã xuất', value: 'done'},
            {label: 'Đơn đã hủy', value: 'cancel'}
          ],
          orderStatus: 'process',
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
    const objInItemList = this.state.ordersList;
    await this.setState({itemListNumber: objInItemList.length})
  }
  
  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false} )
    }, 1500); // setState will be called after 1,5s
  }

  OrdersDetail = (item) => {
    this.props.navigation.navigate('OrdersDetailScreen', {OrderDetail: item, 
      OrderType: 'OutHouse',
      authToken: this.state.authToken,
      authEmail: this.state.authEmail,
      authType: this.state.authType
    })
  }


  getOrderList = () => {
    const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + '/Orders/' + '?email=' + this.state.authEmail + '?type=out' + '?status=' + this.state.orderStatus + '?offset=' + 0;
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
            this.setState({ ordersList: responseJson.ordersList , pageloading: false});
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
      const serviceUrl = this.state.Base_url + '/Orders/' + '?email=' + this.state.authEmail + '?type=out' + '?status=' + this.state.orderStatus + '?offset=' + this.offset;

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
                  ordersList: [...this.state.ordersList, ...responseJson.results],
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
    
    orderListRender({item}){
      return(
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
                            color='red'> {item.orderCode.toUpperCase()}</Text>

                          {item.status === 'done' && 
                            <View style={styles.ItemStatusBlock}>
                              <Icon
                              style={styles.InputIcon}
                              name="gift"
                              size={(20)}/>  
                              <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemSucessText}>  Đã xuất</Text>   
                            </View>
                          }  
                          {item.status === 'cancel' && 
                            <View style={styles.ItemStatusBlock}>
                              <Icon
                              style={styles.InputCancelIcon}
                              name="bell-cancel"
                              size={(20)}/>  
                              <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemCancelText}>  Đã hủy</Text>   
                            </View>
                          }    
                          {item.status === 'process' && 
                            <View style={styles.ItemStatusBlock}>
                              <Icon
                              style={styles.InputProcessIcon}
                              name="truck-delivery"
                              size={(20)}/>  
                              <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemProcessText}>  Chờ xuất</Text>   
                            </View>
                          }  
                        </View>
                        <View style={styles.InputBoxEdit}>
                          <Icon
                            style={styles.InputIcon}
                            name="cash"
                            size={(25)}/>  
                          <NumberFormat
                            value={item.totalBill}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' Vnd'}
                            renderText={value => (
                              <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemNumberText}> {value}</Text>)}/>  
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemNumberText}> {item.itemNumber} Sản phẩm</Text>       
                        </View>
                        <View style={styles.InputBoxEdit}>
                          <Icon
                              style={styles.InputIcon}
                              name="map-marker"
                              size={(25)}/>  
                          <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemAddressText}> {item.deliveryAddress}</Text>
                          <Icon
                              style={styles.InputIcon}
                              name="calendar"
                              size={(25)}/>  
                          <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemDateText}> {item.date}</Text>    
                        </View>
                        
                      </View>
                      <TouchableHighlight style={styles.ItemNaviBlock}
                        onPress={this.OrdersDetail.bind(this, item)}>
                          <Icon
                              style={styles.InputIcon}
                              name="chevron-right-circle"
                              size={(25)}/>
                      </TouchableHighlight>
                    </View>
      )
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
              <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />
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
                  <Picker
                    style={styles.PickerBox}
                    selectedValue={this.state.orderStatus}
                    mode="dialog"
                    onValueChange={(value) =>
                      {this.setState({orderStatus: value}), this.getOrderList()}
                    }> 
                    {this.state.orderFilter.map((member, key)=>
                      <Picker.Item label={member.label} value={member.value} key={key}/>)
                    }  
                  </Picker> 
                  <Text style={styles.DisplayText}>Số lượng đơn hàng: {this.state.itemListNumber}</Text>  
                {/** New block */}
                {this.state.ordersList == [] ? (
                <ActivityIndicator size="large" />
                  ) : (
                    <SafeAreaView>
                      <FlatList
                        style={styles.ScrollViewContainer}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.ordersList}
                        renderItem={this.orderListRender}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        //Adding Load More button as footer component
                      />
                    </SafeAreaView>
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
  pickerBox:{
    height: 30,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#009900',
  },
  DisplayText:{
    fontSize: 10
  },
  ScrollViewContainer:{
    height: '85%',
    marginBottom: 5,
    top: 5,
  },
  Container: {
    width: '95%',
  },
  ItemBox:{
    flexDirection: 'row',
    width: '100%',
    height: 90,
    marginBottom: 5,
    backgroundColor: '#CCFFFF',
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
  ItemNaviBlock:{
    borderColor:'#00CC66',
    justifyContent:'center',
    backgroundColor:'#00CC66',
    borderRadius:50,
    margin: 10
  },
  ItemTitleBlock:{
    flexDirection: 'row',
    width: '100%',
    height: 30,
    alignItems: 'center',
  },
  ItemStatusBlock:{
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  InputBoxEdit:{
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  InputIcon:{
    color: '#006600',
  },
  InputCancelIcon:{
    color: '#EE0000',
  },
  InputProcessIcon:{
    color: '#FF00FF',
  },
  ItemCodeText:{
    fontSize: 10,
    color: '#EE0000',
    width: '50%',
  },
  ItemNumberText:{
    width: '48%',
    alignItems: 'center',
    lineHeight: 30,
    fontSize: 9,
    color: '#009900',
  },
  ItemAddressText:{
    fontSize: 9,
    width: '48%',
    color: '#009900',
    alignItems: 'center',
  },
  ItemDateText:{
    fontSize: 9,
    color: '#009900',
    alignItems: 'center',
  },
  ItemCancelText:{
    color: '#EE0000',
    fontSize: 10
  },
  ItemProcessText:{
    color: '#FF00FF',
    fontSize: 10,
  },
  ItemSucessText:{
    color: '#009900',
    fontSize: 10
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#009900',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
} 