<template>
    <BaseDialog @register="registerDialog" v-bind="dialogProps">
        <BaseForm @register="registerForm" v-bind="formProps"></BaseForm>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, useDialog, BaseForm, useForm } from 'element-plus-components-lib'
import { nextTick, reactive } from 'vue'
import { filterTreeItems, listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import api from '@/api'
import { stateMap } from './constant'

const props = defineProps({
    deptList: {
        type: Array,
        default: () => []
    }
})

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
            prop: 'name',
            label: '部门名称',
            rules: [
                { required: true, message: '部门名称不能为空', trigger: 'blur' },
                { min: 3, message: '部门名称长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '部门名称长度最长20个字符', trigger: 'blur' }
            ],
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'parentId',
            label: '上级部门',
            defaultRenderer: {
                component: 'tree-select',
                props: {
                    class: 'w-100%',
                    data: [],
                    nodeKey: 'id',
                    props: {
                        children: 'children',
                        label: 'name'
                    },
                    clearable: true,
                    checkStrictly: true,
                    defaultExpandAll: true,
                    renderAfterExpand: false
                }
            }
        },
        {
            prop: 'order',
            label: '排序',
            defaultRenderer: {
                component: 'input-number'
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
    const rawDeptTree = listToTree(cloneDeep(props.deptList))
    switch (type) {
        case 'add':
            Object.assign(dialogProps, {
                title: '新增部门'
            })
            formProps.items.find(item => item.prop === `parentId`).defaultRenderer.props.data
                = rawDeptTree
            break
        case 'update':
            Object.assign(dialogProps, {
                title: '编辑部门'
            })
            setFormData({ ...payload })
            formProps.items.find(item => item.prop === `parentId`).defaultRenderer.props.data
                = filterTreeItems(rawDeptTree, [payload.id])
            break
        default:
            break
    }
}

const confirmDialog = async () => {
    const { valid } = await validate()
    if (!valid) return
    const formData = { ...getFormData() }
    if (typeof formData.parentId !== 'number') formData.parentId = null
    try {
        switch (state.operationType) {
            case 'add':
                await api.system.dept.addData(formData)
                ElMessage.success('添加成功')
                break
            case 'update':
                await api.system.dept.updateData(formData)
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
    formProps.items.find(item => item.prop === `parentId`).defaultRenderer.props.data = []
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
