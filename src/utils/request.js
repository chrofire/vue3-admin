import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_baseURL
})

instance.interceptors.request.use(config => {
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
    return Promise.reject(error.response)
})

export default instance