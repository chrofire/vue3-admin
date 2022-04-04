import request from '@/utils/request'

// 添加角色
export const addData = params => {
    return request.post('/role/add', params).then(res => res.data)
}

// 删除角色
export const deleteData = params => {
    return request.post('/role/delete', params).then(res => res.data)
}

// 更新角色
export const updateData = params => {
    return request.post('/role/update', params).then(res => res.data)
}

// 查询角色列表
export const list = params => {
    return request.get('/role/list', { params }).then(res => res.data)
}

// 分页查询角色列表
export const pageList = params => {
    return request.get('/role/pageList', { params }).then(res => res.data)
}
