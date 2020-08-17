import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';



import SaleHome from './Screens/SaleHome';

import WareHouseHome from './Screens/WareHouseHome';
import CoordinatorHome from './Screens/CoordinatorHome';



import Splash from './Screens/Splash';


import Welcome from './Screens/Welcome'; 
import SignUp from './Screens/SignUp'; 


import Settings from './Screens/HomeScreens/Settings';
import Notification from './Screens/HomeScreens/Notification';


import AddressUpdate from './Screens/HomeScreens/SubHomeScreens/AddressUpdate';
import Feedback from './Screens/HomeScreens/SubHomeScreens/Feedback';

// Mutual screens
import ItemQA from './Screens/HomeScreens/SubHomeScreens/Mutual/ItemQA';
import ItemDetail from './Screens/HomeScreens/SubHomeScreens/Mutual/ItemDetail';
import OrdersList from './Screens/HomeScreens/SubHomeScreens/Mutual/OrdersList';
import OrdersDetail from './Screens/HomeScreens/SubHomeScreens/Mutual/OrdersDetail';
import Report from './Screens/HomeScreens/SubHomeScreens/Mutual/Report';


import SaleItemList from './Screens/HomeScreens/SubHomeScreens/Sale/SaleItemList';
import SaleOrder from './Screens/HomeScreens/SubHomeScreens/Sale/SaleOrder';



import TakePicture from './Screens/HomeScreens/SubHomeScreens/Warehouse/TakePicture';

import WareHouseScan from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseScan';
import WareHouseIn from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseIn';
import WareHouseInOrders from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseInOrders';

import WareHouseInFailed from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseInFailed';

import WareHouseOut from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseOut';
import WareHouseShipScan from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseShipScan';
import WareHouseReturnOrders from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseReturnOrders';



import WareHouseOrderGoods from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseOrderGoods';
import WareHouseReport from './Screens/HomeScreens/SubHomeScreens/Warehouse/WareHouseReport';

 

const Auth_token = 'auth_token';
const Auth_type = 'auth_type';
const Auth_email = 'auth_email';

const Stack = createStackNavigator();

//Auth context that will pass the auth state from this component to any other component that requires it.
export const AuthContext = React.createContext();
  
  const initialState = {
    isLoading: false,
    isSignout: false,
    userToken: null,
    userType: null,
    userEmail: null,
  };

  const reducer = (state, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...state,
            userToken: action.userToken,
            userType: action.userType,
            userEmail: action.userEmail,
            isLoading: false,
          };
        case 'SIGN_IN':
        // Storage Token
           AsyncStorage.multiSet([['auth_token', action.userToken], ['auth_type', action.userType], ['auth_email', action.userEmail]]);
         
          //alert(JSON.parse(data))
          return {
            ...state,
            isSignout: false,
            userToken: action.userToken, // userToken is the name of variable (action.userToken) used in connected function dispatched from Welcome Screen
            userEmail: action.userEmail,
            userType: action.userType,
          };
        case 'SIGN_OUT':
          // Remove all Item
          AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys))
          return {
            ...state,
            isSignout: true,
            userToken: null,
            userType: null,
            userEmail: null,
          };
          default:
            return state;
        }
      };
  


function AppNavigator() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const navigationRef = React.useRef(null);


  React.useEffect(() => {
  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    let userToken;
    let userType;
    let userEmail;
    try {
      userToken = await AsyncStorage.getItem(Auth_token);
      userType = await AsyncStorage.getItem(Auth_type);
      userEmail = await AsyncStorage.getItem(Auth_email);

      console.log(JSON.stringify(userType))
    //  console.log(AsyncStorage.getItem(Auth_token))
    } catch (e) {
      // Restoring token failed
    }

    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if(userToken, userEmail, userType){
     // console.log(userToken)
      dispatch({ type: 'RESTORE_TOKEN', userToken: userToken, userType: userType, userEmail: userEmail });

    }
  };
  bootstrapAsync();
},[]); // Pass the special value of empty array [] as a way of saying “only run on mount and unmount

return (
  <AuthContext.Provider value={{
      state,
      dispatch,
    }}>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="SplashScreen" component={Splash} options={{ 
            title: null ,
            headerTransparent: true,
            // When logging out, a pop animation feels intuitive
            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}/>
        ) : state.userToken != null && state.userType === 'Sale' ? ( // If user is Sale
              <React.Fragment>
                <Stack.Screen
                  name="SaleHomeScreen"
                  component={SaleHome}
                  options={{ 
                    title: null ,
                    headerTransparent: true,}}/>   
                
                <Stack.Screen
                  name="SaleItemListScreen"
                  component={SaleItemList}
                  options={{ 
                    title: 'Danh mục sản phẩm' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen
                  name="OrdersListScreen"
                  component={OrdersList}
                  options={{ 
                    title: 'Danh sách đơn hàng' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen
                  name="SaleOrderScreen"
                  component={SaleOrder}
                  options={{ 
                    title: 'Tạo đơn hàng' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen
                  name="ReportScreen"
                  component={Report}
                  options={{ 
                    title: 'Thống kê' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>
                    
                <Stack.Screen
                  name="OrdersDetailScreen"
                  component={OrdersDetail}
                  options={{ 
                    title: 'Thông tin đơn hàng' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

                <Stack.Screen
                  name="ItemDetailScreen"
                  component={ItemDetail}
                  options={{ 
                    title: 'Thông tin sản phẩm' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

                <Stack.Screen
                  name="ItemQAScreen"
                  component={ItemQA}
                  options={{ 
                    title: 'Hỏi đáp về sản phẩm' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 1,
                      shadowOpacity: 0,
                      shadowOffset: {
                        height: 0,
                      },
                      shadowRadius: 0,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen
                  name="SettingScreen"
                  component={Settings}
                  options={{ 
                    title: 'Cài đặt' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>
              </React.Fragment>

          ): state.userToken != null &&  state.userType === 'WareHouse' ? ( // If user is WareHouse
           // use React.Fragment to define multiple screens:
           <React.Fragment>
                <Stack.Screen
                  name="WareHouseHomeScreen"
                  component={WareHouseHome}
                  options={{ 
                    title: null ,
                    headerTransparent: true,}}/>   

                <Stack.Screen
                  name="WareHouseScanScreen"
                  component={WareHouseScan}
                  options={{ 
                    title: null ,
                    headerTransparent: true,
                    headerLeft: null}}/> 
                  
                <Stack.Screen
                  name="WareHouseInOrdersScreen"
                  component={WareHouseInOrders}
                  options={{ 
                    title: 'Hàng cần nhập' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

                <Stack.Screen
                  name="WareHouseOutScreen"
                  component={WareHouseOut}
                  options={{ 
                    title: 'Sản phẩm trong giỏ' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

                <Stack.Screen
                  name="WareHouseShipScanScreen"
                  component={WareHouseShipScan}
                  options={{ 
                    title: null ,
                    headerTransparent: true,
                    headerLeft: null}}/> 



                <Stack.Screen
                  name="TakePictureScreen"
                  component={TakePicture}
                  options={{ 
                    title: null ,
                    headerTransparent: true,
                    headerLeft: null}}/> 


                <Stack.Screen
                  name="WareHouseInScreen"
                  component={WareHouseIn}
                  options={{ 
                    title: 'Sản phẩm trong giỏ' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen
                  name="WareHouseInFailedScreen"
                  component={WareHouseInFailed}
                  options={{ 
                    title: 'Lỗi xuất nhập' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>
                
                <Stack.Screen //New Orders
                  name="OrdersListScreen"
                  component={OrdersList}
                  options={{ 
                    title: 'Đanh sách đơn hàng' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>
                
                <Stack.Screen //Returning Orders
                  name="WareHouseReturnOrdersScreen"
                  component={WareHouseReturnOrders}
                  options={{ 
                    title: 'Sản phẩm trả về' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen // Order Detailed Info
                  name="OrdersDetailScreen"
                  component={OrdersDetail}
                  options={{ 
                    title: 'Thông tin đơn hàng' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

                <Stack.Screen
                  name="ReportScreen"
                  component={Report}
                  options={{ 
                    title: 'Thống kê' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


                <Stack.Screen
                  name="ItemQAScreen"
                  component={ItemQA}
                  options={{ 
                    title: 'Hỏi đáp về sản phẩm' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 1,
                      shadowOpacity: 0,
                      shadowOffset: {
                        height: 0,
                      },
                      shadowRadius: 0,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

                <Stack.Screen // Order more products
                  name="WareHouseOrderGoodsScreen"
                  component={WareHouseOrderGoods}
                  options={{ 
                    title: 'Đặt hàng' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>

          
                <Stack.Screen
                  name="ItemDetailScreen"
                  component={ItemDetail}
                  options={{ 
                    title: 'Thông tin sản phẩm' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/>


              <Stack.Screen
                name="WareHouseReportScreen"
                component={WareHouseReport}
                options={{ 
                  title: 'Đặt sản phẩm' ,
                  headerTitleStyle: {
                    fontWeight: '300',
                    fontFamily: 'Nunito-Regular',
                    fontSize: 15
                  },
                  headerStyle: {
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.5,
                  },
                  headerTintColor: '#009900',
                  headerLeft: () => (
                    <TouchableOpacity                
                      onPress={() => navigationRef.current?.goBack()}>
                      <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                    </TouchableOpacity>
                  ),
              }}/>
              
            
              <Stack.Screen
                  name="SettingScreen"
                  component={Settings}
                  options={{ 
                    title: 'Cài đặt' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                }}/> 
                
            </React.Fragment>
          ):state.userToken != null && state.userType == '3' ?  ( // If user is Coordinator
            <React.Fragment>
              <Stack.Screen
                name="CoordinatorHomeScreen"
                component={CoordinatorHome}
                options={{ 
                  title: null ,
                  headerTransparent: true,}}/>    


              <Stack.Screen
                name="SettingScreen"
                component={Settings}
                options={{ 
                  title: 'Cài đặt' ,
                  headerStyle: {
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.5,
                  },
                  headerTintColor: '#009900',
              }}/>
        

              <Stack.Screen
                name="NotificationScreen"
                component={Notification}
                options={{ 
                  title: 'Thông báo',
                  headerStyle: {
                    backgroundColor: '#008800',
                },
                headerTintColor: '#DDDDDD',}}/> 


              <Stack.Screen
                name="FeedbackScreen"
                component={Feedback}
                options={{ 
                  title: null ,
                  headerTransparent: true,
              }}/>  

            </React.Fragment>   
          ):(  // As user is not logged in
            <React.Fragment>   
              <Stack.Screen
                name="WelcomeScreen"
                component={Welcome}
                options={{ 
                  title: null ,
                  headerTransparent: true,
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}/>
              
              <Stack.Screen
                  name="SignUpScreen"
                  component={SignUp}
                  options={{ 
                    title: 'Đăng ký tài khoản' ,
                    headerTitleStyle: {
                      fontWeight: '300',
                      fontFamily: 'Nunito-Regular',
                      fontSize: 15
                    },
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                      borderBottomWidth: 0.5,
                    },
                    headerTintColor: '#009900',
                    headerLeft: () => (
                      <TouchableOpacity                
                        onPress={() => navigationRef.current?.goBack()}>
                        <Icon style = {{paddingLeft : 10}} name="chevron-left-circle" size={26} color="#009900" />
                      </TouchableOpacity>
                    ),
                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}/>
             
              
            </React.Fragment>   
     )}
      </Stack.Navigator>
    </NavigationContainer>
  </AuthContext.Provider>
);
}


export default AppNavigator;