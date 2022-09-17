<template>
    <div class="base-page-container">
        <div class="base-search-container">
            <BaseForm @register="registerSearchForm" v-bind="searchFormProps"></BaseForm>
        </div>
        <div class="base-operate-list">
            <el-button type="primary" @click="DeptContentDialogRef.openDialog('add')" v-permission="[`system:dept:add`]">
                新增
            </el-button>
            <el-button type="primary" @click="getDataList" v-permission="[`system:dept:list`]">刷新</el-button>
        </div>
        <div class="base-table-container" ref="tableContainer">
            <BaseTable
                ref="BaseTableRef"
                @register="registerTable"
                v-bind="tableProps"
            ></BaseTable>
        </div>
        <DeptContentDialog
            ref="DeptContentDialogRef"
            @submit="getDataList"
            :deptList="state.deptList"
        ></DeptContentDialog>
    </div>
</template>

<script lang="jsx" setup>
import { BaseTable, useTable, BaseForm, useForm } from 'element-plus-components-lib'
import DeptContentDialog from './DeptContentDialog.vue'
import { onMounted, reactive, ref, unref } from 'vue'
import api from '@/api'
import { listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import { useLoading } from '@/hooks/useLoading'
import { stateMap } from './constant'

defineOptions({
    name: 'Dept'
})

const state = reactive({
    deptList: []
})

const tableContainer = ref(null)
const DeptContentDialogRef = ref(null)

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
            label: '部门名称',
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
                            v-permission={[[`system:dept:list`]]}
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
            label: '部门名称'
        },
        {
            prop: 'order',
            label: '排序'
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
            prop: 'createAt',
            label: '创建时间'
        },
        {
            prop: 'updateAt',
            label: '更新时间'
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
                            onClick={() => unref(DeptContentDialogRef).openDialog('update', row)}
                            v-permission={[[`system:dept:update`]]}
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="danger"
                            onClick={() => deleteData(row)}
                            v-permission={[[`system:dept:delete`]]}
                        >
                            删除
                        </el-button>
                    </>
                )
            }
        }
    ],
    data: []
})

const getDataList = async () => {
    loading.start()
    try {
        const params = {
            ...getSearchFormData()
        }
        const { list } = await api.system.dept.list(params)
        const sortList = list.sort((a, b) => a.order - b.order)
        state.deptList = sortList.map(item => {
            item.order === null && delete item.order
            return item
        })
        tableProps.data = listToTree(cloneDeep(sortList))
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
        await api.system.dept.deleteData(payload)
        ElMessage.success('删除成功')
        getDataList()
    } catch (error) {
        if (error === `cancel`) return
        catchErrorMessage(error)
    }
}
</script>

<style lang="scss" scoped></style>
