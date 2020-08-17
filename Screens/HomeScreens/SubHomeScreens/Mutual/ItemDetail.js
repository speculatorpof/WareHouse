import React, { Component } from 'react';
import { View, TextInput, Text, ScrollView, Image, TouchableHighlight, PermissionsAndroid, ProgressBarAndroid,
  ToastAndroid, } from 'react-native';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import ImgRoomerComponent from '../../../../AppSRC/Components/imgRoomer.js';
import NumberFormat from 'react-number-format';
//import RNFetchBlob from "rn-fetch-blob";
import CameraRoll from "@react-native-community/cameraroll";
// import RNFetchBlob from '../index.js'
import {NativeModules} from 'react-native';
const RNFetchBlob = NativeModules.RNFetchBlob


const Auth_token = 'auth_token';
const Auth_phone = 'auth_phone';

export default class ItemDetail extends Component {
  
    constructor(props){
        super(props)
        this.onPressOrderConfirmNegativeButton = this.onPressOrderConfirmNegativeButton.bind(this);
        this.onPressDownloadButton = this.onPressDownloadButton.bind(this);
        this.onPressLeftButton = this.onPressLeftButton.bind(this);
        this.onPressRightButton = this.onPressRightButton.bind(this);
        this.state = {
          pageloading: false,
          loading: false,
          progress: 0,
          imgloading: false,
          imgLink: null,
          imgLinkIndex: null,
          imgLinkList: [{link:'https://i.ibb.co/8cPffGL/108860070-115404266915920-6642145289899799788-n.jpg'}, 
                        {link:'https://i.ibb.co/rbYL3Lx/108218599-115403910249289-6692660946987963222-n.jpg'},
                        {link:'https://i.ibb.co/7kZWvpy/108188381-115404030249277-7245030891961229540-n.jpg'},
                        {link:'https://i.ibb.co/BKqn2kL/109355054-115404116915935-6999829242973739164-n.jpg'},
                        {link:'https://i.ibb.co/Ltdn5QP/108047665-115404150249265-6479236319880280576-n.jpg'},
                        {link:'https://i.ibb.co/q9GYs8X/mileuleu-80032711-260100418297315-3439722197176659923-n.jpg'}
          ],
          Base_url: Base_url,
          userIdToken: '',
          userPhone: '',
          itemDetail: props.route.params.itemDetail,
      }
    }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){

    this.setState({pageloading: false});
  }
    

  onPressOrderConfirmNegativeButton = () => {
  //  alert('Negative Button Clicked');
    this.setState({imgloading: false})
  };


  onPressLeftButton = () =>{
    let currentLinkIndex = this.state.imgLinkIndex;
    let arrayLength = this.state.imgLinkList.length;
    if(currentLinkIndex>0){
        let newIndex = currentLinkIndex - 1
        let newLink = this.state.imgLinkList[newIndex].link
        this.setState({imgLink: newLink, imgLinkIndex: newIndex})  
    }else{ // if currentLinkIndex = 0
      let newIndex = arrayLength - 1 // As index start from 0 to (Length - 1)
      let newLink = this.state.imgLinkList[newIndex].link
      this.setState({imgLink: newLink, imgLinkIndex: arrayLength-1})
     // alert(JSON.stringify(newLink))
    }
    
  // alert(this.state.imgLinkIndex )
  }

  onPressRightButton = () =>{
    let currentLinkIndex = this.state.imgLinkIndex;
    let arrayLength = this.state.imgLinkList.length;
    if(currentLinkIndex<(arrayLength-1)){
        let newIndex = currentLinkIndex + 1
        let newLink = this.state.imgLinkList[newIndex].link
        this.setState({imgLink: newLink, imgLinkIndex: newIndex})  
    }else{ // if currentLinkIndex = (arrayLength-1)
      let newIndex = 0
      let newLink = this.state.imgLinkList[newIndex].link
      this.setState({imgLink: newLink, imgLinkIndex: 0})
     // alert(JSON.stringify(newLink))
    }
  }

  actualDownload = (imgUrl) => {
    if (Platform.OS == 'android') {

      let newImgUri = imgUrl.lastIndexOf('/');
      let imageName = imgUrl.substring(newImgUri);
      let dirs = RNFetchBlob.fs.dirs;
      let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] + imageName : dirs.PictureDir + imageName;

      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image'
        },
  
      }).fetch("GET", imgUrl).then(res => {
        console.log(res, 'end downloaded')
      });
        ToastAndroid.showWithGravity(
          "Your file has been downloaded to downloads folder!",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
    } else {
      CameraRoll.saveToCameraRoll(imgUrl);
    }
  }

  async onPressDownloadButton() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to memory to download the file "
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let imgLink = this.state.imgLink
        this.actualDownload(imgLink);
      } else {
        Alert.alert(
          "Permission Denied!",
          "You need to give storage permission to download the file"
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  ItemQA = () => {
    this.props.navigation.navigate('ItemQAScreen', {ItemCode: this.state.itemDetail.itemCode})
  }

    render() {
        return (
          <View style={styles.container}>
            <Loader
              loading={this.state.pageloading} />
            <Loader
              loading={this.state.loading} />
            
            <ImgRoomerComponent
              displayAlert={this.state.imgloading}
              displayAlertIcon={true}
              displayLeftButton={true}
              displayRightButton={true}
              imgLink={this.state.imgLink}
              LeftButtonText={'Left'}
              RightButtonText={'Right'}
              displayNegativeButton={true}
              negativeButtonText={'Để sau'}
              onPressNegativeButton={this.onPressOrderConfirmNegativeButton}
              onPressDownloadButton={this.onPressDownloadButton}
              onPressLeftButton={this.onPressLeftButton}
              onPressRightButton={this.onPressRightButton}
            />  
            <View style={[styles.overlay, styles.topOverlay]}>
              <View style={styles.ContianerBlock}>
                <View style={styles.InputBox}>
                  <TextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={styles.InputTextField}
                        value={'Tên: ' + this.state.itemDetail.name.toUpperCase()} />   
                </View>  
                <View style={styles.InputBox}>
                  <TextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={styles.InputTextField}
                        value={'Mã: ' + this.state.itemDetail.sku.toUpperCase()} />   
                </View>  
                <View style={styles.InputBox}>
                  <TextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={styles.InputTextField}
                        value={'Trang: ' + this.state.Storename} />   
                </View>      
                <View style={styles.InputBox}>
                  <TextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={styles.InputTextField}
                        value={'Xuất xứ: ' + this.state.itemDetail.name} />   
                </View> 
                <View style={styles.InputBox}>
                    <NumberFormat
                        value={this.state.itemDetail.name}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' VND'}
                        renderText={value => (
                            <TextInput
                              underlineColorAndroid="transparent"
                              editable={false}
                              style={styles.PriceItemText}
                              value={'Giá: ' + value} /> ) } />  
                </View>  
                {/** New block */}
                <ScrollView vertical={true} style={styles.ScrollViewContainer}>

                    <View style={styles.ItemEditBox}>
                       
                      <TextInput
                            multiline={true}
                            numberOfLines={4}
                            underlineColorAndroid="transparent"
                            editable={false}
                            style={styles.ItemTextDes}
                            value={this.state.itemDetail.description} />
                        
                    </View>
                    
                  </ScrollView>
                  
                  <ScrollView horizontal={true} style={styles.ScrollViewImageContainer}>
                    {this.state.imgLinkList.map((obj, i) => 
                    <TouchableHighlight  key={i}
                        onPress={()=> this.setState({imgloading: true, imgLink: obj.link, imgLinkIndex: i})}>
                        <Image
                          source={{
                              uri: obj.link,
                              cache: 'only-if-cached',
                        }}
                        style={styles.imgEl}/>
                    </TouchableHighlight>
                    )}
                  </ScrollView>
                </View>
            </View>    
            <View style={[styles.overlay, styles.bottomOverlay]}>
                  <View style={styles.btnSettings}>
                    <Text style={styles.titleText} 
                          onPress={this.ItemQA}>   Hỏi Đáp Về Sản Phẩm  </Text>
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
    height: '60%',
  },
  ContianerBlock: {
    top: 10,
    width: '90%',
  },
  InputBox:{
    height: 30,
    flexDirection: 'row',
    width: '100%',
    borderBottomColor:'#CCCCCC',
    borderBottomWidth: 0.5, 
  },
  ItemEditBox:{
    flex: 1,
    width: '100%',
    top: 5,
    marginBottom: 5,
    backgroundColor: '#CCFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  ItemTextTitle:{
    color: 'black',
    fontSize: 12,
  },
  InputTextField:{
    fontSize: 8,
    height: 35,
    color: '#111111',
    width: '80%',
    paddingLeft: 10,
  },
  PriceItemText:{
    color: '#009900',
    fontSize: 8,
    height: 35,
  },
  OldPriceItemText:{
    color: '#EE0000',
    fontSize: 8,
    height: 35,
    textDecorationLine: 'line-through'
  },  
  ItemTextDes:{
    color: '#111111',
    fontSize: 10
  },

  InputDisplay:{
    color: 'green'
  },
   ScrollViewImageContainer:{
    backgroundColor: 'red',
  },
  imgEl:{
    width: 80, 
    height: 80,
  },
  bottomOverlay: {
    bottom: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  InputDisplay:{
    color: 'green'
  },
  SubmitBtn:{
    top: 60,
    color: '#00CC33'
  },
  btnSettings:{
    justifyContent: 'center',
    padding: 5,
  },
  titleText: {
    lineHeight: 25,
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
    backgroundColor: "green",
    borderRadius:16,
  },
} 