import React, { Component } from 'react';
import { Alert } from 'react-native';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import { getInvoice } from '../utils/requests';
import { getUser } from '../utils/user';

export default class OrderDetails extends Component {
    state = {
        loading: true
    }
    
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus',() => {
            console.log('component')
            this.setState({ 
                order: this.props.navigation.state.params.order,
                loading: false
            })
        })
    }

    sendInvoice = () => {
        console.log(this.state.order.id)
        let headers
        const toast = Toast.showLoading()
        getUser()
            .then(user => {
                let userData = JSON.parse(user)
                headers = {
                    headers: {
                        Authorization: userData.token
                    }
                }
                return getInvoice(this.state.order.id, headers)
            })
            .then(res => {
                Toast.hide(toast)
                Alert.alert(
                    'Invoice',
                    res.data.message
                )
            })
            .catch(err => {
                Toast.hide(toast)
                console.log(err)
            })
    }

    render() {
        return !this.state.loading ? (
            <View style={styles.container}>
                <FlatList 
                    enableEmptySections={true}
                    data={this.state.order.books}
                    keyExtractor= {(item) => {
                        return item.id;
                    }}
                    renderItem={(item) => {
                        return (
                            <View style={styles.container}>
                                <View>
                                    <View style={styles.box}>
                                        <Image style={styles.image} source={{uri: item.item.book.imageUrl}} />
                                        <View style={styles.boxContent}>
                                            <Text style={styles.title}>{ item.item.book.title }</Text>
                                            <Text style={styles.description}>Price: ₹ {item.item.book.price}</Text>
                                            <Text style={styles.description}>Quantity: { item.item.quantity }</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }} />
                <View style={styles.adminBtnContainer}>
                    <View style={styles.button}>
                        <View style={styles.totalTextView}>
                            <Text style={styles.totalSumText}>Total Amount: ₹ {this.state.order.totalSum}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.sendInvoice()}  style={styles.adminBtn}>
                            <Text style={styles.loginText}>Invoice</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ):(<View></View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        width: 100,
        height:100,
    },
    icon:{
        width:20,
        height:20,
        alignSelf:'center',
        marginRight:10
    },
    box: {
        //   flex: 1,
        padding:20,
        marginTop:5,
        marginBottom:5,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    boxContent: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft:10,
    },
    description:{
        fontSize:15,
        color: "#646464",
    },
    title:{
        fontSize:18,
        color:"#151515",
    },
    button: {
        position: 'absolute',
        bottom:0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin:0
    },
    loginText:{
        color:"#fff"
    },
    adminBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminBtn:{
        // position: 'absolute',
        bottom:0,
        width:"45%",
        backgroundColor:"#613dc1",
        borderRadius:9,
        height:45,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        margin: 10
    },
    totalTextView: {
        bottom:0,
        width:"70%",
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        margin: 10,
    },
    totalSumText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
});