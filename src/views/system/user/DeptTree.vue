<template>
    <div class="dept-tree" ref="deptTreeRef">
        <div class="top">
            <el-input v-model="state.inputVal" placeholder="部门名称" @keyup.enter="getDataList">
                <template #append>
                    <el-button :icon="icons.Search" @click="getDataList" />
                </template>
            </el-input>
            <div class="btn">
                <el-dropdown>
                    <ElIconRender
                        name="MoreFilled"
                        :width="22"
                        color="var(--el-color-info)"
                        :style="{
                            cursor: 'pointer'
                        }"
                    ></ElIconRender>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="() => setExpandAllNode(true)">
                                展开全部
                            </el-dropdown-item>
                            <el-dropdown-item @click="() => setExpandAllNode(false)">
                                折叠全部
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="main">
            <el-scrollbar>
                <el-tree
                    ref="treeRef"
                    :data="state.data"
                    :props="{
                        children: 'children',
                        label: 'name'
                    }"
                    :clearable="true"
                    :highlight-current="true"
                    node-key="id"
                    :expand-on-click-node="false"
                    :default-expand-all="state.expandAll"
                    @node-click="nodeClick"
                    v-bind="attrs"
                />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { h, onMounted, reactive, ref, unref, useAttrs } from 'vue'
import ElIconRender from '@/components/ElIconRender/index.vue'
import useApi from '@/api'
import { useLoading } from '@/hooks/useLoading'
import { listToTree } from '@/utils/tree'

const attrs = useAttrs()
const emit = defineEmits(['nodeChange'])

const api = useApi()

const deptTreeRef = ref(null)
const treeRef = ref(null)

const loading = useLoading({ target: deptTreeRef })

const icons = {
    Search: h(ElIconRender, { name: 'Search' })
}

const state = reactive({
    inputVal: '',
    currentNode: null,
    data: []
})

const setExpandAllNode = data => {
    Object.values(unref(treeRef).store.nodesMap).forEach(node => {
        node.expanded = data
    })
}

const nodeClick = data => {
    if (state.currentNode && data.id === state.currentNode.id) {
        unref(treeRef).setCurrentKey(null)
        state.currentNode = null
        emit('nodeChange', state.currentNode)
        return
    }
    state.currentNode = data
    emit('nodeChange', state.currentNode)
}

const getDataList = async () => {
    loading.start()
    try {
        const params = {
            name: state.inputVal,
            state: 0
        }
        const { list } = await api.system.dept.list(params)
        state.data = listToTree(list)
        emit('nodeChange', state.currentNode)
    } catch (error) {
        catchErrorMessage(error)
    } finally {
        loading.stop()
    }
}

onMounted(() => {
    getDataList()
})

defineExpose({
    state,
    treeRef,
    getDataList
})
</script>

<style lang="scss" scoped>
.dept-tree {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    background-color: #fff;
    .top {
        padding: 8px;
        display: flex;
        .btn {
            transform: rotate(90deg);
        }
    }
    .main {
        flex: 1 0;
        min-height: 0;
    }
}
</style>
