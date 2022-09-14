import { defineStore } from 'pinia'
import api from '@/api'
import { LocalStorage } from '@/utils/storage'
import { listToTree } from '@/utils/tree'
import router, { HomeRoute } from '@/router'
import componentMap from '@/router/componentMap'
import Layout from '@/layout/index.vue'
import NotFound from '@/views/exceptionPage/notFound.vue'
import { markRaw } from 'vue'
import { useTagBarStore } from '@/stores/tagBar.js'

export const useSystemStore = defineStore('system', {
    state: () => ({
        userInfo: {},
        isLogin: false,
        rawMenuList: [],
        menuTree: [],
        permissionList: [],
        addRouteList: [],
        sideBarCollapse: false
    }),
    actions: {
        async login (params) {
            const { token } = await api.system.user.login(params)
            LocalStorage.setItem('token', token)
        },
        async initUserInfo () {
            const { menus, permissions, ...args } = await api.system.user.userInfo()
            this.userInfo = args
            this.rawMenuList = menus
            this.permissionList = permissions.map(item => item.permission)
            const rawMenuTree = listToTree(menus)
            const _menuTree = buildMenuTree(rawMenuTree)
            this.menuTree = [HomeRoute].concat(_menuTree.filter(item => item.meta.parentId === null))
            this.addRouteList = buildRouteTree(_menuTree)
            this.isLogin = true
        },
        addRoutes () {
            this.addRouteList.forEach(route => {
                router.addRoute(route)
            })
        },
        removeRoutes () {
            this.addRouteList.forEach(route => {
                router.removeRoute(route.name)
            })
        },
        async logout () {
            const tagBarStore = useTagBarStore()
            LocalStorage.removeItem('token')
            await router.replace('/login')
            this.removeRoutes()
            this.$reset()
            tagBarStore.$reset()
        },
        toggleSideBarCollapse () {
            return this.sideBarCollapse = !this.sideBarCollapse
        }
    }
})

function buildMenuTree (tree = [], parentNode) {
    return tree.map(item => {
        const meta = { ...item }
        delete meta.children

        const record = {
            meta
        }

        if (!record.meta.isExternalLink) {
            // 不是外链

            // 菜单
            if (record.meta.type === 1) {
                // 替换组件
                const Comp
                    = componentMap.find(item => item.componentName === record.meta.componentName)
                        ?.component || NotFound
                record.meta.component = markRaw(Comp)
                record.component = record.meta.component
            }

            // 是否具有父节点
            if (!parentNode) {
                record.meta.fullPath = `/${record.meta.path}`
                record.meta.breadcrumb = [record]
            } else {
                record.meta.fullPath = `${parentNode.meta.fullPath}/${record.meta.path}`
                record.meta.breadcrumb = [...parentNode.meta.breadcrumb, record]
            }

            record.path = record.meta.fullPath
            record.name = record.meta.name
        } else {
            // 是外链
            record.meta.fullPath = record.meta.path
        }

        // 递归children
        record.children = buildMenuTree(item.children, record)
        return record
    })
}

function buildRouteTree (tree = []) {
    const layoutRoute = {
        path: '/_layout',
        name: '_Layout',
        component: markRaw(Layout),
        children: [HomeRoute]
    }

    const result = tree.map(route => {
        const children = []

        // 第一层 是外链
        if (route.meta.isExternalLink) return null

        if (!route.children.length && route.meta.parentId === null) {
            layoutRoute.children.push(route)
            return
        }

        flatChildren(children, route)
        return {
            ...route,
            children,
            component: markRaw(Layout)
        }
    })
    return result.filter(Boolean).concat(layoutRoute)
    function flatChildren (children, route) {
        if (!route.children.length) {
            route.meta.type === 1 && children.push(route)
            return
        }

        route.children.forEach(child => {
            flatChildren(children, child)
        })
    }
}
