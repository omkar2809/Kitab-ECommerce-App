import React, { Component } from 'react'
import { View } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
// import Toast from 'react-native-tiny-toast'
// import {  } from '../utils/requests'
import { getUser, isAuthenticatedAsync } from '../utils/user'
export default class Orders extends Component {
    state = {
        loading: true,
        activeSections: []
    }
    orders = []

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', async () => {
            // const toast = Toast.showLoading('Loading...')
            console.log('component')
            const isAuth = await isAuthenticatedAsync()
            console.log('isAuth',isAuth)
            if(!isAuth) {
                this.props.navigation.navigate('Login')
            }
            else {
                // let headers = {}
                // getUser()
                // .then(user => {
                //     let userData = JSON.parse(user)
                //     headers = {
                //         headers: {
                //             Authorization: userData.token
                //         }
                //     }
                //     return getSellerBooks(headers)
                // })
                // .then(res => {
                //     this.books = res.data
                //     Toast.hide(toast)
                //     this.setState({loading: false})
                // })
                // .catch(err => {
                //     console.log(err)
                //     this.setState({loading: false})
                //     Toast.hide(toast)
                //     Toast.show('Something went wrong!')
                // })
            }
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _updateSections = activeSections => {
        this.setState({ activeSections });
    }

    render() {
        return !this.state.loading ? (
            <View>
                {
                    this.orders.length == 0 ? (
                        <View>No Orders</View>
                    ) : (
                        <View>
                            <Accordion
                                sections={this.orders}
                                activeSections={this.state.activeSections}
                                renderSectionTitle={this._renderSectionTitle}
                                renderHeader={this._renderHeader}
                                renderContent={this.renderContent}
                                onChange={this._updateSections}
                            />
                        </View>
                    )
                }
            </View>
        ): (<View></View>)
    }
}
