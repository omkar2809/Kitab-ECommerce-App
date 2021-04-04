import * as SecureStore from 'expo-secure-store'
import jwtDecode from 'jwt-decode'

export const setUserData = (data) => {
    const decodedToken = jwtDecode(data.token)
    console.log(decodedToken)
    return SecureStore.setItemAsync('userData', JSON.stringify({...decodedToken, token: `Bearer ${data.token}`}))
}

export const deleteUser = () => {
    return SecureStore.deleteItemAsync('userData')
}

export const getUser = () => {
    return SecureStore.getItemAsync('userData')
}

export const isAuthenticatedAsync = async () => {
    try {
        const user = await getUser()
        let userData = JSON.parse(user);
        console.log(userData)
        if(!userData) return false
        if(userData && userData.exp * 1000 < Date.now()) {
            deleteUser()
            return false
        }
        else return true
    }
    catch(err) {
        return false
    }
}

export const isAuthenticated = (user = undefined) => {
    console.log('in auth')
    if(user) {
        console.log('here')
        console.log(user)
        if(user.exp * 1000 < Date.now()) {
            deleteUser()
            console.log('delete old user after expiry')
            return false
        }
        else return true
    }
    getUser()
    .then(user => {
        let userData = JSON.parse(user);
        console.log(userData)
        if(userData && userData.exp * 1000 < Date.now()) {
            deleteUser()
            return false
        }
        else return true
    })
    .catch(err => {
        console.log(err)
        return false
    })
}

// export default req = { setUserData, deleteUser, getUser, isAuthenticated }