import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/layout'
        },
        {
            path: '/layout',
            name: 'Layout',
            component: () => import('@/layout/index.vue'),
            children: [
                {
                    path: 'dept',
                    name: 'Dept',
                    component: () => import('@/views/system/dept/index.vue')
                }
            ]
        }
    ]
})

export default router
