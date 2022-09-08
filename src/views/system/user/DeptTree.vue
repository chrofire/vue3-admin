<template>
    <div class="dept-tree" ref="deptTreeRef">
        <div class="top">
            <el-input v-model="state.inputVal" placeholder="部门名称"></el-input>
            <div class="btn">
                <el-dropdown>
                    <i class="i-ep-more-filled w-22px h-22px text-$el-color-info cursor-pointer"></i>
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
                    :props="{
                        children: 'children',
                        label: 'name'
                    }"
                    :clearable="true"
                    :highlight-current="true"
                    node-key="id"
                    :expand-on-click-node="false"
                    :default-expand-all="true"
                    @node-click="nodeClick"
                    :filter-node-method="filterNode"
                    v-bind="attrs"
                />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, unref, useAttrs, watch } from 'vue'
import { useLoading } from '@/hooks/useLoading'

const attrs = useAttrs()
const emit = defineEmits(['nodeChange'])

const deptTreeRef = ref(null)
const treeRef = ref(null)

const loading = useLoading({ target: deptTreeRef })

const state = reactive({
    inputVal: '',
    currentNode: null
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

watch(() => state.inputVal, val => {
    treeRef.value.filter(val)
})

const filterNode = (value, data) => {
    if (!value) return true
    return data.name.includes(value)
}

defineExpose({
    state,
    treeRef,
    loading
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
