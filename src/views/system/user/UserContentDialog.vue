<template>
    <BaseDialog @register="registerDialog" v-bind="dialogProps">
        <BaseForm @register="registerForm" v-bind="formProps"></BaseForm>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, useDialog, BaseForm, useForm } from 'element-plus-components-lib'
import { nextTick, reactive } from 'vue'
import api from '@/api'
import { stateMap } from './constant'

const emit = defineEmits(['submit'])

const state = reactive({
    operationType: null
})

const [registerDialog, { componentProps: dialogProps, setVisible: setDialogVisible }] = useDialog({
    title: '标题',
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
    { componentProps: formProps, getFormData, setFormData, validate, resetFields }
] = useForm({
    labelWidth: '90px',
    items: [
        {
            prop: 'username',
            label: '用户名',
            rules: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                { min: 3, message: '用户名长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '用户名长度最长20个字符', trigger: 'blur' }
            ],
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'password',
            label: '密码',
            rules: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 3, message: '密码长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '密码长度最长20个字符', trigger: 'blur' }
            ],
            defaultRenderer: {
                component: 'input',
                props: {
                    type: 'password',
                    showPassword: true
                }
            },
            isShow: () => state.operationType === 'add'
        },
        {
            prop: 'nickname',
            label: '昵称',
            rules: [
                { required: true, message: '昵称不能为空', trigger: 'blur' },
                { min: 3, message: '昵称长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '昵称长度最长20个字符', trigger: 'blur' }
            ],
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'email',
            label: '邮箱',
            rules: [
                { min: 3, message: '邮箱长度最短3个字符', trigger: 'blur' },
                { max: 255, message: '邮箱长度最长255个字符', trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                        if (!value) {
                            callback()
                        } else if (!reg.test(value)) {
                            callback(new Error('邮箱格式不正确'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }
            ],
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'phone',
            label: '手机号',
            rules: [
                { min: 11, message: '手机号长度最短11个字符', trigger: 'blur' },
                { max: 11, message: '手机号长度最长11个字符', trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        const reg
                            = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
                        if (!value) {
                            callback()
                        } else if (!reg.test(value)) {
                            callback(new Error('手机号格式不正确'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }
            ],
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'state',
            label: '状态',
            rules: [{ required: true, message: '状态不能为空', trigger: 'change' }],
            defaultRenderer: {
                component: 'radio-group',
                props: {
                    type: 'button',
                    options: [...stateMap.values()],
                    optionProps: option => ({
                        key: option.value,
                        label: option.value
                    }),
                    labelRenderer: (option, rawOption) => rawOption.label
                }
            }
        },
        {
            prop: 'roleIdList',
            label: '角色',
            defaultRenderer: {
                component: 'select',
                props: {
                    size: 'default',
                    multiple: true,
                    style: {
                        width: `100%`
                    },
                    options: [],
                    optionProps: option => ({
                        key: option.id,
                        value: option.id,
                        label: option.name
                    })
                }
            }
        },
        {
            prop: 'remark',
            label: '备注',
            defaultRenderer: {
                component: 'input'
            }
        }
    ],
    modelValue: {}
})

const openDialog = async (type, payload) => {
    state.operationType = type
    setDialogVisible(true)
    await nextTick()
    await getRoleList()
    switch (type) {
        case 'add':
            Object.assign(dialogProps, {
                title: '新增用户'
            })
            break
        case 'update':
            Object.assign(dialogProps, {
                title: '编辑用户'
            })
            const roleIdList = payload.roles.map(item => item.id)
            setFormData({ ...payload, roleIdList })
            break
        default:
            break
    }
}

const confirmDialog = async () => {
    const { valid } = await validate()
    if (!valid) return
    try {
        switch (state.operationType) {
            case 'add':
                await api.system.user.addData(getFormData())
                ElMessage.success('添加成功')
                break
            case 'update':
                await api.system.user.updateData(getFormData())
                ElMessage.success('修改成功')
                break
            default:
                break
        }
        emit('submit')
        setDialogVisible(false)
    } catch (error) {
        catchErrorMessage(error)
    }
}

const getRoleList = async () => {
    try {
        const params = {
            state: 0
        }
        const { list } = await api.system.role.list(params)
        const formItem = formProps.items.find(item => item.prop === 'roleIdList')
        formItem.defaultRenderer.props.options = list
    } catch (error) {
        catchErrorMessage(error)
    }
}

const resetData = () => {
    state.operationType = null
    resetFields()
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
