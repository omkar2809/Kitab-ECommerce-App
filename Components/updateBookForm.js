import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ScrollView, StyleSheet, Image } from 'react-native'
import { Input } from 'react-native-elements' 
import * as ImagePicker from 'expo-image-picker';
import { getUser, isAuthenticatedAsync } from '../utils/user';
import { updateBook } from '../utils/requests';
import Toast from 'react-native-tiny-toast'

export default class updateBookForm extends Component {
    state = {
        file: null,
        fileName: '',
        imageUrl: '',
        loading: true,
        errVal: {}
    }
    originalBookDetails = {}
    updatedBookDetails = {}

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', async () => {
            console.log('component')
            const isAuth = await isAuthenticatedAsync()
            console.log('isAuth',isAuth)
            if(!isAuth) {
                this.props.navigation.navigate('Login')
            }
            this.originalBookDetails = this.props.navigation.state.params.book
            this.setState({loading: false})
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }


    selectFile = async () => {
        try {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
            })
            const uri = res.uri.split('/')
            this.setState({file: res, fileName: uri[uri.length - 1], imageUrl: res.base64})
            this.updatedBookDetails.imageUrl = res.base64
        } catch (err) {
            console.log(err)
            this.setState({file: null})
        }
    }

    handleSubmit = () => {
        console.log(this.updatedBookDetails)
        const toast = Toast.showLoading('')
        getUser()
        .then(user => {
            let userData = JSON.parse(user)
            console.log(userData.token)
            const headers = {
                headers: {
                    Authorization: userData.token
                }
            }
            return updateBook(this.updatedBookDetails, this.originalBookDetails.id, headers)
        })
        .then(res => {
            Toast.hide(toast)
            Toast.showSuccess(res.data.message)
            this.props.navigation.navigate("Seller's Books")
        })
        .catch(err => {
            console.log(err.request)
            Toast.hide(toast)
            Toast.show('Something went wrong! Please try again..')
        })
    }

    render() {
        return !this.state.loading ? (
            <View>
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.logo}>
                            Update Book Details ..
                        </Text>
                        <Input
                            placeholder="Title"
                            onChangeText={(title) => this.updatedBookDetails.title = title}
                            inputContainerStyle={styles.formInput}
                            label={'Title'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.originalBookDetails.title}
                            errorMessage={this.state.errVal.title ? this.state.errVal.title : null}
                            />
                        <Input
                            placeholder="Description"
                            numberOfLines={3}
                            onChangeText={(description) => this.updatedBookDetails.description = description}
                            inputContainerStyle={styles.formInput}
                            label={'Description'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.originalBookDetails.description}
                            errorMessage={this.state.errVal.description ? this.state.errVal.description : null}
                            />
                        <Input
                            placeholder="Author"
                            onChangeText={(author) => this.updatedBookDetails.author = author}
                            inputContainerStyle={styles.formInput}
                            label={'Author'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.originalBookDetails.author}
                            errorMessage={this.state.errVal.author ? this.state.errVal.author : null}
                            />
                        <Input
                            placeholder="Publisher"
                            onChangeText={(publisher) => this.updatedBookDetails.publisher = publisher}
                            inputContainerStyle={styles.formInput}
                            label={'Publisher'}
                            labelStyle={styles.labelStyle}
                            defaultValue={this.originalBookDetails.publisher}
                            errorMessage={this.state.errVal.publisher ? this.state.errVal.publisher : null}
                            />
                        <Input
                            placeholder="Price"
                            onChangeText={(price) => this.updatedBookDetails.price = parseFloat(price)}
                            inputContainerStyle={styles.formInput}
                            label={'Price'}
                            labelStyle={styles.labelStyle}
                            keyboardType="numeric"
                            defaultValue={this.originalBookDetails.price.toString()}
                            errorMessage={this.state.errVal.price ? this.state.errVal.price : null}
                            />
                        <Input
                            placeholder="Stock"
                            onChangeText={(stock) => this.updatedBookDetails.stock = parseInt(stock)}
                            inputContainerStyle={styles.formInput}
                            label={'Stock'}
                            labelStyle={styles.labelStyle}
                            keyboardType="numeric"
                            defaultValue={this.originalBookDetails.stock.toString()}
                            errorMessage={this.state.errVal.stock ? this.state.errVal.stock : null}
                            />


                        {this.state.file != null ? (
                            <Image style={styles.photo} source={{ uri: this.state.file.uri }} />
                        ) : (
                            <Image style={styles.photo} source={{ uri: this.originalBookDetails.imageUrl }} />
                        )}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={this.selectFile}>
                            <Text style={styles.buttonTextStyle}>Select File</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleSubmit} style={styles.loginBtn}>
                            <Text style={styles.loginText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        ) : (<View></View>)
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor:'#fff'
    },
    formInput: {
        borderRadius:9,
        height:40,
        backgroundColor:'#dee2e6',
        paddingHorizontal:15
    },
    formButton: {
        margin: 60
    },
    buttonStyle: {
        backgroundColor: '#613dc1',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        marginTop: 15,
        marginHorizontal:50
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
        color: '#fff',
        fontSize: 16,
    },
    loginBtn:{
        // width:"80%",
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
        color:"#fff"
    },
    logo: {
        fontWeight:"bold",
        fontSize:30,
        alignSelf:'center',
        color:"#240046",
        marginBottom: 40,
        marginTop: 20
    },
    labelStyle: {
        fontWeight: 'bold',
        color: '#240046',
        marginHorizontal:0,
        marginBottom:1
    },
    photo: {
        width: 300,
        height:300,
        borderRadius: 6,
        marginHorizontal:15,
        alignSelf:'center',
        marginVertical:15
    }
});
