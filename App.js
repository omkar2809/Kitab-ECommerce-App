import React, { Component } from 'react'
import {View, Platform, Image, StyleSheet, ScrollView,Text, TouchableOpacity } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { Icon } from 'react-native-elements'
import { deleteUser, getUser, isAuthenticated } from './utils/user'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import Home from './Components/Home'
import Cart from './Components/Cart'
import Orders from './Components/Orders'


var userInfo = { isAuthenticated: false }

function setUserInfo() {
    console.log('in set user info')
    getUser()
    .then(user => {
            let userData = JSON.parse(user);
            console.log(user)
            if (userData) {
                userInfo = {userData: userData, isAuthenticated: isAuthenticated(user)}
            }
            else {
                userInfo = {isAuthenticated: false}
            }
        })
        .catch(err => {
            userInfo = {isAuthenticated: false}
            console.log(err)
        })
}

const HomeNavigator = createStackNavigator({
    Home: {screen: Home}
    }, {
    defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#00695c',
            height: 70
        },
        headerTintColor: '#ffeb3b',
        headerTitleStyle: {
            color: '#ffeb3b'
        },
        headerLeft: <Icon name='menu' size={38}  color="#ffeb3b" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
    })
});

const LoginNavigator = createStackNavigator({
    Login: {
        screen: Login,
        params: {
            setUserInfo: setUserInfo
        },
        navigationOptions: ({navigation}) => ({
            drawerLabel: () => {
                if(userInfo.isAuthenticated) return null
                else return 'Login'
            },
            headerLeft: () => (<Icon name='menu' size={38} color="#ffeb3b" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>),
        })
    },
    SignUp : {screen: SignUp}
    }, {
    initialRouteName: 'Login',
    defaultNavigationOptions: () => ({
        headerStyle: {
            backgroundColor: "#00695c",
            height: 70
        },
        headerTitleStyle: {
            color: "#ffeb3b"            
        },
        // title: 'Login',
        headerTintColor: "#ffeb3b",
        headerTransparent: true,
    })
});

const CartNavigator = createStackNavigator({
    Cart: {screen: Cart}
    }, {
    defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#00695c',
            height: 70
        },
        headerTintColor: '#ffeb3b',
        headerTitleStyle: {
            color: '#ffeb3b'
        },
        headerLeft: <Icon name='menu' size={38}  color="#ffeb3b" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
    })
});

const OrdersNavigator = createStackNavigator({
    Orders: {screen: Orders}
    }, {
    defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#00695c',
            height: 70
        },
        headerTintColor: '#ffeb3b',
        headerTitleStyle: {
            color: '#ffeb3b'
        },
        headerLeft: <Icon name='menu' size={38}  color="#ffeb3b" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
    })
});

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={styles.drawerHeader}>
                <View style={{flex:1}}>
                    <Image source={require('./assets/book.png')} style={styles.drawerImage} />
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.drawerHeaderText}>eKitab</Text>
                </View>
            </View>
            <DrawerItems {...props} />
            {
                (userInfo.isAuthenticated) ? (
                <TouchableOpacity onPress={() => { deleteUser().then(() => {
                    userInfo = {isAuthenticated: false}
                    props.navigation.toggleDrawer()
                }) }} style={styles.loginBtn}>
                        <Text style={styles.loginText}>Log Out</Text>
                </TouchableOpacity>
                ): null
            }
        </SafeAreaView>
    </ScrollView>
);

const MainNavigator = createDrawerNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            title: 'Home',
            drawerLabel: 'Home',
        }
    },
    Cart: {
        screen: CartNavigator,
        navigationOptions: {
            title: 'Cart',
            drawerLabel: 'Cart',
        }
    },
    Orders: {
        screen: OrdersNavigator,
        navigationOptions: {
            title: 'Orders',
            drawerLabel: 'Orders',
        }
    },
    Login: {
        screen: LoginNavigator,
        navigationOptions: {
            title: 'Login',
            drawerLabel: () => { if(!userInfo.isAuthenticated) return 'Login'; else return null } ,
        }
    },
}, {
    initialRouteName: 'Home',
    drawerBackgroundColor: '#00695c',
    contentComponent: CustomDrawerContentComponent
});
const AppContainer = createAppContainer(MainNavigator);



export default class App extends Component {
    componentDidMount() {
        setUserInfo()
    }

    render() {
        return (
            <View style={{flex:1, paddingTop: Platform.OS ==='android' ? Expo.Constants.statusBarHeight : 0}}>
                <AppContainer setUserInfo={setUserInfo} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawerHeader: {
        backgroundColor:'#00695c',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color:'#ffeb3b',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 80
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#ffeb3b",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
        marginLeft: 27
    },
    loginText:{
        color:"black"
    }
})