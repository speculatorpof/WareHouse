import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNCamera } from 'react-native-camera';
import { Base_url } from '../../../../AppSRC/Data/Base_url';
import Loader from '../../../../AppSRC/Components/loader.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertComponent from '../../../../AppSRC/Components/AlertComponent';



const Auth_token = 'auth_token';
const Auth_email = 'auth_email';

export default class TakePicture extends Component {

  constructor(props) {
    super(props);
    // Listen to all events for this screen 
    this.camera = null;
    this.goback = this.goback.bind(this);
    this.WareHouseOrder = this.WareHouseOrder.bind(this);
    this.onBarCodeReader = this.onBarCodeReader.bind(this)
    //this.barcodeCodes = [];
    this.state = {
      pageloading: true,
      CartAlert: false,
      CameraViewFocused: true,
      CartAlertText: null,
      ScannedItemList: null,
      ItemInfo: null, //For In House
      CartItemNumber: 0,
      SKUCode: props.route.params.SKUCode,
      NeedToScanNumber: props.route.params.NeedToScanNumber,
      Base_url: Base_url, 
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
    this.setState({ScannedItemList: []})

    
    // Remove flag to turn Scanning on
    this.props.navigation.addListener('focus', () => {
      this.setState({CameraViewFocused: true});
    });
    
    // Place flag to turn Scanning on
    this.props.navigation.addListener('blur', () => {
        this.setState({CameraViewFocused: false});
    });
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

  async goback(){
    this.props.navigation.goBack(null);
    // Goback and turn off scanning
  }

  Alert = async (Alert) => {

    await this.setState({ CartAlert: true, CartAlertText: Alert} )
    setTimeout(() => {
      this.setState({ CartAlert: false} )
    }, 1500); // setState will be called after 1,5s
  }

  async onBarCodeReader(scanResult) {

      await this.setState({CartAlert: false})

      if (scanResult.data != null) {
        // Check Code Type
        if(scanResult.type === 'QR_CODE'){
          
          // Check template code: Anista_bck8993_skuerrdd98
          const validCode = scanResult.data.substring(0, 6);
         // alert(validCode)

         if(validCode === 'Anista')
            { 
                // Split data to get BrandCode and ItemCode
                const splitedCode = scanResult.data.split('_')

                // If it is scanning for in house
                if(this.state.ScanStatus === 'In'){
                  const item = this.state.ScannedItemList.find(item => item.itemSKUCode === splitedCode[2])
                  if(item){
                    this.Alert('Sản phẩm đã được quét. Mời quét sản phẩm khác')
                  }
                  else{
                    const itemDetailCode = this.state.CodeToScanList.find(item => item.itemDetailCode === splitedCode[1])
                    if(itemDetailCode){

                      const NeedToScanNumber = this.state.NeedToScanNumber;
                      const InCartNumber = this.state.CartItemNumber;
                      if(InCartNumber == NeedToScanNumber){ // If cart has been added enough
                        this.Alert('Sản phẩm đã được thêm đủ, mời nhấn "Tiếp')
                      }else{
                        await this.state.ScannedItemList.push({'itemSKUCode': splitedCode[2], 'itemDetailCode': splitedCode[1]})
                        const scannedList = this.state.ScannedItemList
                        await this.setState({CartItemNumber: scannedList.length})
                      }
                    }else{
                      this.Alert('Sản phẩm này không phải mã hàng cần quét')
                    }
                  }

                }
                if(this.state.ScanStatus === 'Out'){ // If it is scanning for out house

                  const NeedToScanNumber = this.state.NeedToScanNumber;
                  const InCartNumber = this.state.InCartNumber;

                  if(InCartNumber == NeedToScanNumber){ // If cart has been added enough
                    this.Alert('Sản phẩm đã được thêm đủ, mời nhấn "Tiếp')

                  }else{ // If there are still room to add
                    const itemDetailCode = this.state.CodeToScanList.find(item => item.itemDetailCode === splitedCode[1])
                    if(itemDetailCode){
                      // Check if it was added to the scanned list
                      // itemDetailCode to define what kind of products by name - character (size, smell)
                      // itemSKUCode to define specific products in separate
                      const addeditemSKUCode = this.state.ScannedItemList.find(item => item.itemSKUCode === splitedCode[2])
                      const sameItemDetailCodeobjects = this.state.ScannedItemList.filter(item => item.itemDetailCode === splitedCode[1]);

                      if(addeditemSKUCode){
                        this.Alert('Sản phẩm đã được thêm')
                        //await this.setState({CartAlert: true})
                       // alert('Mã sản phẩm này đã được thêm vào rỏ! Mời quét mã sản phẩm khác')
                      }else{
                        const scannedList = this.state.ScannedItemList

                        if(sameItemDetailCodeobjects != ''){
                          if(itemDetailCode.number > sameItemDetailCodeobjects.length){ // If the number is not added enough yet
                            const ItemName = itemDetailCode.name
                            const ItemDes = itemDetailCode.des
                            await this.state.ScannedItemList.push({'itemSKUCode': splitedCode[2], 'itemDetailCode': splitedCode[1], 'itemDes': ItemDes, 'itemName': ItemName})
                            await this.setState({CartItemNumber: scannedList.length})
                          }else{
                            if(itemDetailCode.number == sameItemDetailCodeobjects.length)
                            this.Alert('Loại sản phẩm này đã được thêm đủ số lượng cho đơn hàng! Mời quét sản phẩm tiếp theo')
                          }
                        }else{ // If BrandCode is scanned for the first time
                          const ItemName = itemDetailCode.name
                          const ItemDes = itemDetailCode.des
                          await this.state.ScannedItemList.push({'itemSKUCode': splitedCode[2], 'itemDetailCode': splitedCode[1], 'itemDes': ItemDes, 'itemName': ItemName})
                          await this.setState({CartItemNumber: scannedList.length})
                        }
                      }

                    }else{
                      this.Alert('Sản phẩm này không có trong đơn hàng này! Mời quét sản phẩm khác')
                    //  alert(JSON.stringify(this.state.CodeToScanList))
                    }                 
                  }
                }
                if(this.state.ScanStatus === 'Return'){ // If it is scanning for return
                  const NeedToScanNumber = this.state.NeedToScanNumber;
                  const InCartNumber = this.state.InCartNumber;
                  if(InCartNumber == NeedToScanNumber){ // If cart has been added enough
                    this.Alert('Sản phẩm đã được thêm đủ, mời nhấn "Tiếp')
                  }else{
                    const scannedItem = this.state.ScannedItemList.find(item => item.itemSKUCode === splitedCode[2])
                    if(scannedItem){
                      this.Alert('Sản phẩm này đã được quét, mời nhấn "Tiếp')
                    }else{
                      const needtoScanItem = this.state.CodeToScanList.find(item => item.itemSKUCode === splitedCode[2])
                      if(needtoScanItem){
                        const scannedList = this.state.ScannedItemList
                        await this.state.ScannedItemList.push({'itemSKUCode': splitedCode[2], 'itemDetailCode': splitedCode[1] })
                        await this.setState({CartItemNumber: scannedList.length})
                      }else{
                        this.Alert('Mã sản phẩm không đúng!')
                      }
                    }
                  }
                }
            }else{
              this.Alert('Mã sản phẩm không hợp lệ! Mời quét sản phẩm khác')
            }
            
           // alert(JSON.stringify(this.state.ScannedItemList))
    
          }else{
          this.Alert('Mã sản phẩm không hợp lệ! Mời quét sản phẩm khác')
        }
        
      //  this.setState({data_scan:null})
       // this.barcodeCodes.setState({barcodeCodes:[]});
        }
      return;
    }
  
  // Update ScannedItemList on goback() function  
  CartUpdate = async (newInCartItemsList) => {
    //(need to use Async/await)
    await this.setState({ScannedItemList: newInCartItemsList})

    // Re-update numbers of item in cart and update Cartnumber as it is asynchronous then (need to use Async/await)
    const scannedList = this.state.ScannedItemList
    await  this.setState({ CartItemNumber:  scannedList.length }); 
  }

  async WareHouseOrder () {
    const NeedToScanNumber = this.state.NeedToScanNumber
    const InHouseItemNum = this.state.CartItemNumber;
    
    if (InHouseItemNum == NeedToScanNumber){
      const ScanStatus = this.state.ScanStatus;
      if(ScanStatus === 'Out'){
        this.props.navigation.navigate('WareHouseOutScreen', {CartItemList: this.state.ScannedItemList, NeedToScanNumber: NeedToScanNumber, onCartBack: this.CartUpdate})
      }else{
        const ItemInfos = this.state.CodeToScanList
        for(let item of ItemInfos){
          await this.setState({ItemInfo: {'orderCode': item.orderCode, 'itemCode': item.itemCode, 'itemDetailCode': item.itemDetailCode, 'des': item.des, 'name': item.name, 'link': item.link, 
          'price': item.price, 'sale': item.sale, 'description': item.description, 'origin': item.origin}
        })
        }
        if(ScanStatus === 'Return'){
          this.props.navigation.navigate('WareHouseInScreen', {
            CartItemList: this.state.ScannedItemList, ItemInfo: this.state.ItemInfo, 
            onCartBack: this.CartUpdate})
        }
        if(ScanStatus === 'In'){
          this.props.navigation.navigate('WareHouseInScreen', {
            CartItemList: this.state.ScannedItemList, ItemInfo: this.state.ItemInfo, 
            onCartBack: this.CartUpdate})
        }
      }
      
    }else{
          this.Alert('Mời quét đủ số lượng sản phẩm để tiếp tục')
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
          <Text style={styles.scanScreenMessage}>Mời chụp ảnh sản phẩm: {this.state.SKUCode}</Text>
          <View>
            <View style={styles.cartStyle}>
              <Text style={styles.cartTextStyle}>{this.state.CartItemNumber}</Text> 
              {this.state.NeedToScanNumber != null && 
              <Text style={styles.cartTextStyle}> /{this.state.NeedToScanNumber}</Text> 
              } 
            </View>
            <Icon
              style={styles.iconStyle}
              name="cart"
              size={28}/> 
          </View> 
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <View style={styles.btnSettings}>
            <Text style={styles.titleText} 
                  onPress={this.takePicture}>Chụp</Text>
          </View>  
          <View style={styles.btnSettings}>
            <Text style={styles.titleText} 
                  onPress={this.WareHouseOrder}>Tiếp</Text>
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
    fontSize: 20,
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
    fontSize:12,
    lineHeight: 60,
    color:'white',
    fontWeight:"bold",
    textAlign: 'center',
    alignItems: 'center'
  },
  scanScreenMessage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00FF00',
    textDecorationLine: 'underline'
  },
  cartTextStyle:{
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00FF00',
    textAlign: 'center',
  }
};

