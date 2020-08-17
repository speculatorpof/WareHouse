import React, { Component } from 'react';
import { Text, View, SafeAreaView, FlatList, Picker, TextInput, ActivityIndicator, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
//import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import { ItemList } from '../../../../AppSRC/Data/ItemList';
import TextAlertComponent from '../../../../AppSRC/Components/TextAlertComponent';
import FastImage from 'react-native-fast-image'

import Loader from '../../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../../AppSRC/Components/DoneIndicator';


import NumberFormat from 'react-number-format';
//import { TouchableHighlight } from 'react-native-gesture-handler';


export default class SaleItemList extends Component {
  
    constructor(props){
        super(props);
        this.offset = 1;
        this.renderProductList = this.renderProductList.bind(this);
        this.setProductList = this.setProductList.bind(this);
        this.state = {
          loading: false,
          doneAnimating: false,
          success_handle: false,
          displayAlertloading: false,
          orderAskingLoading: false,
          fetching_from_server: false,

          Alert: false,
          AlertText: null,

          searchData: null,

          Base_url: Base_url,
          authToken: props.route.params.authToken,
          authEmail: props.route.params.authEmail,

          categoryList: null,
          categoryID: null,

          branchList: null,
          brandID: null,

          productList: null,

          itemList: ItemList,
          itemListNumber: 0,
          orderItemList: [],
          orderItemNumber: 0,
          TotalBill: 0
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
  //  this.setState({loading: false});

    // Update Totall Bill in case for setup requiring munimum purchases
    this.CategoryGet()
    this.clearInCartItems()     // Reset Cart status 
  }

  
  clearInCartItems = async() =>{
    // Reset Cart status 
    this.state.itemList.map(item => item.itemCode !== 0? 
      Object.assign(item, { status: 0 }): item) 
  }

  itemNumberCheck = async() => {
    const objInItemList = this.state.productList;
    await this.setState({itemListNumber: objInItemList.length})
  }
  
  Alert = async (Alert) => {

    await this.setState({ Alert: true, AlertText: Alert} )
    setTimeout(() => {
      this.setState({ Alert: false})
    }, 1500); // setState will be called after 1,5s
  }

  // Get CategoryList
  CategoryGet = () =>{
    const authToken = this.state.authToken;

    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + 'api/dashboard/categories';
      fetch(serviceUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       //   'X-CSRF-TOKEN': token
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        
          if(responseJson.code != 200){
            this.Alert('Oh! đã có lỗi xảy ra rồi!')
       //     this.setState({ loading: false })
          //  alert(responseJson)
          }
          if(responseJson.code == 200){
            this.setState({ categoryList: responseJson.data, loading: false, categoryID: JSON.stringify(responseJson.data[0].id) });

            // Set BrandList with the first object's id
            this.setBrandList(JSON.stringify(responseJson.data[0].id))
         //   this.setProductList(JSON.stringify(responseJson.data[0].id))
          }
          }).catch((error) => {
            console.error(error);
        });
    }
  
  // Get BrandList
  setBrandList = (categoryID) =>{

    const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + 'api/home/brands?category_id=' + categoryID //+ '&page=' + this.offset; //+ '?offset=' + 0;
      fetch(serviceUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       //   'X-CSRF-TOKEN': token
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
         // alert(JSON.stringify(responseJson))
          if(responseJson.code != 200){
            this.Alert('Oh! đã có lỗi xảy ra rồi!')
       //     this.setState({ loading: false })
          //  alert(responseJson)
          }
          if(responseJson.code == 200){
            //alert(JSON.stringify(responseJson.data[0].id))
            this.setState({ BrandList: responseJson.data });
            this.setProductList()
          //  console.log('abc')
        // alert(JSON.stringify(responseJson.data))
        }
          }).catch((error) => {
            console.error(error);
        });
    }
  
  //Filter Productlist by brand
  brandIDUpdate = async(newID) =>{
    await this.setState({brandID: newID})
    this.setProductList()
  }

    // Get Product List by Category and Brand ID
  setProductList = () => {
    // Trigger off loading icon
    const authToken = this.state.authToken;
    const categoryID = this.state.categoryID;
    const brandID = this.state.brandID;

    var serviceUrl;
    if(brandID != null){
      serviceUrl = this.state.Base_url + 'api/products' + '?category_id=' + categoryID + '&brand_id=' + brandID// + '?page=' + this.offset;
    }else{
      serviceUrl = this.state.Base_url + 'api/products' + '?category_id=' + categoryID + '&brand_id=';
    }

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
      .then((response) => response.json())
      .then((responseJson) => {

          if(responseJson.code != 200){
            this.Alert('Oh! đã có lỗi xảy ra rồi!')
          }
          if(responseJson.code == 200){
           // this.offset = this.offset + 1;
            //
          //  console.log(serviceUrl)

            this.setState({ productList: responseJson.data.data, loading: false });
            this.recheckCartStatus();
         //   alert(JSON.stringify(responseJson.data.data[1].prices))
            this.offset = 2; // set offet = 2 after the first load for the next page
      //      alert(JSON.stringify(responseJson.data.current_page))
       //  console.log('called')
            this.itemNumberCheck()
          }
          }).catch((error) => {
            console.error(error);
        });
        
      })
      }

  loadMoreData = () => {
    
    if(this.offset != -1){ // -1 meaning at the end of list
      
      const authToken = this.state.authToken;
      const categoryID = this.state.categoryID
      //On click of Load More button We will call the web API again
      const brandID = this.state.brandID;

      var serviceUrl;
      if(brandID != null){
        serviceUrl = this.state.Base_url + 'api/products' + '?category_id=' + categoryID + '&brand_id=' + brandID + '&page=' + this.offset;
      }else{
        serviceUrl = this.state.Base_url + 'api/products' + '?category_id=' + categoryID + '&brand_id=' + '&page=' + this.offset;
      }
  
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
              if(responseJson.code == 200){
               // alert(JSON.stringify(responseJson.data.data))
                if(responseJson.data.data != ''){ 
                  this.setState({
                    //adding the new data with old one available in Data Source of the List
                    productList: [...this.state.productList, ...responseJson.data.data],
    
                    //updating the loading state to false
                    fetching_from_server: false,
                  });
                  this.itemNumberCheck()
                  //After the response increasing the offset for the next API call.
                  this.offset = this.offset + 1;  
                }else{
                  this.offset = -1;  // Call this first as it is unasynchronous
                  this.itemNumberCheck()
                  this.setState({fetching_from_server: false})
                  //console.log('')
                 // alert(this.offset)
                }
                
              }            
              // Recheck Cartstatus in case
              this.recheckCartStatus();

            })
            .catch(error => {
              console.error(error);
            });
        });
      }
    };

  orderReset = async () =>{
    // Loop through new productList to update Cart Status
    await this.state.productList.filter(item => item.status === 'Cart'? 
      Object.assign(item, { status: 'Active' }): item)

    await this.setState({orderItemList: [], orderItemNumber: 0})

  }


  recheckCartStatus = async() =>{
    const InCartItems = this.state.orderItemList;
    // Foreach through array 
    for (let addedItem of InCartItems) {
      // Loop through new itemList to update Cart Status
      await this.state.productList.map(item => item.sku === addedItem.sku? 
        Object.assign(item, { status: 'Cart' }): item) 
    }
  }

  async AddCart(item){
   
      let inCartItem = this.state.productList.find(obj => obj.sku === item.sku)
      inCartItem.status = 'Cart'

      await this.state.orderItemList.push({'sku': item.sku, 'number': item.number, 
      'name': item.name, 'prices': item.prices, 'items': item.items})
      // Update item number in orderitemlist
      const objInorderList = this.state.orderItemList;
      await this.setState({orderItemNumber: objInorderList.length})    
  }

  async RemoveCart(item){
    let updatedItem = this.state.orderItemList.filter(obj => obj.sku !== item.sku)
    await this.setState({orderItemList: updatedItem}) // Remove item from cart

    let inCartItem = this.state.productList.find(obj => obj.sku === item.sku)
    inCartItem.status = 'Active' //Reset status

    // Update number in orderItemnumber
    const objInorderList = this.state.orderItemList;
    await this.setState({orderItemNumber: objInorderList.length})
  
  }

 
  async itemListUpdateOnBack(updatedItem, removedCodeList){
    
    // Reset Cart status 
    if(removedCodeList != []){
      removedCodeList.map(obj => this.state.itemList.map(item => item.itemCode === obj.removedCode? 
        Object.assign(item, { status: 0 }): item) )
    }

    // Foreach through array 
    await this.setState({orderItemList: updatedItem})

    // Reset orderItemList
    const objInorderList = this.state.orderItemList;

    // Reset orderItem number
    await this.setState({orderItemNumber: objInorderList.length})
    
  }

  orderCreate(){
    // this.updateTotalBill()
     if(this.state.orderItemNumber == 0){
       this.Alert('Oh! Bạn quên chọn sản phẩm à?')
     }else{
         this.props.navigation.navigate('SaleOrderScreen', {
           OrderItemList: this.state.orderItemList, authToken: this.state.authToken, 
           authEmail: this.state.authEmail, OnBack: this.itemListUpdateOnBack.bind(this)
          })
      
     }
  }

  ItemDetail(item){
      this.props.navigation.navigate('ItemDetailScreen', {itemDetail: item})
  }
  

  renderProductList({item}){
    var ItemPrice
    if(JSON.stringify(item.prices[3]) === undefined){
       ItemPrice = null
    }else{
       ItemPrice = JSON.stringify(item.prices[3].price)
    }
    return (
      <View style={styles.ItemBox}>
          <TouchableOpacity onPress={this.ItemDetail.bind(this, item)}>
            <FastImage
              style={styles.imgStyle}
              source={{
                uri:  item.photos[1].image,
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}/> 
          </TouchableOpacity>
          <View style={styles.ItemInfoBlock}>
            <Text
              underlineColorAndroid="transparent"
              editable={false}
              style={styles.ItemTextTitle}>{item.name.toUpperCase()}</Text>
            <View style={styles.InputBoxEdit}>
            {ItemPrice != null && 
            <NumberFormat
              value={ItemPrice}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' Vnd'}
              renderText={value => (
              <TextInput
                underlineColorAndroid="transparent"
                editable={false}
                style={styles.PriceItemText}
                value={'Giá: ' + value} /> )} /> }
            {ItemPrice == null && 
              <TextInput
                underlineColorAndroid="transparent"
                editable={false}
                style={styles.PriceItemText}
                value={'Giá: Liên hệ'} />}
            {item.status == 'Active' &&
              <TouchableOpacity style={styles.BodyContainerEle} onPress={this.AddCart.bind(this, item)}>
                <Icon
                  style={styles.iconStylePlus}
                  name="cart-plus"
                  size={20}/>  
              </TouchableOpacity>}            
            {item.status == 'Cart' &&
              <TouchableOpacity style={styles.BodyContainerEle} onPress={this.RemoveCart.bind(this, item)}>
                <Icon
                  style={styles.iconStyleMinus}
                  name="cart-minus"
                  size={20}/>  
              </TouchableOpacity>}         
          </View>
        </View>
      </View>
      );
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
        {this.offset != -1 &&
          <Text style={styles.btnText}>Xem thêm</Text>
        } 
        {this.offset == -1 &&
          <Text style={styles.btnText}>  Hết  </Text>
        } 
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
                      itemStyle={styles.PickerBox}
                      style={{color: 'green', height: 30}}
                      selectedValue={this.state.categoryID}
                      mode="dialog"
                      onValueChange={(value) =>
                        {this.setState({categoryID: value, brandID: null}), this.setBrandList(value)} 
                      }> 
                      {this.state.categoryList != null && 
                        this.state.categoryList.map((member, key)=>
                          <Picker.Item label={member.name} value={JSON.stringify(member.id)} key={key}/>)
                      }
                      {this.state.categoryList == null && 
                          <Picker.Item label={'Loading...'}/>
                      }
                  </Picker> 
                  {/**Brand List */}
                  <SafeAreaView style={styles.BrandView}>
                    <ScrollView  horizontal={true} contentContainerStyle={styles.BrandList}>
                    {this.state.BrandList != null && 
                      this.state.BrandList.map((member, key)=>
                      <TouchableOpacity key={key} onPress={()=> {this.brandIDUpdate(member.id)}}>
                        {this.state.brandID === member.id &&
                        <Text style={styles.BrandListTextEnter}> {member.name}  </Text> 
                        }
                        {this.state.brandID != member.id &&
                        <Text style={styles.BrandListText}> {member.name}  </Text> 
                        }
                      </TouchableOpacity>
                    )}
                    </ScrollView>
                  </SafeAreaView>
                  <View style={styles.SearchBox}>
                    <Icon
                          style={styles.searchIcon}
                          name='cloud-search'
                          size={20}/>
                    <TextInput 
                        style={styles.InputSearchField}
                        placeholder={'Gõ tên sản phẩm'}
                        placeholderTextColor = "#666666"
                        onChangeText={(searchData) => this.setState({searchData})}
                        keyboardType={'default'}/>
                  </View>
                  <Text style={styles.DisplayText}>Số lượng sản phẩm: {this.state.itemListNumber}</Text>
                {/** Searching Block */}
                {this.state.productList == null ? (
                <ActivityIndicator style={alignItems= 'center'} size="large" />
                  ) : this.state.searchData != null && this.state.searchData != '' ? ( // For searching by name
                    <SafeAreaView style={styles.ScrollViewBody}>
                      <FlatList
                        style={styles.ScrollViewContainer}
                        initialNumToRender={2}
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        windowSize={5}
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        updateCellsBatchingPeriod={100} 
                        keyExtractor={(item, i) => i.toString()}
                        data={this.state.productList.filter(item => item.name.toLowerCase().includes(this.state.searchData.toLowerCase()))}
                        renderItem={this.renderProductList}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                      //  ListFooterComponent={this.renderFooter.bind(this)}
                        //Adding Load More button as footer component
                      />
                    </SafeAreaView>
                  ) : ( 
                    // Product List Block
                    <SafeAreaView style={styles.ScrollViewBody}>
                      <FlatList
                        style={styles.ScrollViewContainer}
                        initialNumToRender={2}
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        windowSize={5}
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        updateCellsBatchingPeriod={100} 
                        keyExtractor={(item, index) => '' + index}
                        data={this.state.productList}
                        renderItem={this.renderProductList}
                        onEndReached={this.loadMoreData.bind(this)}
                        onEndReachedThreshold={0.04}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        //Adding Load More button as footer component
                      />
                    </SafeAreaView>
                  )}
                </View>
            </View>
            <View style={[styles.overlay, styles.bottomOverlay]}>
                <View style={styles.btnSettings}>
                  <TouchableOpacity style={styles.CartBtn} onPress={this.orderCreate}>
                    <Icon
                      style={styles.CartBtnIcon}
                      name="cart"
                      size={30}/>  
                    <Text style={styles.CartText}>  {this.state.orderItemNumber}    </Text>
                  </TouchableOpacity>   
                </View>  
                <View style={styles.btnSettings}>
                  <Text style={styles.titleText} 
                        onPress={this.orderReset}>   Làm mới  </Text>
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
  Container: {
    flex: 1,
    width: '95%',
  },
  pickerBox:{
    fontSize: 10,
    color: '#6633FF',
  },
  BrandView:{
    height: 25
  },
  BrandList:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BrandListText:{
    lineHeight: 20,
    color: '#fff',
    fontSize: 10,
    backgroundColor: "#6633FF",
    borderRadius:10,
    marginLeft: 10
  },
  BrandListTextEnter:{
    lineHeight: 20,
    color: '#FFFF66',
    fontSize: 10,
    backgroundColor: "#00CC00",
    borderRadius:10,
    marginLeft: 10
  },
  SearchBox:{
    flexDirection: 'row',
    height: 35,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#6633FF',
    alignItems: 'center',
  },
  searchIcon:{
    paddingLeft: 5,
  },
  InputSearchField:{
    fontSize: 10,
    paddingLeft: 10,
    width: '90%',
  },
  ScrollViewBody:{
    flex: 1,
    height: '90%',
  },
  ScrollViewContainer:{
    position: 'absolute',
    width: '100%',
    height: '90%',
    marginBottom: 10,
    top: 5,
  },
  DisplayText:{
    fontSize: 10,
    top: 5
  },
  ItemBox:{
    flexDirection: 'row',
    width: '100%',
    height: 70,
    marginBottom: 2,
    borderRadius: 5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  imgStyle:{
    height: 60,
    width: 60,
    borderRadius: 5,
  },
  ItemInfoBlock:{
    height: '100%',
    flex: 1,
    paddingLeft: 5
  },
  iconStylePlus:{
    color: '#6633FF',
    top: 10,
  },
  iconStyleMinus:{
    color: '#EE0000',
    top: 10,
  },
  CartBtnIcon:{
    color: '#6633FF',
  },
  InputBoxEdit:{
    flexDirection: 'row',
  },
  ItemTextTitleSale:{
    fontSize: 10,
    color: '#FF0000',
  },
  ItemTextTitle:{
    fontSize: 10,
    color: '#009900',
    lineHeight: 30,
  },
  PriceItemText:{
    fontSize: 10,
    width: '60%',
    color: '#6633FF',
  },
  bottomOverlay: {
    bottom: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnSettings:{
    justifyContent: 'center',
    padding: 5,
  },
  titleText: {
    lineHeight: 25,
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    backgroundColor: "#6633FF",
    borderRadius:16,
  },
  CartBtn: {
    flexDirection: 'row',
    textAlign: 'center',
    fontSize: 14,
  },
  CartText:{
    fontSize: 18,
    color: '#fff',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#6633FF',
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