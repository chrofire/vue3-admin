<template>
    <div class="main-container">
        <div class="left-container">
            <DeptTree ref="DeptTreeRef" @nodeChange="getDataList"></DeptTree>
        </div>
        <div class="right-container">
            <div class="search-container">
                <BasicForm @register="registerSearchForm" v-bind="searchFormProps"></BasicForm>
            </div>
            <div class="operate-list">
                <el-button type="primary" @click="UserContentDialogRef.openDialog('add')">
                    新增
                </el-button>
                <el-button type="primary" @click="getDataList">刷新</el-button>
            </div>
            <div class="table-container" ref="tableContainer">
                <BasicTable
                    ref="BasicTableRef"
                    @register="registerTable"
                    v-bind="tableProps"
                ></BasicTable>
            </div>
            <div class="pagination-container">
                <BasicPagination
                    :pagination="tableProps.pagination"
                    @paginationChange="getDataList"
                ></BasicPagination>
            </div>
        </div>
        <UserContentDialog ref="UserContentDialogRef" @submit="getDataList"></UserContentDialog>
    </div>
</template>

<script lang="jsx">
export default {
    name: 'User'
}
</script>

<script lang="jsx" setup>
import BasicTable, { useTable } from '@/components/BasicTable/index.vue'
import BasicPagination from '@/components/BasicPagination/index.vue'
import BasicForm, { useForm } from '@/components/BasicForm/index.vue'
import UserContentDialog from './UserContentDialog.vue'
import { ref, unref } from 'vue'
import api from '@/api'
import { useLoading } from '@/hooks/useLoading'
import { stateMap } from './const'
import DeptTree from './DeptTree.vue'

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
    schema: [
        {
            prop: 'username',
            label: '用户名',
            col: {
                span: 8
            },
            render: {
                component: 'el-input',
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
            render: {
                component: 'el-input',
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
            render: {
                component: 'el-select',
                props: {
                    clearable: true,
                    style: { width: '100%' }
                },
                options: [...stateMap.values()]
            }
        },
        {
            prop: '_operate',
            labelWidth: '0px',
            col: {
                span: 24
            },
            render: ({ formItem, formData }) => {
                return (
                    <div class="btn-list">
                        <el-button type="primary" onClick={() => getDataList()}>
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
            render ({ row, column }) {
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
            render ({ row }) {
                return (
                    <>
                        <el-button
                            type="primary"
                            onClick={() => unref(UserContentDialogRef).openDialog('update', row)}
                        >
                            编辑
                        </el-button>
                        <el-button type="danger" onClick={() => deleteData(row)}>
                            删除
                        </el-button>
                    </>
                )
            }
        }
    ],
    dataSource: [],
    pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
    }
})

const getDataList = async () => {
    loading.start()
    try {
        const deptId = unref(DeptTreeRef).state.currentNode
            ? unref(DeptTreeRef).state.currentNode.id
            : undefined
        const params = {
            deptId,
            ...tableProps.pagination,
            ...getSearchFormData()
        }
        const { list, ...pagination } = await api.system.user.pageList(params)
        tableProps.dataSource = list
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
