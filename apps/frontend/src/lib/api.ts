import axios from "axios"

const API_BASE_URL = 'http://localhost:4000'

const api = axios.create({
    baseURL : API_BASE_URL,
    headers : { 'Content-Type': 'application/json' }
})

export const authApi ={
    signup: (data: {
        firstName: string,
        lastName: string,
        email: string,
        phone?: string,
        password: string
    }) => api.post('/auth/signup', data),

    login: (data:{
        email: string,
        password: string
    }) => api.post('/auth/login', data),

    logout: (token: string) =>
        api.post('/auth/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
}

export const propertyApi = {
    create: (data: any, token: string) => 
        api.post('/properties', data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),

    getMyProperties: (token: string) =>
        api.get('/properties/my', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export default api