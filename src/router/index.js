import { markRaw } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useSystemStore } from '@/stores/system.js'
import Login from '@/views/login/index.vue'
import NotFound from '@/views/exceptionPage/notFound.vue'
import Home from '@/views/home/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})

export default router

export const HomeRoute = {
    path: '/home',
    name: 'Home',
    component: markRaw(Home),
    children: [],
    meta: {
        fullPath: '/home',
        name: '首页',
        type: 1,
        isExternalLink: false,
        isShow: true,
        isCache: true
    }
}

const whiteList = ['/login']

router.beforeEach(async (to, from) => {
    const systemStore = useSystemStore()
    const token = localStorage.getItem('token')
    if (whiteList.includes(to.path)) {
        return true
    }
    if (token) {
        if (!systemStore.isLogin) {
            try {
                await systemStore.initUserInfo()
                systemStore.addRoutes()
            } catch (error) {
                return { path: `/login`, replace: true }
            }
            return { path: to.path }
        } else {
            return true
        }
    } else {
        return { path: `/login`, replace: true }
    }
})