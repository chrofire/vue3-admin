<template>
    <BaseDialog @register="registerDialog" v-bind="dialogProps">
        <BaseForm @register="registerForm" v-bind="formProps"></BaseForm>
    </BaseDialog>
</template>

<script lang="jsx" setup>
import { BaseDialog, useDialog, BaseForm, useForm } from 'element-plus-components-lib'
import { nextTick, reactive } from 'vue'
import { filterTreeItems, listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import api from '@/api'
import { booleanMap, stateMap, typeMap } from './constant'
import IconifySelect from '@/components/IconifySelect/index.vue'
import componentMap from '@/router/componentMap'

const props = defineProps({
    menuList: {
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
            prop: 'type',
            label: '菜单类型',
            rules: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }],
            defaultRenderer: {
                component: 'radio-group',
                props: {
                    type: 'button',
                    options: [...typeMap.values()],
                    optionProps: option => ({
                        key: option.value,
                        label: option.value
                    }),
                    labelRenderer: (option, rawOption) => rawOption.label
                }
            }
        },
        {
            prop: 'parentId',
            label: '上级菜单',
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
            prop: 'name',
            label: '菜单名称',
            rules: [
                { required: true, message: '菜单名称不能为空', trigger: 'blur' },
                { min: 1, message: '菜单名称长度最短1个字符', trigger: 'blur' },
                { max: 20, message: '菜单名称长度最长20个字符', trigger: 'blur' }
            ],
            col: {
                span: 12
            },
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'icon',
            label: '菜单图标',
            col: {
                span: 12
            },
            defaultRenderer ({ formItem, formData }) {
                return (
                    <IconifySelect
                        v-model={formData[formItem.prop]}
                        clearable
                    ></IconifySelect>
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
            defaultRenderer: {
                component: 'input'
            },
            isShow: () => [0, 1].includes(formProps.modelValue.type)
        },
        {
            prop: 'componentName',
            label: '组件',
            col: {
                span: 12
            },
            defaultRenderer: {
                component: 'select',
                props: {
                    clearable: true,
                    style: { width: '100%' },
                    options: componentMap,
                    optionProps: option => ({
                        key: option.componentName,
                        value: option.componentName,
                        label: option.desc
                    })
                }
            },
            isShow: () => [1].includes(formProps.modelValue.type)
        },
        {
            prop: 'permission',
            label: '权限标识',
            rules: [
                { required: true, message: '权限标识不能为空', trigger: 'blur' },
                { max: 255, message: '权限标识长度最长255个字符', trigger: 'blur' }
            ],
            defaultRenderer: {
                component: 'input'
            },
            isShow: () => [2].includes(formProps.modelValue.type)
        },
        {
            prop: 'order',
            label: '排序',
            col: {
                span: 24
            },
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
            prop: 'isCache',
            label: '是否缓存',
            rules: [{ required: true, message: '是否缓存不能为空', trigger: 'change' }],
            defaultRenderer: {
                component: 'radio-group',
                props: {
                    type: 'button',
                    options: [...booleanMap.values()],
                    optionProps: option => ({
                        key: option.value,
                        label: option.value
                    }),
                    labelRenderer: (option, rawOption) => rawOption.label
                }
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
            defaultRenderer: {
                component: 'radio-group',
                props: {
                    type: 'button',
                    options: [...booleanMap.values()],
                    optionProps: option => ({
                        key: option.value,
                        label: option.value
                    }),
                    labelRenderer: (option, rawOption) => rawOption.label
                }
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
            defaultRenderer: {
                component: 'radio-group',
                props: {
                    type: 'button',
                    options: [...booleanMap.values()],
                    optionProps: option => ({
                        key: option.value,
                        label: option.value
                    }),
                    labelRenderer: (option, rawOption) => rawOption.label
                }
            },
            isShow: () => [0, 1].includes(formProps.modelValue.type)
        },
        {
            prop: 'remark',
            label: '备注',
            defaultRenderer: {
                component: 'input'
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
    const rawMenuTree = listToTree(cloneDeep(props.menuList.filter(item => item.type !== 2)))
    switch (type) {
        case 'add':
            Object.assign(dialogProps, {
                title: '新增菜单'
            })
            formProps.items.find(item => item.prop === `parentId`).defaultRenderer.props.data = rawMenuTree
            break
        case 'update':
            Object.assign(dialogProps, {
                title: '编辑菜单'
            })
            setFormData({ ...payload })
            formProps.items.find(item => item.prop === `parentId`).defaultRenderer.props.data = filterTreeItems(
                rawMenuTree,
                [payload.id]
            )
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
    formProps.modelValue = {
        type: 0
    }
    formProps.items.find(item => item.prop === `parentId`).defaultRenderer.props.data = []
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
