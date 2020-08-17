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

export default class Notification extends Component {

  constructor(props){
    super(props);
    this.state = {
      pageloading: true,
      notification: [{
        type: '1',
        title: 'Thông báo giao hàng',
        content: 'Đơn hàng của bạn sắp đến rồi. ' +
        'Hãy chuẩn bị nhận đơn hàng, đơn hàng của bạn dự kiến được giao vào ngày',
      }],
      shopperPhone: props.route.params.shopperPhone,
    }
  }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});
  //  alert(this.state.Phonenumber)
  }

 

 
    
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
          
        <ScrollView vertical={true} style={{marginTop: 20, bottom: 20}}>
            <Loader loading={this.state.pageloading}/>
            <View style={styles.InfoDisplay}>
              <View style={styles.NoteDisplay}>
                <Icon
                  name="trash-can"
                  color='gray'
                  size={25}
                  onPress={()=> this.props.navigation.navigate('AddressUpdateScreen', {AddressNumber: '1'})}
                  />
              </View>
              <View style={styles.DisplayComponent}>
                <Text style={styles.InputInfoDisplay}>Thống báo đơn hàng:</Text>
                <Text style={styles.InputContentDisplay}>{this.state.notificationContent}</Text>
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
  fontSize: 18,
  color: 'black',
},
InputContentDisplay:{
  marginTop: 20,
  lineHeight: 30,
  fontSize: 16,
},
});  