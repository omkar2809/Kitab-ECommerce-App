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
import BookForm from './Components/BookForm'
import SellersBooks from './Components/SellersBooks'
import BookDetails from './Components/BookDetails'
import updateBookForm from './Components/updateBookForm'

var userInfo = { isAuthenticated: false }

function setUserInfo() {
    console.log('in set user info')
    getUser()
    .then(user => {
            let userData = JSON.parse(user);
            console.log(user)
            if (userData) {
                userInfo = {userData: userData, isAuthenticated: isAuthenticated(userData)}
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
    Home: {
            screen: Home,
            navigationOptions: ({navigation}) => ({
                drawerLabel: 'Home',
                headerLeft: <Icon name='menu' size={38}  color="#613dc1" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>,
                // detachPreviousScreen: true
        })
    },
    BookDetails: { screen: BookDetails }
    }, {
    initialRouteName: 'Home',
    defaultNavigationOptions: () => ({
        headerStyle: {
            backgroundColor: '#e9e0ff',
            height: 60
        },
        headerTintColor: '#4a4e69',
        headerTitleStyle: {
            color: '#4a4e69'
        },
    }),
})

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
            headerLeft: () => (<Icon name='menu' size={38} color="#613dc1" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>),
        })
    },
    SignUp : {screen: SignUp}
    }, {
    initialRouteName: 'Login',
    defaultNavigationOptions: () => ({
        headerStyle: {
            backgroundColor: "#e9e0ff",
            height: 60
        },
        headerTitleStyle: {
            color: "#4a4e69"            
        },
        headerTintColor: "#4a4e69",
        headerTransparent: true,
    })
});

const CartNavigator = createStackNavigator({
    Cart: {
            screen: Cart,
            navigationOptions: ({navigation}) => ({
                drawerLabel: 'Cart',
                headerLeft: <Icon name='menu' size={38}  color="#613dc1" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
        })
    },
    BookDetails: { screen: BookDetails }
    }, {
    initialRouteName: 'Cart',
    defaultNavigationOptions: () => ({
        headerStyle: {
            backgroundColor: '#e9e0ff',
            height: 60
        },
        headerTintColor: '#4a4e69',
        headerTitleStyle: {
            color: '#4a4e69'
        }
    })
})

const OrdersNavigator = createStackNavigator({
    Orders: {
        screen: Orders,
        params: {
            userInfo: userInfo
        }
    }
    }, {
    defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#e9e0ff',
            height: 60
        },
        headerTintColor: '#4a4e69',
        headerTitleStyle: {
            color: '#4a4e69'
        },
        headerLeft: <Icon name='menu' size={38}  color="#613dc1" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
    })
})

const SellBookNavigator = createStackNavigator({
    "Sell Book": {
        screen: BookForm,
        params: {
            userInfo: userInfo
        }
    }
    }, {
    defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: '#e9e0ff',
            height: 60
        },
        headerTintColor: '#4a4e69',
        headerTitleStyle: {
            color: '#4a4e69'
        },
        headerLeft: <Icon name='menu' size={38}  color="#613dc1" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
    })
})

const SellerBooksNavigator = createStackNavigator({
    "Seller's Books": {
            screen: SellersBooks,
            navigationOptions: ({navigation}) => ({
                drawerLabel: 'Books',
                headerLeft: <Icon name='menu' size={38}  color="#613dc1" iconStyle={{marginLeft: 10}} onPress = {() => navigation.toggleDrawer()}/>
        })
    },
    BookDetails: { screen: BookDetails },
    UpdateDetails: { screen: updateBookForm }
    }, {
    initialRouteName: "Seller's Books",
    defaultNavigationOptions: () => ({
        headerStyle: {
            backgroundColor: '#e9e0ff',
            height: 60
        },
        headerTintColor: '#4a4e69',
        headerTitleStyle: {
            color: '#4a4e69'
        }
    })
})

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={styles.drawerHeader}>
                <View style={{flex:1}}>
                    <Image source={require('./assets/book.png')} style={styles.drawerImage} />
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.drawerHeaderText}>Kitab</Text>
                </View>
            </View>
            <DrawerItems {...props} />
            {
                (userInfo.isAuthenticated) ? (
                <TouchableOpacity onPress={() => { deleteUser().then(() => {
                    userInfo = {isAuthenticated: false}
                    props.navigation.toggleDrawer()
                    props.navigation.navigate('Home')
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
    SellBook: {
        screen: SellBookNavigator,
        navigationOptions: {
            title: 'Sell Book',
            drawerLabel: 'Sell Book',
        }
    },
    SellersBooks: {
        screen: SellerBooksNavigator,
        navigationOptions: {
            title: "Seller's Books",
            drawerLabel: () => { if(userInfo.isAuthenticated) return "Seller's Books"; else return null },
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
    drawerBackgroundColor: '#f8f9fa',
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
        activeTintColor: '#9a51f9',
        // activeBackgroundColor: 'transparent',
        inactiveTintColor: 'black',
        inactiveBackgroundColor: 'transparent',
    //   labelStyle: {
    //     fontSize: 15,
    //     marginLeft: 10,
    //   },
    },
    resetOnBlur: true
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
        backgroundColor:'#e9e0ff',
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color:'#4a4e69',
        fontSize: 35,
        fontWeight: 'bold',
        marginLeft:7
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 80
    },
    loginBtn:{
        backgroundColor:"#613dc1",
        borderRadius:9,
        height:45,
        alignItems:"center",
        justifyContent:"center",
        bottom:0,
        marginBottom:10,
        marginHorizontal:20
    },
    loginText:{
        color:"#fff"
    }
})