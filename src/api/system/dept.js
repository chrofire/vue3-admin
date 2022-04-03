import request from '@/utils/request'

// 添加部门
export const addData = params => {
    return request.post('/dept/add', params).then(res => res.data)
}

// 删除部门
export const deleteData = params => {
    return request.post('/dept/delete', params).then(res => res.data)
}

// 更新部门
export const updateData = params => {
    return request.post('/dept/update', params).then(res => res.data)
}

// 查询部门列表
export const list = params => {
    return request.get('/dept/list', { params }).then(res => res.data)
}