import axios from 'axios'

const baseUrl ='https://0x4e2z9u2h.execute-api.us-east-1.amazonaws.com/dev'

export const login = (payload) => {
    return axios.post(`${baseUrl}/login`, payload)
}

export const signUp = (payload) => {
    return axios.post(`${baseUrl}/signup`, payload)
}

export const uploadImageDemo = (payload) => {
    return axios.post(`${baseUrl}/uploadDemo`, payload)
}

export const addBook = (payload, headers) => {
    return axios.post(`${baseUrl}/addBook`, payload, headers)
}

export const getBooks = () => {
    return axios.get(`${baseUrl}/getBooks`)
}

export const getSellerBooks = (headers) => {
    return axios.get(`${baseUrl}/getSellerBooks`, headers)
}

export const getCart = (headers) => {
    return axios.get(`${baseUrl}/getCart`, headers)
}

export default req = { login, signUp }