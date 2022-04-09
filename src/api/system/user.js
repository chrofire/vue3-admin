import request from '@/utils/request'

// 添加用户
export const addData = params => {
    return request.post('/user/add', params).then(res => res.data)
}

// 删除用户
export const deleteData = params => {
    return request.post('/user/delete', params).then(res => res.data)
}

// 更新用户
export const updateData = params => {
    return request.post('/user/update', params).then(res => res.data)
}

// 查询用户列表
export const list = params => {
    return request.get('/user/list', { params }).then(res => res.data)
}

// 分页查询用户列表
export const pageList = params => {
    return request.get('/user/pageList', { params }).then(res => res.data)
}

// 登录
export const login = params => {
    return request.post('/user/login', params).then(res => res.data)
}

// 查询当前用户信息
export const userInfo = params => {
    return request.get('/user/userInfo', { params }).then(res => res.data)
}
