export default [
    {
        componentName: 'Dept',
        desc: '部门管理',
        component: () => import('@/views/system/dept/index.vue')
    },
    {
        componentName: 'Role',
        desc: '角色管理',
        component: () => import('@/views/system/role/index.vue')
    },
    {
        componentName: 'User',
        desc: '用户管理',
        component: () => import('@/views/system/user/index.vue')
    },
    {
        componentName: 'Menu',
        desc: '菜单管理',
        component: () => import('@/views/system/menu/index.vue')
    }
]