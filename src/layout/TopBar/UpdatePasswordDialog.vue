<template>
    <BasicDialog @register="registerDialog" v-bind="dialogProps">
        <BasicForm @register="registerForm" v-bind="formProps"></BasicForm>
    </BasicDialog>
</template>

<script setup>
import BasicDialog, { useDialog } from '@/components/BasicDialog/index.vue'
import BasicForm, { useForm } from '@/components/BasicForm/index.vue'
import api from '@/api'

const [registerDialog, { componentProps: dialogProps, setVisible: setDialogVisible }] = useDialog({
    title: '修改密码',
    confirmProps: {
        onClick: () => confirmDialog()
    },
    cancelProps: {
        onClick: () => setDialogVisible(false)
    },
    onClose () {
        resetData()
    }
})

const [
    registerForm,
    { componentProps: formProps, getFormData, validate, resetFields }
] = useForm({
    labelWidth: '70px',
    formItems: [
        {
            prop: 'oldPassword',
            label: '旧密码',
            rules: [
                { required: true, message: '旧密码不能为空', trigger: 'blur' },
                { min: 3, message: '旧密码长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '旧密码长度最长20个字符', trigger: 'blur' }
            ],
            render: {
                component: 'el-input',
                props: {
                    type: 'password',
                    showPassword: true
                }
            }
        },
        {
            prop: 'password',
            label: '新密码',
            rules: [
                { required: true, message: '新密码不能为空', trigger: 'blur' },
                { min: 3, message: '新密码长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '新密码长度最长20个字符', trigger: 'blur' }
            ],
            render: {
                component: 'el-input',
                props: {
                    type: 'password',
                    showPassword: true
                }
            }
        }
    ],
    modelValue: {}
})

const openDialog = async () => {
    setDialogVisible(true)
}

const confirmDialog = async () => {
    const { valid } = await validate()
    if (!valid) return
    try {
        await api.system.user.updatePassword(getFormData())
        ElMessage.success('修改成功')
        setDialogVisible(false)
    } catch (error) {
        catchErrorMessage(error)
    }
}

const resetData = () => {
    resetFields()
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
