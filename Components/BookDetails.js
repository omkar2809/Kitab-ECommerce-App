import React, { Component } from 'react'
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Toast from 'react-native-tiny-toast'
import { getUser, isAuthenticated } from '../utils/user'
import { addToCart, deleteBook } from '../utils/requests'

export default class BookDetails extends Component {
    state = {
        admin: false,
        loading: true,
        book: {}
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus',() => {
            console.log('component')
            this.setState({ 
                book: this.props.navigation.state.params.book, 
                admin: this.props.navigation.state.params.admin,
                loading: false
            })
        })
    }


    addBookToCart = (bookId) => {
        console.log('inside add', bookId)
        let headers = {}
        const toast = Toast.showLoading('')
        getUser()
        .then(user => {
            let userData = JSON.parse(user)
            if(isAuthenticated(userData)) {
                headers = {
                    headers: {
                        Authorization: userData.token
                    }
                }
                addToCart(headers, bookId)
                .then(res => {
                    console.log(res.data)
                    Toast.hide(toast)
                    Toast.showSuccess(res.data.message)
                    this.props.navigation.push('Cart')
                })
                .catch(err => {
                    console.log(err)
                    Toast.hide(toast)
                    Toast.show('Something went wrong!')
                })
            }
            else{
                Toast.hide(toast)
                this.props.navigation.navigate('Login')
            }
        })
        .catch(err => {
            console.log(err)
            Toast.hide(toast)
            Toast.show('Something went wrong!')
        })
    }

    removeBook = (bookId) => {
        console.log('remove Book')
        console.log(bookId)
        let headers = {}
        const toast = Toast.showLoading('')
        getUser()
        .then(user => {
            let userData = JSON.parse(user)
            if(isAuthenticated(userData)) {
                headers = {
                    headers: {
                        Authorization: userData.token
                    }
                }
                deleteBook(headers, bookId)
                .then(res => {
                    console.log(res.data)
                    Toast.hide(toast)
                    Toast.showSuccess(res.data.message)
                    this.props.navigation.navigate("Home")
                })
                .catch(err => {
                    console.log(err)
                    Toast.hide(toast)
                    Toast.show('Something went wrong!')
                })
            }
            else{
                Toast.hide(toast)
                this.props.navigation.navigate('Login')
            }
        })
        .catch(err => {
            console.log(err)
            Toast.hide(toast)
            Toast.show('Something went wrong!')
        })
    }

    render() {
        return (
            <ScrollView>
                {
                    !this.state.loading ? (
                        <View>
                            <View style={styles.container}>
                                <Image style={styles.photo} source={{ uri: this.state.book.imageUrl }} />
                                <Text style={styles.title}>{this.state.book.title}</Text>
                                <Text style={styles.price}>₹ {this.state.book.price}</Text>
                            </View>
                            <View style={styles.stockContainer}>
                                {
                                    this.state.book.stock > 0 ? (
                                        <View style={styles.stockContainer}>
                                            <Text style={styles.inStock} >#In Stock</Text>
                                            <Text style={styles.inStock}>{this.state.book.stock} left</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.stockContainer} >
                                            <Text style={styles.outStock}>#Out of Stock</Text>
                                        </View>
                                    )
                                }
                            </View>
                            <View style={styles.detailsContainer}>
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.detailsText}>Author: {this.state.book.author}</Text>
                                    <Text style={styles.detailsText}>Publisher: {this.state.book.publisher}</Text>
                                    <Text style={styles.detailsText}>Description: {this.state.book.description}</Text>
                                </View>
                            </View>
                            {
                                !this.state.admin ? (
                                    <View style={styles.container}>
                                        {
                                            this.state.book.stock > 0 ? (
                                                <TouchableOpacity  onPress={() => this.addBookToCart(this.state.book.id)}  style={styles.loginBtn}>
                                                    <Text style={styles.loginText}>Add to Cart</Text>
                                                </TouchableOpacity>
                                            ): null
                                        }
                                    </View>
                                ) : (
                                    <View style={styles.adminBtnContainer}>
                                        <TouchableOpacity onPress={() => this.props.navigation.push('UpdateDetails' , { book: this.state.book })}  style={styles.adminBtn}>
                                            <Text style={styles.loginText}>Update</Text>
                                        </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                Alert.alert(
                                                    'Remove book?',
                                                    'Are you sure you wish to remove the book ' + this.state.book.title + '?',
                                                    [
                                                        { 
                                                            text: 'Cancel', 
                                                            onPress: () => console.log('Not Deleted'),
                                                            style: ' cancel'
                                                        },
                                                        {
                                                            text: 'OK',
                                                            onPress: () => this.removeBook(this.state.book.id)
                                                        }
                                                    ],
                                                    { cancelable: false }
                                                )
                                        }}  style={styles.adminBtn}>
                                            <Text style={styles.loginText}>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    ) : null
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    stockContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 2,
        marginLeft:20
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 2,
        marginLeft:20
    },
    photo: {
        width: 375,
        height:400,
        borderRadius: 15
    },
    title: {
        flex: 1,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5,
    },
    price: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inStock: {
        textAlign: 'justify',
        color: 'green'
    },
    outStock: {
        textAlign: 'justify',
        color: 'red'
    },
    detailsText: {
        textAlign: 'justify',
        fontSize: 17
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
    adminBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    adminBtn:{
        width:"35%",
        backgroundColor:"#00695c",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        margin: 30
    }
});