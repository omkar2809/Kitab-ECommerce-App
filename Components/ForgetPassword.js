import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import Toast from 'react-native-tiny-toast'
import { sendOTP, verifyOTP, resetPassword } from '../utils/requests'

export default class ForgetPassword extends Component {
    state = {
        verified: false,
        generateOTP: false,
        email: '',
        OTP: '',
        password: '',
        confirmPassword: '',
        error: false,
        errMessage: ''
    }

    handleSendOTP = () => {
        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email)) {
            this.setState({ error: true, errMessage: 'Invalid Email' })
            return
        }
        const toast = Toast.showLoading('')
        sendOTP({ email: this.state.email })
            .then(res => {
                console.log(res.data)
                this.setState({generateOTP: true, error: false})    
                Toast.hide(toast)
            })
            .catch(err => {
                console.log(err.request)
                Toast.hide(toast)
                Toast.show('Something Went Wrong.')
            })
    }

    handleOTPVerification = () => {
        if (this.state.OTP.length !== 6) {
            this.setState({ error: true, errMessage: 'Please Enter Valid OTP' })
            return
        }
        const toast = Toast.showLoading('')
        verifyOTP({ email: this.state.email, OTP: this.state.OTP })
            .then(res => {
                console.log(res.data)
                this.setState({verified: true, error: false})
                Toast.hide(toast)
            })
            .catch(err => {
                Toast.hide(toast)
                this.setState({error: true,errMessage: JSON.parse(err.request._response).message})
                console.log(JSON.parse(err.request._response).message)
            })
    }

    handleSubmit = () => {
        if (this.state.password.length == 0 && this.state.confirmPassword.length == 0) {
            this.setState({error: true, errMessage: 'Required Fields Are Empty!'})
            return
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({error: true, errMessage: 'Password and Confirm Password Not Matching'})
            return
        }
        const toast = Toast.showLoading('')
        resetPassword({
            email: this.state.email,
            OTP: this.state.OTP,
            password: this.state.password
        })
            .then(res => {
                console.log(res.data)
                Toast.hide(toast)
                Toast.showSuccess(res.data.message)

                this.props.navigation.navigate('Login')
            })
            .catch(err => {
                console.log(err)
                Toast.hide(toast)
                Toast.show('Something Went Wrong.')
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/login_cover_photo.png')} style={styles.logoImage} />
                <Text style={styles.logo}>Kitab</Text>
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Email" 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({ email: text.trim() })}
                        editable={!this.state.generateOTP}
                        />
                </View>
                {
                    !this.state.generateOTP ? (
                        <TouchableOpacity onPress={() => this.handleSendOTP()} style={styles.loginBtn}>
                            <Text style={styles.loginText}>Send OTP</Text>
                        </TouchableOpacity>
                    ) : (
                            !this.state.verified ? (
                                <View>
                                    <View style={styles.inputView} >
                                        <TextInput  
                                            style={styles.inputText}
                                            secureTextEntry
                                            placeholder="OTP" 
                                            placeholderTextColor="#003f5c"
                                            onChangeText={text => this.setState({OTP:text})}/>
                                    </View>
                                    <TouchableOpacity onPress={() => this.handleOTPVerification()} style={styles.loginBtn}>
                                        <Text style={styles.loginText}>Verify</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                    <View>
                                        <View style={styles.inputView} >
                                            <TextInput  
                                                style={styles.inputText}
                                                secureTextEntry
                                                placeholder="New Password" 
                                                placeholderTextColor="#003f5c"
                                                onChangeText={text => this.setState({password:text})}/>
                                        </View>
                                        <View style={styles.inputView} >
                                            <TextInput  
                                                style={styles.inputText}
                                                secureTextEntry
                                                placeholder="Confirm Password" 
                                                placeholderTextColor="#003f5c"
                                                onChangeText={text => this.setState({confirmPassword:text})}/>
                                        </View>
                                        <TouchableOpacity onPress={() => this.handleSubmit()} style={styles.loginBtn}>
                                            <Text style={styles.loginText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                            )
                    )
                }
                {
                    this.state.error ? (
                        <View >
                            <Text style={styles.error}>{this.state.errMessage }</Text>
                        </View>
                    ) : null
                }
            </View>
        )
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
    loginText:{
        color:"white"
    },
    logoImage: {
        alignSelf:'center',
        width: 130,
        height: 130
    },
    error:{
        color:"red",
        fontSize: 11,
        marginBottom: 8,
        alignSelf: 'center'
    },
});