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
        phoneNo: "",
        address: "",
        error: false,
        errMessage: ''
    }

    handleSignUp = () => {
        if (this.state.email.length == 0 &&
            this.state.password.length == 0 &&
            this.state.confirmPassword.length == 0 &&
            this.state.name.length == 0 &&
            this.state.phoneNo.length == 0 &&
            this.state.address.length == 0) {
            this.setState({ error: true, errMessage: 'Required Fields Are Empty!' })
            return
        }
        if (this.state.phoneNo.length !== 10) {
            this.setState({ error: true, errMessage: 'Invalid Phone No.' })
            return
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ error: true, errMessage: 'Password and Confirm Password Not Matching' })
            return
        }
        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email)) {
            this.setState({ error: true, errMessage: 'Invalid Email' })
            return
        }
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
            this.setState({error: true, errMessage: JSON.parse(err.request._response).message})
            console.log(err.request.status)
            console.log(JSON.parse(err.request._response).message)
        })
    }
    
    render(){
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Image source={require('../assets/login_cover_photo.png')} style={styles.logoImage} />
                    <Text style={styles.logo}>Kitab</Text>
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Email" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({email:text.trim()})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Name" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({username:text.trim()})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Phone No" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({phoneNo:text.trim()})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput  
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="Password" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({password:text})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput  
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="Confirm Password" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({confirmPassword:text})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput
                            numberOfLines={3}
                            style={styles.inputText}
                            placeholder="Address" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({address:text.trim()})}/>
                    </View>
                    {
                        this.state.error ? (
                            <View style={styles.errorContainer} >
                                <Text style={styles.error}>{this.state.errMessage }</Text>
                            </View>
                        ) : null
                    }
                    <TouchableOpacity onPress={this.handleSignUp} style={styles.loginBtn}>
                        <Text style={styles.signUpText}>SIGN UP</Text>
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
        alignSelf:'center',
        fontWeight:"bold",
        fontSize:50,
        color:"#240046",
        marginBottom:40
    },
    inputView:{
        marginHorizontal:15,
        backgroundColor:"#dee2e6",
        borderRadius:9,
        height:40,
        marginBottom:10,
        justifyContent:"center",
        paddingHorizontal:15
    },
    inputText:{
        height:50,
        color:"black"
    },
    forgot:{
        color:"white",
        fontSize:11
    },
    loginBtn:{
        marginHorizontal:15,
        backgroundColor:"#613dc1",
        borderRadius:9,
        height:45,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    signUpText:{
        color:"white",
    },
    loginText:{
        color: "#000",
        alignSelf:'center'
    },
    logoImage: {
        alignSelf:'center',
        marginTop:'30%',
        width: 130,
        height: 130
    },
    error:{
        color:"red",
        fontSize: 11,
        marginBottom: 3
    },
    errorContainer: {
        alignItems: 'center'
    }
});