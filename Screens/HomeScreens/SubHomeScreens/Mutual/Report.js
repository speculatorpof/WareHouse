import React, { Component } from 'react';
import { Text, View, Alert, FlatList, Picker, TextInput, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import { ItemList } from '../../../../AppSRC/Data/ItemList';
import TextAlertComponent from '../../../../AppSRC/Components/TextAlertComponent';

import Loader from '../../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../../AppSRC/Components/DoneIndicator';


import NumberFormat from 'react-number-format';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default class Report extends Component {
  
    constructor(props){
        super(props);
        this.offset = 1;
        this.state = {
          pageloading: true,
          loading: false,
          doneAnimating: false,
          success_handle: false,
          displayAlertloading: false,
          orderAskingLoading: false,

          Alert: false,
          AlertText: null,

          Base_url: Base_url,
          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,
          authType: props.route.params.authType,
          
          ordersList: [
            {date: 10-7, totalBill: 5400000, orderNumber: 22},
            {date: 9-7, totalBill: 454000, orderNumber: 21},
            {date: 8-7, totalBill: 243000, orderNumber: 20},
            {date: 7-7, totalBill: 224000, orderNumber: 14},
            {date: 6-7, totalBill: 125000, orderNumber: 11},
            {date: 5-7, totalBill: 1230000, orderNumber: 10},
            {date: 4-7, totalBill: 1110000, orderNumber: 8},
            {date: 3-7, totalBill: 900000, orderNumber: 6},
            {date: 2-7, totalBill: 580000, orderNumber: 5},
            {date: 1-7, totalBill: 540000, orderNumber: 2},
          ],
          orderFilter: [
            {label: 'Đơn đang đặt', value: 'process'},
            {label: 'Đơn đã hoàn thành', value: 'done'},
            {label: 'Đơn đã hủy', value: 'cancel'}
          ],
          InitialDate: '13/07/2020',
          EndDate: '18/07/2020',
          itemList: ItemList,
          itemListNumber: 0,
          orderItemList: [],
          orderItemNumber: 0,
          TotalBill: 0
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});

    // Update Totall Bill in case for setup requiring munimum purchases
   // this.brandListGet()
    this.itemNumberCheck()
  }

 

  itemNumberCheck = async() => {
    const objInItemList = this.state.itemList;
    await this.setState({itemListNumber: objInItemList.length})
  }
  
  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false} )
    }, 1500); // setState will be called after 1,5s
  }



  getOrderList = (orderTypeCode) => {

    const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + '/SaleOrders/' + '?email=' + this.state.authEmail  + '?orderType=' + orderTypeCode + '?offset=' + 0; // offset = 0 as getting new list
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
            this.offset = 1 // Set offset = 1
          }
          }).catch((error) => {
            console.error(error);
        });
    });
  }


  
  loadMoreData = () => {
    const authToken = this.state.authToken;

  //On click of Load More button We will call the web API again
  const serviceUrl = this.state.Base_url + '/SaleOrders/' + '?email=' + this.state.authEmail  + '?orderType=' + orderTypeCode + '?offset=' + this.offset; 

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
                  <Text style={styles.DisplayText}>Thời gian: {this.state.InitialDate} - {this.state.EndDate}</Text>
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
                          
                        </View>
                       
                        
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
    backgroundColor: '#fff',
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