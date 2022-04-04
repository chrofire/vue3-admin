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
            prop: 'name',
            label: '角色名称',
            rules: [
                { required: true, message: '角色名称不能为空', trigger: 'blur' },
                { min: 3, message: '角色名称长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '角色名称长度最长20个字符', trigger: 'blur' }
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
    switch (type) {
        case 'add':
            Object.assign(dialogProps, {
                title: '新增角色'
            })
            break
        case 'update':
            Object.assign(dialogProps, {
                title: '编辑角色'
            })
            setFormData({ ...payload })
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
                await api.system.role.addData(getFormData())
                ElMessage.success('添加成功')
                break
            case 'update':
                await api.system.role.updateData(getFormData())
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

const resetData = () => {
    state.operationType = null
    resetFields()
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
