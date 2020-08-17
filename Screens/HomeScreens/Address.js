import React, { Component } from 'react';
import { Text, View, Alert, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../AppSRC/Components/loader.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const DeliveryAddress1 = 'Delivery_address1';
const DeliveryAddress2 = 'Delivery_address2';
const DeliveryAddress3 = 'Delivery_address3';

export default class Address extends Component {

  constructor(props){
    super(props);
    this.state = {
      pageloading: true,
      delivery_address_1: null,
      delivery_address_2: null,
      delivery_address_3: null,
      Phonenumber: '0396526078',
      Email: 'duongtuananh68@gmail.com'
    }
  }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});
    this.getDeliveryAddress();
  //  alert(this.state.Phonenumber)
  }

  getDeliveryAddress = async () => {
    
    try{
      let DeliveryAddress1 = await AsyncStorage.getItem(Delivery_address1);
      let DeliveryAddress2 = await AsyncStorage.getItem(Delivery_address2);
      let DeliveryAddress3 = await AsyncStorage.getItem(Delivery_address3);

      if(DeliveryAddress1){
        //console.log(token[1][1])
        this.setState({delivery_address_1: DeliveryAddress1})
      }
      if(DeliveryAddress2){
        //console.log(token[1][1])
        this.setState({delivery_address_2: DeliveryAddress2})
      }
      if(DeliveryAddress3){
        //console.log(token[1][1])
        this.setState({delivery_address_3: DeliveryAddress3})
      }
    }catch(error){

      //Alert.alert("something went wrong")
      console.log(error)
    }
  }

  withdrawRequest = () => {
    if(this.state.bank_account_balance == null){
      this.props.navigation.navigate('WithdrawScreen')

      //Alert.alert('Sorry! You dont have deposit to withdraw for now')
    }else{
     // this.props.navigation.navigate('WithdrawScreen')
    }
  }
    
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        

          <View style={styles.NoticeDisplay}>
            <Text style={styles.NoticeText}>* Bạn có thể thêm tối đa 3 địa chỉ giao hàng</Text>
          </View>

          
          <ScrollView vertical={true} style={{marginTop: 10, bottom: 20}}>
          <Loader loading={this.state.pageloading}/>
            <View style={styles.InfoDisplay}>
              <View style={styles.NoteDisplay}>
                <Icon
                  name="file-document-edit"
                  color='gray'
                  size={25}
                  onPress={()=> this.props.navigation.navigate('AddressUpdateScreen', {AddressNumber: '1'})}
                  />
              </View>
              <View style={styles.DisplayComponent}>
                <Text style={styles.InputInfoDisplay}>Địa chỉ giao hàng 1:</Text>
                <Text style={styles.InputContentDisplay}>
                  {this.state.delivery_address_1 != null &&
                    'Mời bạn nhập đia chỉ'
                  }
                  {this.state.delivery_address_1 == null &&
                    'No04, LK 111, La Khê, Hà Đông, Hà Nội'
                  }
                </Text>
              </View>
            </View>

            <View style={styles.InfoDisplay}>
              <View style={styles.NoteDisplay}>
                <Icon
                  name="file-document-edit"
                  color='gray'
                  size={25}
                  onPress={()=> this.props.navigation.navigate('AddressUpdateScreen', {AddressNumber: '2'})}/>
              </View>
              <View style={styles.DisplayComponent}>
                <Text style={styles.InputInfoDisplay}>Địa chỉ giao hàng 2:</Text>
                <Text style={styles.InputContentDisplay}>
                  {this.state.delivery_address_2 == null &&
                    'Mời bạn nhập đia chỉ'
                  }
                  {this.state.delivery_address_2 != null &&
                    '007, Tập thể 1, Cầu Kho, Quận 1, Hồ Chí Minh'
                  }
                </Text>
              </View>
            </View>
          
            <View style={styles.InfoDisplay}>
              <View style={styles.NoteDisplay}>
                <Icon
                  style={styles.Logo}
                  name="file-document-edit"
                  color='gray'
                  size={25}
                  onPress={()=> this.props.navigation.navigate('AddressUpdateScreen', {AddressNumber: '3'})}/>
              </View>
              <View style={styles.DisplayComponent}>
                <Text style={styles.InputInfoDisplay}>Địa chỉ giao hàng 3:</Text>
                <Text style={styles.InputContentDisplay}>
                  {this.state.delivery_address_3 == null &&
                    'Mời bạn nhập đia chỉ'
                  }
                  {this.state.delivery_address_3 != null &&
                  <Text style={styles.InputContentDisplay}>No04, LK 111, La Khê, Hà Đông, Hà Nội</Text>
                  }
                </Text>
              </View>
            </View>         
          
          </ScrollView>
      </View>
      
    );
  }
}

const styles = ({  
  container: {  
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
},
NoticeDisplay:{
  width: '95%',
  marginLeft: 10,
  marginTop: 80, 
  bottom: 20
},
NoticeText:{
  color: '#FF0000',
  fontSize: 16
},
buttonText:{
  lineHeight: 40,
  width: '70%',
  color: 'black',
},
InfoDisplay:{
  width: '95%',
  marginLeft: 10,
  backgroundColor: '#99FFCC',
  borderRadius: 10,
  marginTop: 5,
},
NoteDisplay:{
  alignItems: 'flex-end',
  width: '98%',
  marginTop: 5
},
DisplayComponent:{
  lineHeight: 40,
  marginTop: 5,
  marginBottom: 5,
  paddingLeft: 20,
},
InputInfoDisplay:{
  fontSize: 14,
  color: '#666666',
},
InputContentDisplay:{
  lineHeight: 40,
  fontSize: 16,
},
});  