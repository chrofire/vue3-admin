import axios from 'axios'
import { useSystemStore } from '@/stores/system.js'
import { LocalStorage } from './storage'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_baseURL
})

instance.interceptors.request.use(config => {
    const token = LocalStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    if (!response.data.success) {
        return Promise.reject(response)
    }
    return response.data
}, error => {
    const systemStore = useSystemStore()
    switch (error.response.status) {
        case 401:
            LocalStorage.removeItem('token')
            systemStore.logout()
            break
        default:
            break
    }
    return Promise.reject(error.response)
})

export default instance