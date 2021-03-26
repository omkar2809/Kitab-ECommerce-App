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
                password:""
        }
    }

    handleLogin = () => {
        console.log('inside handleLogin')
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
            console.log(err)
        })
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
                <Image source={require('../assets/book_new.png')} style={styles.logoImage} />
                <Text style={styles.logo}>Kitab</Text>
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Email" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({email:text})}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password" 
                        placeholderTextColor="#000"
                        onChangeText={text => this.setState({password:text})}/>
                </View>
                <TouchableOpacity>
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
        color:"#4a4e69",
        marginBottom:40
    },
    inputView:{
        width:"95%",
        backgroundColor:"#dee2e6",
        borderRadius:9,
        height:40,
        marginBottom:20,
        justifyContent:"center",
        paddingHorizontal:10
    },
    inputText:{
        height:35,
        color:"black"
    },
    forgot:{
        color:"#000",
        fontSize:15
    },
    loginBtn:{
        width:"95%",
        backgroundColor:"#613dc1",
        borderRadius:9,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:'#fff'
    },
    logoImage: {
        width: 150,
        height: 150
    }
});