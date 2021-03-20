import React, { Component } from 'react';
// import { FlatList, Text, View, Image , StyleSheet, Dimensions, TouchableOpacity} from 'react-native'
import { FlatList, View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import Toast from 'react-native-tiny-toast'
import Swipeout from 'react-native-swipeout'
import { getUser, isAuthenticatedAsync } from '../utils/user'
import { getCart } from '../utils/requests'


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
                    this.setState({cart: res.data.books, totalSum: res.data.totalSum})
                    // console.log(res.data)
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
    }

    render() {
        const renderCartItems = ({item, index}) => {
            // console.log(item)
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
                                    keyExtractor={item => item.id}
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
                                    <TouchableOpacity  style={styles.adminBtn}>
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

// const { width, height } = Dimensions.get('window')
// const SCREEN_WIDTH = width < height ? width : height;
// const bookNumColumns = 2;
// const BOOK_ITEM_HEIGHT = 200;
// const BOOK_ITEM_MARGIN = 5;

// export default class Cart extends Component {
//     state = {
//         loading: true,
//         cart: [],
//         totalSum : 0
//     }
//     componentDidMount() {
//         this._navListener = this.props.navigation.addListener('didFocus', async () => {
//             console.log('component')
//             const isAuth = await isAuthenticatedAsync()
//             console.log('isAuth',isAuth)
//             if(!isAuth) {
//                 this.props.navigation.navigate('Login')
//             }
//             else {
//                 let headers = {}
//                 const toast = Toast.showLoading('Loading...')
//                 getUser()
//                 .then(user => {
//                     let userData = JSON.parse(user)
//                     headers = {
//                         headers: {
//                             Authorization: userData.token
//                         }
//                     }
//                     return getCart(headers)
//                 })
//                 .then(res => {
//                     // this.books = res.data
//                     this.setState({cart: res.data.books})
//                     // console.log(res.data)
//                     Toast.hide(toast)
//                     this.setState({loading: false})
//                 })
//                 .catch(err => {
//                     console.log(err)
//                     this.setState({loading: false})
//                     Toast.hide(toast)
//                     Toast.show('Something went wrong!')
//                 })
//             }
//         });
//     }

//     componentWillUnmount() {
//         this._navListener.remove();
//     }

//     renderBooks = ({item, index}) => (
//         <TouchableOpacity underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.props.navigation.navigate('BookDetails', {book: item.book, admin: false})}>
//             <View style={styles.container}>
//                 <Image style={styles.photo} source={{ uri: item.book.imageUrl }} />
//                 <Text style={styles.title}>{item.book.title}</Text>
//                 <Text style={styles.price}>$ {item.book.price}</Text>
//                 <Text style={styles.price}>Quantity: {item.quantity}</Text>
//             </View>
//         </TouchableOpacity>
//     );

//     render() {
//         return !this.state.loading ? (
//             <View>
//                 {
//                     this.state.cart.length === 0 ? (
//                         <Text>Cart is Empty ..</Text>
//                     ): (
//                         <View>
//                             <FlatList
//                                 vertical
//                                 showsVerticalScrollIndicator={false}
//                                 numColumns={2}
//                                 data={this.state.cart}
//                                 renderItem={this.renderBooks}
//                                 keyExtractor={book => book.id}
//                             />
//                             <View style={styles.footer}>
//                                 <Text>Home</Text>
//                             </View>
//                         </View>
//                     )
//                 }
//             </View>
//         ): (
//             <View>
//             </View>
//         );
//     }
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: BOOK_ITEM_MARGIN,
//         marginTop: 20,
//         width: (SCREEN_WIDTH - (bookNumColumns + 1) * BOOK_ITEM_MARGIN) / bookNumColumns,
//         // height: BOOK_ITEM_HEIGHT + 75,
//         borderColor: '#cccccc',
//         borderWidth: 0.5,
//         borderRadius: 15
//     },
//     photo: {
//         width: (SCREEN_WIDTH - (bookNumColumns + 1) * BOOK_ITEM_MARGIN) / bookNumColumns,
//         height: BOOK_ITEM_HEIGHT,
//         borderRadius: 15,
//         borderBottomLeftRadius: 0,
//         borderBottomRightRadius: 0
//     },
//     title: {
//         flex: 1,
//         fontSize: 17,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         color: '#444444',
//         marginTop: 3,
//         marginRight: 5,
//         marginLeft: 5,
//     },
//     price: {
//         marginTop: 5,
//         // marginBottom: 5
//     },
//     footer: {
//         // flex: 1,
//         // flexDirection: 'row',
//         // justifyContent: 'flex-end',
//         // alignItems:'baseline',
//         borderColor: '#cccccc',
//         borderWidth:2,
//         position: 'absolute',
//         bottom: 0
//         // height: 40,
//         // left: 0,
//         // top: height - 40
//     }
// });