import { defineStore } from 'pinia'
import router from '@/router'

export const useTagBarStore = defineStore('tagBar', {
    state: () => ({
        tagList: [],
        cacheList: []
    }),
    actions: {
        addTag (tag) {
            if (this.tagList.find(item => item.name === tag.name)) return
            this.tagList.push(tag)
        },
        deleteTag (tag) {
            const index = this.tagList.findIndex(item => item.name === tag.name)
            if (index === -1) return

            const {
                currentRoute: {
                    value: { name }
                }
            } = router
            
            this.tagList.splice(index, 1)

            if (this.tagList.length === 0) {
                router.push('/home')
                return
            }

            if (tag.name === name) {
                router.push(this.tagList[this.tagList.length - 1].fullPath)
                return
            }
        },
        addCache (tag) {
            if (!tag.meta.isCache) return
            if (this.cacheList.includes(tag.meta.componentName)) return
            this.cacheList.push(tag.meta.componentName)
        },
        deleteCache (tag) {
            this.cacheList = this.cacheList.filter(item => item !== tag.meta.componentName)
        },
        reloadTagPage (tag) {
            this.deleteCache(tag)
            router.replace({ path: '/redirect' + tag.fullPath })
        },
        async closeAllTag () {
            this.$reset()
            setTimeout(() => {
                router.replace({ path: '/redirect' + '/home' })
            }, 60)
        }
    }
})
