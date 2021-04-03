import React, { Component } from 'react';
import { FlatList, Text, View, Image , StyleSheet, Dimensions, TouchableOpacity} from 'react-native'
import Toast from 'react-native-tiny-toast'
import { getBooks } from '../utils/requests'

const { width, height } = Dimensions.get('window')
const SCREEN_WIDTH = width < height ? width : height;
const bookNumColumns = 2;
const BOOK_ITEM_HEIGHT = 200;
const BOOK_ITEM_MARGIN = 5;
export default class Home extends Component {
    state = {
        loading: true
    }
    books = []
    
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus',() => {
            // this.setState({loading: true})
            console.log('inside home component')
            getBooks()
            .then(res => {
                this.books = res.data
                this.setState({loading: false})
            })
            .catch(err => {
                console.log(err)
                this.setState({loading: false})
                Toast.show('Something went wrong!')
            })
        })
    }

    componentWillUnmount() {
        this._navListener.remove()
    }

    renderBooks = ({item, index}) => (
        <TouchableOpacity underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.props.navigation.push('BookDetails', {book: item, admin: false})}>
            <View style={styles.container}>
                <Image style={styles.photo} source={{ uri: item.imageUrl }} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>₹ {item.price}</Text>
            </View>
        </TouchableOpacity>
    );
    render() {
        return !this.state.loading ? (
        <View style={{backgroundColor:'#fff',flex:1}}>
            {
                    this.books.length === 0 ? (
                        <View style={styles.nullContainer}>
                            <Image source={require('../assets/not_found.png')} style={styles.notFoundImage}/>
                            <Text style={styles.nullText}>Books are not available</Text>
                        </View>
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
        ): (
            <View></View>
        );
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
    },
    nullContainer: {
        flex: 1,
        justifyContent:'center',
        backgroundColor:'#fff',
        alignItems:'center',
    },
    notFoundImage:{
        height:200,
        width:'80%',
        alignSelf:'center'
    },
    nullText: {
        backgroundColor:'#fff',
        alignSelf:'center',
        fontSize: 20
    }
});