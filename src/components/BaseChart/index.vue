<template>
    <div class="chart" ref="chartRef" v-bind="attrs"></div>
</template>

<script setup>
import { ref, onMounted, useAttrs } from 'vue'
import { useChart } from './index'

defineOptions({
    name: 'BaseChart',
    inheritAttrs: false
})

const props = defineProps({
    getRawOption: {
        type: Function,
        default: () => ({})
    }
})

const attrs = useAttrs()

const chartRef = ref(null)

const chartInfo = useChart(chartRef, { autoResize: true })

onMounted(() => {
    chartInfo.init()
    chartInfo.setOption(props.getRawOption())
})

defineExpose(chartInfo)
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>
