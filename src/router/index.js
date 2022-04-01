import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/demo'
        },
        {
            path: '/demo',
            name: 'Demo',
            component: () => import('@/views/demo.vue')
        }
    ]
})

export default router
