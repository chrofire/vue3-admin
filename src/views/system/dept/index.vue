<template>
    <div class="main-container">
        <div class="operate-list">
            <el-button type="primary" @click="DeptContentDialogRef.openDialog('add')">
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
        <DeptContentDialog
            ref="DeptContentDialogRef"
            @submit="getDataList"
            :deptList="state.deptList"
        ></DeptContentDialog>
    </div>
</template>

<script lang="jsx">
export default {
    name: 'Dept'
}
</script>

<script lang="jsx" setup>
import BasicTable, { useTable } from '@/components/BasicTable/index.vue'
import DeptContentDialog from './DeptContentDialog.vue'
import { onMounted, reactive, ref, unref } from 'vue'
import useApi from '@/api'
import { listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import { useLoading } from '@/hooks/useLoading'
import { stateMap } from './const'

const api = useApi()

const state = reactive({
    deptList: []
})

const tableContainer = ref(null)
const DeptContentDialogRef = ref(null)

const loading = useLoading({ target: tableContainer })

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
            render ({ row, column }) {
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
            render ({ row }) {
                return (
                    <>
                        <el-button
                            type="primary"
                            onClick={() => unref(DeptContentDialogRef).openDialog('update', row)}
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
    dataSource: []
})

const getDataList = async () => {
    loading.start()
    try {
        const params = {}
        const { list } = await api.system.dept.list(params)
        const sortList = list.sort((a, b) => a.order - b.order)
        state.deptList = sortList.map(item => {
            item.order === null && delete item.order
            return item
        })
        tableProps.dataSource = listToTree(cloneDeep(sortList))
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

<style lang="scss" scoped>
.main-container {
    display: flex;
    flex-flow: column nowrap;
    .table-container {
        flex: 1 0;
        min-height: 0;
    }
}
</style>