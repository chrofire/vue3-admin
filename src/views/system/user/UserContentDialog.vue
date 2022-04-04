<template>
    <BasicDialog @register="registerDialog" v-bind="dialogProps">
        <BasicForm @register="registerForm" v-bind="formProps"></BasicForm>
    </BasicDialog>
</template>

<script setup>
import BasicDialog, { useDialog } from '@/components/BasicDialog/index.vue'
import BasicForm, { useForm } from '@/components/BasicForm/index.vue'
import { nextTick, reactive } from 'vue'
import useApi from '@/api'
import { stateMap } from './const'

const api = useApi()

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
    schema: [
        {
            prop: 'username',
            label: '用户名',
            rules: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                { min: 3, message: '用户名长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '用户名长度最长20个字符', trigger: 'blur' }
            ],
            render: {
                component: 'el-input'
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
            render: {
                component: 'el-input',
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
            render: {
                component: 'el-input'
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
            render: {
                component: 'el-input'
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
            render: {
                component: 'el-input'
            }
        },
        {
            prop: 'state',
            label: '状态',
            rules: [{ required: true, message: '状态不能为空', trigger: 'change' }],
            render: {
                component: 'el-radio-group',
                type: 'button',
                options: [...stateMap.values()],
                optionProps: option => ({
                    key: option.value,
                    label: option.value
                }),
                optionSlots: option => option.label
            }
        },
        {
            prop: 'roleIdList',
            label: '角色',
            render: {
                component: 'el-select',
                options: [],
                optionProps: option => ({
                    key: option.id,
                    value: option.id,
                    label: option.name
                }),
                props: {
                    size: 'default',
                    multiple: true,
                    style: {
                        width: `100%`
                    }
                }
            }
        },
        {
            prop: 'remark',
            label: '备注',
            render: {
                component: 'el-input'
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
        const schemaItem = formProps.schema.find(item => item.prop === 'roleIdList')
        schemaItem.render.options = list
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
