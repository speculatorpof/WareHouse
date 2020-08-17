import React from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from "prop-types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AlertComponent extends React.Component {

  onNegativeButtonPress = () => {
    this.props.onPressNegativeButton();
  };

  onPositiveButtonPress = () => {
    this.props.onPressPositiveButton();
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
              <Text style={styles.alertMessageTextStyle}>
                {`${this.props.alertMessageText}`}
              </Text>
          </View>
        </View>
      </Modal>
    );
  }
}

AlertComponent.propTypes = {
  displayAlert: PropTypes.bool,
  displayNegativeButton: PropTypes.bool,
  alertMessageText: PropTypes.string,
  negativeButtonText: PropTypes.string,
  onPressNegativeButton : PropTypes.func,
}

// export default AlertComponent;

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088'
  },
  mainContainer: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    padding: 4,
  },
  alertMessageTextStyle: {
    color: '#FFFFFF',
    textAlign: 'justify',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
});