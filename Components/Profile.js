import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements' 
import UserAvatar from 'react-native-user-avatar'
import { getProfile, updateProfile } from '../utils/requests'
import {  getUser } from '../utils/user'
import Toast from 'react-native-tiny-toast'
export default class Profile extends Component {
    state = {
        profile: {},
        loading: true,
        avatar: '',
        showModal: false
    }
    updatedProfileDetails = {}

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', async () => {
            let headers = {}
            const toast = Toast.showLoading('')
            getUser()
            .then(user => {
                let userData = JSON.parse(user)
                headers = {
                    headers: {
                        Authorization: userData.token
                    }
                }
                return getProfile(headers)
            })
            .then(res => {
                console.log(res.data)
                const avatarCharList = res.data.user.name.split()
                if (avatarCharList.length > 1) {
                    this.setState({avatar: (avatarCharList[0][0] + avatarCharList[1][0]).toUpperCase()})
                } else {
                    this.setState({avatar: (avatarCharList[0][0] + avatarCharList[0][1]).toUpperCase()})
                }
                this.setState({ profile: res.data.user })
                this.setState({loading: false})
                Toast.hide(toast)
            })
            .catch(err => {
                console.log(err)
                this.setState({loading: false})
                Toast.hide(toast)
                Toast.show('Something went wrong!')
            })
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal})
    }
    
    handleSubmit = () => {
        const toast = Toast.showLoading('')
        let message = ''
        let headers = {}
        getUser()
        .then(user => {
            let userData = JSON.parse(user)
            console.log(userData.token)
            headers = {
                headers: {
                    Authorization: userData.token
                }
            }
            return updateProfile(this.updatedProfileDetails, headers)
        })
        .then(res => {
            message = res.data.message
            return getProfile(headers)
        })
        .then(res => {
            console.log(res.data)
            const avatarCharList = res.data.user.name.split()
            if (avatarCharList.length > 1) {
                this.setState({avatar: (avatarCharList[0][0] + avatarCharList[1][0]).toUpperCase()})
            } else {
                this.setState({avatar: (avatarCharList[0][0] + avatarCharList[0][1]).toUpperCase()})
            }
            this.setState({ profile: res.data.user })
            this.setState({ loading: false })
            
            this.toggleModal()
            Toast.hide(toast)
            Toast.showSuccess(message)
        })
        .catch(err => {
            console.log(err)
            Toast.hide(toast)
            Toast.show('Something went wrong! Please try again..')
        })
    }

    render() {
        return !this.state.loading ? (
        <View style={styles.container}>
            <View style={styles.header}></View>
                <UserAvatar style={styles.avatar} size={100} bgColor='#ffeb3b' name={this.state.avatar}/>
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <Text style={styles.name}>{this.state.profile.name}</Text>
                    <Text style={styles.description}>Email: { this.state.profile.email }</Text>
                        <Text style={styles.description}>Phone No: {this.state.profile.phoneNo}</Text>
                        <Text style={styles.description}>Address: { this.state.profile.address || '' }</Text>
                    <TouchableOpacity onPress={() => this.toggleModal()} style={styles.buttonContainer}>
                        <Text style={styles.btnText} >Edit</Text>  
                    </TouchableOpacity>              
                </View>
            </View>
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={this.state.showModal}
                onDismiss={() => {this.toggleModal()}}
                onRequestClose={() => { this.toggleModal() }}   
            >
                <View style={styles.formContainer}>
                        <Text style={styles.logo}>
                            Update Profile ..
                        </Text>
                        <Input
                            placeholder="Name"
                            onChangeText={(name) => this.updatedProfileDetails.name = name}
                            inputContainerStyle={styles.formInput}
                            label={'Name'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.state.profile.name}
                            />
                        <Input
                            placeholder="Phone No."
                            onChangeText={(phoneNo) => this.updatedProfileDetails.phoneNo = phoneNo}
                            inputContainerStyle={styles.formInput}
                            label={'Phone No.'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.state.profile.phoneNo}
                            />
                        <Input
                            placeholder="Address"
                            numberOfLines={3}
                            onChangeText={(address) => this.updatedProfileDetails.address = address}
                            inputContainerStyle={styles.formInput}
                            label={'Address'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.state.profile.address}
                            />
                        <TouchableOpacity onPress={this.handleSubmit} style={styles.loginBtn}>
                            <Text style={styles.loginText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toggleModal()}>
                            <Text style={styles.modalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
            </Modal>
        </View>
        ): (<View></View>)
    }
}

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#00695c",
        height:200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:130
    },
    name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    name:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600"
    },
    info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#00695c",
    },
    btnText: {
        color:'#ffeb3b'
    },
    formContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        flex: 1
    },
    formInput: {
        borderColor: '#00695c',
        marginBottom: 5,
        borderWidth: 4,
        borderBottomWidth: 4
    },
    formButton: {
        margin: 60
    },
    buttonStyle: {
        backgroundColor: '#ffeb3b',
        borderWidth: 6,
        color: '#FFFFFF',
        borderColor: '#ffeb3b',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    textStyle: {
        backgroundColor: '#fff',
        fontSize: 15,
        marginTop: 16,
        marginLeft: 35,
        marginRight: 35,
        textAlign: 'center',
    },
    buttonTextStyle: {
        color: '#00695c',
        paddingVertical: 10,
        fontSize: 16,
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#00695c",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"#ffeb3b"
    },
    logo:{
        fontWeight:"bold",
        fontSize:30,
        color:"#00695c",
        marginBottom:40
    },
    labelStyle: {
        fontWeight: 'bold',
        color: '#00695c'
    },
    modalText: {
        color: '#00695c',
        fontSize: 20,
        marginBottom: 40
    },
});
