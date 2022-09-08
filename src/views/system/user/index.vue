<template>
    <div class="main-container">
        <div class="left-container">
            <DeptTree ref="DeptTreeRef" :data="treeData" @nodeChange="getDataList"></DeptTree>
        </div>
        <div class="right-container">
            <div class="search-container">
                <BaseForm @register="registerSearchForm" v-bind="searchFormProps"></BaseForm>
            </div>
            <div class="operate-list">
                <el-button type="primary" @click="UserContentDialogRef.openDialog('add')" v-permission="[`system:user:add`]">
                    新增
                </el-button>
                <el-button type="primary" @click="getDataList" v-permission="[`system:user:pageList`]">刷新</el-button>
            </div>
            <div class="table-container" ref="tableContainer">
                <BaseTable
                    ref="BaseTableRef"
                    @register="registerTable"
                    v-bind="tableProps"
                ></BaseTable>
            </div>
            <div class="pagination-container">
                <BasePagination
                    :pagination="tableProps.pagination"
                    @change="getDataList"
                ></BasePagination>
            </div>
        </div>
        <UserContentDialog ref="UserContentDialogRef" @submit="getDataList" :treeData="treeData"></UserContentDialog>
    </div>
</template>

<script lang="jsx">
export default {
    name: 'User'
}
</script>

<script lang="jsx" setup>
import { BaseTable, useTable, BaseForm, useForm, BasePagination } from 'element-plus-components-lib'
import UserContentDialog from './UserContentDialog.vue'
import { onMounted, ref, unref } from 'vue'
import api from '@/api'
import { useLoading } from '@/hooks/useLoading'
import { stateMap } from './constant'
import DeptTree from './DeptTree.vue'
import { listToTree } from '@/utils/tree'

const tableContainer = ref(null)
const UserContentDialogRef = ref(null)
const DeptTreeRef = ref(null)

const loading = useLoading({ target: tableContainer })

const [
    registerSearchForm,
    {
        componentProps: searchFormProps,
        getFormData: getSearchFormData,
        resetFields: searchFormResetFields
    }
] = useForm({
    labelWidth: '70px',
    items: [
        {
            prop: 'username',
            label: '用户名',
            col: {
                span: 8
            },
            defaultRenderer: {
                component: 'input',
                props: {
                    clearable: true
                }
            }
        },
        {
            prop: 'nickname',
            label: '昵称',
            col: {
                span: 8
            },
            defaultRenderer: {
                component: 'input',
                props: {
                    clearable: true
                }
            }
        },
        {
            prop: 'state',
            label: '状态',
            col: {
                span: 8
            },
            defaultRenderer: {
                component: 'select',
                props: {
                    clearable: true,
                    style: { width: '100%' },
                    options: [...stateMap.values()]
                }
            }
        },
        {
            prop: '_operate',
            labelWidth: '0px',
            col: {
                span: 24
            },
            defaultRenderer: ({ formItem, formData }) => {
                return (
                    <div class="btn-list">
                        <el-button
                            type="primary"
                            onClick={() => getDataList()}
                            v-permission={[[`system:user:pageList`]]}
                        >
                            查询
                        </el-button>
                        <el-button onClick={() => searchFormResetFields()}>重置</el-button>
                    </div>
                )
            }
        }
    ],
    modelValue: {}
})

const [registerTable, { componentProps: tableProps }] = useTable({
    autoHeight: true,
    rowKey: row => row.id,
    columns: [
        {
            prop: 'username',
            label: '用户名'
        },
        {
            prop: 'nickname',
            label: '昵称'
        },
        {
            prop: 'email',
            label: '邮箱'
        },
        {
            prop: 'phone',
            label: '手机号'
        },
        {
            prop: 'state',
            label: '状态',
            cellRenderer ({ row, column }) {
                const mapItem = stateMap.get(row[column.property]) || stateMap.get(1)
                return <el-tag type={mapItem.type}>{mapItem.label}</el-tag>
            }
        },
        {
            prop: 'remark',
            label: '备注'
        },
        {
            label: '操作',
            width: 160,
            cellRenderer ({ row }) {
                return (
                    <>
                        <el-button
                            type="primary"
                            onClick={() => unref(UserContentDialogRef).openDialog('update', row)}
                            v-permission={[[`system:user:update`]]}
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="danger"
                            onClick={() => deleteData(row)}
                            v-permission={[[`system:user:delete`]]}
                        >
                            删除
                        </el-button>
                    </>
                )
            }
        }
    ],
    data: [],
    pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
    }
})

const treeData = ref([])

const getDeptTreeList = async () => {
    unref(DeptTreeRef).loading.start()
    try {
        const params = {
            name: unref(DeptTreeRef).state.inputVal,
            state: 0
        }
        const { list } = await api.system.dept.list(params)
        treeData.value = listToTree(list)
    } catch (error) {
        catchErrorMessage(error)
    } finally {
        unref(DeptTreeRef).loading.stop()
    }
}

const getDataList = async () => {
    loading.start()
    try {
        const deptId = unref(DeptTreeRef).state.currentNode?.id
        const params = {
            deptId,
            ...tableProps.pagination,
            ...getSearchFormData()
        }
        const { list, ...pagination } = await api.system.user.pageList(params)
        tableProps.data = list
        tableProps.pagination = pagination
    } catch (error) {
        catchErrorMessage(error)
    } finally {
        loading.stop()
    }
}

const deleteData = async payload => {
    try {
        await ElMessageBox.confirm('是否删除', '警告', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await api.system.user.deleteData(payload)
        ElMessage.success('删除成功')
        getDataList()
    } catch (error) {
        if (error === `cancel`) return
        catchErrorMessage(error)
    }
}

onMounted(() => {
    getDeptTreeList()
    getDataList()
})
</script>

<style lang="scss" scoped>
.main-container {
    display: flex;
    .left-container {
        width: 200px;
        margin-right: 10px;
    }
    .right-container {
        flex: 1 0;
        min-width: 0;
        display: flex;
        flex-flow: column nowrap;
        .table-container {
            flex: 1 0;
            min-height: 0;
        }
        .pagination-container {
            display: flex;
            justify-content: flex-end;
            background-color: #fff;
            padding: 6px;
            margin-top: 6px;
        }
    }
}
</style>
