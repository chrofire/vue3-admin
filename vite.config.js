import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { presetIcons, presetMini } from 'unocss'
import * as epIcons from '@iconify-json/ep'

import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

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
                safelist: [
                    ...Object.keys(epIcons.icons.icons).map(name => `i-${epIcons.icons.prefix}-${name}`)
                ]
            }),
            viteCompression(),
            visualizer({
                filename: 'visualizer.html'
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        base: env.VITE_PUBLIC_PATH,
        server: {
            port: env.VITE_PORT,
            cors: true,
            proxy: {
                [env.VITE_API_baseURL]: {
                    target: env.VITE_PROXY_TARGET,
                    changeOrigin: true
                }
            }
        },
        build: {
            rollupOptions: {
                output: {
                    // 单独 打包
                    manualChunks: {
                        'lodash-es': ['lodash-es'],
                        echarts: ['echarts'],
                        'element-plus': ['element-plus']
                    }
                }
            }
        }
    }
})