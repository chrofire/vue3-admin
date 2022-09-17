<template>
    <div class="base-page-container">
        <div class="base-search-container">
            <BaseForm @register="registerSearchForm" v-bind="searchFormProps"></BaseForm>
        </div>
        <div class="base-operate-list">
            <el-button type="primary" @click="RoleContentDialogRef.openDialog('add')" v-permission="[`system:role:add`]">
                新增
            </el-button>
            <el-button type="primary" @click="getDataList" v-permission="[`system:role:pageList`]">刷新</el-button>
        </div>
        <div class="base-table-container" ref="tableContainer">
            <BaseTable
                ref="BaseTableRef"
                @register="registerTable"
                v-bind="tableProps"
            ></BaseTable>
        </div>
        <div class="base-pagination-container">
            <BasePagination
                :pagination="tableProps.pagination"
                @change="getDataList"
            ></BasePagination>
        </div>
        <RoleContentDialog
            ref="RoleContentDialogRef"
            @submit="getDataList"
        ></RoleContentDialog>
    </div>
</template>

<script lang="jsx" setup>
import { BaseTable, useTable, BaseForm, useForm, BasePagination } from 'element-plus-components-lib'
import RoleContentDialog from './RoleContentDialog.vue'
import { onMounted, ref, unref } from 'vue'
import api from '@/api'
import { useLoading } from '@/hooks/useLoading'
import { stateMap } from './constant'

defineOptions({
    name: 'Role'
})

const tableContainer = ref(null)
const RoleContentDialogRef = ref(null)

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
            prop: 'name',
            label: '角色名称',
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
                span: 8
            },
            defaultRenderer: ({ formItem, formData }) => {
                return (
                    <div class="btn-list">
                        <el-button
                            type="primary"
                            onClick={() => getDataList()}
                            v-permission={[[`system:role:pageList`]]}
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
            prop: 'name',
            label: '角色名称'
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
                            onClick={() => unref(RoleContentDialogRef).openDialog('update', row)}
                            v-permission={[[`system:role:update`]]}
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="danger"
                            onClick={() => deleteData(row)}
                            v-permission={[[`system:role:delete`]]}
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

const getDataList = async () => {
    loading.start()
    try {
        const params = {
            ...tableProps.pagination,
            ...getSearchFormData()
        }
        const { list, ...pagination } = await api.system.role.pageList(params)
        tableProps.data = list
        tableProps.pagination = pagination
    } catch (error) {
        catchErrorMessage(error)
    } finally {
        loading.stop()
    }
}

onMounted(() => {
    getDataList()
})

const deleteData = async payload => {
    try {
        await ElMessageBox.confirm('是否删除', '警告', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await api.system.role.deleteData(payload)
        ElMessage.success('删除成功')
        getDataList()
    } catch (error) {
        if (error === `cancel`) return
        catchErrorMessage(error)
    }
}
</script>

<style lang="scss" scoped></style>
