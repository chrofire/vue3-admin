<template>
    <div class="demo">
        <div class="action-list">
            <el-input-number
                v-model="state.dataSourceLength"
                @keyup.enter="setDataSource"
            ></el-input-number>
            <el-button type="primary" @click="setDataSource">setDataSource</el-button>
            <el-button type="primary" @click="tableProps.autoHeight = !tableProps.autoHeight">
                autoHeight: {{ tableProps.autoHeight }}
            </el-button>
            <el-button type="primary" @click="handleSingleSelect">handleSingleSelect</el-button>
            <el-button type="primary" @click="handleMultipleSelect">handleMultipleSelect</el-button>
        </div>
        <div class="table-container">
            <BasicTable @register="registerTable" v-bind="tableProps"></BasicTable>
        </div>
    </div>
</template>

<script lang="jsx" setup>
import BasicTable, { useTable } from '@/components/BasicTable/index.vue'
import { nextTick, reactive } from 'vue'

const state = reactive({
    dataSourceLength: 10
})

const setDataSource = async () => {
    tableProps.dataSource = []
    await nextTick()
    tableProps.dataSource = Array.from({ length: state.dataSourceLength }, (_, i) => {
        return {
            id: i,
            col1: `col1-${i}`,
            col2: `col2-${i}`,
            col3: Math.round(Math.random())
        }
    })
}

const [
    registerTable,
    {
        componentProps: tableProps,
        getInstance,
        setSingleSelect,
        getSingleSelect,
        setMultipleSelect,
        setSingleItemMultipleSelect,
        getMultipleSelect
    }
] = useTable({
    autoHeight: true,
    // singleSelect: true,
    // singleItemMultipleSelect: true,
    rowKey: row => row.id,
    columns: [
        {
            type: 'index'
        },
        {
            type: 'selection'
        },
        {
            prop: 'col1',
            label: '列1',
            width: 300
        },
        {
            prop: 'col2',
            label: '列2'
        },
        {
            prop: 'col3',
            label: '列3',
            width: 200,
            render ({ row, column }) {
                const map = {
                    0: `状态0`,
                    1: `状态1`
                }
                const val = row[column.property]
                return <el-tag type={val === 0 ? 'success' : 'danger'}>{map[val]}</el-tag>
            }
        }
    ],
    dataSource: []
})

const handleSingleSelect = () => {
    if (!tableProps.dataSource.length) return
    setSingleSelect(tableProps.dataSource[0])
    console.log(getSingleSelect())
}

const handleMultipleSelect = () => {
    if (!tableProps.dataSource.length) return
    setMultipleSelect(tableProps.dataSource.slice(0, 2))
}
</script>

<style lang="scss" scoped>
.demo {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    .action-list {
        display: flex;
        .el-input-number {
            margin-right: 10px;
        }
    }
    .table-container {
        flex: 1 0;
        min-height: 0;
    }
}
</style>
