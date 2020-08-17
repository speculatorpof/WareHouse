import React, { Component } from 'react';
import { Text, View, Alert, Picker, TextInput } from 'react-native';
import { Base_url } from '../../../AppSRC/Data/Base_url';

import { Input } from 'react-native-elements';
import Loader from '../../../AppSRC/Components/loader.js';

export default class Feedback extends Component {

  constructor(props){
    super(props);
    this.state = {
        pageloading: true,
        feedback_issue: '',
        feedback_title: '',
        feedback_details: '',
        Base_url: Base_url,
        FeedbackCategory:[
          { listlabel: 'Encountered Issue', listvalue: 'None' },
          { listlabel: 'System Error', listvalue: 'VCB' },
          { listlabel: 'Service Error', listvalue: 'STB' },
          { listlabel: 'Payment Error', listvalue: 'TCB' },
          { listlabel: 'Support Issue', listvalue: 'VTB' },
        ]
    }
  }

  // componentDidMount will be called before checking getAuthInfo function after render
  componentDidMount(){
    this.setState({pageloading: false});
  }

  TextValidateFunction = () =>{

    // This assgins 2 variable to 2 equivalent local Textinput variables 
    const feedback_issue = this.state.feedback_issue;
    const feedback_title = this.state.feedback_title;
    const feedback_details = this.state.feedback_details;

   // const submitUserPassword  = this.state.bank_acc_name;

   // Regext to test if string contains text only without any number
    const hasNumber = /^[A-Za-z]+$/;

    if(feedback_issue =='' || feedback_title =='' || feedback_details ==''){
      Alert.alert("Please full fill the items")
    }else{
      this.feedbackSumit(feedback_issue, feedback_title, feedback_details)
    }   
  }

  feedbackSumit = (feedback_issue, feedback_title, feedback_details) =>{

    const serviceUrl = this.state.Base_url + 'api/feedback';
  
    fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
       // 'X-CSRFToken': res.csrftoken,
      },
      body: JSON.stringify({
        
        feedback_issue: feedback_issue,
        feedback_title: feedback_title,
        feedback_details: feedback_details
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
  
        if(responseJson.status != '200'){
          Alert.alert("Sorry! Something went wrong");
        }
        if(responseJson.status == '200'){
          Alert.alert("Thank for your feedback! We will respond to your feedback as soon as possible");
        }
        }).catch((error) => {
          console.error(error);
      });
    }

  render() {
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.pageloading} />
        <View style={styles.informationToplayout}>
          <Text style={styles.informationContent}>* Update us what issue you have encountered while experiencing the service</Text>
        </View>
        <View style={styles.selectBox}>
          <Picker
            selectedValue={this.state.language}
            style={{height: 50, width: '100%'}}
            mode="subtitles"
            onValueChange={(value) =>
              this.setState({bankid: value})
            }>
            {
            this.state.FeedbackCategory.map((member, key)=>
              <Picker.Item label={member.listlabel} value={member.listvalue} key={key}/>)
            }
          </Picker>    
        </View>
        <Input
            style={{height: 50, width: '100%'}}
            placeholder='Feedback Title'
            onChangeText={(feedback_title) => this.setState({feedback_title})}/>
        <TextInput
            style={styles.TextArea}
            multiline={true}
            numberOfLines={10}
            onChangeText={(feedback_details) => this.setState({feedback_details})}
            value={this.state.feedback_details}/>
          <View style={styles.btnSave}>
            <Text style={styles.buttonText} 
                onPress={this.TextValidateFunction}>Send Feedback</Text>
          </View>  
      </View>
      
    );
  }
}

const styles = ({  
  container: {  
    flex: 1, 
    textAlign: 'center',
    alignItems: 'center',
},
  informationToplayout:{
    alignItems: 'center',
    width: '95%',
    marginBottom: 30,
    marginTop: 60
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
  TextArea:{
    width: '95%',
    backgroundColor: '#CCCCCC'
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