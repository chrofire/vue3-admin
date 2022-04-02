<template>
    <el-pagination
        v-model:currentPage="pagination.pageNum"
        @update:currentPage="pageNumChange"
        v-model:pageSize="pagination.pageSize"
        @update:pageSize="pageSizeChange"
        :total="pagination.total"
        v-bind="{
            ...defaultProps,
            ...attrs
        }"
    >
    </el-pagination>
</template>

<script>
export default {
    name: 'BasicPagination',
    inheritAttrs: false
}
</script>

<script setup>
import { useAttrs } from 'vue'
const props = defineProps({
    pagination: {
        type: Object,
        default: () => ({
            pageNum: 1,
            pageSize: 10,
            total: 10
        })
    }
})

const attrs = useAttrs()

const emit = defineEmits(['paginationChange'])

const defaultProps = {
    background: true,
    pageSizes: [10, 50, 100, 300, 500],
    layout: `total, sizes, prev, pager, next, jumper`,
    pagerCount: 7
}

// 选中页改变
const pageNumChange = value => {
    emit('paginationChange', {
        type: 'pageNum',
        value
    })
}

// 每页条数改变
const pageSizeChange = value => {
    // 重置选中页
    props.pagination.pageNum = 1
    emit('paginationChange', {
        type: 'pageSize',
        value
    })
}
</script>

<style lang="scss" scoped></style>
