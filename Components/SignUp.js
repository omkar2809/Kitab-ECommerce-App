import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { signUp } from '../utils/requests'
import Toast from 'react-native-tiny-toast'

export default class SignUp extends React.Component {
    state = {
        email:"",
        password:"",
        confirmPassword: "",
        name: "",
        phoneNo: ""
    }

    handleSignUp = () => {
        const toast = Toast.showLoading('')
        signUp({...this.state})
        .then(res => {
            console.log(res.data)
            Toast.hide(toast)
            if(res.status == 200) {
                Toast.showSuccess(res.data.message)
                this.props.navigation.navigate('Login')
            }
            else {
                Toast.show(res.data.message)
            }
        })
        .catch(err => {
            Toast.hide(toast)
            console.log(err)
        })
    }
    
    render(){
        return (
            <View style={styles.container}>
                <Image source={require('../assets/book_new.png')} style={styles.logoImage} />
                <Text style={styles.logo}>Kitab</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Email" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({email:text})}/>
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Name" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({name:text})}/>
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Phone No" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({phoneNo:text})}/>
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({password:text})}/>
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Confirm Password" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({confirmPassword:text})}/>
                    <TouchableOpacity onPress={this.handleSignUp} style={styles.loginBtn}>
                        <Text style={styles.loginText}>SIGN UP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Text style={styles.loginText}>log In</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#4a4e69",
        marginBottom:40,
        alignSelf:'center'
    },
    inputText:{
        marginHorizontal:15,
        backgroundColor:'#dee2e6',
        marginVertical:7,
        height:40,
        color:"black",
        borderRadius:9,
        paddingHorizontal:10
    },
    forgot:{
        color:"white",
        fontSize:11
    },
    loginBtn:{
        backgroundColor:"#613dc1",
        borderRadius:9,
        height:45,
        marginHorizontal:15,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"#fff"
    },
    logoImage: {
        alignSelf:'center',
        marginTop:50,
        width: 150,
        height: 150
    }
});