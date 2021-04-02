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
        confirmPassword: '' 
    }

    handleSendOTP = () => {
        const toast = Toast.showLoading('')
        sendOTP({ email: this.state.email })
            .then(res => {
                console.log(res.data)
                this.setState({generateOTP: true})    
                Toast.hide(toast)
            })
            .catch(err => {
                console.log(err)
                Toast.hide(toast)
            })
    }

    handleOTPVerification = () => {
        const toast = Toast.showLoading('')
        verifyOTP({ email: this.state.email, OTP: this.state.OTP })
            .then(res => {
                console.log(res.data)
                this.setState({verified: true})
                Toast.hide(toast)
            })
            .catch(err => {
                console.log(err)
                Toast.hide(toast)
            })
    }

    handleSubmit = () => {
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
                        placeholder="Email..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({email:text})}/>
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
    }
});