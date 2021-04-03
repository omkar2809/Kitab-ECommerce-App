import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements' 
import Toast from 'react-native-tiny-toast'
import UserAvatar from 'react-native-user-avatar'
import { getProfile, updateProfile } from '../utils/requests'
import {  getUser } from '../utils/user'
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
                const avatarCharList = res.data.user.username.split(' ')
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
            const avatarCharList = res.data.user.username.split()
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
                <UserAvatar style={styles.avatar} size={100} bgColor='#240046' name={this.state.avatar}/>
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <Text style={styles.name}>{this.state.profile.username}</Text>
                    <Text style={styles.description}>Email: { this.state.profile.email?this.state.profile.email:"Edit details" }</Text>
                        <Text style={styles.description}>Phone Number: {this.state.profile.phoneNo?this.state.profile.phoneNo:"Edit details"}</Text>
                        <Text style={styles.description}>Address: { this.state.profile.address?this.state.profile.address:"Edit details" }</Text>
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
                            Update Profile
                        </Text>
                        <Input
                            placeholder="Name"
                            onChangeText={(name) => this.updatedProfileDetails.username = name}
                            inputContainerStyle={styles.formInput}
                            label={'Name'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.state.profile.name}
                            />
                        <Input
                            placeholder="Phone Number"
                            onChangeText={(phoneNo) => this.updatedProfileDetails.phoneNo = phoneNo}
                            inputContainerStyle={styles.formInput}
                            label={'Phone Number'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.state.profile.phoneNo}
                            />
                        <Input
                            placeholder="Address"
                            numberOfLines={1}
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
        backgroundColor: "#fff",
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
        fontWeight: '600'
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        marginTop:20
        // padding:30,
    },
    name:{
        // marginHorizontal:15,
        // marginVertical:15,
        alignSelf: 'center',
        fontSize:28,
        color: "#240046",
        fontWeight: "bold"
    },
    info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#000",
        marginHorizontal:15,
        alignItems: 'stretch',
        marginTop: 15
    },
    buttonContainer: {
        marginTop:50,
        height:45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        marginHorizontal:15,
        borderRadius:9,
        backgroundColor: "#613dc1",
    },
    btnText: {
        color:'#fff'
    },
    formContainer: {
        justifyContent: 'center',
        flex: 1
    },
    formInput: {
        backgroundColor:'#dee2e6',
        borderRadius:6,
        paddingHorizontal:15
    },
    formButton: {
        margin: 60
    },
    buttonStyle: {
        backgroundColor: '#ffeb3b',
        color: '#FFFFFF',
        borderColor: '#ffeb3b',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        marginHorizontal:15,
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
        backgroundColor:"#613dc1",
        borderRadius:9,
        height:45,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        marginHorizontal:15
    },
    loginText:{
        color:"#fff"
    },
    logo:{
        alignSelf:'center',
        fontWeight:"bold",
        fontSize:30,
        color:"#240046",
        marginBottom:40
    },
    labelStyle: {
        fontWeight: 'bold',
        color: '#000'
    },
    modalText: {
        color: '#000',
        alignSelf:'center',
        fontSize: 14,
    },
});
