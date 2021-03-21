import React, { Component } from 'react'
import { FlatList, View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import Toast from 'react-native-tiny-toast'
import Swipeout from 'react-native-swipeout'
import { getUser, isAuthenticatedAsync } from '../utils/user'
import { getCart, removeFromCart, clearCart } from '../utils/requests'


export default class Cart extends Component {
    state = {
        loading: true,
        cart: [],
        totalSum : 0
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', async () => {
            console.log('component')
            const isAuth = await isAuthenticatedAsync()
            console.log('isAuth',isAuth)
            if(!isAuth) {
                this.props.navigation.navigate('Login')
            }
            else {
                let headers = {}
                const toast = Toast.showLoading('Loading...')
                getUser()
                .then(user => {
                    let userData = JSON.parse(user)
                    headers = {
                        headers: {
                            Authorization: userData.token
                        }
                    }
                    return getCart(headers)
                })
                .then(res => {
                    // this.books = res.data
                    this.setState({cart: res.data.books.filter(Boolean), totalSum: res.data.totalSum})
                    console.log('Books ',res.data.books.filter(Boolean))
                    Toast.hide(toast)
                    this.setState({loading: false})
                })
                .catch(err => {
                    console.log(err)
                    this.setState({loading: false})
                    Toast.hide(toast)
                    Toast.show('Something went wrong!')
                })
            }
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    removeBookFromCart = (bookId) => {
        console.log(bookId)
        let headers = {}
        let message = ''
        const toast = Toast.showLoading('')
        getUser()
        .then(user => {
            let userData = JSON.parse(user)
            headers = {
                headers: {
                    Authorization: userData.token
                }
            }
            return removeFromCart(headers, bookId)
        })
        .then(res => {
            // this.books = res.data
            // this.setState({cart: res.data.books, totalSum: res.data.totalSum})
            console.log(res.data)
            message=  res.data.message
            return getCart(headers)
        })
        .then(res => {
            this.setState({cart: res.data.books, totalSum: res.data.totalSum})
            // console.log(res.data)
            Toast.hide(toast)
            Toast.showSuccess(message)
            this.setState({loading: false})
        })
        .catch(err => {
            console.log(err)
            this.setState({loading: false})
            Toast.hide(toast)
            Toast.show('Something went wrong!')
        })
    }

    clearCartItems = () => {
        let headers = {}
        let message = ''
        const toast = Toast.showLoading('')
        getUser()
        .then(user => {
            let userData = JSON.parse(user)
            headers = {
                headers: {
                    Authorization: userData.token
                }
            }
            return clearCart(headers)
        })
        .then(res => {
            // this.books = res.data
            // this.setState({cart: res.data.books, totalSum: res.data.totalSum})
            console.log(res.data)
            message=  res.data.message
            return getCart(headers)
        })
        .then(res => {
            this.setState({cart: res.data.books, totalSum: res.data.totalSum})
            // console.log(res.data)
            Toast.hide(toast)
            Toast.showSuccess(message)
            this.setState({loading: false})
        })
        .catch(err => {
            console.log(err)
            this.setState({loading: false})
            Toast.hide(toast)
            Toast.show('Something went wrong!')
        })
    }

    render() {
        const renderCartItems = ({item, index}) => {
            console.log('render cart ',item)
            const rightButton = [{
                text: 'Delete', 
                type: 'delete',
                onPress: () => {
                    Alert.alert(
                        'Remove From Cart?',
                        'Are you sure you wish to remove the book ' + item.book.title + '?',
                        [
                            { 
                                text: 'Cancel', 
                                onPress: () => console.log(item.book.title + 'Not Deleted'),
                                style: ' cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => this.removeBookFromCart(item.book.id)
                            }
                        ],
                        { cancelable: false }
                    )
                }
            }]
            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem key={index} 
                        onPress={() => this.props.navigation.navigate('BookDetails', { book: item.book, admin: false })}
                        bottomDivider>
                        <Avatar rounded source={{uri: item.book.imageUrl}} />
                        <ListItem.Content>
                        <ListItem.Title>{item.book.title}</ListItem.Title>
                        <ListItem.Subtitle>{'Quantity '+ item.quantity}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron type='font-awesome' name='trash' size={30} onPress={() => Alert.alert(
                            'Remove From Cart?',
                            'Are you sure you wish to remove the book ' + item.book.title + '?',
                            [
                                { 
                                    text: 'Cancel', 
                                    onPress: () => console.log(item.book.title + ' Not Deleted'),
                                    style: ' cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => this.removeBookFromCart(item.book.id)
                                }
                            ],
                            { cancelable: false }
                        )} />
                    </ListItem>
                </Swipeout>
            )
        }

        return (
            !this.state.loading ? (
                <View style={styles.container}>
                    {
                        this.state.cart.length == 0 ? (
                            <View>
                                <Text>Cart is Empty!!</Text>
                            </View>
                        ) : (
                            <View>
                                <FlatList 
                                    data={this.state.cart}
                                    renderItem={renderCartItems}
                                    keyExtractor={item => item}
                                    />
                            </View>
                        )
                    }
                    {
                        !this.state.cart.length == 0 ?(
                            <View style={styles.adminBtnContainer}>
                                <View style={styles.button}>
                                    <View style={styles.totalTextView}>
                                        <Text style={styles.totalSumText}>Total: $ {this.state.totalSum}</Text>
                                    </View>
                                    <TouchableOpacity  style={styles.adminBtn}>
                                        <Text style={styles.loginText}>Order</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  onPress={() => this.clearCartItems()} style={styles.adminBtn}>
                                        <Text style={styles.loginText}>Clear Cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null
                    }
                </View>
            ) : (<View></View>)
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center'
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36,
    },
    button: {
        position: 'absolute',
        bottom:0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
        // position: 'absolute',
        bottom:0,
        width:"35%",
        backgroundColor:"#00695c",
        borderRadius:20,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        margin: 10
    },
    totalTextView: {
        bottom:0,
        width:"50%",
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        margin: 10
    },
    totalSumText: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})