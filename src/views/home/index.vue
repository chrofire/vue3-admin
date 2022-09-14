<template>
    <div class="w-100% h-100% overflow-auto">
        <el-row class="w-100%" :gutter="20">
            <el-col :span="12">
                <BaseChart class="h-50vh!" ref="BaseChartRef1" :getRawOption="getRawOption1"></BaseChart>
            </el-col>
            <el-col :span="12">
                <BaseChart class="h-50vh!" ref="BaseChartRef2" :getRawOption="getRawOption2"></BaseChart>
            </el-col>
            <el-col :span="12">
                <BaseChart class="h-50vh!" ref="BaseChartRef3" :getRawOption="getRawOption3"></BaseChart>
            </el-col>
            <el-col :span="12">
                <BaseChart class="h-50vh!" ref="BaseChartRef4" :getRawOption="getRawOption4"></BaseChart>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BaseChart } from '@/components/BaseChart'

const BaseChartRef1 = ref(null)
const BaseChartRef2 = ref(null)
const BaseChartRef3 = ref(null)
const BaseChartRef4 = ref(null)

onMounted(() => {
    BaseChartRef1.value.setOption({
        series: [
            {
                data: [100, 200, 300, 400, 500, 600, 500]
            }
        ]
    })
    BaseChartRef2.value.setOption({
        series: [
            {
                data: [100, 200, 300, 400, 500, 600, 500]
            }
        ]
    })
    BaseChartRef3.value.setOption({
        series: [
            {
                data: [
                    { name: 'A', value: 100 },
                    { name: 'B', value: 200 },
                    { name: 'C', value: 300 },
                    { name: 'D', value: 400 },
                    { name: 'E', value: 500 }
                ]
            }
        ]
    })
    BaseChartRef4.value.setOption({
        series: [
            {
                data: [
                    {
                        name: 'One',
                        value: [4200, 3000, 20000, 35000, 50000, 18000]
                    },
                    {
                        name: 'Two',
                        value: [5000, 14000, 28000, 26000, 42000, 21000]
                    }
                ]
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

const getRawOption3 = () => {
    return {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '0%',
            left: 'center'
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }
        ]
    }
}

const getRawOption4 = () => {
    return {
        legend: {
            data: ['One', 'Two']
        },
        radar: {
            indicator: [
                { name: 'A' },
                { name: 'B' },
                { name: 'C' },
                { name: 'D' },
                { name: 'E' },
                { name: 'F' }
            ]
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        name: 'One',
                        value: []
                    },
                    {
                        name: 'Two',
                        value: []
                    }
                ]
            }
        ]
    }
}
</script>

<style lang="scss" scoped></style>
