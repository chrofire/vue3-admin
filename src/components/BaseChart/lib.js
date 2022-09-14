import * as echarts from 'echarts/core'

import {
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    ScatterChart
} from 'echarts/charts'

import {
    GridComponent,
    LegendComponent,
    RadarComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent
} from 'echarts/components'

echarts.use([
    // charts
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    ScatterChart,
    // components
    GridComponent,
    LegendComponent,
    RadarComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent
])

export default echarts
