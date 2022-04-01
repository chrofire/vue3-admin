import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://cn.vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass',
                directives: true
            })]
        }),
        Components({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass',
                directives: true
            })]
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/element-preset.scss" as *;`
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
