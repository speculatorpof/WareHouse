import React, { Component } from 'react';
import { Text, View, Alert, SafeAreaView , FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class WareHouseOrderGoods extends Component {
  
    constructor(props){
        super(props)
        this.offset = 1;
        this.state = {
          pageloading: true,
          Base_url: Base_url,
          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,
          ordersList: [
            {totalBill: 540000, itemNumber: 5, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 5, status: 'come'},
            {totalBill: 540000, itemNumber: 3, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 4, status: 'wait'},
            {totalBill: 540000, itemNumber: 7, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 3, status: 'come'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 10, status: 'wait'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 10, status: 'wait'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 10, status: 'wait'},
            {totalBill: 540000, itemNumber: 2, orderCode: 'xbcd98', deliveryAddress:'54 Ha Dong, Ha Noi', distance: 10, status: 'wait'},
          ],
          
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
   
  }

  

  getOrderList = () => {
    const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + '/WareHouseOrders/' + '?email=' + this.state.authEmail + '?orderType=' + 'process' + '?offset=' + 0;
    this.setState({ pageloading: true }, () => {
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
      const serviceUrl = this.state.Base_url + '/WareHouseOrders/' + '?email=' + this.state.authEmail + '?orderType=' + 'process' + '?offset=' + 0;

        this.setState({ fetching_from_server: true }, () => {
          fetch(serviceUrl, {
            method: 'GET',
            headers: {
              'Authorization': `token ${authToken}`,
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
                  cartList: [...this.state.ordersList, ...responseJson.results],
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

    WareHouseOrdersDetail = (item) => {
      this.props.navigation.navigate('WareHouseOrdersDetailScreen', {OrderDetail: item})
    }


    render() {
        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
         
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.Container}>
                  
                {/** New block */}
                {this.state.ordersList == [] ? (
                <ActivityIndicator size="large" />
                  ) : (
                    <FlatList
                      style={styles.ScrollViewContainer}
                      keyExtractor={(item, index) => index.toString()}
                      data={this.state.ordersList}
                      renderItem={({ item, index }) => (
                        <View style={styles.ItemBox} key={index}>
                        
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

                          {item.status === 'come' && 
                            <View style={styles.ItemStatusBlock}>
                              <Icon
                              style={styles.InputIcon}
                              name="truck-delivery-outline"
                              size={(20)}/>  
                              <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemDistanceText}>  {item.distance} Km</Text>   
                            </View>
                          }  
                          {item.status === 'wait' && 
                            <View style={styles.ItemStatusBlock}>
                              <Icon
                              style={styles.InputIcon}
                              name="gift-outline"
                              size={(20)}/>  
                              <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemStatusText}>  Chờ nhận</Text>   
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
                        </View>
                        
                      </View>
                      <TouchableHighlight style={styles.ItemNaviBlock}
                        onPress={this.WareHouseOrdersDetail.bind(this, item)}>
                          <Icon
                              style={styles.InputIcon}
                              name="chevron-right-circle"
                              size={(25)}/>
                      </TouchableHighlight>
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
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  ScrollViewContainer:{
    height: '66%',
    marginBottom: 10,
    top: 5,
  },
  Container: {
    width: '95%',
  },
  ItemBox:{
    flexDirection: 'row',
    width: '100%',
    height: 100,
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
    color: '#009900',
    alignItems: 'center',
  },
  ItemStatusText:{
    color: '#EE0000',
    fontSize: 10
  },
  ItemDistanceText:{
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