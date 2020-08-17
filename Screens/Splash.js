import React, { Component } from 'react';
import { Text, View } from 'react-native';


export default class Splash extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = ({  
  container: {  
    flex: 1, 
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
},
  informationToplayout:{
    justifyContent: 'center',
    width: '95%',
    marginBottom: 30
  },
  informationContent:{
    justifyContent: 'center',
    color: '#999999'
  },
  selectBoxIcon:{
    padding: 15,
  },
  selectBox:{
    flexDirection: 'row',
    width: '95%',
    borderBottomWidth: 1
  },
  topContainer:{
    backgroundColor: "#00FF00",
    height: 130
  },
  bodyContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  btnSave:{
    top: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText:{
    lineHeight: 50,
    width: '95%',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    backgroundColor: "green",
    borderRadius:5,
  },
});  