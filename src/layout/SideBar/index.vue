<script>
import { ElMenu, ElMenuItem, ElScrollbar, ElSubMenu } from 'element-plus'
import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system.js'

export default defineComponent({
    name: 'SideBar',
    setup (props, { attrs, slots, emit, expose }) {
        const systemStore = useSystemStore()
        const router = useRouter()
        const route = useRoute()

        const genTitle = item => {
            return h('div', { class: 'item-content' }, [
                h('div', { class: ['item-icon', item.meta.icon] }),
                h('div', { class: 'item-label' }, item.meta.name)
            ])
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
                            title: () => genTitle(item),
                            default: () => genMenuTree(item.children)
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
                        title: () => genTitle(item)
                    }
                )
            })
        }

        return () => {
            return h(
                'div',
                { class: 'side-bar' },
                h(ElScrollbar, {}, () =>
                    h(
                        ElMenu,
                        {
                            router: false,
                            defaultActive: route.meta.name
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
    width: 200px;
    height: 100%;
}
.item-content {
    display: flex;
    align-items: center;
    .item-icon {
        width: 20px;
        margin-right: 3px;
    }
}
</style>
