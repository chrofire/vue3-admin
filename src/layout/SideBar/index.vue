<script>
import { ElIcon, ElMenu, ElMenuItem, ElScrollbar, ElSubMenu } from 'element-plus'
import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system.js'

export default defineComponent({
    name: 'SideBar',
    setup (props, { attrs, slots, emit, expose }) {
        const systemStore = useSystemStore()
        const router = useRouter()
        const route = useRoute()

        const genSubMenuTitle = item => {
            return [h(ElIcon, { class: [item.meta.icon] }), h('span', item.meta.name)]
        }

        const genMenuTree = tree => {
            return tree.map(item => {
                // 目录
                if (item.meta.type === 0 && item.children && item.children.length) {
                    return h(
                        ElSubMenu,
                        {
                            index: item.meta.name
                        },
                        {
                            default: () => genMenuTree(item.children),
                            title: () => genSubMenuTitle(item)
                        }
                    )
                }

                // 不显示
                if (!item.meta.isShow) return null

                return h(
                    ElMenuItem,
                    {
                        index: item.meta.name,
                        onClick () {
                            // 外链
                            if (item.meta.isExternalLink) {
                                window.open(item.meta.fullPath)
                                return
                            }
                            router.push(item.meta.fullPath)
                        }
                    },
                    {
                        default: () => h(ElIcon, { class: [item.meta.icon] }),
                        title: () => h('span', item.meta.name)
                    }
                )
            })
        }

        return () => {
            return h(
                'div',
                { class: ['side-bar', { 'is-expand': !systemStore.sideBarCollapse }] },
                h(ElScrollbar, {}, () =>
                    h(
                        ElMenu,
                        {
                            router: false,
                            defaultActive: route.meta.name,
                            collapse: systemStore.sideBarCollapse,
                            collapseTransition: false
                        },
                        () => genMenuTree(systemStore.menuTree)
                    )
                )
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.side-bar {
    height: 100%;
    transition: width 0.4s;
    width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
    &.is-expand {
        width: 220px;
    }
    :deep() {
        .el-scrollbar__view {
            height: 100%;
        }
        .el-menu {
            height: 100%;
            border-right: none;
        }
    }
}
</style>
