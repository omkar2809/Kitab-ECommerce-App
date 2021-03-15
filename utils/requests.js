import axios from 'axios'

const baseUrl ='https://0x4e2z9u2h.execute-api.us-east-1.amazonaws.com/dev'

export const login = (payload) => {
    return axios.post(`${baseUrl}/login`, payload)
}

export const signUp = (payload) => {
    return axios.post(`${baseUrl}/signup`, payload)
}

export default req = { login, signUp }