<template>
    <div class="w-100% h-100% overflow-auto p-20px">
        <el-row class="w-100%" :gutter="20">
            <el-col :span="12">
                <div>BaseChart 组件</div>
                <BaseChart class="h-50vh!" ref="BaseChartRef" :getRawOption="getRawOption1"></BaseChart>
            </el-col>
            <el-col :span="12">
                <div>useChart hook</div>
                <div class="h-50vh!" ref="chartRef"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BaseChart, useChart } from '@/components/BaseChart'

defineOptions({
    name: 'Chart'
})

const BaseChartRef = ref(null)

const chartRef = ref(null)
const chartInfo = useChart(chartRef, { autoResize: true })

onMounted(() => {
    BaseChartRef.value.setOption({
        series: [
            {
                data: [100, 200, 300, 400, 500, 600, 500]
            }
        ]
    })

    chartInfo.init()
    chartInfo.setOption(getRawOption2())
    chartInfo.setOption({
        series: [
            {
                data: [100, 200, 300, 400, 500, 600, 500]
            }
        ]
    })
})
const getRawOption1 = () => {
    return {
        xAxis: {
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'line'
            }
        ]
    }
}

const getRawOption2 = () => {
    return {
        xAxis: {
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'bar'
            }
        ]
    }
}
</script>

<style lang="scss" scoped></style>