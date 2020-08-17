import React from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from "prop-types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class TextAlertComponent extends React.Component {

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
           
                <Icon
                  style={styles.alertIconStyle}
                  name="bell"
                  size={30}/>
                <Text style={styles.alertTitleTextStyle}>
                  Cảnh báo
                </Text>
            </View>
            {/* Second Row - Alert Message Text */}
            <View style={styles.middlePart}>
              <Text style={styles.alertMessageTextStyle}>
                {`${this.props.alertMessageText}`}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

TextAlertComponent.propTypes = {
  displayAlert: PropTypes.bool,
  alertTitleText: PropTypes.string,
  alertMessageText: PropTypes.string,
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
    flexDirection: 'column',
    height: '25%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderWidth: 2,
    // borderColor: '#FF0000',
    borderRadius: 10,
    padding: 4,
  },
  topPart: {
    flex: 0.5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    paddingHorizontal: 2,
    paddingVertical: 4
  },
  middlePart: {
    flex: 1,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#FF6600',
    padding: 4,
    color: '#FFFFFF',
    fontSize: 12,
    marginVertical: 2
  },
  alertIconStyle: {
    // borderWidth: 1,
    // borderColor: '#cc00cc',
    color:'#EE0000',
    height: 35,
    width: 35,
  },
  alertTitleTextStyle: {
    flex: 1,
    textAlign: 'justify',
    color: "#EE0000",
    fontSize: 12,
    fontWeight: 'bold',
   // borderWidth: 1,
    //borderColor: '#660066',
    padding: 2,
    marginHorizontal: 2
  },
  alertMessageTextStyle: {
    color: '#111111',
    textAlign: 'justify',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

});