import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import Toast from 'react-native-tiny-toast'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getUser, isAuthenticatedAsync } from '../utils/user'
import { getOrders } from '../utils/requests'

export default class Orders extends Component {
    state = {
        loading: true
    }
    orders = []

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
                const toast = Toast.showLoading('')
                getUser()
                .then(user => {
                    let userData = JSON.parse(user)
                    headers = {
                        headers: {
                            Authorization: userData.token
                        }
                    }
                    return getOrders(headers)
                })
                .then(res => {
                    // console.log(res.data.orders)
                    this.orders = res.data.orders
                    this.setState({loading: false})
                    Toast.hide(toast)
                })
                .catch(err => {
                    console.log(err)
                    Toast.hide(toast)
                })
            }
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    renderGroupMembers = (group) => {
        if (group.books) {
            return (
                <View style={styles.groupMembersContent}>
                {group.books.map((prop, key) => {
                    return (
                    <Image key={key} style={styles.memberImage}  source={{uri:prop.book.imageUrl}}/>
                    );
                })}
                </View>
            );
        }
        return null;
    }

    render() {
        dayjs.extend(relativeTime)
        return !this.state.loading ? (
                !this.orders.length !== 0 ? (
                    
                    <FlatList
                    style={styles.root}
                    data={this.orders}
                    extraData={this.state}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator}/>
                        )
                    }}
                    keyExtractor={(item)=>{
                        return item.id;
                    }}
                    renderItem={(item) => {
                        const Group = item.item
                        console.log(Group)
                        let mainContentStyle;
                        if(Group.attachment) {
                            mainContentStyle = styles.mainContent;
                        }
                        return(
                            <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('Order Details', {order: Group})}>
                                <Image source={{uri:Group.books[0].book.imageUrl}} style={styles.avatar}/>
                                <View style={styles.content}>
                                    <View style={mainContentStyle}>
                                    <View style={styles.text}>
                                        <Text style={styles.groupName}>Order ID: #{Group.id}</Text>
                                    </View>
                                    <Text style={styles.countMembers}>
                                        Total Amount: ₹ {Group.totalSum}
                                    </Text>
                                    <Text style={styles.timeAgo}>
                                        {dayjs(Group.createdAt).fromNow()}
                                    </Text>
                                    {this.renderGroupMembers(Group)}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}/>
            ) : (
                    <View style={styles.nullContainer}>
                        <Image source={require('../assets/not_found.png')} style={styles.notFoundImage}/>
                        <Text style={styles.nullText}>No Orders</Text>
                    </View>
                )
        ): (<View></View>)
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "#FFFFFF"
    },
    container: {
        padding: 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: 'flex-start'
    },
    avatar: {
        width:55,
        height:55,
        borderRadius:25,
    },
    text: {
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap:'wrap'
    },
    content: {
        flex: 1,
        marginLeft: 16,
        marginRight: 0
    },
    mainContent: {
        marginRight: 60
    },
    memberImage: {
        height: 30,
        width: 30,
        marginRight:4,
        borderRadius:10,
    },
    separator: {
        height: 1,
        backgroundColor: "#CCCCCC"
    },
    countMembers:{
        color:"#613dc1"
    },
    timeAgo:{
        fontSize:12,
        color:"#696969"
    },
    groupName:{
        fontSize:18,
        color:"#240046"
    },
    groupMembersContent:{
        flexDirection:'row',
        marginTop:10
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