import React from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from "prop-types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ImgRoomerComponent extends React.Component {

  onNegativeButtonPress = () => {
    this.props.onPressNegativeButton();
  };

  onDownloadButtonPress = () => {
    this.props.onPressDownloadButton();
  };

  onLeftButtonPress = () => {
    this.props.onPressLeftButton();
  };

  onRightButtonPress = () => {
    this.props.onPressRightButton();
  };

  render() {
    return (
      <Modal
        visible={this.props.displayAlert}
        transparent={true}
        animationType={"fade"}>
        <View style={styles.mainOuterComponent}>
          <View style={styles.mainContainer}>
            {/* First ROw - Alert Icon and Title */}
            <View style={styles.topPart}>
              {
                this.props.displayAlertIcon
                &&
                  <Icon
                    name="close"
                    color='green'
                    size={(24)}
                    backgroundColor="transparent"
                    onPress={this.onNegativeButtonPress}/>
              }
              {
                this.props.displayAlertIcon
                &&
                  <Icon
                    style={styles.iconLeftStyle}
                    name="cloud-download"
                    color='green'
                    size={(24)}
                    backgroundColor="transparent"
                    onPress={this.onDownloadButtonPress}/>
              }
              
              
            </View>
            {/* Second Row - Alert Message Text */}
     
            <View style={styles.middlePart}>
              {
                this.props.displayLeftButton
                &&
                <TouchableOpacity
                  style={styles.ButtonBlockStyle}>
                  <Icon
                    style={styles.iconStyle}
                    name="arrow-left-box"
                    color='green'
                    size={(28)}
                    backgroundColor="transparent"
                    onPress={this.onLeftButtonPress}/>
                </TouchableOpacity>
              }
              { 
                this.props.displayAlertIcon
                &&
                <TouchableOpacity
                 // onPress={this.onNegativeButtonPress}>
                    onMouseOut={this.onLeftButtonPress}
                    onMouseOver={this.onRightButtonPress}>
                  <Image
                    source={{
                      uri: this.props.imgLink,
                      cache: 'only-if-cached',
                    }}
                    style={styles.imgStyle}
                  />
                </TouchableOpacity>
              }
              {
                this.props.displayRightButton
                &&
                <TouchableOpacity
                  style={styles.ButtonBlockStyle}>
                  <Icon
                    style={styles.iconStyle}
                    name="arrow-right-box"
                    color='green'
                    size={(24)}
                    backgroundColor="transparent"
                    onPress={this.onRightButtonPress}/>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

ImgRoomerComponent.propTypes = {
  displayAlert: PropTypes.bool,
  displayAlertIcon: PropTypes.bool,
  imgLink: PropTypes.string,
  displayLeftButton: PropTypes.bool,
  displayRightButton: PropTypes.bool,
  displayNegativeButton: PropTypes.bool,
  onPressNegativeButton : PropTypes.func,
  onPressDownloadButton : PropTypes.func,
  onPressLeftButton: PropTypes.func,
  onPressRightButton: PropTypes.func,
}

// export default CustomAlertComponent;

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088'
  },
  mainContainer: {
    height: '60%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#404040',
    // borderWidth: 2,
    // borderColor: '#FF0000',
    borderRadius: 10,
    padding: 4,
  },
  topPart: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row-reverse',
  //   borderWidth: 1,
   //  borderColor: '#00FF00',
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  iconLeftStyle:{
    left: 15
  },
  middlePart: {
    flex: 1,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#0066FF',
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-evenly'
  },
  alertIconStyle: {
    // borderWidth: 1,
    // borderColor: '#cc00cc',
    height: 30,
    width: 30,
  },
  imgStyle:{
    height: 300,
    width: 210,
  },
  
  ButtonBlockStyle: {
    paddingHorizontal: 6,
    marginVertical: 4,
    justifyContent: 'center',
  },
  iconStyle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});