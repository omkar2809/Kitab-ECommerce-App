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
                            onChangeText={text => this.setState({email:text})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Name" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({username:text})}/>
                    </View>
                    <View style={styles.inputView} >
                        <TextInput  
                            style={styles.inputText}
                            placeholder="Phone No" 
                            placeholderTextColor="#000"
                            onChangeText={text => this.setState({phoneNo:text})}/>
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
                            onChangeText={text => this.setState({address:text})}/>
                    </View>
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
        color:"white",
    },
    logoImage: {
        alignSelf:'center',
        marginTop:'30%',
        width: 130,
        height: 130
    }
});