import React, { Component } from 'react';
import { View, TextInput, ScrollView, AsyncStorage } from 'react-native';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';


const Auth_token = 'auth_token';
const SaleCode = 'auth_sale'

export default class ItemQA extends Component {
  
    constructor(props){
        super(props)
        this.state = {
          pageloading: false,
          Base_url: Base_url,

          itemCode: props.route.params.ItemCode,
          itemQAList: [
            {question: 'Chất vải sản phẩm', answer: 'Hàng cotton'},
            {question: 'Ra đời năm nào', answer: 'Tháng 6 2019'},
            {question: 'Người nổi tiếng nào đã mặc', answer: 'Nhóm nhạc ABC'},
            {question: 'Nhóm nhạc này ai hot', answer: 'ABCD'},
            {question: 'Sự kiện âm nhạc nào ca sĩ này đã mặc', answer: 'NewAward 2020'},
            {question: 'Hàng này đã có ở VN chưa', answer: 'Chưa có, hàng độc'},
            {question: 'Phân biệt hàng giả thế nào', answer: 'Xem mã của nhà sản xuất và quét mã hàng'},
          ]
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){

    this.setState({pageloading: false});
    //this.getItemQA()
  }
  
  getItemQA = () => {
    //const authToken = this.state.authToken;

    const serviceUrl = this.state.Base_url + '/ItemQA' + '?itemCode=' + this.state.itemCode ;
    this.setState({ pageloading: true }, () => {
      fetch(serviceUrl, {
        method: 'GET',
        headers: {
          //'Authorization': `Bearer ${authToken}`,
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
            this.setState({itemQAList: responseJson.itemQAList})
          }
          }).catch((error) => {
            console.error(error);
        });
    });
  }
  
    
    render() {
        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
          
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.ContianerBlock}>
                
                {/** New block */}
                <ScrollView vertical={true} style={styles.ScrollViewContainer}>
                  {this.state.itemQAList.map((item, i)=>
                    <View style={styles.ItemEditBox} key={i}>
                      <TextInput 
                            multiline={true}
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextTile}
                            value={item.question} />
                      <TextInput
                            multiline={true}
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextDes}
                            value={item.answer} />
                        
                    </View>
                  )}
                  </ScrollView>
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
    height: '75%',
  },
  ContianerBlock: {
    top: 10,
    width: '90%',
  },
  ItemEditBox:{
    flex: 1,
    width: '100%',
    marginBottom: 5,
    backgroundColor: '#CCFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
 
  ItemTextTile:{
    color: 'red',
    fontSize: 16
  },
  ItemTextDes:{
    color: 'black',
    fontSize: 16
  },
} 