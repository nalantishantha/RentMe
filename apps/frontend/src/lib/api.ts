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
        }),
    
    getAllProperties: (search?: string) =>
        api.get('/properties', {
            params: search ? { search } : {}
        })
}

export const userApi = {
    createUser: (data: any, token: string) =>
        api.post('/users', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),

    getUsers: (page: number, limit: number, search: string, token: string) =>
        api.get('/users', {
            params: { page, limit, search },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    
    getUserDetails: (id: number, token: string) =>
        api.get(`/users/${id}/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    
    updateUser: (id: number, data: any, token: string) =>
        api.patch(`/users/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    
    deleteUser: (id: number, token: string) =>
        api.delete(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    
    setInactive: (id: number, token: string) =>
        api.patch(`/users/${id}/inactive`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    
    setActive: (id: number, token: string) =>
        api.patch(`/users/${id}/active`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export const permissionApi = {
    getPermissions: (token?: string) =>
        api.get('/permissions', token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : {}),
    
    getPermission: (id: number, token?: string) =>
        api.get(`/permissions/${id}`, token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : {}),
    
    createPermission: (data: any, token?: string) =>
        api.post('/permissions', data, token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : {}),
    
    updatePermission: (id: number, data: any, token?: string) =>
        api.patch(`/permissions/${id}`, data, token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : {}),
    
    deletePermission: (id: number, token?: string) =>
        api.delete(`/permissions/${id}`, token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : {})
}

export default api