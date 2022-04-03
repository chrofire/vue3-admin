import { ElMessage } from 'element-plus'

export const catchErrorMessage = error => {
    ElMessage.error(error?.data?.message || error?.message || '错误')
}