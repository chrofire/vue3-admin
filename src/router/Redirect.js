import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    setup () {
        const route = useRoute()
        const router = useRouter()
        const { params, query } = route
        const { path } = params
        router.replace({ path: `/${path}`, query })
        return () => {
            return h('div')
        }
    }
})