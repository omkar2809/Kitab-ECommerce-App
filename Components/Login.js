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
                <Image source={require('../assets/book.png')} style={styles.logoImage} />
                <Text style={styles.logo}>Kitab</Text>
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Email..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({email:text})}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({password:text})}/>
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleLogin} style={styles.loginBtn}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('SignUp')}>
                    <Text style={styles.loginText}>Signup</Text>
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
        backgroundColor: '#00695c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#ffeb3b",
        marginBottom:40
    },
    inputView:{
        width:"80%",
        backgroundColor:"#fff",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
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
        width:"80%",
        backgroundColor:"#ffeb3b",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"white"
    },
    logoImage: {
        width: 100,
        height: 100
    }
});