<script>
import * as _ElIcons from '@element-plus/icons-vue'
import { h, mergeProps } from 'vue'
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        width: {
            type: Number,
            default: 25
        },
        height: {
            type: Number
        },
        color: {
            type: String,
            default: `#000`
        }
    },
    setup () {
        return instance => {
            const vnode = _ElIcons[instance.name]?.render?.()
            if (vnode) vnode.props = mergeProps(vnode.props, {
                style: {
                    width: `${instance.width}px`,
                    height: typeof instance.height !== 'undefined' ? `${instance.height}px` : void 0,
                    color: instance.color
                }
            })
            return vnode ? vnode : h('div', { style: { display: `inline-flex` }}, 'NoIcon')
        }
    }
}
</script>