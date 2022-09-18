<template>
    <div class="tag-bar">
        <el-scrollbar ref="scrollbarRef">
            <div class="tag-bar-list">
                <div
                    class="tag-item"
                    v-for="item in tagBarStore.tagList"
                    :key="item.meta.id"
                    :class="{ 'current-item': route.name === item.name }"
                >
                    <div
                        class="label"
                        @click="handleRouter(item)"
                        @contextmenu="handleContextMenu($event, item)"
                    >
                        {{ item.name }}
                    </div>
                    <div
                        class="close"
                        v-if="!(tagBarStore.tagList.length === 1 && route.name === `首页`)"
                    >
                        <i class="i-ep-close" @click.prevent="handleClose(item)"></i>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { useTagBarStore } from '@/stores/tagBar.js'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContextMenu } from 'element-plus-components-lib'

const scrollbarRef = ref(null)
const tagBarStore = useTagBarStore()
const route = useRoute()
const router = useRouter()

const contextMenuInstance = shallowRef(null)
onMounted(() => {
    contextMenuInstance.value = useContextMenu({
        menuList: [
            {
                label: '重新加载',
                onClick: ({ item, state, close }) => {
                    tagBarStore.reloadTagPage(state.payload)
                    close()
                }
            },
            {
                label: '关闭全部标签页',
                onClick: ({ item, state, close }) => {
                    tagBarStore.closeAllTag()
                    close()
                }
            }
        ]
    })
})
const handleContextMenu = (e, item) => {
    contextMenuInstance.value.open(e, item)
}
onBeforeUnmount(() => {
    contextMenuInstance.value?.destroy?.()
})

const handleClose = item => {
    tagBarStore.deleteTag(item)
    tagBarStore.deleteCache(item)
    updateScrollbar()
}

const handleRouter = item => {
    router.push(item.fullPath)
}

const updateScrollbar = async () => {
    await nextTick()
    unref(scrollbarRef)?.update()
}

watch(
    () => route.path,
    () => {
        const tag = Object.assign({}, route)

        // 跳过重新向
        if (tag.fullPath.startsWith('/redirect')) return

        tagBarStore.addTag(tag)
        tagBarStore.addCache(tag)
        updateScrollbar()
    },
    {
        immediate: true
    }
)
</script>

<style lang="scss" scoped>
.tag-bar {
    height: 35px;
    border-bottom: 1px solid #eee;
    .el-scrollbar {
        height: 35px;
        :deep() {
            .el-scrollbar__view {
                height: 35px;
            }
        }
    }
    .tag-bar-list {
        height: 100%;
        display: flex;
        .tag-item {
            display: flex;
            align-items: center;
            border-bottom: 3px solid transparent;
            padding: 0 7px 0 10px;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s;
            &:hover {
                .close {
                    width: 20px;
                    height: 20px;
                }
            }
            &.current-item {
                border-bottom: 3px solid var(--el-color-primary);
                .close {
                    width: 20px;
                    height: 20px;
                }
            }
            .label {
                height: 35px;
                padding-right: 5px;
                display: flex;
                align-items: center;
                white-space: nowrap;
            }
            .close {
                width: 0;
                height: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s;
            }
        }
    }
}
</style>
