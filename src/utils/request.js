import axios from 'axios'
import { useSystemStore } from '@/stores/system'
import { LocalStorage } from './storage'
import { ElLoading } from 'element-plus'

/**
 * axios 默认配置
 * @type {import('axios').AxiosRequestConfig}
 */
export const defaultConfig = {
    baseURL: import.meta.env.VITE_API_baseURL
}

/**
 * 默认自定义配置
 */
export const defaultCustomConfig = {
    // 取消重复请求
    cancelRepeatRequest: false,
    // 唯一 Loading
    uniqueLoading: false,
    // 唯一 Loading 配置
    uniqueLoadingOptions: {},
    // 是否 直接返回 后端 的 响应数据
    returnBackEndResponseDataDirectly: true
}

/**
 * 生成 axios 实例
 */
export const genAxiosInstance = (customConfig = {}) => {
    const instance = axios.create({
        ...defaultConfig
    })

    const _customConfig = {
        ...defaultCustomConfig,
        ...customConfig
    }

    // 请求拦截器
    instance.interceptors.request.use(
        config => {
            // 发送请求之前

            // 合并 自定义配置 到 config
            Object.assign(config, { customConfig: _customConfig })

            // 添加 token
            addToken(config)

            // 每次发送请求前 终止 与 该请求 相同 的 上一个 请求
            _customConfig.cancelRepeatRequest && removePending(config)
            // 将 该请求 添加到 等待队列 中
            _customConfig.cancelRepeatRequest && addPending(config)

            // 开启 唯一 Loading
            _customConfig.uniqueLoading && startUniqueLoading(config)

            return config
        },
        error => {
            // 处理请求错误
            return Promise.reject(error)
        }
    )

    // 响应拦截器
    instance.interceptors.response.use(
        response => {
            // 2xx 范围内的状态码都会触发该函数
            // 处理响应数据

            // 响应时 将 等待队列 中的 该请求 移除
            _customConfig.cancelRepeatRequest && removePending(response.config)

            // 关闭 唯一 Loading
            _customConfig.uniqueLoading && stopUniqueLoading()

            // 失败的响应
            if (!response.data.success) {
                return Promise.reject(response)
            }

            // 是否 直接返回 后端 的 响应数据
            return _customConfig.returnBackEndResponseDataDirectly ? response.data : response
        },
        error => {
            // 超出 2xx 范围的状态码都会触发该函数
            // 处理响应错误

            // 响应时 将 等待队列 中 该请求 移除
            _customConfig.cancelRepeatRequest && error.config && removePending(error.config)

            // 关闭 唯一 Loading
            _customConfig.uniqueLoading && stopUniqueLoading()

            // 根据 http状态码 处理错误
            httpStatusErrorHandler(error)

            // 打印 重复请求
            repeatRequestErrorHandler(error)

            return Promise.reject(error)
        }
    )

    return instance
}

export default genAxiosInstance()

/**
 * 添加 Token
 * @type {function (import('axios').AxiosRequestConfig)}
 */
function addToken (config) {
    const token = LocalStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
}


/** ---------- 重复请求 start ---------- */
// pending 队列
const pendingMap = new Map()

/**
 * 获取每个请求唯一的键
 * @type {function (import('axios').AxiosRequestConfig)}
 * @returns {string} pendingKey
 */
function getPendingKey (config) {
    let { url, method, params, data } = config
    // 根据 请求地址 请求方式 请求参数 拼接成 唯一的键
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 储存每个请求的取消方法, 用于取消请求
 * @type {function (import('axios').AxiosRequestConfig)}
 */
function addPending (config) {
    const pendingKey = getPendingKey(config)
    const abortController = new AbortController()
    config.signal = config.signal || abortController.signal
    if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, abortController)
    }
}

/**
 * 删除重复的请求
 * @type {function (import('axios').AxiosRequestConfig)}
 */
function removePending (config) {
    const pendingKey = getPendingKey(config)
    if (pendingMap.has(pendingKey)) {
        const abortController = pendingMap.get(pendingKey)
        // 不支持 message 参数
        // 已经响应的请求 取消无效
        abortController.abort()
        pendingMap.delete(pendingKey)
    }
}
/** ---------- 重复请求 end ---------- */


/** ---------- 唯一 Loading start ---------- */
const uniqueLoadingInfo = {
    instance: null,
    count: 0
}
/**
 * 开启唯一 Loading
 * @type {function (import('axios').AxiosRequestConfig)}
 */
function startUniqueLoading (config) {
    // 计数 +1
    uniqueLoadingInfo.count++
    // 出现首个请求的时候 开启 Loading
    if(uniqueLoadingInfo.count === 1) {
        uniqueLoadingInfo.instance = ElLoading.service(config.customConfig.uniqueLoadingOptions)
    }
}
function stopUniqueLoading () {
    // 每次调用函数 计数 -1
    if (uniqueLoadingInfo.count > 0) uniqueLoadingInfo.count--
    // 没有请求时 关闭 唯一 Loading
    if(uniqueLoadingInfo.count === 0) {
        uniqueLoadingInfo.instance.close()
        uniqueLoadingInfo.instance = null
    }
}
/** ---------- 唯一 Loading end ---------- */


/** ---------- 响应拦截 start ---------- */
/**
 * http状态码错误处理器
 * @type {function (import('axios').AxiosError)}
 */
function httpStatusErrorHandler (error) {
    // console.log(`httpStatusErrorHandler`, error)
    let message = ''
    // 请求超时 error 中 不存在 response
    if (error.response) {
        switch (error.response.status) {
            case 302:
                message = '接口重定向'
                break
            case 400:
                message = '参数不正确'
                break
            case 401:
                message = '鉴权未通过'
                unauthorizedErrorHandler()
                break
            case 403:
                message = '没有操作权限'
                break
            case 404:
                message = `请求地址出错: ${error.response.config.url}`
                break
            case 408:
                message = '请求超时'
                break
            case 409:
                message = '系统已存在相同数据'
                break
            case 500:
                message = '服务器内部错误'
                break
            case 501:
                message = '服务未实现'
                break
            case 502:
                message = '网关错误'
                break
            case 503:
                message = '服务不可用'
                break
            case 504:
                message = '服务暂时无法访问，请稍后再试'
                break
            case 505:
                message = 'HTTP版本不受支持'
                break
            default:
                message = '请求异常'
                break
        }
    }
    if (!window.navigator.onLine) message = '设备已断网'
    if (!error.response && error.message.includes('timeout')) message = '请求超时'
    // 默认 error message
    error._message = error.message
    // 重写 error message
    error.message = message
}

/**
 * 重复请求错误处理器
 * @type {function (import('axios').AxiosError)}
 */
function repeatRequestErrorHandler (error) {
    // console.log(`repeatRequestErrorHandler`, error)
    if (axios.isCancel(error)) {
        console.warn(`重复请求`)
    }
}

/**
 * 鉴权错误处理器
 */
function unauthorizedErrorHandler () {
    const systemStore = useSystemStore()
    LocalStorage.removeItem('token')
    systemStore.logout()
}
/** ---------- 响应拦截 end ---------- */