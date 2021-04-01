import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { signUp } from '../utils/requests'
import Toast from 'react-native-tiny-toast'

export default class SignUp extends React.Component {
    state = {
        email:"",
        password:"",
        confirmPassword: "",
        name: "",
        phoneNo: "",
        address: ""
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
                        style={styles.inputText}
                        placeholder="Name..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({username:text})}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Phone No..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({phoneNo:text})}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({password:text})}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Confirm Password..." 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({confirmPassword:text})}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        numberOfLines={3}
                        style={styles.inputText}
                        placeholder="Address" 
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({address:text})}/>
                </View>
                <TouchableOpacity onPress={this.handleSignUp} style={styles.loginBtn}>
                    <Text style={styles.loginText}>SIGN UP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.loginText}>log In</Text>
                </TouchableOpacity>
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