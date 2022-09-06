<template>
    <BaseDialog @register="registerDialog" v-bind="dialogProps">
        <BaseForm @register="registerForm" v-bind="formProps">
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
        </BaseForm>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, useDialog, BaseForm, useForm } from 'element-plus-components-lib'
import BasicTreeSelect from '@/components/BasicTreeSelect/index.vue'
import { nextTick, reactive, ref, unref } from 'vue'
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
            extra: {
                data: []
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
            formProps.items.find(item => item.prop === `parentId`).extra.data = rawDeptTree
            break
        case 'update':
            Object.assign(dialogProps, {
                title: '编辑部门'
            })
            setFormData({ ...payload })
            formProps.items.find(item => item.prop === `parentId`).extra.data = filterTreeItems(
                rawDeptTree,
                [payload.id]
            )
            await nextTick()
            const parentNode = props.deptList.find(item => item.id === payload.parentId)
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
    try {
        switch (state.operationType) {
            case 'add':
                await api.system.dept.addData(getFormData())
                ElMessage.success('添加成功')
                break
            case 'update':
                await api.system.dept.updateData(getFormData())
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
    formProps.items.find(item => item.prop === `parentId`).extra.data = []
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
