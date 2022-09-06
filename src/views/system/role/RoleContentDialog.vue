<template>
    <BaseDialog @register="registerDialog" v-bind="dialogProps">
        <BaseForm @register="registerForm" v-bind="formProps">
            <template #menu>
                <el-tree
                    v-loading="state.menuTreeLoading"
                    ref="menuTreeRef"
                    :data="state.menuTreeList"
                    :props="{
                        children: 'children',
                        label: 'name'
                    }"
                    node-key="id"
                    :show-checkbox="true"
                    :default-expand-all="true"
                    :check-strictly="false"
                    :expand-on-click-node="false"
                    :check-on-click-node="true"
                    style="width: 100%;"
                ></el-tree>
            </template>
        </BaseForm>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, useDialog, BaseForm, useForm } from 'element-plus-components-lib'
import { nextTick, reactive, ref, unref } from 'vue'
import api from '@/api'
import { stateMap } from './constant'
import { listToTree } from '@/utils/tree'

const emit = defineEmits(['submit'])

const menuTreeRef = ref(null)

const state = reactive({
    operationType: null,
    menuTreeLoading: false,
    menuTreeList: []
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
            label: '角色名称',
            rules: [
                { required: true, message: '角色名称不能为空', trigger: 'blur' },
                { min: 3, message: '角色名称长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '角色名称长度最长20个字符', trigger: 'blur' }
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
            prop: 'remark',
            label: '备注',
            defaultRenderer: {
                component: 'input'
            }
        },
        {
            prop: 'menu',
            label: '菜单权限'
        }
    ],
    modelValue: {}
})

const openDialog = async (type, payload) => {
    state.operationType = type
    setDialogVisible(true)
    await nextTick()
    await getMenuList()
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
            payload.menus.forEach(item => {
                const node = unref(menuTreeRef).getNode(item)
                if (node && node.isLeaf) {
                    unref(menuTreeRef).setChecked(node, true)
                }
            })
            break
        default:
            break
    }
}

const confirmDialog = async () => {
    const checkedId = unref(menuTreeRef).getCheckedKeys()
    const halfId = unref(menuTreeRef).getHalfCheckedKeys()
    const menuIdList = [...checkedId, ...halfId]

    const { valid } = await validate()
    if (!valid) return
    try {
        switch (state.operationType) {
            case 'add':
                await api.system.role.addData({ ...getFormData(), menuIdList })
                ElMessage.success('添加成功')
                break
            case 'update':
                await api.system.role.updateData({ ...getFormData(), menuIdList })
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
    state.menuTreeList = []
}

const getMenuList = async () => {
    try {
        state.menuTreeLoading = true
        const params = {}
        const { list } = await api.system.menu.list(params)
        const tree = listToTree(list)
        state.menuTreeList = tree
    } catch (error) {
        catchErrorMessage(error)
    } finally {
        state.menuTreeLoading = false
    }
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>
