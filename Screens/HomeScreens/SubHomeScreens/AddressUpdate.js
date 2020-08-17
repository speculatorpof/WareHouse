import React, { Component } from 'react';
import { Text, View, Alert, Picker, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Base_url } from '../../../AppSRC/Data/Base_url';
import { CityList } from '../../../AppSRC/Data/CityList';
import { DistrictLists } from '../../../AppSRC/Data/DistrictList';
import { EmtyList } from '../../../AppSRC/Data/District_Lists/1_None';

import Loader from '../../../AppSRC/Components/loader.js';
import DoneIndicator from '../../../AppSRC/Components/DoneIndicator.js';


const Auth_token = 'auth_token';
const Auth_email = 'auth_email';

export default class AddressUpdate extends Component {

  constructor(props){
    super(props);
    this.state = {
        pageloading: true,
        loading: false,
        doneAnimating: false,
        Base_url: Base_url,
        email: 'duongtuananh68@gmail.com',
        appPartnerID: '',
        shopperID: '',
        AddressNumber: props.route.params.AddressNumber,
        EmtyList: EmtyList,
        City: null,
        District: null,
        Address: null,
        CityList: CityList,
        DistrictList: DistrictLists, 
      }
    }
  
  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});
    this.getAuthInfo();
 // alert(this.state.AddressNumber)
  }


  getAuthInfo = async () => {

    let getItems = [Auth_token, Auth_email];
    try{
      let User_info = await AsyncStorage.multiGet(getItems);

      if(User_info){
        //console.log(token[1][1])
        this.setState({userIdToken: User_info[0][1], userEmail: User_info[1][1]})
       // console.log(AsyncStorage.getItem(Scanned_Payment_Data))
      }
    }catch(error){

     // Alert.alert("something went wrong")
      console.log(error)
    }
  }
test=()=>{
  alert(this.state.District)
}
  TextValidateFunction = () =>{

    // This assgins 2 variable to 2 equivalent local Textinput variables 
    const city = this.state.City;
    const district = this.state.District;
    const address = this.state.Address;
    const FixedAddress = this.state.AddressNumber;

    if(city == null || district == null || address == null){
        Alert.alert("Aha! Bạn chưa nhập đủ địa chỉ giao hàng")
    }else{
      if(city =='0' || district =='0' || address ==''){
        Alert.alert("Aha! Bạn chưa nhập đủ địa chỉ giao hàng")
      }else{
          // Loading icon
          this.setState({ loading: true });
          this.DeliveryAddressSubmit(city, district, address, FixedAddress)
        }  
      } 
    }

  DeliveryAddressSubmit = (city, district, address, FixedAddress) => {

    this.getLoadingicon();
    const auth_Token = this.state.userIdToken;
    const appPartnerID = this.state.appPartnerID;
    const shopperID = this.state.shopperID;

    //const auth_token = '123432423423dfasdafadsaf1432143';
    //const { navigate } = this.props.navigation;
    const serviceUrl = this.state.Base_url + 'user/ShopperAddress';
    
    fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${auth_Token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
     //   'X-CSRF-TOKEN': token
      },
      body: JSON.stringify({
        appPartnerID: appPartnerID,
        shopperID: shopperID,
        city: city,
        district: district,
        address: address,
        addressToUpdate: FixedAddress
      })
    })
    .then((response) => response.text())
    .then((responseJson) => {
  
        if(responseJson.status != '200'){
          Alert.alert("Oh! Hình như có lỗi hệ thống rồi!");
        }
        if(responseJson.status == '200'){
          this.setState({ loading: false });
          this.setState({ doneAnimating: true });
          Alert.alert("Cảm ơn bạn! Địa chỉ giao hàng đã được cập nhật");
        }
        }).catch((error) => {
          console.error(error);
      });
    }

    
  render() {
    const city = this.state.DistrictList
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.pageloading} />
        <DoneIndicator
              loading={this.state.doneAnimating} />  
        <View style={styles.informationToplayout}>
          <Text style={styles.informationContent}> ** Thêm địa chỉ nhận hàng để thuận tiện mua sắm</Text>
        </View>
        <View style={styles.selectBox}>
          <Icon.Button
              style={styles.selectBoxIcon}
              name="bank"
              color='green'
              size={(24)}
              backgroundColor="transparent"
             >
          </Icon.Button>
          <Picker
              style={styles.PickerBox}
              selectedValue={this.state.City}
              color='green'
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
          <Icon.Button
              style={styles.selectBoxIcon}
              name="road-variant"
              color='green'
              size={(24)}
              backgroundColor="transparent"
             >
          </Icon.Button>
          <Picker
              style={styles.PickerBox}
              selectedValue={this.state.District}
              color='green'
              mode="dialog"
              onValueChange={(value) => 
                this.setState({District: value})
              }>
              {this.state.City != null && 
                city[this.state.City].map((member, key)=>
                  <Picker.Item  label={member.listlabel} value={member.listvalue} key={key}/>)
              }  
              {this.state.City == null && 
                <Picker.Item label={'Quận/Huyện'}/>
              }  
          </Picker>       
        </View>  
        <View style={styles.InputBox}>
          <Icon
                style={styles.InputIcon}
                name='home'
                size={25}
                color='green'/>
          <TextInput 
              style={styles.InputTextField}
              placeholder={'Địa chỉ nhà'}
              //value={this.state.salary}
              onChangeText={(bank_acc_name) => this.setState({bank_acc_name})}
              keyboardType={'default'}/>
        </View>
          <View style={styles.btnSave}>
            <Text style={styles.buttonText} 
                onPress={this.test()}>Cập nhật lại</Text>
          </View>  
      </View>
      
    );
  }
}

const styles = ({  
  container: {  
    flex: 1, 
    alignItems: 'center',
},
  informationToplayout:{
    justifyContent: 'center',
    width: '95%',
    marginBottom: 30,
    marginTop: 60
  },
  informationContent:{
    justifyContent: 'center',
    color: '#999999'
  },
  selectBox:{
    flexDirection: 'row',
    width: '95%',
    borderBottomWidth: 1
  },
  selectBoxIcon:{
    paddingLeft: 15,
  },
  PickerBox:{
    width: '80%'
  },
  topContainer:{
    backgroundColor: "#00FF00",
    height: 130
  },
  bodyContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  btnSave:{
    top: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  InputBox:{
    flexDirection: 'row',
    width: '95%',
    borderBottomColor:'#000',
    borderBottomWidth: 1 
  },
  InputIcon:{
    lineHeight: 40,
    paddingLeft: 15,
  },
  InputTextField:{
    fontSize: 16,
    color: 'black',
    width: '80%',
    marginLeft: 15
  },
  buttonText:{
    lineHeight: 50,
    width: '95%',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    backgroundColor: "green",
    borderRadius:5,
  },
});  