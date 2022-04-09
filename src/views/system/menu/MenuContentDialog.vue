<template>
    <BasicDialog @register="registerDialog" v-bind="dialogProps">
        <BasicForm @register="registerForm" v-bind="formProps">
            <template #parentId="{ formItem, formData }">
                <BasicTreeSelect
                    v-model="formData[formItem.prop]"
                    ref="parentIdTreeSelectRef"
                    :data="formItem.extra.data"
                    :props="{
                        children: 'children',
                        label: 'name'
                    }"
                    :clearable="true"
                    :highlight-current="true"
                    node-key="id"
                    :expand-on-click-node="false"
                    @node-click="
                        (data) => {
                            // 修改表单值
                            formData[formItem.prop] = data.id
                            // 修改输入框值
                            parentIdTreeSelectRef.state.inputVal = data.name
                        }
                    "
                ></BasicTreeSelect>
            </template>
        </BasicForm>
    </BasicDialog>
</template>

<script lang="jsx" setup>
import BasicDialog, { useDialog } from '@/components/BasicDialog/index.vue'
import BasicForm, { useForm } from '@/components/BasicForm/index.vue'
import BasicTreeSelect from '@/components/BasicTreeSelect/index.vue'
import { nextTick, reactive, ref, unref } from 'vue'
import { filterTreeItems, listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import api from '@/api'
import { booleanMap, stateMap, typeMap } from './const'
import ElIconSelect from '@/components/ElIconSelect/index.vue'
import componentMap from '@/router/componentMap'

const props = defineProps({
    menuList: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['submit'])

const parentIdTreeSelectRef = ref(null)

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
    formItems: [
        {
            prop: 'type',
            label: '菜单类型',
            rules: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }],
            render: {
                component: 'el-radio-group',
                type: 'button',
                options: [...typeMap.values()],
                optionProps: option => ({
                    key: option.value,
                    label: option.value
                }),
                optionSlots: option => option.label
            }
        },
        {
            prop: 'parentId',
            label: '上级菜单',
            extra: {
                data: []
            }
        },
        {
            prop: 'name',
            label: '菜单名称',
            rules: [
                { required: true, message: '菜单名称不能为空', trigger: 'blur' },
                { min: 3, message: '菜单名称长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '菜单名称长度最长20个字符', trigger: 'blur' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-input'
            }
        },
        {
            prop: 'icon',
            label: '菜单图标',
            col: {
                span: 12
            },
            render ({ formItem, formData }) {
                return (
                    <ElIconSelect
                        v-model={formData[formItem.prop]}
                        clearable
                        style="width: 100%;"
                    ></ElIconSelect>
                )
            },
            isShow: () => [0, 1].includes(formProps.modelValue.type)
        },
        {
            prop: 'path',
            label: '路由路径',
            rules: [
                { required: true, message: '路由路径不能为空', trigger: 'blur' },
                { max: 255, message: '路由路径长度最长255个字符', trigger: 'blur' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-input'
            },
            isShow: () => [0, 1].includes(formProps.modelValue.type)
        },
        {
            prop: 'componentName',
            label: '组件',
            col: {
                span: 12
            },
            render: {
                component: 'el-select',
                props: {
                    clearable: true,
                    style: { width: '100%' }
                },
                options: componentMap,
                optionProps: option => ({
                    key: option.componentName,
                    value: option.componentName,
                    label: option.desc
                })
            },
            isShow: () => [1].includes(formProps.modelValue.type)
        },
        {
            prop: 'permission',
            label: '权限标识',
            rules: [
                { required: true, message: '权限标识不能为空', trigger: 'blur' },
                { min: 3, message: '权限标识长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '权限标识长度最长20个字符', trigger: 'blur' }
            ],
            render: {
                component: 'el-input'
            },
            isShow: () => [2].includes(formProps.modelValue.type)
        },
        {
            prop: 'order',
            label: '排序',
            col: {
                span: 24
            },
            render: {
                component: 'el-input-number'
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
            prop: 'isCache',
            label: '是否缓存',
            rules: [{ required: true, message: '是否缓存不能为空', trigger: 'change' }],
            render: {
                component: 'el-radio-group',
                type: 'button',
                options: [...booleanMap.values()],
                optionProps: option => ({
                    key: option.value,
                    label: option.value
                }),
                optionSlots: option => option.label
            },
            isShow: () => [1].includes(formProps.modelValue.type)
        },
        {
            prop: 'isExternalLink',
            label: '是否外链',
            rules: [{ required: true, message: '是否外链不能为空', trigger: 'change' }],
            col: {
                span: 12
            },
            render: {
                component: 'el-radio-group',
                type: 'button',
                options: [...booleanMap.values()],
                optionProps: option => ({
                    key: option.value,
                    label: option.value
                }),
                optionSlots: option => option.label
            },
            isShow: () => [1].includes(formProps.modelValue.type)
        },
        {
            prop: 'isShow',
            label: '是否显示',
            rules: [{ required: true, message: '是否显示不能为空', trigger: 'change' }],
            col: {
                span: 12
            },
            render: {
                component: 'el-radio-group',
                type: 'button',
                options: [...booleanMap.values()],
                optionProps: option => ({
                    key: option.value,
                    label: option.value
                }),
                optionSlots: option => option.label
            },
            isShow: () => [0, 1].includes(formProps.modelValue.type)
        },
        {
            prop: 'remark',
            label: '备注',
            render: {
                component: 'el-input'
            }
        }
    ],
    modelValue: {
        type: 0
    }
})

const openDialog = async (type, payload) => {
    state.operationType = type
    setDialogVisible(true)
    await nextTick()
    const rawMenuTree = listToTree(cloneDeep(props.menuList))
    switch (type) {
        case 'add':
            Object.assign(dialogProps, {
                title: '新增菜单'
            })
            formProps.formItems.find(item => item.prop === `parentId`).extra.data = rawMenuTree
            break
        case 'update':
            Object.assign(dialogProps, {
                title: '编辑菜单'
            })
            setFormData({ ...payload })
            formProps.formItems.find(item => item.prop === `parentId`).extra.data = filterTreeItems(
                rawMenuTree,
                [payload.id]
            )
            await nextTick()
            const parentNode = props.menuList.find(item => item.id === payload.parentId)
            unref(parentIdTreeSelectRef).treeRef.setCurrentKey(parentNode?.id)
            unref(parentIdTreeSelectRef).state.inputVal = parentNode?.name
            break
        default:
            break
    }
}

const confirmDialog = async () => {
    const { valid } = await validate()
    if (!valid) return
    const formData = getFormData()
    if (typeof formData.parentId === 'undefined') {
        formData.parentId = null
    }
    try {
        switch (state.operationType) {
            case 'add':
                await api.system.menu.addData(formData)
                ElMessage.success('添加成功')
                break
            case 'update':
                await api.system.menu.updateData(formData)
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
    unref(parentIdTreeSelectRef).resetField()
    formProps.formItems.find(item => item.prop === `parentId`).extra.data = []
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
