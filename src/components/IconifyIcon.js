import { defineComponent, h } from 'vue'

export default defineComponent({
    name: 'IconifyIcon',
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            required: true
        }
    },
    setup (props, { attrs }) {
        return () => {
            return h('i', { class: props.name, ...attrs })
        }
    }
})

export const IconifyIcon = (name, props) => {
    return h('i', { class: name, ...props })
}