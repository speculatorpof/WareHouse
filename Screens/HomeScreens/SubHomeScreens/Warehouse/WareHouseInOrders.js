import React, { Component } from 'react';
import { Text, View, Alert, Picker , FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class WareHouseInOrders extends Component {
  
    constructor(props){
        super(props)
        this.offset = 1;
        this.state = {
          pageloading: true,
          Base_url: Base_url,
          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,
          authType: props.route.params.authType,

          ordersList: [
            {number: 25, inhouseNumber: 15, orderCode: 'xbcd98', date:'17/08/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 10, inhouseNumber: 8, orderCode: 'xbcd98', date:'5/07/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 15, inhouseNumber: 15, orderCode: 'xbcd98', date:'2/07/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 20, inhouseNumber: 16, orderCode: 'xbcd98', date:'30/06/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 25, inhouseNumber: 25, orderCode: 'xbcd98', date:'27/05/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 27, inhouseNumber: 25, orderCode: 'xbcd98', date:'12/03/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 25, inhouseNumber: 15, orderCode: 'xbcd98', date:'17/08/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 10, inhouseNumber: 8, orderCode: 'xbcd98', date:'5/07/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 15, inhouseNumber: 15, orderCode: 'xbcd98', date:'2/07/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 20, inhouseNumber: 16, orderCode: 'xbcd98', date:'30/06/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 25, inhouseNumber: 25, orderCode: 'xbcd98', date:'27/05/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 27, inhouseNumber: 25, orderCode: 'xbcd98', date:'12/03/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 25, inhouseNumber: 15, orderCode: 'xbcd98', date:'17/08/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 10, inhouseNumber: 8, orderCode: 'xbcd98', date:'5/07/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 15, inhouseNumber: 15, orderCode: 'xbcd98', date:'2/07/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 20, inhouseNumber: 16, orderCode: 'xbcd98', date:'30/06/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 25, inhouseNumber: 25, orderCode: 'xbcd98', date:'27/05/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 27, inhouseNumber: 25, orderCode: 'xbcd98', date:'12/03/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
            {number: 25, inhouseNumber: 25, orderCode: 'xbcd98', date:'27/05/2020', status: 'done', warehouse: 'warehouse1@gmail.com'},
            {number: 27, inhouseNumber: 25, orderCode: 'xbcd98', date:'12/03/2020', status: 'process', warehouse: 'warehouse1@gmail.com'},
      
          ],
          orderFilter: [
            {label: 'Đơn chờ nhập', value: 'process'},
            {label: 'Đơn đã nhập', value: 'done'},
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
      OrderType: 'InHouse',
      authToken: this.state.authToken,
      authEmail: this.state.authEmail,
      authType: this.state.authType
    })
  }


  getOrderList = () => {
    const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + '/Orders' + '?email=' + this.state.authEmail + '?type=in' + '?status=' + this.state.orderStatus + '?offset=' + 0;
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
      const serviceUrl = this.state.Base_url + '/Orders' + '?email=' + this.state.authEmail + '?type=in' + '?status=' + this.state.orderStatus + '?offset=' + this.offset;

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
                  ordersList: [...this.state.ordersList, ...responseJson.ordersList],
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

    render() {
        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
         
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.Container}>
                  <Picker
                    style={styles.PickerBox}
                    selectedValue={this.state.orderType}
                    mode="dialog"
                    onValueChange={(value) =>
                      {this.getOrderList(value)}
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

                          {item.status === 'done' && 
                            <View style={styles.ItemStatusBlock}>
                              <Icon
                              style={styles.InputIcon}
                              name="gift"
                              size={(20)}/>  
                              <Text
                                underlineColorAndroid="transparent"
                                editable={false}
                                style={styles.ItemSucessText}>  Đã nhập</Text>   
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
                                style={styles.ItemProcessText}>  Chờ nhập</Text>   
                            </View>
                          }  
                        </View>
                        <View style={styles.InputBoxEdit}>
                          <Icon
                            style={styles.InputIcon}
                            name="calendar"
                            size={(25)}/>  
                         
                          <Text
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.ItemNumberText}> {item.date}</Text>
                          {item.status === 'done' &&  
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemNumberText}> {item.inhouseNumber}/{item.number}  Sản phẩm</Text>       
                          }  
                          {item.status === 'process' &&  
                          <Text
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ProcessItemNumberText}> {item.inhouseNumber}/{item.number}  Sản phẩm</Text>       
                          }  
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
  ProcessItemNumberText:{
    width: '48%',
    alignItems: 'center',
    lineHeight: 30,
    fontSize: 9,
    color: '#EE0000',
    fontWeight: 'bold'
  },
  ItemAddressText:{
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