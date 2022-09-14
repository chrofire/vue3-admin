import { nextTick, onBeforeUnmount, shallowRef, unref } from 'vue'
import echarts from './lib'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import { useResizeObserver } from '@vueuse/core'

export function useChart (chartEl, options = {}) {
    const _options = {
        autoResize: false,
        renderer: 'canvas',
        theme: 'default'
    }
    if (typeof options === 'object' && options !== null) {
        Object.assign(_options, options)
    }

    // 使用渲染器
    echarts.use(_options.renderer === 'svg' ? SVGRenderer : CanvasRenderer)

    // echart实例
    const chartInstance = shallowRef(null)

    // 初始化 图表
    const init = () => {
        if (!unref(chartEl)) {
            console.warn('不存在 图表 dom')
            return
        }
        
        chartInstance.value = echarts.init(unref(chartEl), _options.theme, {
            renderer: _options.renderer
        })
    }

    // 设置 图表实例 的 配置
    async function setOption (...args) {
        if (!chartInstance.value) {
            console.warn('不存在 图表 实例')
            return
        }

        await nextTick()

        chartInstance.value.setOption(...args)
    }

    // 获取 图表 实例
    function getInstance () {
        if (!chartInstance.value) return null
        return chartInstance.value
    }

    // 调整 图表 尺寸
    function resize (...args) {
        chartInstance.value?.resize(args)
    }

    // 清空 图表 实例
    function clear () {
        chartInstance.value?.clear()
    }

    // 释放 图表 实例
    function dispose () {
        chartInstance.value?.dispose()
    }

    let firstResize = false
    // 自动 调整 图表 尺寸
    useResizeObserver(chartEl, () => {
        // 跳过首次 resize
        if (!firstResize) {
            firstResize = true
            return
        }
        _options.autoResize && resize()
    })

    onBeforeUnmount(() => {
        dispose()
        chartInstance.value = null
    })

    return {
        chartInstance,
        // methods
        init,
        setOption,
        getInstance,
        resize,
        clear,
        dispose
    }
}
