import request from '@/utils/request'

// 添加菜单
export const addData = params => {
    return request.post('/menu/add', params).then(res => res.data)
}

// 删除菜单
export const deleteData = params => {
    return request.post('/menu/delete', params).then(res => res.data)
}

// 更新菜单
export const updateData = params => {
    return request.post('/menu/update', params).then(res => res.data)
}

// 查询菜单列表
export const list = params => {
    return request.get('/menu/list', { params }).then(res => res.data)
}