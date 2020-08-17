import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNCamera } from 'react-native-camera';
import { Base_url } from '../../AppSRC/Data/Base_url';
import Loader from '../../AppSRC/Components/loader.js';


const Auth_token = 'auth_token';
const Auth_email = 'auth_email';
const Scanned_Payment_Data = 'Scanned_Payment_Data'

export default class Scan extends Component {

  constructor(props) {
    super(props);
    this.camera = null;
    //this.barcodeCodes = [];

    this.state = {
      pageloading: true,
      data_scan: '',
      userEmail: '',
      scaning: true,
      Base_url: Base_url, 
      isBarcodeScannerEnabled: true,
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      }
    };
  }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});

    this.getAuthInfo();
    AsyncStorage.removeItem(Scanned_Payment_Data);
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

  async onBarCodeReader(scanResult) {
     // console.warn(scanResult.type);

      const isNumberString = /^\d+$/;

      if (scanResult.data != null) {
        // Check Code Type
        if(scanResult.type === 'QR_CODE'){

          // Check if data returned numbers only?
          if(isNumberString.test(scanResult.data)){

            // Check Scanned_Payment_Data if it is now none
            const scaned_data = await AsyncStorage.getItem(Scanned_Payment_Data);
            // if(!this.state.data_scan.includes(scanResult.data)){ //Stop sending request with the same scanned data 

            if(JSON.parse(scaned_data) == null){ // Stop sending request with the same scanned data
              // this.barcodeCodes.push(scanResult.data);
              
              // Put Scanned_Payment_Data into AsyncStorage for usage later at the next screen
              await AsyncStorage.setItem(Scanned_Payment_Data, JSON.stringify(scanResult.data))

              //this.QRCodedata_submit(scanResult.data)
              this.props.navigation.navigate('ItemOrderScreen')
            }
          }else{
            Alert.alert('! Mã QR không hợp lệ')
          }
        }else{
          Alert.alert('! Mã QR lỗi, mời quét đúng mà')
        }
        
      //  this.setState({data_scan:null})
       // this.barcodeCodes.setState({barcodeCodes:[]});
        }
      return;
    }
  
  
  // removable
  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

//componentDidMount() {
    //Here is the Trick
   // const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
   // this.focusListener = navigation.addListener('didFocus', () => {
    //  this.setState({ count: 0 });
   // });
 // }

  render() {
    return (
      <View style={styles.container}>
        <Loader
              loading={this.state.pageloading} />
        <RNCamera
            style={styles.preview}
            ref={ref => {
              this.camera = ref;
            }}
            
            // onBarCodeRead supports only a single barcode at a time
            // Bind(this) is corresponding function of 'var _self = this';
            onBarCodeRead={this.onBarCodeReader.bind(this)}
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
        />
        <View style={[styles.overlay, styles.topOverlay]}>
          <Text style={styles.scanScreenMessage}>Quét mã QR để hoàn tất đặt hàng COD</Text>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <View style={styles.btnSettings}>
            <Text style={styles.titleText} 
                  onPress={()=> this.props.navigation.navigate('WareHouseHomeScreen')}>Quay lại</Text>
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
  bottomOverlay: {
    bottom: 0,
    height: 250,
    fontSize: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSettings:{
    height: 100,
    width: 120,
    justifyContent: 'center',
    backgroundColor: "green",
    borderRadius:16,
  },
  titleText: {
    fontSize:25,
    lineHeight: 100,
    color:'white',
    fontWeight:"bold",
    textAlign: 'center',
    alignItems: 'center'
  },
  scanScreenMessage: {
    fontSize: 16,
    color: '#00FF00',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

