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

export const addToCart = (headers, bookId) => {
    return axios.post(`${baseUrl}/addToCart/${bookId}`,{}, headers)
}

export const removeFromCart = (headers, bookId) => {
    return axios.delete(`${baseUrl}/removeFromCart/${bookId}`, headers)
}

export const clearCart = (headers) => {
    return axios.delete(`${baseUrl}/clearCart`, headers)
}

export const deleteBook = (headers, bookId) => {
    return axios.delete(`${baseUrl}/deleteBook/${bookId}`, headers)
}

export const updateBook = (payload, bookId, headers) => {
    return axios.put(`${baseUrl}/updateBook/${bookId}`, payload, headers)
}

export const postOrder = (payload, headers) => {
    return axios.post(`${baseUrl}/postOrder`, payload, headers)
}


export default req = { login, signUp }