import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { presetIcons, presetMini } from 'unocss'

// https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    return {
        plugins: [
            vue(),
            vueJsx(),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
            Unocss({
                presets: [
                    presetMini(),
                    presetIcons({
                        extraProperties: {
                            display: 'inline-block',
                            'vertical-align': 'middle'
                        }
                    })
                ],
                variants: [
                    {
                        match: s => {
                            if (s.startsWith('i-')) {
                                return {
                                    matcher: s,
                                    selector: s => {
                                        return s.startsWith('.') ? `${s.slice(1)},${s}` : s
                                    }
                                }
                            }
                        }
                    }
                ],
                safelist: []
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: env.VITE_PORT,
            cors: true,
            proxy: {
                [env.VITE_API_baseURL]: {
                    target: env.VITE_PROXY_TARGET,
                    changeOrigin: true
                }
            }
        }
    }
})