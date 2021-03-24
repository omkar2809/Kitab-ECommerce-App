import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ScrollView, StyleSheet, Image } from 'react-native'
import { Input } from 'react-native-elements' 
import * as ImagePicker from 'expo-image-picker';
import { getUser, isAuthenticatedAsync } from '../utils/user';
import { addBook } from '../utils/requests';
import Toast from 'react-native-tiny-toast'

export default class BookForm extends Component {
    state = {
        file: null,
        fileName: '',
        imageUrl: '',
        title: '',
        description: '',
        price: '',
        author: '',
        publisher: '',
        stock: 1,
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', async () => {
            console.log('component')
            const isAuth = await isAuthenticatedAsync()
            console.log('isAuth',isAuth)
            if(!isAuth) {
                this.props.navigation.navigate('Login')
            }
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
        } catch (err) {
            console.log(err)
            this.setState({file: null})
        }
    }

    handleSubmit = () => {
        if (this.state.file != null) {
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
                const payload = {
                    imageUrl: this.state.imageUrl,
                    title: this.state.title,
                    description: this.state.description,
                    price: this.state.price,
                    author: this.state.author,
                    publisher: this.state.publisher,
                    stock: this.state.stock
                }
                return addBook(payload, headers)
            })
            .then(res => {
                Toast.hide(toast)
                Toast.showSuccess(res.data.message)
                this.props.navigation.navigate("Seller's Books")
            })
            .catch(err => {
                console.log(err)
                Toast.hide(toast)
                Toast.show('Something went wrong! Please try again..')
            })
        }
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.logo}>
                            Add Book Details ..
                        </Text>
                        <Input
                            placeholder="Title"
                            onChangeText={(title) => this.setState({title: title})}
                            inputContainerStyle={styles.formInput}
                            label={'Title'}
                            labelStyle={styles.labelStyle}
                            />
                        <Input
                            placeholder="Description"
                            numberOfLines={3}
                            onChangeText={(description) => this.setState({description: description})}
                            inputContainerStyle={styles.formInput}
                            label={'Description'}
                            labelStyle={styles.labelStyle}
                            />
                        <Input
                            placeholder="Author"
                            onChangeText={(author) => this.setState({author: author})}
                            inputContainerStyle={styles.formInput}
                            label={'Author'}
                            labelStyle={styles.labelStyle}
                            />
                        <Input
                            placeholder="Publisher"
                            onChangeText={(publisher) => this.setState({publisher: publisher})}
                            inputContainerStyle={styles.formInput}
                            label={'Publisher'}
                            labelStyle={styles.labelStyle}
                            />
                        <Input
                            placeholder="Price"
                            onChangeText={(price) => this.setState({price: parseFloat(price)})}
                            inputContainerStyle={styles.formInput}
                            label={'Price'}
                            labelStyle={styles.labelStyle}
                            keyboardType="numeric"
                            />
                        <Input
                            placeholder="Stock"
                            onChangeText={(stock) => this.setState({stock: parseInt(stock)})}
                            inputContainerStyle={styles.formInput}
                            label={'Stock'}
                            labelStyle={styles.labelStyle}
                            keyboardType="numeric"
                            defaultValue={this.state.stock.toString()}
                            />

                        {this.state.file != null ? (
                            <Image style={styles.photo} source={{ uri: this.state.file.uri }} />
                        ) : null}
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
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
    photo: {
        width: 375,
        height:400,
        borderRadius: 15
    }
});
