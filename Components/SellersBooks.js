import React, { Component } from 'react';
import { FlatList, Text, View, Image , StyleSheet, Dimensions, TouchableOpacity} from 'react-native'
import Toast from 'react-native-tiny-toast'
import { getSellerBooks } from '../utils/requests'
import { getUser, isAuthenticatedAsync } from '../utils/user';

const { width, height } = Dimensions.get('window')
const SCREEN_WIDTH = width < height ? width : height;
const bookNumColumns = 2;
const BOOK_ITEM_HEIGHT = 200;
const BOOK_ITEM_MARGIN = 5;
export default class SellersBooks extends Component {
    state = {
        loading: false
    }
    books = []

    componentDidMount() {
        const toast = Toast.showLoading('Loading...')
        this._navListener = this.props.navigation.addListener('didFocus', async () => {
            console.log('component')
            const isAuth = await isAuthenticatedAsync()
            console.log('isAuth',isAuth)
            if(!isAuth) {
                this.props.navigation.navigate('Login')
            }
            else {
                let headers = {}
                getUser()
                .then(user => {
                    let userData = JSON.parse(user)
                    headers = {
                        headers: {
                            Authorization: userData.token
                        }
                    }
                    return getSellerBooks(headers)
                })
                .then(res => {
                    this.books = res.data
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

    renderBooks = ({item}) => (
        <TouchableOpacity underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.props.navigation.navigate('BookDetails', {book: item, admin: true})} >
            <View style={styles.container}>
                <Image style={styles.photo} source={{ uri: item.imageUrl }} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>$ {item.price}</Text>
            </View>
        </TouchableOpacity>
    );
    render() {
        return (
        <View>
            {
                this.books.length === 0 ? (
                    <Text>Books are not available ..</Text>
                ): (
                <FlatList
                    vertical
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    data={this.books}
                    renderItem={this.renderBooks}
                    keyExtractor={book => book.id}
                />
                )
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: BOOK_ITEM_MARGIN,
        marginTop: 20,
        width: (SCREEN_WIDTH - (bookNumColumns + 1) * BOOK_ITEM_MARGIN) / bookNumColumns,
        height: BOOK_ITEM_HEIGHT + 75,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 15
    },
    photo: {
        width: (SCREEN_WIDTH - (bookNumColumns + 1) * BOOK_ITEM_MARGIN) / bookNumColumns,
        height: BOOK_ITEM_HEIGHT,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444444',
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5,
    },
    price: {
        marginTop: 5,
        marginBottom: 5
    }
});