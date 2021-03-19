import React, { Component } from 'react'
import { View, Image, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class BookDetails extends Component {
    state = {
        admin: false,
        loading: true,
        book: {}
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params.book)
        this.setState({ 
            book: this.props.navigation.state.params.book, 
            admin: this.props.navigation.state.params.admin,
            loading: false
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
                                <Text style={styles.price}>$ {this.state.book.price}</Text>
                            </View>
                            <View style={styles.stockContainer}>
                                {
                                    this.state.book.stock > 0 ? (
                                        <View style={styles.stockContainer}>
                                            <Text style={styles.inStock} >#In Stock</Text>
                                            <Text style={styles.inStock}>{this.state.book.stock} left</Text>
                                        </View>
                                    ): (
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
                                        <TouchableOpacity  style={styles.loginBtn}>
                                            <Text style={styles.loginText}>Add to Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.adminBtnContainer}>
                                        <TouchableOpacity  style={styles.adminBtn}>
                                            <Text style={styles.loginText}>Update</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity  style={styles.adminBtn}>
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
        width: 275,
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