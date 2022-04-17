import { useSystemStore } from '@/stores/system.js'

export default {
    name: 'permission',
    mounted (el, binding, vnode) {
        const systemStore = useSystemStore()
        
        if (binding.modifiers.off) return
        
        const result = (binding.value || []).every(item => {
            if (systemStore.permissionList.includes(item)) return true
            return false
        })
        
        if (result) return

        if (el.classList.contains('el-button')) {
            el.classList.add('is-disabled')
            el.disabled = true
            return
        }

        if (el.classList.contains('el-input')) {
            el.classList.add('is-disabled')
            return
        }
        
        el.parentNode && el.parentNode.removeChild(el)
    }
}