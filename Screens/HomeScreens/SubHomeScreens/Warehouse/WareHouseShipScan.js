import React, { Component } from 'react';
import { Text, View, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNCamera } from 'react-native-camera';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertComponent from '../../../../AppSRC/Components/AlertComponent';



const Auth_token = 'auth_token';
const Auth_email = 'auth_email';

export default class WareHouseShipScan extends Component {

  constructor(props) {
    super(props);
    // Listen to all events for this screen 
    this.camera = null;
    this.goback = this.goback.bind(this);
    this.onBarCodeReader = this.onBarCodeReader.bind(this)
    //this.barcodeCodes = [];
    this.state = {
      pageloading: true,
      CartAlert: false,
      CartAlertText: null,
      CameraViewFocused: true,
      ShipperCode: 'none',
      CartItemNumber: 0,
      Base_url: Base_url, 
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      }
    };
  }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.setState({pageloading: false});

    //AsyncStorage.removeItem(Scanned_Item_Data);
   // this.getScanReady()
    this.props.navigation.addListener('focus', () => {
      this.setState({CameraViewFocused: true});
    });

    this.props.navigation.addListener('blur', () => {
        this.setState({CameraViewFocused: false});
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.backfunction()
  }
 
  

  backfunction(){
    
    const { params } = this.props.route;
  
    // Call back function in the previous component with newly updated list
    params.onShipBack(this.state.ShipperCode)
  }

  goback(){
    const { params } = this.props.route;
  
    // Call back function in the previous component with newly updated list
    params.onShipBack(null)
    this.props.navigation.goBack();

  }

  getAuthInfo = async () => {

    let getItems = [Auth_token, Auth_email];
    
    try{
      let User_info = await AsyncStorage.multiGet(getItems);

      if(User_info){
        //console.log(token[1][1])
        this.UserAuthInfo(User_info[0][1], User_info[1][1])
        Alert.alert(User_info[2][1])
      }
    }catch(error){

      //Alert.alert("something went wrong")
      console.log(error)
    }
  }


  CartAlert = async (Alert) => {

    await this.setState({ CartAlert: true, CartAlertText: Alert} )
    setTimeout(() => {
      this.setState({ CartAlert: false} )
    }, 1500); // setState will be called after 1,5s
  }

  async onBarCodeReader(scanResult) {
     // console.warn(scanResult.type);

      await this.setState({CartAlert: false})
        
      if (scanResult.data != null) {
        // Check Code Type
        if(scanResult.type === 'QR_CODE'){
          
          // Check template code: Anista_bck8993_skuerrdd98
          const validCode = scanResult.data.substring(0, 6);
         // alert(validCode)
          if(validCode === 'AnisSH'){ 
                // Split data to get BrandCode and ItemCode
                const splitedCode = scanResult.data.split('_')

             //   alert(validBrandCode[2])
                // If it is scanning for in house
                  const item = this.state.ShipperCode
                  if(item === splitedCode[1]){
                    this.CartAlert('Mã vận chuyển đã được quét')
                  }
                  else{
                    await this.setState({ShipperCode: splitedCode[1]})
                  //  alert(this.state.ShipperCode)

                    this.props.navigation.goBack(null);
                  }

                }else{
                  this.CartAlert('Mã vận chuyển không đúng')
            }
          
          }else{
            this.CartAlert('Mã lỗi, mời quét mã khác')
        }
      return;
      }
    }
  

  // removable
  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Loader loading={this.state.pageloading} />
        <AlertComponent 
            displayAlert={this.state.CartAlert}
            alertMessageText={this.state.CartAlertText}
          />  
        {this.state.CameraViewFocused && (  
        <RNCamera
            style={styles.preview}
            ref={ref => { this.camera = ref; }}
            
            // onBarCodeRead supports only a single barcode at a time
            // Bind(this) is corresponding function of 'var _self = this';
            
            onBarCodeRead={this.onBarCodeReader}
            //Note that onGoogleVisionBarcodesDetected returns an object containing the barcodes property, 
            // which contains an array of all the barcodes recognized in the camera
         //  onGoogleVisionBarcodesDetected={this.barcodeRecognized.bind(this)}

            // Following ones are removable
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            androidCameraPermissionOptions={{
              title: 'Cấp quyền để sử dụng camera',
              message: 'Ứng dụng cần cấp quyền để sử dụng camera của bạn',
              buttonPositive: 'Đồng Ý',
              buttonNegative: 'Để sau',
            }}
           // permissionDialogTitle={'Permission to use camera'}
           // permissionDialogMessage={'We need your permission to use your camera phone'}
            type={this.state.camera.type}
        />)}
        <View style={[styles.overlay, styles.topOverlay]}>
          <Icon
            style={styles.iconStyle}
            name="qrcode-scan"
            size={24}/> 
          <Text style={styles.scanScreenMessage}>Quét mã người vận chuyển</Text>
          <Icon
            style={styles.iconStyle}
            name="account"
            size={24}/>   
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <View style={styles.btnSettings}>
            <Text style={styles.titleText} 
                  onPress={this.goback}>Quay lại</Text>
          </View>     
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    padding:16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cartStyle:{
    flexDirection: 'row',
  },
  iconStyle:{
    color: '#00FF00'
  },
  bottomOverlay: {
    bottom: 0,
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSettings:{
    width: 120,
    justifyContent: 'center',
    backgroundColor: "green",
    borderRadius:16,
    margin: 5
  },
  titleText: {
    fontSize:15,
    lineHeight: 80,
    color:'white',
    fontWeight:"bold",
    textAlign: 'center',
    alignItems: 'center'
  },
  scanScreenMessage: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFF00',
    textDecorationLine: 'underline'
  },
  cartTextStyle:{
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00FF00',
    textAlign: 'center',
  }
};

