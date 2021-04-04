import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { login } from '../utils/requests'
import { setUserData } from '../utils/user'
import Toast from 'react-native-tiny-toast'

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email:"",
            password: "",
            error: false,
            errMessage: ''
        }
    }

    handleLogin = () => {
        console.log('inside handleLogin')
        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email)) {
            this.setState({ error: true, errMessage: 'Invalid Email' })
            return
        }
        if (this.state.email.length === 0 && this.state.email.length === 0) {
            this.setState({ error: true, errMessage: 'Required Fields are empty' })
            console.log('error')
        }
        else {
            const toast = Toast.showLoading('')
            login({...this.state})
            .then(res => {
                if(res.status == 200){
                    setUserData(res.data)
                    .then(() => {
                        this.props.navigation.state.params.setUserInfo()
                        Toast.hide(toast)
                        Toast.showSuccess(res.data.message)
                        this.props.navigation.navigate('Home')
                    })
                }
                else {
                    Toast.hide(toast)
                    Toast.show(res.data.message)
                }
            })
            .catch(err => {
                Toast.hide(toast)
                console.log(err.request.status)
                if (err.request.status === 403 || err.request.status === 404) {
                    this.setState({error: true,errMessage: JSON.parse(err.request._response).message})
                    console.log(JSON.parse(err.request._response).message)
                } else {
                    Toast.show('Something went wrong.')
                }
            })
        }
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            console.log('update')
        });
    }
    
    componentWillUnmount() {
        this._navListener.remove()
    }

    render(){
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Image source={require('../assets/login_cover_photo.png')} style={styles.logoImage} />
                <Text style={styles.logo}>Kitab</Text>
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Email" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({ email: text.trim() })}
                        />
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({password:text})}/>
                </View>
                {
                    this.state.error ? (
                        <View >
                            <Text style={styles.error}>{this.state.errMessage }</Text>
                        </View>
                    ) : null
                }
                <TouchableOpacity onPress={() => navigate('Forget Password')}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleLogin} style={styles.loginBtn}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('SignUp')}>
                    <Text style={styles.signupText}>Signup</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={this.deleteUser} style={styles.loginBtn}>
                    <Text  style={styles.loginText}>Remove info</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.getUserData} style={styles.loginBtn}>
                    <Text style={styles.loginText}>Get User</Text>
                </TouchableOpacity> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#240046",
        marginBottom:40
    },
    inputView:{
        width:"90%",
        backgroundColor:"#dee2e6",
        borderRadius:9,
        height:40,
        marginBottom:20,
        justifyContent:"center",
        paddingHorizontal:15
    },
    inputText:{
        height:50,
        color:"#240046"
    },
    forgot:{
        color:"#240046",
        fontSize:11
    },
    error:{
        color:"red",
        fontSize: 11,
        marginBottom: 8
    },
    loginBtn:{
        width:"90%",
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
        width: 130,
        height: 130
    },
    signupText:{
        color:'#240046'
    }
});