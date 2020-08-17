import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  View,
  Modal,
} from 'react-native';

// Below I have created a variable called "Loader" and 
// destructured the parameters so I do not have to enter “props” before referencing a prop in the component.
const DoneIndicator = ({ loading }) => 
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
          <Icon
                style={styles.InputIcon}
                name='check-square-o'
                size={30}
                color='green'/>
            
          </View>
        </View>
      </Modal>
  

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default DoneIndicator;